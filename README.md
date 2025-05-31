# Pelvix AI 🤖

Your digital best friend powered by AI. A modern, full-stack chatbot with personality, built with Next.js and integrated with Pollinations AI for both text generation and image creation.

## ✨ Features

- 🤖 **Intelligent Chat**: Powered by DeepSeek-R1 via Pollinations AI
- 🎨 **Image Generation**: High-quality images with `/imagine` commands
- 💫 **Smooth Animations**: GSAP-powered UI with custom animations
- 🎭 **Personality**: Pelvix has a warm, friendly, and witty personality
- 📱 **Responsive Design**: Works beautifully on all devices
- 🔄 **Real-time Chat**: Instant responses with typing indicators
- 🎨 **Custom Themes**: Beautiful dark theme with CSS variables
- 🛡️ **Error Handling**: Robust error boundaries and fallbacks
- ⚡ **Performance**: Optimized with Next.js 15 and React 19

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd PelVix

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting with Pelvix!

## 💬 Usage

### Text Chat
Simply type your message and press Enter. Pelvix will respond with her characteristic warmth and wit.

```
User: How are you today?
Pelvix: Hey there! I'm doing fantastic, thanks for asking! 😊 Ready to dive into whatever's on your mind!
```

### Image Generation
Use the `/imagine` command to generate stunning images:

```
/imagine a cute robot drinking coffee
/imagine a sunset over mountains --seed 123
/imagine a cyberpunk city --model flux
```

**Supported Parameters:**
- `--seed <number>`: For reproducible results
- `--model <name>`: Specify AI model (default: flux)

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, JavaScript/JSX
- **Styling**: CSS Modules with custom properties
- **Animations**: GSAP with React hooks
- **AI Integration**: Pollinations AI API
- **Text Model**: DeepSeek-R1
- **Image Model**: Flux (SDXL-based)
- **Deployment**: Vercel
- **Typography**: Geist Mono font

## 📁 Project Structure

```
PelVix/
├── src/
│   ├── app/
│   │   ├── api/chat/          # API route for chat/image generation
│   │   ├── component/         # Reusable React components
│   │   ├── context/           # React context providers
│   │   ├── utils/             # Utility functions and GSAP config
│   │   ├── assets/            # Static assets (fonts, images)
│   │   ├── globals.css        # Global styles and CSS variables
│   │   ├── layout.jsx         # Root layout with providers
│   │   └── page.jsx           # Main chat interface
├── public/                    # Public static files
├── next.config.mjs           # Next.js configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies and scripts
```

## 🎨 Key Components

- **Chat Interface** (`page.jsx`): Main conversation UI
- **Message Animation** (`messageAnim/`): GSAP-powered text/image reveals
- **Input Component** (`input/`): Custom input with caret animation
- **Theme System**: CSS custom properties for consistent theming
- **Error Boundary**: Graceful error handling throughout the app

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. No additional configuration needed!

### Manual Deployment
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run clean        # Clean build cache
```

### Environment Setup
The app works out of the box with no environment variables required. All AI services are accessed through public APIs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Credits

**Created by [Kedar Sathe](https://wtfkedar.vercel.app)**

**Powered by:**
- [Pollinations AI](https://pollinations.ai) - Free AI platform for text and images
- [Next.js](https://nextjs.org) - React framework
- [GSAP](https://gsap.com) - Professional animation library
- [Vercel](https://vercel.com) - Deployment platform

## 🔗 Links

- **Live Demo**: [https://pelvix.vercel.app](https://pelvix.vercel.app)
- **Developer**: [https://wtfkedar.vercel.app](https://wtfkedar.vercel.app)
- **Technical Report**: See [TECHNICAL_REPORT.md](./TECHNICAL_REPORT.md)

---

Made with ❤️ by Kedar Sathe