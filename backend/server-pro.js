const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// COMPLETE ELECTION ARCHIVE - INDIA
// Past: 2024-2025 | Upcoming: 2026-2028
// ==========================================
const electionData = {
  states: {
    'west-bengal': {
      name: 'West Bengal',
      language: 'bn',
      upcomingElections: [
        {
          id: 'wb-loksabha-2024',
          title: 'Lok Sabha Elections 2024 - West Bengal',
          date: '2024-05-20',
          type: 'national',
          description: 'General elections for 42 parliamentary constituencies in West Bengal',
          phases: 7,
          totalSeats: 42,
          result: 'AITC: 29, BJP: 12, INC: 1',
          status: 'completed',
          voterTurnout: '81.9%'
        },
        {
          id: 'wb-panchayat-2026',
          title: 'West Bengal Panchayat Elections 2026',
          date: '2026-07-15',
          type: 'local',
          description: 'Three-tier panchayat system elections across all districts',
          phases: 3,
          totalSeats: 92833,
          notificationDate: '2026-06-20',
          lastDateNomination: '2026-06-27',
          scrutinyDate: '2026-06-28',
          withdrawalDate: '2026-07-01',
          countingDate: '2026-07-18',
          status: 'upcoming',
          isImportant: true
        },
        {
          id: 'wb-municipal-2026',
          title: 'West Bengal Municipal Elections 2026',
          date: '2026-11-20',
          type: 'municipal',
          description: 'Elections for 108 municipalities and 7 municipal corporations including Kolkata',
          phases: 1,
          totalSeats: 4580,
          notificationDate: '2026-10-25',
          lastDateNomination: '2026-11-01',
          scrutinyDate: '2026-11-02',
          withdrawalDate: '2026-11-04',
          countingDate: '2026-11-23',
          status: 'upcoming'
        },
        {
          id: 'wb-assembly-2026',
          title: 'West Bengal Legislative Assembly Elections 2026',
          date: '2026-04-15',
          type: 'state',
          description: 'Elections for 294 assembly constituencies',
          phases: 8,
          totalSeats: 294,
          notificationDate: '2026-03-20',
          status: 'scheduled'
        }
      ],
      constituencies: [
        { id: 'KOL-N', name: 'Kolkata North', type: 'municipal', voters: 1250000 },
        { id: 'KOL-S', name: 'Kolkata South', type: 'municipal', voters: 1180000 },
        { id: 'HWD', name: 'Howrah', type: 'municipal', voters: 980000 },
        { id: 'DAR', name: 'Darjeeling', type: 'panchayat', voters: 420000 },
        { id: 'N24', name: 'North 24 Parganas', type: 'panchayat', voters: 2100000 }
      ],
      majorParties: ['AITC', 'BJP', 'INC', 'CPI(M)', 'ISF'],
      chiefElectoralOfficer: {
        name: 'Shri Aariz Aftab, IAS',
        office: 'Election Department, 2nd Floor, New Secretariat Building, Kolkata',
        phone: '033-2214-5555',
        email: 'ceo_westbengal@eci.gov.in',
        website: 'https://ceowestbengal.nic.in'
      },
      voterHelpline: '1950',
      onlineServices: {
        registration: 'https://voterservice.eci.gov.in',
        statusCheck: 'https://electoralsearch.eci.gov.in',
        downloadEPIC: 'https://nvsp.in'
      }
    },
    'karnataka': {
      name: 'Karnataka',
      language: 'kn',
      upcomingElections: [
        {
          id: 'ka-loksabha-2024',
          title: 'Lok Sabha Elections 2024 - Karnataka',
          date: '2024-04-26',
          type: 'national',
          description: 'General elections for 28 parliamentary constituencies',
          phases: 2,
          totalSeats: 28,
          result: 'BJP: 17, INC: 9, JDS: 2',
          status: 'completed',
          voterTurnout: '70.9%'
        },
        {
          id: 'ka-bbmp-2026',
          title: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Elections 2026',
          date: '2026-08-20',
          type: 'municipal',
          description: 'Elections for Bengaluru city corporation - 198 wards',
          phases: 1,
          totalSeats: 198,
          notificationDate: '2026-07-25',
          lastDateNomination: '2026-08-01',
          scrutinyDate: '2026-08-02',
          withdrawalDate: '2026-08-05',
          countingDate: '2026-08-23',
          status: 'upcoming',
          isImportant: true
        },
        {
          id: 'ka-assembly-2028',
          title: 'Karnataka Legislative Assembly Elections 2028',
          date: '2028-05-10',
          type: 'state',
          description: 'Elections for 224 assembly constituencies',
          phases: 1,
          totalSeats: 224,
          status: 'scheduled'
        }
      ],
      constituencies: [
        { id: 'BLR-C', name: 'Bengaluru Central', type: 'municipal', voters: 1850000 },
        { id: 'BLR-N', name: 'Bengaluru North', type: 'municipal', voters: 1620000 },
        { id: 'BLR-S', name: 'Bengaluru South', type: 'municipal', voters: 1780000 },
        { id: 'MYS', name: 'Mysuru', type: 'municipal', voters: 890000 }
      ],
      majorParties: ['BJP', 'INC', 'JDS', 'AAP'],
      chiefElectoralOfficer: {
        name: 'Shri Manoj Kumar Meena, IAS',
        office: 'Chief Electoral Office, 2nd Floor, Multi-Storeyed Building, Dr. B.R. Ambedkar Road, Bengaluru',
        phone: '080-2228-2424',
        email: 'ceo_karnataka@eci.gov.in',
        website: 'https://ceokarnataka.kar.nic.in'
      },
      voterHelpline: '1950',
      onlineServices: {
        registration: 'https://voterservice.eci.gov.in',
        statusCheck: 'https://electoralsearch.eci.gov.in',
        downloadEPIC: 'https://nvsp.in'
      }
    },
    'maharashtra': {
      name: 'Maharashtra',
      language: 'mr',
      upcomingElections: [
        {
          id: 'mh-loksabha-2024',
          title: 'Lok Sabha Elections 2024 - Maharashtra',
          date: '2024-05-20',
          type: 'national',
          description: 'General elections for 48 parliamentary constituencies',
          phases: 5,
          totalSeats: 48,
          result: 'BJP: 9, SHS(UBT): 9, NCP: 4, INC: 13, SHS: 7',
          status: 'completed',
          voterTurnout: '61.3%'
        },
        {
          id: 'mh-assembly-2024',
          title: 'Maharashtra Legislative Assembly Elections 2024',
          date: '2024-11-20',
          type: 'state',
          description: 'Elections for 288 assembly constituencies',
          phases: 1,
          totalSeats: 288,
          result: 'Mahayuti (BJP+): 237, MVA: 46',
          status: 'completed',
          voterTurnout: '66.0%'
        },
        {
          id: 'mh-municipal-2026',
          title: 'Maharashtra Municipal Council Elections 2026',
          date: '2026-09-10',
          type: 'municipal',
          description: 'Elections for 225 municipal councils and 21 municipal corporations',
          phases: 2,
          totalSeats: 8950,
          notificationDate: '2026-08-15',
          lastDateNomination: '2026-08-22',
          scrutinyDate: '2026-08-23',
          withdrawalDate: '2026-08-26',
          countingDate: '2026-09-13',
          status: 'upcoming',
          isImportant: true
        }
      ],
      constituencies: [
        { id: 'MUM-C', name: 'Mumbai City', type: 'municipal', voters: 3200000 },
        { id: 'MUM-S', name: 'Mumbai Suburban', type: 'municipal', voters: 4500000 },
        { id: 'PUN', name: 'Pune', type: 'municipal', voters: 2100000 },
        { id: 'NAG', name: 'Nagpur', type: 'municipal', voters: 980000 }
      ],
      majorParties: ['BJP', 'SHS', 'NCP', 'INC', 'UBT', 'AAP'],
      chiefElectoralOfficer: {
        name: 'Shri Kiran Gitte, IAS',
        office: 'Chief Electoral Office, New Administrative Building, 7th Floor, Mumbai',
        phone: '022-2202-1234',
        email: 'ceo_maharashtra@eci.gov.in',
        website: 'https://ceomaharashtra.gov.in'
      },
      voterHelpline: '1950',
      onlineServices: {
        registration: 'https://voterservice.eci.gov.in',
        statusCheck: 'https://electoralsearch.eci.gov.in',
        downloadEPIC: 'https://nvsp.in'
      }
    },
    'tamil-nadu': {
      name: 'Tamil Nadu',
      language: 'ta',
      upcomingElections: [
        {
          id: 'tn-local-2026',
          title: 'Tamil Nadu Local Body Elections 2026',
          date: '2026-02-15',
          type: 'local',
          description: 'Elections for district panchayats, town panchayats and municipalities',
          phases: 2,
          totalSeats: 125000,
          notificationDate: '2026-01-20',
          lastDateNomination: '2026-01-27',
          scrutinyDate: '2026-01-28',
          withdrawalDate: '2026-01-30',
          countingDate: '2026-02-18',
          status: 'scheduled'
        }
      ],
      constituencies: [
        { id: 'CHE-N', name: 'Chennai North', type: 'municipal', voters: 1850000 },
        { id: 'CHE-S', name: 'Chennai South', type: 'municipal', voters: 1920000 },
        { id: 'COI', name: 'Coimbatore', type: 'municipal', voters: 1200000 },
        { id: 'MAD', name: 'Madurai', type: 'municipal', voters: 890000 }
      ],
      majorParties: ['DMK', 'AIADMK', 'BJP', 'INC', 'VCK'],
      chiefElectoralOfficer: {
        name: 'Shri Satyabrata Sahoo, IAS',
        office: 'Chief Electoral Office, Fort St. George, Chennai',
        phone: '044-2567-0216',
        email: 'ceo_tamilnadu@eci.gov.in',
        website: 'https://www.elections.tn.gov.in'
      },
      voterHelpline: '1950',
      onlineServices: {
        registration: 'https://voterservice.eci.gov.in',
        statusCheck: 'https://electoralsearch.eci.gov.in',
        downloadEPIC: 'https://nvsp.in'
      }
    },
    'delhi': {
      name: 'Delhi',
      language: 'hi',
      upcomingElections: [
        {
          id: 'dl-loksabha-2024',
          title: 'Lok Sabha Elections 2024 - Delhi',
          date: '2024-05-25',
          type: 'national',
          description: 'General elections for 7 parliamentary constituencies',
          phases: 1,
          totalSeats: 7,
          result: 'BJP: 7 (Clean Sweep)',
          status: 'completed',
          voterTurnout: '58.3%'
        },
        {
          id: 'dl-assembly-2025',
          title: 'Delhi Legislative Assembly Elections 2025',
          date: '2025-02-05',
          type: 'state',
          description: 'Elections for 70 assembly constituencies',
          phases: 1,
          totalSeats: 70,
          result: 'AAP: 48, BJP: 22',
          status: 'completed',
          voterTurnout: '60.5%'
        },
        {
          id: 'dl-mcd-2026',
          title: 'Delhi Municipal Corporation Elections 2026',
          date: '2026-10-15',
          type: 'municipal',
          description: 'Elections for 250 wards of Municipal Corporation of Delhi',
          phases: 1,
          totalSeats: 250,
          notificationDate: '2026-09-20',
          lastDateNomination: '2026-09-27',
          scrutinyDate: '2026-09-28',
          withdrawalDate: '2026-09-30',
          countingDate: '2026-10-18',
          status: 'upcoming',
          isImportant: true
        }
      ],
      constituencies: [
        { id: 'ND', name: 'New Delhi', type: 'municipal', voters: 1450000 },
        { id: 'SD', name: 'South Delhi', type: 'municipal', voters: 2100000 },
        { id: 'ED', name: 'East Delhi', type: 'municipal', voters: 1950000 },
        { id: 'WD', name: 'West Delhi', type: 'municipal', voters: 2300000 },
        { id: 'NDMC', name: 'North Delhi', type: 'municipal', voters: 1850000 }
      ],
      majorParties: ['AAP', 'BJP', 'INC'],
      chiefElectoralOfficer: {
        name: 'Shri P. Krishnamurthy',
        office: 'Chief Electoral Office, Old St. Stephen College Building, Kashmere Gate, Delhi',
        phone: '011-2391-7272',
        email: 'ceo_delhi@eci.gov.in',
        website: 'https://ceodelhi.gov.in'
      },
      voterHelpline: '1950',
      onlineServices: {
        registration: 'https://voterservice.eci.gov.in',
        statusCheck: 'https://electoralsearch.eci.gov.in',
        downloadEPIC: 'https://nvsp.in'
      }
    }
  }
};

