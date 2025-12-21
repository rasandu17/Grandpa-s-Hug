"use client";

import Image from 'next/image';
import { X, Send, Smile, MessageSquare, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatCompanionProps {
    onClose: () => void;
}

interface ChatSession {
    id: string;
    title: string;
    date: string;
}

interface Message {
    id: number;
    text: string;
    sender: 'grandpa' | 'user' | 'system';
}

export default function ChatCompanion({ onClose }: ChatCompanionProps) {
    const [selectedSession, setSelectedSession] = useState<string>('current');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const sessions: ChatSession[] = [
        { id: 'current', title: 'New Chat', date: 'Today' },
        { id: '1', title: 'The Brave Knight Story', date: 'Yesterday' },
        { id: '2', title: 'Drawing a Rocket', date: 'Previous 7 Days' },
        { id: '3', title: 'School Advice', date: 'Previous 7 Days' }
    ];

    const [messages, setMessages] = useState<Message[]>([
        // Defaulting to "Today" for the new chat context
        { id: 1, text: "Today", sender: 'system' },
        { id: 2, text: "Hello there! I'm here to listen.", sender: 'grandpa' }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim() === "") return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user'
        };

        setMessages([...messages, newMessage]);
        setInputText("");

        // Simulate Grandpa reply
        setTimeout(() => {
            const reply: Message = {
                id: messages.length + 2,
                text: "That sounds wonderful! Tell me more!",
                sender: 'grandpa'
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="chat-overlay">
            <div className="chat-container-flex">
                {/* Sidebar */}
                <div className={`chat-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-header">
                        <button className="new-chat-btn" onClick={() => setSelectedSession('current')}>
                            <span>+ New Chat</span>
                        </button>
                    </div>

                    <div className="sidebar-list">
                        <div className="sidebar-section-label">Today</div>
                        {sessions.filter(s => s.date === 'Today').map(session => (
                            <div key={session.id}
                                className={`sidebar-item ${selectedSession === session.id ? 'active' : ''}`}
                                onClick={() => setSelectedSession(session.id)}>
                                <MessageSquare size={16} />
                                <span className="truncate">{session.title}</span>
                            </div>
                        ))}

                        <div className="sidebar-section-label">Yesterday</div>
                        {sessions.filter(s => s.date === 'Yesterday').map(session => (
                            <div key={session.id}
                                className={`sidebar-item ${selectedSession === session.id ? 'active' : ''}`}
                                onClick={() => setSelectedSession(session.id)}>
                                <MessageSquare size={16} />
                                <span className="truncate">{session.title}</span>
                            </div>
                        ))}

                        <div className="sidebar-section-label">Previous 7 Days</div>
                        {sessions.filter(s => s.date === 'Previous 7 Days').map(session => (
                            <div key={session.id}
                                className={`sidebar-item ${selectedSession === session.id ? 'active' : ''}`}
                                onClick={() => setSelectedSession(session.id)}>
                                <MessageSquare size={16} />
                                <span className="truncate">{session.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="chat-main-area">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                                <Menu size={24} />
                            </button>
                            <div className="chat-avatar-small">
                                <Image src="/assets/grandpa.png" alt="Grandpa" width={40} height={40} />
                            </div>
                            <h3>Grandpa</h3>
                        </div>
                        <button onClick={onClose} className="chat-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages Config */}
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            msg.sender === 'system' ? (
                                <div key={msg.id} className="chat-date-separator">
                                    <span>{msg.text}</span>
                                </div>
                            ) : (
                                <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                    {msg.sender === 'grandpa' && (
                                        <div className="message-avatar">
                                            <Image src="/assets/grandpa.png" alt="Grandpa" width={30} height={30} />
                                        </div>
                                    )}
                                    <div className="message-content">
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area">
                        <button className="chat-action-btn">
                            <Smile size={24} />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="chat-input"
                        />
                        <button className="chat-send-btn" onClick={handleSend}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
