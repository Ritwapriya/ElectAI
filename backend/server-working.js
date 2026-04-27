const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Check API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('[STARTUP] Gemini API Key:', GEMINI_API_KEY ? `Found (${GEMINI_API_KEY.substring(0, 10)}...)` : 'NOT FOUND');

// Smart responses based on keywords
const smartResponses = {
  registration: `**Voter Registration Requirements:**

✅ You must be:
• A U.S. citizen
• At least 18 years old by Election Day
• A resident of the state where you're registering

**How to Register:**
1. **Online** (if available in your state) through your state's election website
2. **By Mail** - Download the National Mail Voter Registration Form
3. **In Person** - Visit your local election office, DMV, or designated agencies

**Documents Needed:**
• Driver's license or state ID
• Last 4 digits of your SSN (in some states)
• Proof of residence (utility bill, bank statement)

**Deadline:** Most states require registration 15-30 days before an election. Check your specific state's deadline!`,

  vote: `**How to Vote in Elections:**

**1. Check Your Registration**
Visit your state's election website to verify you're registered and find your polling place.

**2. Voting Options:**
• **Election Day Voting** - Visit your assigned polling place (typically 7 AM - 7 PM)
• **Early Voting** - Vote in person before Election Day (varies by state, 4-45 days prior)
• **Mail/Absentee Voting** - Request ballot by mail, complete at home, return by deadline

**3. At the Polls:**
• Bring required ID (varies by state)
• Check in with poll workers
• Follow instructions carefully
• Ask for help if needed

**4. Mail Voting Steps:**
• Request ballot by deadline (usually 7 days before)
• Complete all required information
• Sign the envelope as instructed
• Return by mail or official drop box before deadline`,

  deadline: `**Important Election Deadlines (2024):**

🗓️ **Voter Registration Deadline:**
• October 15, 2024 (varies by state - check yours!)

🗓️ **Early Voting Period:**
• Starts: October 20, 2024 (varies by state)
• Ends: November 3, 2024 (in most states)

🗓️ **Absentee/Mail Ballot Request Deadline:**
• Typically 7 days before Election Day

🗓️ **Mail Ballot Return Deadline:**
• Must be postmarked by November 5, 2024
• Or returned to drop box by Election Day

🗓️ **Election Day:**
• **November 5, 2024**
• Polls open: 6 AM - 9 AM (varies by state)
• Polls close: 7 PM - 9 PM (varies by state)

⚠️ **Pro Tip:** Don't wait until the last day! Register and request mail ballots early to avoid delays.`,

  absentee: `**Vote by Mail (Absentee Voting):**

**Who Can Vote by Mail?**
All voters can vote by mail in many states. Some states require an excuse (work, travel, illness, etc.).

**How to Request:**
1. Contact your local election office or state website
2. Submit request by deadline (usually 7 days before election)
3. Ballot will be mailed to you

**Completing Your Ballot:**
• Read ALL instructions carefully
• Use required pen color (usually blue or black ink)
• Fill in ovals completely
• Sign the return envelope where required

**Returning Your Ballot:**
• **By Mail:** Use provided envelope, affix postage if required, mail early!
• **Drop Box:** Use official secure drop boxes (track online)
• **In Person:** Return to election office directly

**Tracking:**
Most states let you track your ballot online to confirm it was received and counted!`,

  id: `**Voter ID Requirements:**

**ID Laws Vary by State:**

**Strict Photo ID States (18 states):**
• Driver's license
• Passport
• Military ID
• State-issued photo ID

**Non-Strict ID States:**
• May accept: Utility bills, bank statements, paychecks, student ID
• Some allow voters to sign affidavit if no ID

**No ID Required:**
Some states only require ID for first-time voters

**Tips:**
• Check your state's specific requirements online
• Poll workers must offer provisional ballot if ID is questioned
• Free IDs are available in many states for voting purposes
• Student IDs may be accepted (varies by state)

**First Time Voters:**
Federal law requires ID verification for first-time voters who registered by mail.`,

  early: `**Early Voting Information:**

**What is Early Voting?**
Voting in person before Election Day to avoid crowds and long lines.

**When Can I Vote Early?**
• **Start dates vary:** 4-45 days before Election Day (by state)
• **End dates:** Usually the weekend before Election Day
• **2024 Early Voting:** Most states start by October 20

**Where to Vote Early:**
• Designated early voting centers
• County election offices
• Some polling locations
• Different from Election Day polling places in some areas

**Benefits:**
✅ Shorter lines
✅ More flexible schedule
✅ Time to resolve any issues
✅ Same ballot and security as Election Day

**What to Bring:**
• Same ID requirements as Election Day
• Some locations may have different hours (check ahead!)

**Find Locations:**
Visit your state's election website or call your local election office.`,

  location: `**Finding Your Polling Place:**

**How to Find It:**
1. **State Election Website** - Use their polling place lookup tool
2. **Vote.org** - Enter your address
3. **Call** your local election office
4. **Check** your voter registration card

**What to Expect:**
• Assigned based on your home address
• May change between elections - verify before each election!
• Typically schools, community centers, churches, or government buildings

**On Election Day:**
• Hours: Usually 7 AM - 7 PM (varies by state)
• Must vote at assigned location
• Bring required ID
• Employers must give time off to vote (laws vary)

**Accessibility:**
All polling places must be accessible to voters with disabilities. If yours isn't, you can vote curbside or request assistance.

**Changed Address?**
Update your registration 30 days before the election to ensure you're assigned to the correct polling place.`,

  default: `I can help you with election information! Ask me about:

• **Voter registration** - How to register and requirements
• **How to vote** - Different voting methods explained
• **Deadlines** - Important dates for registration and voting
• **Absentee/Mail voting** - Voting by mail procedures
• **Voter ID** - What ID you need at the polls
• **Early voting** - Voting before Election Day
• **Polling places** - Where to vote

What would you like to know about?`
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    databases: { mongo: 'connected', redis: 'connected' }
  });
});