// Polling booth data sample (would be from ECI database)
const pollingBooths = {
  'west-bengal': {
    'KOL-N': [
      { id: 'WB001', name: 'Patha Bhavan School', address: '2A, Mandeville Gardens, Ballygunge, Kolkata', pincode: '700019', lat: 22.5251, lng: 88.3572 },
      { id: 'WB002', name: 'South Point High School', address: '16, Mandeville Gardens, Ballygunge, Kolkata', pincode: '700019', lat: 22.5271, lng: 88.3582 },
      { id: 'WB003', name: 'Loreto House', address: '7, Sir William Jones Sarani, Park Street, Kolkata', pincode: '700016', lat: 22.5471, lng: 88.3592 }
    ],
    'KOL-S': [
      { id: 'WB101', name: 'Jadavpur University', address: '188, Raja Subodh Chandra Mullick Road, Jadavpur', pincode: '700032', lat: 22.4975, lng: 88.3712 },
      { id: 'WB102', name: 'St. Xavier\'s College', address: '30, Mother Teresa Sarani, Park Street', pincode: '700016', lat: 22.5501, lng: 88.3601 }
    ]
  },
  'karnataka': {
    'BLR-C': [
      { id: 'KA001', name: 'Bangalore University', address: 'Jnana Bharathi Campus, Mysore Road', pincode: '560056', lat: 12.9245, lng: 77.4988 },
      { id: 'KA002', name: 'R.V. College of Engineering', address: 'Mysore Road, R.V. Vidyaniketan, Bengaluru', pincode: '560059', lat: 12.9227, lng: 77.4998 }
    ]
  }
};

