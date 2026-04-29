const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

async function fetchWithError(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function sendMessage(message, options = {}) {
  return fetchWithError(`${API_BASE_URL}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      ...options,
    }),
  });
}

export async function sendRAGQuery(message) {
  return fetchWithError(`${API_BASE_URL}/chat/rag`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function getTimeline(electionId) {
  const url = electionId 
    ? `${API_BASE_URL}/election/timeline?electionId=${electionId}`
    : `${API_BASE_URL}/election/timeline`;
  return fetchWithError(url);
}

export async function getUpcomingEvents(days = 30) {
  return fetchWithError(`${API_BASE_URL}/election/upcoming?days=${days}`);
}

export async function getElections() {
  return fetchWithError(`${API_BASE_URL}/election/list`);
}

export async function getAgentStatus() {
  return fetchWithError(`${API_BASE_URL}/agents/status`);
}

export async function runRetrievalAgent(query) {
  return fetchWithError(`${API_BASE_URL}/agents/retrieval`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function runExplanationAgent(content, explainLevel = 'simple') {
  return fetchWithError(`${API_BASE_URL}/agents/explanation`, {
    method: 'POST',
    body: JSON.stringify({ content, explainLevel }),
  });
}

export async function runTimelineAgent(query = '') {
  return fetchWithError(`${API_BASE_URL}/agents/timeline`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function runRecommendationAgent(userId, query) {
  return fetchWithError(`${API_BASE_URL}/agents/recommendation`, {
    method: 'POST',
    body: JSON.stringify({ userId, query }),
  });
}

export async function runFactCheckAgent(content) {
  return fetchWithError(`${API_BASE_URL}/agents/factcheck`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function seedDatabase() {
  return fetchWithError(`${API_BASE_URL}/election/seed`, {
    method: 'POST',
  });
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