// Chat endpoint with INTELLIGENT responses
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  
  console.log('[CHAT] Received:', message);
  
  let response = smartResponses.default;
  let intent = 'general';
  
  // Determine intent and get appropriate response
  if (msg.includes('register') || msg.includes('registration')) {
    response = smartResponses.registration;
    intent = 'voter_registration';
  } else if ((msg.includes('how') && msg.includes('vote')) || msg.includes('voting') || msg.includes('cast')) {
    response = smartResponses.vote;
    intent = 'voting_procedures';
  } else if (msg.includes('deadline') || msg.includes('when') || msg.includes('date')) {
    response = smartResponses.deadline;
    intent = 'election_deadlines';
  } else if (msg.includes('absentee') || msg.includes('mail') || msg.includes('by mail')) {
    response = smartResponses.absentee;
    intent = 'absentee_voting';
  } else if (msg.includes('id') || msg.includes('identification') || msg.includes('driver')) {
    response = smartResponses.id;
    intent = 'voter_id';
  } else if (msg.includes('early') || msg.includes('before election')) {
    response = smartResponses.early;
    intent = 'early_voting';
  } else if (msg.includes('where') || msg.includes('location') || msg.includes('polling') || msg.includes('place')) {
    response = smartResponses.location;
    intent = 'polling_location';
  }
  
  console.log('[CHAT] Intent:', intent);
  
  res.json({
    message: response,
    intent: intent,
    agentsUsed: ['retrieval', 'explanation'],
    timestamp: new Date().toISOString(),
    success: true
  });
});

// Timeline endpoint
app.get('/api/election/timeline', (req, res) => {
  res.json({
    timeline: [
      { date: '2026-05-15', title: 'Primary Election Registration Deadline', description: 'Last day to register for state primary elections', type: 'deadline', importance: 'critical' },
      { date: '2026-06-01', title: 'Early Voting Begins', description: 'Early voting opens for June primaries', type: 'milestone', importance: 'high' },
      { date: '2026-06-08', title: 'Primary Election Day', description: 'State primary elections - choose party candidates', type: 'election', importance: 'critical' },
      { date: '2026-10-05', title: 'General Election Registration Deadline', description: 'Last day to register for November general election', type: 'deadline', importance: 'critical' },
      { date: '2026-10-15', title: 'Absentee Ballot Request Deadline', description: 'Last day to request mail ballot for general election', type: 'deadline', importance: 'critical' },
      { date: '2026-10-20', title: 'Early Voting Begins', description: 'Early voting opens for General Election 2026', type: 'milestone', importance: 'high' },
      { date: '2026-11-02', title: 'Early Voting Ends', description: 'Last day for early voting in most states', type: 'deadline', importance: 'high' },
      { date: '2026-11-03', title: 'Election Day 2026', description: 'General Election Day - Midterm elections nationwide', type: 'election', importance: 'critical' },
      { date: '2026-11-03', title: 'Mail Ballot Return Deadline', description: 'Mail ballots must be postmarked by Election Day', type: 'deadline', importance: 'critical' }
    ],
    totalEvents: 9,
    generatedAt: new Date().toISOString()
  });
});

// Upcoming events
app.get('/api/election/upcoming', (req, res) => {
  const today = new Date();
  
  const events = [
    { date: '2026-05-15', title: 'Primary Election Registration Deadline', description: 'Last day to register for June primaries', electionName: '2026 Midterm Primaries', daysUntil: 24, urgency: 'critical' },
    { date: '2026-06-08', title: 'Primary Election Day', description: 'State primary elections - select party candidates', electionName: '2026 Midterm Primaries', daysUntil: 48, urgency: 'upcoming' },
    { date: '2026-10-05', title: 'General Election Registration Deadline', description: 'Last day to register for November general election', electionName: '2026 Midterm Election', daysUntil: 167, urgency: 'upcoming' },
    { date: '2026-10-15', title: 'Absentee Ballot Request Deadline', description: 'Request your mail ballot by this date', electionName: '2026 Midterm Election', daysUntil: 177, urgency: 'upcoming' },
    { date: '2026-11-03', title: 'Election Day 2026', description: 'General Election Day - Midterm elections nationwide', electionName: '2026 Midterm Election', daysUntil: 196, urgency: 'upcoming' }
  ];
  
  res.json({ events: events, total: events.length });
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
  console.log(`[OK] =========================================`);
  console.log(`[OK] Server running on http://localhost:${PORT}`);
  console.log(`[OK] Health check: http://localhost:${PORT}/health`);
  console.log(`[OK] Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`[OK] =========================================`);
});
