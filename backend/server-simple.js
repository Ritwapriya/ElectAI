const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint with mock responses
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  const responses = {
    'voter registration': 'To register to vote, you must be a U.S. citizen, at least 18 years old, and meet your state\'s residency requirements. You can register online, by mail, or in person. Required documents typically include a driver\'s license or state ID.',
    'how to vote': 'Voting is your fundamental right! Here\'s the process:\n\n1. Check your voter registration status\n2. Find your polling place\n3. Bring required ID on Election Day\n4. Follow instructions on your ballot\n5. Submit your ballot\n\nYou can also vote early or by mail in most states!',
    'election day': 'On Election Day, polls are typically open from 7 AM to 7 PM. Bring your ID if required by your state. You\'ll receive a ballot with candidates and ballot measures. If your name isn\'t on the rolls, ask for a provisional ballot.',
    'deadline': 'Key deadlines vary by state, but typically:\n\n- Voter Registration: 15-30 days before Election Day\n- Early Voting: 4-45 days before Election Day\n- Mail Ballot Request: 7 days before Election Day\n- Mail Ballot Return: Must be postmarked by Election Day',
    'absentee': 'To vote by mail (absentee voting):\n\n1. Request an absentee ballot from your local election office\n2. Complete the ballot following all instructions\n3. Sign the ballot envelope as required\n4. Return by mail or drop at an official drop box\n5. Track your ballot online if available',
  };
  
  let response = 'I can help you with election information! Ask me about voter registration, how to vote, election day procedures, deadlines, or absentee voting.';
  
  const msg = message.toLowerCase();
  if (msg.includes('register') || msg.includes('registration')) response = responses['voter registration'];
  else if (msg.includes('how') && msg.includes('vote')) response = responses['how to vote'];
  else if (msg.includes('election day')) response = responses['election day'];
  else if (msg.includes('deadline') || msg.includes('when')) response = responses['deadline'];
  else if (msg.includes('absentee') || msg.includes('mail')) response = responses['absentee'];
  
  res.json({
    message: response,
    intent: 'explanation_query',
    agentsUsed: ['retrieval', 'explanation'],
    timestamp: new Date().toISOString(),
    success: true
  });
});

// Timeline endpoint
app.get('/api/election/timeline', (req, res) => {
  res.json({
    timeline: [
      { date: '2024-10-01', title: 'Voter Registration Opens', description: 'Registration period begins', type: 'campaign', importance: 'medium' },
      { date: '2024-10-15', title: 'Voter Registration Deadline', description: 'Last day to register', type: 'deadline', importance: 'critical' },
      { date: '2024-10-20', title: 'Early Voting Begins', description: 'Early voting opens in most states', type: 'milestone', importance: 'high' },
      { date: '2024-11-03', title: 'Early Voting Ends', description: 'Last day for early voting', type: 'deadline', importance: 'high' },
      { date: '2024-11-05', title: 'Election Day', description: 'Official voting day', type: 'election', importance: 'critical' },
    ],
    totalEvents: 5,
    generatedAt: new Date().toISOString()
  });
});

// Upcoming events
app.get('/api/election/upcoming', (req, res) => {
  res.json({
    events: [
      { date: '2024-10-15', title: 'Voter Registration Deadline', description: 'Last day to register for General Election 2024', electionName: 'General Election 2024', daysUntil: 15, urgency: 'critical' },
      { date: '2024-10-20', title: 'Early Voting Begins', description: 'Early voting period opens', electionName: 'General Election 2024', daysUntil: 20, urgency: 'upcoming' },
      { date: '2024-11-05', title: 'Election Day', description: 'Official voting day', electionName: 'General Election 2024', daysUntil: 36, urgency: 'upcoming' },
    ],
    total: 3
  });
});

// Agent status
app.get('/api/agents/status', (req, res) => {
  res.json({
    agents: [
      { name: 'RetrievalAgent', status: 'active', type: 'rag' },
      { name: 'ExplanationAgent', status: 'active', type: 'processing' },
      { name: 'TimelineAgent', status: 'active', type: 'data' },
      { name: 'RecommendationAgent', status: 'active', type: 'processing' },
      { name: 'FactCheckAgent', status: 'active', type: 'verification' }
    ],
    totalActive: 5,
    orchestrator: 'active'
  });
});

app.listen(PORT, () => {
  console.log(`[OK] Server running on http://localhost:${PORT}`);
  console.log(`[OK] Health check: http://localhost:${PORT}/health`);
  console.log(`[OK] API endpoints ready`);
});
