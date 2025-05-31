# Pelvix AI

A full-stack AI chatbot built with Next.js and FastAPI. Chat with DeepSeek-R1 and generate images with Flux-Pro via PollinationsAI.

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Backend**: FastAPI, Python
- **AI Integration**: GPT4FREE, PollinationsAI
- **Models**: DeepSeek-R1 (text), Flux-Pro (images)

## Quick Start

```bash
# Install dependencies
pnpm install
pip install -r requirements.txt

# Run both frontend and backend
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

## Features

- Real-time chat interface
- Image generation with `/imagine` command
- Conversation history
- Multiple AI model support
- Theme switching

## Usage

**Text Chat**: Type normally and press enter

**Image Generation**: 
```
/imagine a cool robot --nis 30 --seed 123
```

## Project Structure

```
├── src/app/          # Next.js frontend
├── api/              # FastAPI backend  
├── public/           # Static assets
└── requirements.txt  # Python deps
```

## Deployment

Configured for Vercel. Just connect your repo and deploy.

## Credits

Built by [Kedar Sathe](https://wtfkedar.vercel.app)

Powered by:
- [GPT4FREE](https://github.com/xtekky/gpt4free) - Free AI model access
- [PollinationsAI](https://pollinations.ai) - Creative AI platform