// Candidate data (sample)
const candidates = {
  'wb-panchayat-2025': {
    'KOL-N': [
      { name: 'Ananya Banerjee', party: 'AITC', age: 42, education: 'M.A. Political Science', profession: 'Social Worker', criminalCases: 0, assets: '₹2.5 Cr' },
      { name: 'Rahul Sinha', party: 'BJP', age: 48, education: 'B.Com, MBA', profession: 'Businessman', criminalCases: 1, assets: '₹5.8 Cr' },
      { name: 'Mohammed Imran', party: 'INC', age: 38, education: 'LL.B', profession: 'Advocate', criminalCases: 0, assets: '₹1.2 Cr' }
    ]
  }
};

// Smart responses based on location
const smartResponses = {
  registration: (state) => `**Voter Registration in ${state.name}:**

✅ **Eligibility:**
• Indian citizen
• 18+ years by qualifying date
• Resident of ${state.name}

**How to Register:**
1. **Online:** ${state.onlineServices.registration}
2. **NVSP Portal:** https://nvsp.in (Form 6)
3. **Voter Helpline:** Call ${state.voterHelpline}
4. **Offline:** Visit Electoral Registration Office

**Documents Required:**
• Photo ID (Aadhaar/Passport/Driving License)
• Address Proof
• Passport size photo

**Status Check:** ${state.onlineServices.statusCheck}

**CEO Office:** ${state.chiefElectoralOfficer.phone}`,

  deadlines: (state, election) => `**${election.title} - Key Dates:**

📅 **Notification:** ${election.notificationDate}
📅 **Last Date Nominations:** ${election.lastDateNomination}
📅 **Scrutiny:** ${election.scrutinyDate}
📅 **Withdrawal:** ${election.withdrawalDate}
🗳️ **Polling Date:** ${election.date}
📊 **Counting:** ${election.countingDate}

**Total Seats:** ${election.totalSeats.toLocaleString()}
**Phases:** ${election.phases}

⚠️ **Register NOW at:** ${state.onlineServices.registration}

Helpline: ${state.voterHelpline}`,

  candidates: (state, electionId, constituency) => {
    const candList = candidates[electionId]?.[constituency.id] || [
      { name: 'Candidate list not available yet', party: 'N/A', note: 'Will be updated after nomination filing' }
    ];
    
    return `**Candidates for ${constituency.name} (${electionId}):**

${candList.map(c => `
👤 **${c.name}**
   Party: ${c.party}
   Age: ${c.age} | Education: ${c.education}
   Profession: ${c.profession}
   Criminal Cases: ${c.criminalCases}
   Assets: ${c.assets}
`).join('\n')}

⚠️ **Note:** Candidate list will be finalized after scrutiny on ${state.upcomingElections.find(e => e.id === electionId)?.scrutinyDate || 'TBD'}

Check official updates at: ${state.chiefElectoralOfficer.website}`;
  },

  pollingBooth: (state, constituency, booths) => `**Your Polling Booths in ${constituency.name}:**

${booths.map(b => `
🏛️ **${b.name}**
   Address: ${b.address}
   Pincode: ${b.pincode}
   Booth ID: ${b.id}
   [View on Map](https://www.google.com/maps?q=${b.lat},${b.lng})
`).join('\n')}

**Voter Helpline:** ${state.voterHelpline}
**CEO Office:** ${state.chiefElectoralOfficer.phone}

⚠️ **Carry:** Voter ID (EPIC) or approved alternate ID
⚠️ **Timing:** 7 AM - 6 PM (may vary)

Find your exact booth: https://electoralsearch.eci.gov.in`,

  default: (state) => `**Welcome to ${state.name} Election Information!**

I can help you with:

📍 **Select your constituency** to get specific info

🔍 **Ask me about:**
• Voter registration process
• Upcoming election dates
• Polling booth locations
• Candidate information
• Required documents
• How to check voter status

📞 **Quick Help:**
• Voter Helpline: ${state.voterHelpline}
• CEO Office: ${state.chiefElectoralOfficer.phone}
• Website: ${state.chiefElectoralOfficer.website}

💻 **Online Services:**
• Registration: ${state.onlineServices.registration}
• Status Check: ${state.onlineServices.statusCheck}`
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0-pro',
    features: ['state-selection', 'real-elections', 'polling-booths', 'candidates', 'multilingual']
  });
});

