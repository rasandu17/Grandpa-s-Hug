"use client";

import Image from "next/image";
import { Mic, X, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface VoiceCompanionProps {
  onClose: () => void;
}

export default function VoiceCompanion({ onClose }: VoiceCompanionProps) {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState<string>("Getting ready...");
  const [errorText, setErrorText] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);
  const isBusyRef = useRef(false);

  const backendBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsListening(false);
      setStatusText("Tap the mic to start talking");
    }, 300);

    return () => {
      clearTimeout(timer);
      try {
        mediaRecorderRef.current?.stop();
      } catch {
        // ignore
      }
      mediaRecorderRef.current = null;

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    if (isBusyRef.current) return;
    setErrorText(null);

    try {
      setStatusText("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
      const mimeType = preferredMimeTypes.find((t) => {
        try {
          return (
            typeof MediaRecorder !== "undefined" &&
            MediaRecorder.isTypeSupported(t)
          );
        } catch {
          return false;
        }
      });

      chunksRef.current = [];
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) chunksRef.current.push(evt.data);
      };

      recorder.onstop = async () => {
        // Stop mic tracks once we have data.
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];

        if (blob.size === 0) {
          setErrorText("I didn't catch any audio. Try again?");
          setStatusText("Tap the mic to start talking");
          isBusyRef.current = false;
          return;
        }

        try {
          setStatusText("Sending to Grandpa...");
          const ext = blob.type.includes("ogg") ? "ogg" : "webm";
          const file = new File([blob], `voice.${ext}`, {
            type: blob.type || "audio/webm",
          });
          const form = new FormData();
          form.append("file", file);

          const res = await fetch(
            `${backendBaseUrl.replace(/\/$/, "")}/chat-audio`,
            {
              method: "POST",
              body: form,
            }
          );

          if (!res.ok) {
            const msg = await res.text().catch(() => "Request failed");
            throw new Error(msg || `HTTP ${res.status}`);
          }

          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("audio/")) {
            const audioBlob = await res.blob();
            if (lastObjectUrlRef.current)
              URL.revokeObjectURL(lastObjectUrlRef.current);
            const url = URL.createObjectURL(audioBlob);
            lastObjectUrlRef.current = url;

            if (!audioRef.current) audioRef.current = new Audio();
            audioRef.current.src = url;
            setStatusText("Grandpa is talking...");
            await audioRef.current.play();

            audioRef.current.onended = () => {
              setStatusText("Tap the mic to start talking");
            };
          } else {
            const text = await res.text();
            setStatusText(text || "Tap the mic to start talking");
          }
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Something went wrong";
          setErrorText(msg);
          setStatusText("Tap the mic to start talking");
        } finally {
          isBusyRef.current = false;
          setIsListening(false);
        }
      };

      recorder.start();
      setIsListening(true);
      setStatusText("I'm listening...");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Microphone permission was denied";
      setErrorText(msg);
      setStatusText("Tap the mic to start talking");
      isBusyRef.current = false;
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "inactive") return;
    setStatusText("Okay... one moment");
    recorder.stop();
    mediaRecorderRef.current = null;
  };

  const toggleMic = async () => {
    if (isBusyRef.current) return;
    if (isListening) {
      isBusyRef.current = true;
      stopRecording();
      return;
    }
    isBusyRef.current = false;
    await startRecording();
  };

  return (
    <div className="voice-overlay">
      {/* Close Button */}
      <button
        onClick={() => {
          try {
            mediaRecorderRef.current?.stop();
          } catch {
            // ignore
          }
          onClose();
        }}
        className="voice-close"
      >
        <X size={32} />
      </button>

      {/* Animated Rings Container */}
      <div className="voice-visualizer">
        {isListening && (
          <>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
          </>
        )}

        {/* Grandpa Avatar */}
        <div className="voice-avatar-container">
          <Image
            src="/assets/grandpa.png"
            alt="Grandpa"
            width={200}
            height={200}
            className="voice-avatar-img"
          />
        </div>
      </div>

      {/* Status Text */}
      <div className="voice-status">
        <h2>{statusText}</h2>
        <p>{errorText ? errorText : "Go ahead, ask me anything!"}</p>
      </div>

      {/* Controls */}
      <div className="voice-controls">
        <button
          className={`voice-mic-btn ${isListening ? "active" : "inactive"}`}
          onClick={toggleMic}
        >
          <Mic size={40} />
        </button>
      </div>
    </div>
  );
}
