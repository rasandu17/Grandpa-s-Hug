"use client";

import Image from 'next/image';
import { Mic, X, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VoiceCompanionProps {
    onClose: () => void;
}

export default function VoiceCompanion({ onClose }: VoiceCompanionProps) {
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        // Simulate listening state start
        const timer = setTimeout(() => setIsListening(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="voice-overlay">
            {/* Close Button */}
            <button
                onClick={onClose}
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
                <h2>
                    {isListening ? "I'm listening..." : "Getting ready..."}
                </h2>
                <p>
                    Go ahead, ask me anything!
                </p>
            </div>

            {/* Controls */}
            <div className="voice-controls">
                <button
                    className={`voice-mic-btn ${isListening ? 'active' : 'inactive'}`}
                    onClick={() => setIsListening(!isListening)}
                >
                    <Mic size={40} />
                </button>
            </div>
        </div>
    );
}