// Get all states
app.get('/api/states', (req, res) => {
  const states = Object.entries(electionData.states).map(([id, data]) => ({
    id,
    name: data.name,
    language: data.language,
    upcomingElections: data.upcomingElections, // Include full election data!
    constituencies: data.constituencies,
    chiefElectoralOfficer: data.chiefElectoralOfficer,
    voterHelpline: data.voterHelpline,
    onlineServices: data.onlineServices
  }));
  
  res.json({ states, total: states.length });
});

// Get state details
app.get('/api/states/:stateId', (req, res) => {
  const state = electionData.states[req.params.stateId];
  if (!state) return res.status(404).json({ error: 'State not found' });
  
  res.json(state);
});

// Get constituencies for state
app.get('/api/states/:stateId/constituencies', (req, res) => {
  const state = electionData.states[req.params.stateId];
  if (!state) return res.status(404).json({ error: 'State not found' });
  
  res.json({ constituencies: state.constituencies, total: state.constituencies.length });
});

// Get polling booths
app.get('/api/states/:stateId/constituencies/:constituencyId/polling-booths', (req, res) => {
  const { stateId, constituencyId } = req.params;
  const booths = pollingBooths[stateId]?.[constituencyId] || [];
  
  res.json({ 
    booths, 
    total: booths.length,
    stateId,
    constituencyId
  });
});

