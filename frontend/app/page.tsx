"use client";

import Image from "next/image";
import {
  Home,
  Trophy,
  Crosshair,
  User,
  MessageCircle,
  BookOpen,
  Settings,
  Search,
  Download,
  Box,
  PlusCircle,
  Filter,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import VoiceCompanion from "./components/VoiceCompanion";
import ChatCompanion from "./components/ChatCompanion";

type BackendMessage = { role: string; message: string };
type VoiceTurn = { child: string; grandpa?: string };

function pairConversation(messages: BackendMessage[]): VoiceTurn[] {
  const turns: VoiceTurn[] = [];
  for (const msg of messages) {
    const role = (msg.role || "").toLowerCase();
    const text = msg.message || "";
    if (!text) continue;

    if (role === "child") {
      turns.push({ child: text });
      continue;
    }
    if (role === "grandpa") {
      if (turns.length === 0) {
        turns.push({ child: "" });
      }
      turns[turns.length - 1].grandpa = text;
    }
  }
  return turns.filter(
    (t) => (t.child && t.child.trim()) || (t.grandpa && t.grandpa.trim())
  );
}

export default function Page() {
  const [showVoice, setShowVoice] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [voiceHistory, setVoiceHistory] = useState<VoiceTurn[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const backendBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        setHistoryError(null);
        const res = await fetch(
          `${backendBaseUrl.replace(/\/$/, "")}/conversation-history`,
          {
            method: "GET",
            cache: "no-store",
          }
        );
        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || `HTTP ${res.status}`);
        }
        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) {
          throw new Error(
            "Backend should return an array like [{role:'child'|'grandpa', message:'...'}]"
          );
        }

        const turns = pairConversation(data as BackendMessage[]);
        if (isMounted) setVoiceHistory(turns);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load voice history";
        if (isMounted) {
          setHistoryError(msg);
          setVoiceHistory([]);
        }
      }
    };

    // Load on first render, and also refresh after the voice overlay closes
    // so new conversations show up immediately.
    if (!showVoice) {
      loadHistory();
    }
    return () => {
      isMounted = false;
    };
  }, [backendBaseUrl, showVoice]);

  return (
    <>
      {showVoice && <VoiceCompanion onClose={() => setShowVoice(false)} />}
      {showChat && <ChatCompanion onClose={() => setShowChat(false)} />}

      {/* Header */}
      <header className="header">
        <div className="greeting-text">Hi Kiddoo!</div>
      </header>

      <main className="dashboard-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-left">
            <h1 className="hero-title">
              Welcome to
              <br />
              Grandpa's Hug!
            </h1>
            <p className="hero-subtitle">
              Your friend for stories,
              <br />
              fun & gentle advice
            </p>
            <button className="btn-primary">Start Our Story</button>
          </div>

          <div className="hero-center">
            <Image
              src="/assets/grandpa.png"
              alt="Grandpa"
              width={400}
              height={500}
              className="hero-grandpa"
              priority
            />
          </div>

          <div className="hero-right">
            <h2
              className="voice-title"
              style={{
                fontSize: "1.8rem",
                color: "white",
                marginBottom: "1rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              Talk with grandpa
            </h2>

            <div className="voice-actions">
              <p className="voice-title">
                Hello, little one! What shall you talk today?
              </p>
              <div className="voice-buttons">
                <button
                  className="btn-advice"
                  onClick={() => setShowVoice(true)}
                >
                  <span>Ask</span>
                  <span>Grandpa</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Lower Grid */}
        <div className="lower-section">
          {/* Card: Grandpa's Daily Note (Replaces Mood Check-in) */}
          <div
            className="card-container"
            style={{ background: "transparent", padding: 0, boxShadow: "none" }}
          >
            <div className="daily-note-card">
              <div className="note-pin"></div>
              <h3 className="note-title">"Did anyone make you smile today?"</h3>
              <button
                className="note-action-btn"
                onClick={() => setShowVoice(true)}
              >
                <span style={{ fontSize: "1.2rem" }}>✏️</span> Tell Grandpa
              </button>
            </div>
          </div>

          {/* Memory Snaps Section (Replaces Search Events) */}
          <div className="snaps-section">
            <div className="snaps-header">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className="section-title">Voice History</h3>
                <span style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                  {historyError
                    ? "Could not load history"
                    : "What you told Grandpa before"}
                </span>
              </div>
              {/* Search Bar kept small/hidden or optional */}
            </div>

            <div className="snaps-grid">
              {voiceHistory.length > 0 ? (
                voiceHistory
                  .slice()
                  .reverse()
                  .slice(0, 6)
                  .map((turn, idx) => (
                    <div
                      key={idx}
                      className="snap-card"
                      style={{
                        padding: "16px",
                        transform:
                          idx % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {turn.child && turn.child.trim() ? (
                          <div
                            style={{
                              fontWeight: 700,
                              color: "var(--text-dark)",
                              lineHeight: 1.3,
                            }}
                          >
                            👦 Child said:{" "}
                            <span style={{ fontWeight: 600 }}>
                              {turn.child}
                            </span>
                          </div>
                        ) : null}
                        {turn.grandpa && turn.grandpa.trim() ? (
                          <div
                            style={{
                              fontWeight: 700,
                              color: "var(--text-dark)",
                              lineHeight: 1.4,
                            }}
                          >
                            👴 Grandpa says:{" "}
                            <span style={{ fontWeight: 600 }}>
                              {turn.grandpa}
                            </span>
                          </div>
                        ) : (
                          <div style={{ fontWeight: 600, color: "#7f8c8d" }}>
                            Grandpa is thinking...
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div
                  className="snap-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      color: "#7f8c8d",
                      fontWeight: 600,
                    }}
                  >
                    {historyError
                      ? "Backend history not available yet."
                      : "No voice history yet. Talk to Grandpa to start!"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
