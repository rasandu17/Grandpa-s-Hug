"use client";

import Image from 'next/image';
import { X, Send, Smile } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatCompanionProps {
    onClose: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'grandpa' | 'user';
}

export default function ChatCompanion({ onClose }: ChatCompanionProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello there! I'm here to listen.", sender: 'grandpa' },
        { id: 2, text: "What's on your mind today, kiddo?", sender: 'grandpa' }
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
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-info">
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
    );
}