// Get upcoming elections
app.get('/api/elections/upcoming', (req, res) => {
  const allElections = [];
  
  Object.entries(electionData.states).forEach(([stateId, state]) => {
    state.upcomingElections.forEach(election => {
      allElections.push({
        ...election,
        stateId,
        stateName: state.name
      });
    });
  });
  
  // Sort by date
  allElections.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json({ elections: allElections, total: allElections.length });
});

// PRO Chat endpoint with location awareness
app.post('/api/chat', async (req, res) => {
  const { message, stateId, constituencyId, language = 'en' } = req.body;
  const msg = message.toLowerCase();
  
  console.log('[CHAT] User:', message, '| State:', stateId, '| Constituency:', constituencyId);
  
  // Get state data if provided
  const state = stateId ? electionData.states[stateId] : null;
  const constituency = (state && constituencyId) 
    ? state.constituencies.find(c => c.id === constituencyId)
    : null;
  
  let response = '';
  let intent = 'general';
  let actionItems = [];
  
  // State-specific responses
  if (state) {
    const upcomingElection = state.upcomingElections[0]; // Next election
    
    if (msg.includes('register') || msg.includes('registration')) {
      response = smartResponses.registration(state);
      intent = 'voter_registration';
      actionItems = [
        { label: '🔗 Register Online', url: state.onlineServices.registration, type: 'primary' },
        { label: '✓ Check Status', url: state.onlineServices.statusCheck, type: 'secondary' },
        { label: '⬇ Download EPIC', url: state.onlineServices.downloadEPIC, type: 'secondary' }
      ];
    } else if (msg.includes('deadline') || msg.includes('date') || msg.includes('when')) {
      if (upcomingElection) {
        response = smartResponses.deadlines(state, upcomingElection);
        intent = 'election_deadlines';
        actionItems = [
          { label: 'Add to Calendar', action: 'calendar', date: upcomingElection.date },
          { label: 'Set Reminder', action: 'reminder', type: 'secondary' }
        ];
      }
    } else if (msg.includes('candidate') || msg.includes('who') || msg.includes('contest')) {
      if (constituency && upcomingElection) {
        response = smartResponses.candidates(state, upcomingElection.id, constituency);
        intent = 'candidate_info';
      } else {
        response = `**Candidates List**

To see candidate information, please **select your constituency** first.

${state.constituencies.map(c => `• ${c.name}`).join('\n')}

📞 **For candidate info:**
• Visit: ${state.chiefElectoralOfficer.website}
• Call: ${state.chiefElectoralOfficer.phone}`;
        intent = 'candidate_info';
      }
    } else if (msg.includes('booth') || msg.includes('where') || msg.includes('polling') || msg.includes('station')) {
      if (constituency) {
        const booths = pollingBooths[stateId]?.[constituencyId] || [];
        if (booths.length > 0) {
          response = smartResponses.pollingBooth(state, constituency, booths);
          intent = 'polling_location';
          actionItems = [
            { label: '🔗 Find Nearest Booth', url: `https://www.google.com/maps/search/?api=1&query=polling+booth+${encodeURIComponent(constituency.name)}+${encodeURIComponent(state.name)}`, type: 'primary' },
            { label: '📋 Check on ECI Website', url: 'https://electoralsearch.eci.gov.in', type: 'secondary' },
            { label: '📞 Call Helpline', url: `tel:${state.voterHelpline}`, type: 'secondary' }
          ];
        } else {
          response = `**Polling Booths for ${constituency.name}**

Booth list will be available after the notification date.

**Check back after:** ${upcomingElection?.notificationDate || 'TBD'}

**Alternative:** Find your booth on election day using:
• Voter Helpline: ${state.voterHelpline}
• SMS: Send EPIC <VoterID> to 1950
• Online: https://electoralsearch.eci.gov.in`;
        }
      } else {
        response = `**Find Your Polling Booth**

Please **select your constituency** first to see polling booth locations.

${state.constituencies.map(c => `• ${c.name} (${c.voters.toLocaleString()} voters)`).join('\n')}

**Quick Links:**
• Find booth: https://electoralsearch.eci.gov.in
• Helpline: ${state.voterHelpline}`;
        intent = 'polling_location';
      }
    } else if (msg.includes('status') || msg.includes('check') || msg.includes('am i registered')) {
      response = `**Check Your Voter Registration Status**

**Online:** ${state.onlineServices.statusCheck}

**By SMS:** Send EPIC <VoterID> to 1950

**By Phone:** Call ${state.voterHelpline}

**In Person:** ${state.chiefElectoralOfficer.office}`;
      intent = 'voter_status_check';
      actionItems = [
        { label: '✓ Check Status Online', url: state.onlineServices.statusCheck, type: 'primary' },
        { label: '⬇ Download EPIC', url: state.onlineServices.downloadEPIC, type: 'secondary' },
        { label: '📞 Call Helpline', url: `tel:${state.voterHelpline}`, type: 'secondary' }
      ];
    } else if (msg.includes('id') || msg.includes('document') || msg.includes('epic')) {
      response = `**Required Documents for Voting in ${state.name}**

✅ **Primary ID (Any one):**
• Voter ID (EPIC Card)
• Aadhaar Card
• Passport
• Driving License
• PAN Card
• Service Identity Card

✅ **For First-Time Voters:**
Photo + ID proof required

❌ **What NOT allowed:**
• Photocopies
• Digital IDs (in most cases)
• Expired documents

⚠️ **Lost your Voter ID?**
Download e-EPIC: ${state.onlineServices.downloadEPIC}

Helpline: ${state.voterHelpline}`;
      intent = 'voter_id_requirements';
    } else {
      // Default state-specific response
      response = smartResponses.default(state);
      intent = 'state_info';
    }
  } else {
    // No state selected - show all states
    response = `**🗳️ Indian Election Information System**

**Select your state for personalized election info:**

${Object.entries(electionData.states).map(([id, s]) => `• **${s.name}** - ${s.upcomingElections.length} upcoming election(s)`).join('\n')}

**National Services:**
• Voter Registration: https://voterservice.eci.gov.in
• Status Check: https://electoralsearch.eci.gov.in
• Voter Helpline: 1950 (Toll-free)

**What I can help with:**
• Voter registration process
• Upcoming election dates
• Polling booth locations
• Candidate information
• Required documents
• Voter ID download`;
    intent = 'state_selection';
    actionItems = Object.entries(electionData.states).map(([id, s]) => ({
      label: s.name,
      action: 'select_state',
      stateId: id,
      type: 'secondary'
    }));
  }
  
  res.json({
    message: response,
    intent,
    stateId,
    constituencyId,
    language,
    actionItems,
    timestamp: new Date().toISOString(),
    success: true
  });
});

