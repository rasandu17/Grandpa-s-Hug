# Grandpa's Hug - Next.js Application

A warm and friendly web application recreated from the design mockup, built with Next.js 14, React, and TypeScript.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. **Important**: Add the grandpa image
   - Save the grandpa character image as `grandpa.png` in the `public` folder
   - The image should be at: `public/grandpa.png`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
Grandpa-s-Hug/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   ├── page.module.css     # Home page styles
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Header.module.css
│   ├── HeroSection.tsx     # Main hero section with grandpa
│   ├── HeroSection.module.css
│   ├── StoriesSection.tsx  # Magical stories and events
│   └── StoriesSection.module.css
├── public/
│   └── grandpa.png         # (Add this file)
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎨 Features

- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile
- **Modern UI**: Clean and colorful interface with smooth animations
- **Component-Based**: Modular React components with CSS modules for styling
- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: Built with the latest App Router architecture

## 🛠️ Technologies Used

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **CSS Modules**: Scoped styling
- **Next/Image**: Optimized image component

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎯 Components Overview

### Header
Navigation bar with logo, menu items, and theme toggle.

### HeroSection
Main feature section with:
- Welcome message
- Grandpa character image
- Character selection card
- Interactive buttons

### StoriesSection
Content area featuring:
- Magical Stories panel with search and icons
- Event cards (Brave Knights, Space Adventures)
- Featured story card with coin rewards

## 🎨 Color Palette

- **Primary Blue**: `#3b82f6`
- **Indigo**: `#6366f1`
- **Orange**: `#fb923c`
- **Background**: Gradient from `#e0e7ff` to `#dbeafe`

## 📝 Customization

To customize the application:
1. Edit component files in the `components/` folder
2. Modify styles in the corresponding `.module.css` files
3. Update global styles in `app/globals.css`
4. Change colors, fonts, and layouts as needed

## 🤝 Contributing

Feel free to fork this project and make your own modifications!

## 📄 License

This project is open source and available under the MIT License.
