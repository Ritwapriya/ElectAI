# ElectAI API Documentation

Welcome to the ElectAI API documentation. This document outlines the available endpoints, request/response formats, and the multi-agent orchestration logic.

## Base URL
`https://elect-ai.onrender.com/api` (Production)
`http://localhost:5000/api` (Development)

## Authentication
Currently, the API is public for hackathon demonstration. Future versions will implement JWT-based authentication.

---

## 1. Chat & Orchestration
### POST `/chat`
The main entry point for the Multi-Agent system.

**Request Body:**
```json
{
  "message": "How do I register to vote?",
  "stateId": "delhi",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "response": "To register to vote in India, visit the NVSP portal...",
  "intent": "registration_query",
  "agentsUsed": ["retrieval", "explanation"]
}
```

---

## 2. Election Data
### GET `/election/timeline`
Fetches the global election timeline.

### GET `/election/states`
Returns a list of all supported Indian states.

### GET `/election/constituencies/:stateId`
Returns constituencies for a specific state.

---

## 3. Agents System
ElectAI uses a specialized Multi-Agent architecture:
- **Retrieval Agent**: Fetches grounded data from the knowledge base.
- **Explanation Agent**: Simplifies complex legal/electoral terminology.
- **Timeline Agent**: Manages dates and deadlines.
- **Fact-Check Agent**: Verifies AI responses against official ECI sources.
- **Recommendation Agent**: Provides personalized voter guidance.

---

## Error Handling
The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found
- `429`: Too Many Requests (Rate Limited)
- `500`: Internal Server Error

---
*© 2026 ElectAI Project. Built for Virtual Prompt Wars.*