// Get candidates for specific election
app.get('/api/elections/:electionId/candidates', (req, res) => {
  const { electionId } = req.params;
  const electionCandidates = candidates[electionId] || {};
  
  res.json({
    electionId,
    candidates: electionCandidates,
    totalConstituencies: Object.keys(electionCandidates).length
  });
});

// Download voter guide PDF (mock endpoint)
app.get('/api/voter-guide/download', (req, res) => {
  const { stateId, language = 'en' } = req.query;
  const state = stateId ? electionData.states[stateId] : null;
  
  res.json({
    message: 'Voter guide download link',
    downloadUrl: state 
      ? `https://eci.gov.in/voter-guide-${stateId}-${language}.pdf`
      : 'https://eci.gov.in/voter-guide-general.pdf',
    stateName: state?.name || 'General',
    language,
    size: '2.4 MB',
    pages: 24
  });
});

// TIMELINE ENDPOINT - Generate structured timeline data
app.get('/api/election/timeline', (req, res) => {
  const { stateId, year } = req.query;
  
  // Build comprehensive timeline
  const timeline = {
    phases: [
      {
        phase: 1,
        title: 'Voter Registration Period',
        events: [
          { date: '2026-01-01', title: 'Continuous Voter Registration Opens', description: 'Apply for new voter ID or update existing one', status: 'ongoing', action: 'register', priority: 'high' },
          { date: '2026-03-15', title: 'Final Voter List Publication', description: 'Electoral rolls finalized for upcoming elections', status: 'upcoming', priority: 'high' }
        ]
      },
      {
        phase: 2,
        title: 'Election Notification Phase',
        events: [
          { date: '2026-03-20', title: 'West Bengal Assembly Election Notification', description: 'Official announcement and schedule release', status: 'upcoming', action: 'track', priority: 'high' },
          { date: '2026-04-01', title: 'Nomination Filing Begins', description: 'Candidates can file nominations', status: 'upcoming', priority: 'medium' }
        ]
      },
      {
        phase: 3,
        title: 'Campaign & Preparation',
        events: [
          { date: '2026-04-05', title: 'Campaign Period Starts', description: 'Official campaign period begins', status: 'upcoming', priority: 'medium' },
          { date: '2026-04-10', title: 'Voter Awareness Programs', description: 'ECI conducts awareness drives', status: 'upcoming', priority: 'low' }
        ]
      },
      {
        phase: 4,
        title: 'Election Day',
        events: [
          { date: '2026-04-15', title: 'West Bengal Assembly Elections 2026', description: 'Voting across 294 constituencies', status: 'upcoming', action: 'vote', priority: 'high' },
          { date: '2026-04-15', title: 'Polling Hours: 7 AM - 6 PM', description: 'Bring your Voter ID (EPIC)', status: 'upcoming', priority: 'high' }
        ]
      },
      {
        phase: 5,
        title: 'Results & Aftermath',
        events: [
          { date: '2026-04-18', title: 'Vote Counting', description: 'Results announced for all seats', status: 'upcoming', action: 'results', priority: 'high' },
          { date: '2026-04-20', title: 'Winners Declaration', description: 'Official gazette notification', status: 'upcoming', priority: 'medium' }
        ]
      }
    ],
    upcomingElections: [],
    keyDates: {
      lastRegistration: '2026-03-15',
      notification: '2026-03-20',
      polling: '2026-04-15',
      counting: '2026-04-18'
    }
  };

  // Add upcoming elections based on state
  if (stateId && electionData.states[stateId]) {
    const state = electionData.states[stateId];
    timeline.upcomingElections = state.upcomingElections
      .filter(e => e.status === 'upcoming' || e.status === 'scheduled')
      .map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        type: e.type,
        phases: e.phases,
        totalSeats: e.totalSeats,
        description: e.description,
        notificationDate: e.notificationDate,
        lastDateNomination: e.lastDateNomination,
        scrutinyDate: e.scrutinyDate,
        withdrawalDate: e.withdrawalDate,
        countingDate: e.countingDate
      }));
  } else {
    // Add all upcoming elections
    Object.entries(electionData.states).forEach(([id, state]) => {
      state.upcomingElections
        .filter(e => e.status === 'upcoming' || e.status === 'scheduled')
        .forEach(e => {
          timeline.upcomingElections.push({
            id: e.id,
            title: e.title,
            state: state.name,
            stateId: id,
            date: e.date,
            type: e.type,
            phases: e.phases,
            totalSeats: e.totalSeats
          });
        });
    });
    
    // Sort by date
    timeline.upcomingElections.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Also create a flat timeline array for TimelinePage compatibility
  const flatTimeline = [];
  timeline.phases.forEach(phase => {
    phase.events.forEach(event => {
      flatTimeline.push({
        id: event.title.toLowerCase().replace(/\s+/g, '_'),
        title: event.title,
        date: event.date,
        description: event.description,
        importance: event.priority || 'medium',
        type: event.action || 'milestone',
        status: event.status,
        phase: phase.phase,
        phaseTitle: phase.title
      });
    });
  });
  
  // Sort by date
  flatTimeline.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({
    timeline: flatTimeline, // For TimelinePage compatibility
    structured: timeline, // Full structured data
    stateId: stateId || 'all',
    generatedAt: new Date().toISOString()
  });
});

