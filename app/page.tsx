"use client";

import Image from 'next/image'
import { Home, Trophy, Crosshair, User, MessageCircle, BookOpen, Settings, Search, Download, Box, PlusCircle, Filter } from 'lucide-react'
import { useState } from 'react'
import VoiceCompanion from './components/VoiceCompanion'
import ChatCompanion from './components/ChatCompanion'

export default function Page() {
    const [showVoice, setShowVoice] = useState(false);
    const [showChat, setShowChat] = useState(false);

    return (
        <>
            {showVoice && <VoiceCompanion onClose={() => setShowVoice(false)} />}
            {showChat && <ChatCompanion onClose={() => setShowChat(false)} />}

            {/* Header */}
            <header className="header">
                <div className="logo">
                    <div className="logo-icon">
                        <span role="img" aria-label="logo">👣</span> {/* Placeholder for footprint logo */}
                    </div>
                    <span>Grandpa's Hug</span>
                </div>

                <nav className="nav">
                    <a href="#" className="nav-item active">
                        <Home size={18} />
                        Home
                    </a>
                    <a href="#" className="nav-item">
                        <Trophy size={18} /> {/* Using trophy for scores */}
                        Scores
                    </a>
                    <a href="#" className="nav-item">
                        <Crosshair size={18} />
                        Chase
                    </a>
                </nav>

                <div className="user-profile">
                    <div className="user-pill">
                        <Image
                            src="/assets/avatar.png"
                            alt="Kenjiro"
                            width={24}
                            height={24}
                            className="avatar"
                        />
                        <span className="user-name">Kenjiro</span>
                    </div>
                    <div className="coin-pill">
                        3
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-left">
                        <h1 className="hero-title">Welcome to<br />Grandpa's Hug!</h1>
                        <p className="hero-subtitle">Your friend for stories,<br />fun & gentle advice</p>
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
                        <h2 className="voice-title" style={{ fontSize: '1.8rem', color: 'white', marginBottom: '1rem', width: '100%', textAlign: 'center' }}>Hand-pick Your<br />Character</h2>

                        <div className="character-picker">
                            <Image src="/assets/grandpa.png" alt="Icon" width={30} height={30} className="picker-avatar" style={{ backgroundColor: '#eee' }} />
                            <input type="text" className="picker-input" placeholder="Grandpa's Hug" disabled />
                        </div>

                        <div className="voice-actions">
                            <p className="voice-title">Hello, little one! What shall you talk today?</p>
                            <div className="voice-buttons">
                                <button className="btn-action-icon btn-book">
                                    <BookOpen size={28} />
                                </button>
                                <button className="btn-advice" onClick={() => setShowVoice(true)}>
                                    <span>Ask</span>
                                    <span>Grandpa</span>
                                </button>
                                <button className="btn-action-icon btn-chat" onClick={() => setShowChat(true)}>
                                    <MessageCircle size={28} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lower Grid */}
                <div className="lower-section">
                    {/* Card: Grandpa's Daily Note (Replaces Mood Check-in) */}
                    <div className="card-container" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
                        <div className="daily-note-card">
                            <div className="note-pin"></div>
                            <h3 className="note-title">"Did anyone make you smile today?"</h3>
                            <button className="note-action-btn" onClick={() => setShowChat(true)}>
                                <span style={{ fontSize: '1.2rem' }}>✏️</span> Tell Grandpa
                            </button>
                        </div>
                    </div>

                    {/* Memory Snaps Section (Replaces Search Events) */}
                    <div className="snaps-section">
                        <div className="snaps-header">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 className="section-title">Happy Moments</h3>
                                <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Special snaps we shared</span>
                            </div>
                            {/* Search Bar kept small/hidden or optional */}
                        </div>

                        <div className="snaps-grid">
                            {/* Snap 1 */}
                            <div className="snap-card">
                                <div className="snap-image-container">
                                    <Image src="/assets/dragon.png" alt="Brave Moment" width={200} height={200} className="snap-image" />
                                </div>
                                <div className="snap-caption">I was brave! 🐉</div>
                            </div>

                            {/* Snap 2 */}
                            <div className="snap-card">
                                <div className="snap-image-container">
                                    <Image src="/assets/rocket.png" alt="Space Dream" width={200} height={200} className="snap-image" />
                                </div>
                                <div className="snap-caption">To the moon! 🚀</div>
                            </div>

                            {/* Snap 3 - Placeholder/Add New */}
                            <div className="snap-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFC' }}>
                                <div style={{ textAlign: 'center', color: '#CBD5E0' }}>
                                    <PlusCircle size={40} style={{ margin: '0 auto 0.5rem auto' }} />
                                    <span style={{ fontSize: '0.9rem', display: 'block' }}>New Memory</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
