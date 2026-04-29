# Scaler Persona Chatbot

A persona-based AI chatbot that lets users have real conversations with three Scaler / InterviewBit leaders — each with a distinct, research-backed communication style powered by the Meta Llama 3.1 8B model via Hugging Face.

| Persona | Role | Key Trait |
|---|---|---|
| **Anshuman Singh** | Co-founder, Scaler & InterviewBit | Mission-driven, inspirational mentor |
| **Abhimanyu Saxena** | Co-founder, Scaler & InterviewBit | Structured, "measure twice, cut once" philosophy |
| **Kshitij Mishra** | Head of Instructors, Scaler | Patient, analogy-driven teacher |

## Features

- 🎭 **Three distinct AI personas** with research-backed system prompts & few-shot examples
- 💬 **Real-time chat** with typing indicators and suggestion chips
- 🧠 **Chain-of-Thought toggle** — see how the AI reasons before answering
- 🔒 **Secure** — API keys stay on the server, never exposed to the client
- 🎨 **Glassmorphism UI** — premium dark theme with subtle glow effects

## Project Structure

```
genAI/
├── public/                  # Static frontend assets
│   ├── index.html           #   Main HTML page
│   ├── css/
│   │   └── style.css        #   Glassmorphism theme
│   └── js/
│       └── app.js           #   Chat logic & persona switching
├── src/                     # Backend source code
│   ├── config/
│   │   └── personas.js      #   Persona definitions (system prompts)
│   └── routes/
│       └── chat.js          #   POST /api/chat handler
├── docs/                    # Documentation
│   ├── prompts.md           #   Prompt engineering rationale
│   └── reflection.md        #   GIGO reflection write-up
├── server.js                # Express entry point
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── package.json             # Project metadata & dependencies
└── README.md                # This file
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your `HUGGINGFACE_TOKEN` from [Hugging Face](https://huggingface.co/settings/tokens).

3. **Start the server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Development mode** (auto-restart on file changes):
   ```bash
   npm run dev
   ```

## Deployment

1. Connect your repository to a platform like **Vercel**, **Railway**, or **Render**.
2. Set the environment variable `HUGGINGFACE_TOKEN` in the platform settings.
3. Use `npm start` as the start command.

## Documentation

- [`docs/prompts.md`](docs/prompts.md) — Detailed system prompts and research rationale for each persona.
- [`docs/reflection.md`](docs/reflection.md) — 300–500 word reflection on the process, the GIGO principle, and future improvements.
