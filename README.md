# 🗳️ ElectAI - Multi-Agent Election Intelligence Platform

### 🚀 [Live Demo: elect-ai.onrender.com](https://elect-ai.onrender.com)

A cutting-edge AI-powered platform that uses specialized agents to deliver accurate, personalized election information to every citizen.

![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=render)
![Architecture](https://img.shields.io/badge/Architecture-Multi--Agent-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-RAG%20%2B%20LLM-purple?style=for-the-badge)

## 🌟 Key Features

- **🤖 Multi-Agent AI System**: 5 specialized agents working together
- **📚 RAG-Powered Chatbot**: Grounded responses with no hallucinations
- **📅 Interactive Timeline**: Visual election schedules and deadlines
- **🎯 Smart Recommendations**: Personalized next steps
- **✅ Fact-Checked**: All responses verified against official sources
- **🔒 Secure**: JWT auth, rate limiting, input sanitization

## 🏗️ Architecture

```
Frontend (React + Tailwind + Framer Motion)
        ↓
API Gateway (Node.js + Express)
        ↓
Agent Orchestrator (Core Brain)
        ↓
------------------------------------------------
| Multi-Agent Layer                            |
|----------------------------------------------|
| 1. Retrieval Agent (RAG)                     |
| 2. Explanation Agent                         |
| 3. Timeline Agent                            |
| 4. Recommendation Agent                      |
| 5. Fact-Check Agent                          |
------------------------------------------------
        ↓
Memory + Data Layer
(MongoDB + Redis + ChromaDB)
        ↓
LLM (Gemini / OpenAI)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Google Gemini API Key

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Seed the database
npm run seed

# Start the server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/health

## 🧠 The Multi-Agent System

Each agent has one job only:

| Agent | Role | Purpose |
|-------|------|---------|
| **Retrieval Agent** | Brain | Searches vector DB for relevant documents |
| **Explanation Agent** | Translator | Converts complex info into simple explanations |
| **Timeline Agent** | Scheduler | Generates structured election timelines |
| **Recommendation Agent** | Advisor | Suggests next steps and important deadlines |
| **Fact-Check Agent** | Guardian | Prevents misinformation by cross-checking sources |

## 📚 RAG Pipeline

1. **Data Collection**: Election Commission websites, government PDFs
2. **Chunking**: Split text into 300-500 token chunks
3. **Embedding**: OpenAI/Gemini embeddings
4. **Storage**: ChromaDB vector database
5. **Query Flow**: User Query → Embed → Vector Search → Top Docs → LLM → Answer

## 🔐 Security Features

- JWT Authentication
- Rate limiting on AI endpoints
- Input sanitization
- API key protection (environment variables)
- Helmet security headers

## 📈 Scalability

- Redis caching for frequent queries
- Scalable vector DB retrieval
- Microservices-ready architecture
- Queue system ready (BullMQ)

## 🛠️ Tech Stack

**Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide Icons
**Backend**: Node.js, Express, MongoDB, Redis
**AI/ML**: Google Gemini, Vector Embeddings
**Database**: MongoDB, Redis, ChromaDB

## 📁 Project Structure

```
elect/
├── backend/
│   ├── agents/           # 5 specialized AI agents
│   ├── orchestrator/     # Agent routing logic
│   ├── services/         # RAG, embeddings, LLM
│   ├── routes/           # API endpoints
│   ├── db/              # Database connections
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared components
│   │   ├── pages/        # Route pages
│   │   └── services/     # API client
│   └── public/           # Static assets
└── README.md
```

## 🧪 API Endpoints

### Chat
- `POST /api/chat` - Send message to AI
- `POST /api/chat/rag` - RAG-only query
- `POST /api/chat/stream` - Streaming response

### Election Data
- `GET /api/election/timeline` - Get election timeline
- `GET /api/election/upcoming` - Upcoming events
- `POST /api/election/seed` - Seed sample data

### Agents
- `GET /api/agents/status` - Agent health status
- `POST /api/agents/retrieval` - Run retrieval agent
- `POST /api/agents/explanation` - Run explanation agent
- `POST /api/agents/timeline` - Run timeline agent
- `POST /api/agents/recommendation` - Run recommendation agent
- `POST /api/agents/factcheck` - Run fact-check agent

## 🎨 UI Features

- **Glassmorphism Design**: Modern translucent UI
- **Animated Interactions**: Framer Motion animations
- **Responsive Layout**: Mobile-first design
- **Dark Mode**: Default dark theme with accent colors
- **Real-time Chat**: Interactive chat interface with agent indicators
- **Visual Timeline**: Interactive timeline with filtering

## 🔮 Future Enhancements

- [ ] Voice-based chatbot
- [ ] Multi-country election support
- [ ] Visual dashboards
- [ ] Bookmark important information
- [ ] "Explain like I'm 10" mode toggle
- [ ] Mobile app (React Native)
- [ ] Browser extension

## 📄 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

Built with 💜 for democracy. Empowering voters through technology.
