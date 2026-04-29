# Google Cloud & Firebase Integration

ElectAI is built using the Google Cloud ecosystem to ensure scalability, security, and high-performance AI orchestration.

## 1. Google Generative AI (Gemini)
- **Model**: `gemini-1.5-flash` for low-latency, grounded responses.
- **SDK**: Using `@google/generative-ai` for seamless integration.
- **Safety**: Multi-layered safety settings (harassment, hate speech, etc.) enforced at the SDK level.
- **Vertex AI Compatibility**: The architecture is designed to transition to Vertex AI for enterprise-grade scalability.

## 2. Firebase (Google Cloud Console)
- **Authentication**: Firebase Auth is used for secure user session management.
- **Firestore**: Used for storing non-sensitive election metadata and voter readiness checklists.
- **Analytics**: Google Analytics for Firebase tracks user engagement with civic educational content.

## 3. Infrastructure
- **Deployment**: Node.js backend and React frontend are deployed with environment variable management for Google Cloud secrets.

---
*Built with ❤️ using Google Cloud Platform*
