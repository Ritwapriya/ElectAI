# ElectAI Security Policy

This document outlines the security measures implemented in the ElectAI platform to ensure data integrity, user privacy, and system resilience.

## 1. Data Protection
- **Encryption**: All communication between the frontend and backend is encrypted via HTTPS (managed by Render).
- **Environment Variables**: Sensitive keys (API keys, DB URIs) are never hardcoded and are managed via environment variables.

## 2. API Security
- **Helmet**: Used for setting secure HTTP headers (CSP, HSTS, etc.).
- **Rate Limiting**: Implemented to prevent Brute Force and DoS attacks.
- **Input Sanitization**: All user inputs are sanitized using `express-validator` to prevent XSS and Injection attacks.
- **CORS**: Restricted to production domains only.

## 3. AI Safety
- **Content Filtering**: Google Gemini API safety settings are configured to block harassment, hate speech, and dangerous content.
- **System Guardrails**: System instructions force the AI to remain neutral, non-partisan, and citation-focused.

## 4. Infrastructure
- **Database**: MongoDB Atlas is used with IP whitelisting and encrypted connections.
- **Redis**: Used for secure caching of frequently asked questions.

---
*Report security vulnerabilities to: security@electai.project*
