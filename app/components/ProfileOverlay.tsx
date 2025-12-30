"use client";

import Image from 'next/image';
import { X, Save, User, Phone, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProfileOverlayProps {
    onClose: () => void;
}

export default function ProfileOverlay({ onClose }: ProfileOverlayProps) {
    // State for form fields
    const [name, setName] = useState("Kenjiro");
    const [age, setAge] = useState("6");
    const [parentName, setParentName] = useState("Mom");
    const [parentContact, setParentContact] = useState("071-234-5678");

    const handleSave = () => {
        // Logic to save details would go here
        onClose();
    };

    return (
        <div className="profile-overlay">
            <div className="profile-card">
                <button className="profile-close-btn" onClick={onClose}>
                    <X size={28} />
                </button>

                <div className="profile-header">
                    <div className="profile-avatar-large">
                        <Image src="/assets/avatar.png" alt="Kenjiro" width={100} height={100} className="avatar-img" />
                        <button className="edit-avatar-btn">✏️</button>
                    </div>
                    <h2 className="profile-title">My Profile</h2>
                </div>

                <div className="profile-scroll-content">
                    {/* Section: All About Me */}
                    <div className="profile-section me-section">
                        <div className="section-header">
                            <User size={20} className="section-icon color-blue" />
                            <h3>All About Me</h3>
                        </div>
                        <div className="input-group">
                            <label>My Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="cute-input"
                            />
                        </div>
                        <div className="input-group">
                            <label>I am... (years old)</label>
                            <input
                                type="text"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="cute-input"
                            />
                        </div>
                    </div>

                    {/* Section: Parent's Corner */}
                    <div className="profile-section parent-section">
                        <div className="section-header">
                            <Heart size={20} className="section-icon color-pink" />
                            <h3>Parent's Corner</h3>
                        </div>
                        <div className="input-group">
                            <label>Parent/Guardian Name</label>
                            <input
                                type="text"
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                className="cute-input"
                            />
                        </div>
                        <div className="input-group">
                            <label>Emergency Contact</label>
                            <div className="input-with-icon">
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="text"
                                    value={parentContact}
                                    onChange={(e) => setParentContact(e.target.value)}
                                    className="cute-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-footer">
                    <button className="save-btn" onClick={handleSave}>
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
