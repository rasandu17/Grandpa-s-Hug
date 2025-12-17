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
          {/* Card: Mood Check-in (Replaces Magical Stories) */}
          <div className="card-container mood-checkin">
            <div className="card-title-row">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className="section-title">How is your heart?</h3>
                <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Tell Grandpa, I'm listening.</span>
              </div>
              <button className="close-btn">x</button>
            </div>

            <div className="mood-grid">
              <button className="mood-btn mood-btn-happy">
                <span className="mood-emoji">☀️</span>
                <span>Happy</span>
              </button>
              <button className="mood-btn mood-btn-sad">
                <span className="mood-emoji">🌧️</span>
                <span>Sad</span>
              </button>
              <button className="mood-btn mood-btn-angry">
                <span className="mood-emoji">🔥</span>
                <span>Mad</span>
              </button>
              <button className="mood-btn mood-btn-scared">
                <span className="mood-emoji">💨</span>
                <span>Scared</span>
              </button>
            </div>

            <p className="mood-subtext">Picking a feeling helps me find the perfect story for you!</p>
          </div>

          {/* Search Events Section */}
          <div className="events-section">
            <div className="search-bar" style={{ background: '#F8F9FA', borderRadius: '50px', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Search Events" className="search-input" />
              <button className="filter-btn">
                <Filter size={20} />
              </button>
            </div>

            <div className="events-grid">
              {/* Card 1 */}
              <div className="event-card">
                <div className="event-image-container">
                  <Image src="/assets/dragon.png" alt="Dragon" width={200} height={140} className="event-image" />
                </div>
                <div className="event-content">
                  <div className="event-footer" style={{ marginBottom: '0.5rem', justifyContent: 'flex-start', gap: '8px' }}>
                    {/* Icons if needed */}
                  </div>
                  <h3>Brave Knights</h3>
                  <p className="event-desc">A tiny knight mustt a hot dragon.</p>
                  <p className="event-desc" style={{ fontSize: '0.7rem' }}>Note: Typo in image replicated 'mustt'</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="event-card">
                <div className="event-image-container">
                  <Image src="/assets/rocket.png" alt="Rocket" width={200} height={140} className="event-image" />
                </div>
                <div className="event-content">
                  <h3>Space Adventures</h3>
                  <p className="event-desc">Appa signs in and waglas, dinoailes...</p>

                  <div className="event-footer">
                    <span className="coin-price">
                      <span className="coin-icon-small"></span> 40
                    </span>
                    <button className="btn-join">Join Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