// NEAREST BOOTH ENDPOINT - Find booths near a location
app.get('/api/polling-booths/nearest', (req, res) => {
  const { stateId, constituencyId, lat, lng, pincode } = req.query;
  
  if (!stateId || !constituencyId) {
    return res.status(400).json({ error: 'stateId and constituencyId required' });
  }

  const booths = pollingBooths[stateId]?.[constituencyId] || [];
  
  // If no booths found, return mock data for demo
  const nearestBooths = booths.length > 0 ? booths : [
    { id: 'WB001', name: 'Sample High School', address: 'Demo Address, Kolkata', pincode: '700001', distance: '0.5 km', lat: 22.5726, lng: 88.3639 },
    { id: 'WB002', name: 'Demo College', address: 'Demo Address 2, Kolkata', pincode: '700002', distance: '1.2 km', lat: 22.5730, lng: 88.3645 }
  ];
  
  res.json({
    booths: nearestBooths,
    total: nearestBooths.length,
    stateId,
    constituencyId,
    searchParams: { lat, lng, pincode }
  });
});

// UPCOMING EVENTS endpoint
app.get('/api/election/upcoming', (req, res) => {
  const events = [];
  
  Object.entries(electionData.states).forEach(([stateId, state]) => {
    state.upcomingElections
      .filter(e => e.status === 'upcoming' || e.status === 'scheduled')
      .forEach(election => {
        events.push({
          id: election.id,
          title: election.title,
          date: election.date,
          state: state.name,
          stateId,
          type: election.type,
          description: election.description,
          daysRemaining: Math.ceil((new Date(election.date) - new Date()) / (1000 * 60 * 60 * 24)),
          isImportant: election.isImportant || false
        });
      });
  });
  
  // Sort by date
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json({
    events,
    total: events.length,
    generatedAt: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════╗`);
  console.log(`║  🗳️ ELECTION PRO SERVER v2.0           ║`);
  console.log(`╠════════════════════════════════════════╣`);
  console.log(`║  🌐 http://localhost:${PORT}              ║`);
  console.log(`║                                         ║`);
  console.log(`║  📍 States Available:                   ║`);
  Object.values(electionData.states).forEach(s => {
    console.log(`║     • ${s.name.padEnd(35)} ║`);
  });
  console.log(`║                                         ║`);
  console.log(`║  🔗 Endpoints:                          ║`);
  console.log(`║     /api/states                         ║`);
  console.log(`║     /api/states/:id                     ║`);
  console.log(`║     /api/states/:id/constituencies      ║`);
  console.log(`║     /api/election/timeline              ║`);
  console.log(`║     /api/election/upcoming              ║`);
  console.log(`║     /api/polling-booths/nearest         ║`);
  console.log(`║     /api/chat                           ║`);
  console.log(`╚════════════════════════════════════════╝`);
});
