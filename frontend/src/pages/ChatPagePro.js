import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, MapPin, Calendar, Phone, 
  Loader2, RefreshCw, ThumbsUp, ThumbsDown,
  ExternalLink, CheckCircle,
  ChevronDown, Building2, Users, FileText, 
  Navigation, Globe, MessageSquare,
  ArrowRight, X, LayoutDashboard,
  Clock, TrendingUp, Award, Flag,
  ChevronUp, ChevronRight, BookOpen, Vote
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

const INDIAN_STATES = [
  { 
    id: 'andhra-pradesh', 
    name: 'Andhra Pradesh', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'ap-asm-2024', title: 'Assembly Election 2024', status: 'completed', date: '2024-05-13', result: 'TDP-JSP-BJP Alliance won majority', voterTurnout: '80.66%', description: 'Simultaneous elections for 175 Assembly and 25 Lok Sabha seats.' }
    ],
    constituencies: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore']
  },
  { 
    id: 'delhi', 
    name: 'Delhi', 
    voterHelpline: '1950', 
    status: 'COMPLETED',
    chiefElectoralOfficer: { name: 'P. Krishnamurthy, IAS', phone: '011-2394 6100', website: 'https://ceodelhi.gov.in/' },
    onlineServices: { registration: 'https://voters.eci.gov.in/', status: 'https://voters.eci.gov.in/track' },
    upcomingElections: [],
    pastElections: [
      { id: 'dl-asm-2025', title: 'Assembly Election 2025', status: 'completed', date: '2025-02-05', result: 'BJP won majority (48 seats)', voterTurnout: '67.45%', description: 'BJP returned to power after 27 years in the capital.', trends: { shift: 'Massive consolidation of middle-class and suburban votes for BJP.' } },
      { id: 'dl-asm-2020', title: 'Assembly Election 2020', status: 'completed', date: '2020-02-08', result: 'AAP won majority (62 seats)', voterTurnout: '62.59%', description: 'Arvind Kejriwal secured a dominant second term.', trends: { shift: 'Development-centric voting with focus on free utilities.' } }
    ],
    constituencies: [
      { name: 'New Delhi', candidates: [
          { name: 'Rekha Gupta', party: 'BJP', symbol: '🪷', bio: 'CM of Delhi & Senior Leader' },
          { name: 'Arvind Kejriwal', party: 'AAP', symbol: '🧹', bio: 'Former CM & Social Reformer' },
          { name: 'Alka Lamba', party: 'INC', symbol: '✋', bio: 'Spokesperson & Community Activist' }
        ],
        pastResults: [
          { year: 2025, winner: 'Rekha Gupta (BJP)', party: 'BJP', votes: 82400, turnout: '69.2%', margin: 12100, parties: [{ name: 'BJP', pct: 49, color: '#f97316' }, { name: 'AAP', pct: 41, color: '#2dd4bf' }, { name: 'INC', pct: 7, color: '#3b82f6' }, { name: 'Others', pct: 3, color: '#6b7280' }], insight: 'BJP flipped this VVIP seat as anti-incumbency peaked in urban pockets.' },
          { year: 2020, winner: 'Arvind Kejriwal (AAP)', party: 'AAP', votes: 71200, turnout: '62.4%', margin: 21600, parties: [{ name: 'AAP', pct: 61, color: '#2dd4bf' }, { name: 'BJP', pct: 32, color: '#f97316' }, { name: 'INC', pct: 4, color: '#3b82f6' }, { name: 'Others', pct: 3, color: '#6b7280' }], insight: 'Kejriwal won with a landslide, maintaining a 60%+ vote share in his home constituency.' }
        ]
      },
      { name: 'Chandni Chowk', candidates: [
          { name: 'Praveen Khandelwal', party: 'BJP', symbol: '🪷', bio: 'Trade Leader & Visionary' },
          { name: 'Parlad Singh Sawhney', party: 'AAP', symbol: '🧹', bio: 'Experienced MLA & Minority Advocate' },
          { name: 'J.P. Agarwal', party: 'INC', symbol: '✋', bio: 'Veteran Leader & 3-time MP' }
        ],
        pastResults: [
          { year: 2025, winner: 'Praveen Khandelwal', party: 'BJP', votes: 64200, turnout: '65.1%', margin: 8400, parties: [{ name: 'BJP', pct: 47, color: '#f97316' }, { name: 'AAP', pct: 42, color: '#2dd4bf' }, { name: 'INC', pct: 9, color: '#3b82f6' }, { name: 'Others', pct: 2, color: '#6b7280' }], insight: 'Business community support consolidated behind BJP in this historic trading hub.' },
          { year: 2020, winner: 'Parlad Singh Sawhney', party: 'AAP', votes: 50800, turnout: '61.3%', margin: 14900, parties: [{ name: 'AAP', pct: 66, color: '#2dd4bf' }, { name: 'BJP', pct: 28, color: '#f97316' }, { name: 'INC', pct: 4, color: '#3b82f6' }, { name: 'Others', pct: 2, color: '#6b7280' }], insight: 'AAP swept the seat as the minority and local trader vote split worked in their favor.' }
        ]
      }
    ]
  },
  { 
    id: 'bihar', 
    name: 'Bihar', 
    voterHelpline: '1950', 
    status: 'COMPLETED',
    chiefElectoralOfficer: { name: 'H.R. Srinivas, IAS', phone: '0612-2217 005', website: 'https://ceobihar.nic.in/' },
    onlineServices: { registration: 'https://voters.eci.gov.in/', status: 'https://voters.eci.gov.in/track' },
    upcomingElections: [],
    pastElections: [
      { id: 'bh-asm-2025', title: 'Assembly Election 2025', status: 'completed', date: '2025-11-14', result: 'NDA won majority (202 seats)', voterTurnout: '63.40%', description: 'NDA secured a decisive victory across North Bihar.', trends: { shift: 'JD(U) and BJP alliance proved unstoppable in rural belts.' } },
      { id: 'bh-asm-2020', title: 'Assembly Election 2020', status: 'completed', date: '2020-11-10', result: 'NDA won (125 seats)', voterTurnout: '57.05%', description: 'A closely fought battle where RJD emerged as the single largest party.', trends: { shift: 'Tejashwi Yadav\'s focus on jobs created a massive youth surge.' } }
    ],
    constituencies: [
      { name: 'Patna Sahib', candidates: [
          { name: 'Ravi Shankar Prasad', party: 'BJP', symbol: '🪷', bio: 'Former Union Law Minister' },
          { name: 'Anshul Avijit Kushwaha', party: 'INC', symbol: '✋', bio: 'Educated Youth Leader' },
          { name: 'Shatrughan Sinha', party: 'AITC', symbol: '🌱', bio: 'Legendary Actor & Leader' }
        ],
        pastResults: [
          { year: 2025, winner: 'Ravi Shankar Prasad', party: 'BJP', votes: 98100, turnout: '59.2%', margin: 34000, parties: [{ name: 'BJP', pct: 54, color: '#f97316' }, { name: 'INC', pct: 28, color: '#3b82f6' }, { name: 'RJD', pct: 14, color: '#16a34a' }, { name: 'Others', pct: 4, color: '#6b7280' }], insight: 'A BJP bastion. The Kayastha vote and urban middle class remained loyal to the NDA.' },
          { year: 2020, winner: 'Ravi Shankar Prasad', party: 'BJP', votes: 89400, turnout: '56.1%', margin: 28200, parties: [{ name: 'BJP', pct: 52, color: '#f97316' }, { name: 'INC', pct: 31, color: '#3b82f6' }, { name: 'Others', pct: 17, color: '#6b7280' }], insight: 'The MGB (Grand Alliance) failed to breach the urban core of Patna despite a strong rural wave.' }
        ]
      },
      { name: 'Gaya Town', candidates: [
          { name: 'Prem Kumar', party: 'BJP', symbol: '🪷', bio: '8-time MLA & Former Minister' },
          { name: 'Kumar Sarvjeet', party: 'RJD', symbol: '🏮', bio: 'Youth Icon & Dalit Voice' },
          { name: 'Jitan Ram Manjhi', party: 'HAM', symbol: '🍳', bio: 'Former CM & Social Justice Advocate' }
        ],
        pastResults: [
          { year: 2025, winner: 'Prem Kumar', party: 'BJP', votes: 72300, turnout: '61.4%', margin: 15400, parties: [{ name: 'BJP', pct: 46, color: '#f97316' }, { name: 'RJD', pct: 34, color: '#16a34a' }, { name: 'HAM', pct: 15, color: '#facc15' }, { name: 'Others', pct: 5, color: '#6b7280' }], insight: 'Prem Kumar\'s personal popularity combined with NDA unity secured a record 9th term.' },
          { year: 2020, winner: 'Prem Kumar', party: 'BJP', votes: 66800, turnout: '58.7%', margin: 11900, parties: [{ name: 'BJP', pct: 43, color: '#f97316' }, { name: 'RJD', pct: 39, color: '#16a34a' }, { name: 'Others', pct: 18, color: '#6b7280' }], insight: 'A tight contest where RJD made significant inroads into the urban OBC vote bank.' }
        ]
      }
    ]
  },
  { 
    id: 'gujarat', 
    name: 'Gujarat', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'gj-asm-2022', title: 'Assembly Election 2022', status: 'completed', date: '2022-12-05', result: 'BJP won landslide majority', voterTurnout: '64.33%', description: '182-member Assembly elections.' }
    ],
    constituencies: ['Ahmedabad West', 'Gandhinagar', 'Surat', 'Rajkot', 'Vadodara', 'Bhavnagar']
  },
  { 
    id: 'haryana', 
    name: 'Haryana', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'hr-asm-2024', title: 'Assembly Election 2024', status: 'completed', date: '2024-10-05', result: 'BJP won majority', voterTurnout: '67.90%', description: '90-member Assembly elections.' }
    ],
    constituencies: ['Gurgaon', 'Faridabad', 'Rohtak', 'Ambala', 'Hisar', 'Karnal']
  },
  { 
    id: 'maharashtra', 
    name: 'Maharashtra', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'mh-asm-2024', title: 'Assembly Election 2024', status: 'completed', date: '2024-11-20', result: 'Mahayuti Alliance won majority', voterTurnout: '66.05%', description: '288-member Assembly elections.' }
    ],
    constituencies: ['Mumbai South', 'Mumbai North', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad']
  },
  { 
    id: 'tamil-nadu', 
    name: 'Tamil Nadu', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'tn-asm-2026', title: 'Assembly Election 2026', status: 'upcoming', date: '2026-04-15', phases: 1, totalSeats: 234, description: 'Upcoming elections for 234 Assembly seats.' }
    ],
    constituencies: ['Chennai Central', 'Chennai South', 'Madurai', 'Coimbatore', 'Salem', 'Trichy']
  },
  { 
    id: 'uttar-pradesh', 
    name: 'Uttar Pradesh', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'up-asm-2027', title: 'Assembly Election 2027', status: 'upcoming', date: '2027-02-10', phases: 7, totalSeats: 403, description: 'Next major state election for 403 seats.' }
    ],
    constituencies: ['Lucknow', 'Varanasi', 'Kanpur', 'Allahabad', 'Agra', 'Meerut', 'Gorakhpur']
  },
  { 
    id: 'karnataka', 
    name: 'Karnataka', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'ka-asm-2023', title: 'Assembly Election 2023', status: 'completed', date: '2023-05-10', result: 'INC won majority', voterTurnout: '73.19%', description: '224-member Assembly elections.' }
    ],
    constituencies: ['Bangalore Central', 'Bangalore North', 'Bangalore South', 'Mysore', 'Hubli-Dharwad', 'Mangalore']
  },
  { 
    id: 'kerala', 
    name: 'Kerala', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'kl-asm-2026', title: 'Assembly Election 2026', status: 'upcoming', date: '2026-04-20', phases: 1, totalSeats: 140, description: 'Upcoming elections for 140 Assembly seats.' }
    ],
    constituencies: ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Palakkad', 'Kollam']
  },
  { 
    id: 'madhya-pradesh', 
    name: 'Madhya Pradesh', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'mp-asm-2023', title: 'Assembly Election 2023', status: 'completed', date: '2023-11-17', result: 'BJP won majority', voterTurnout: '77.15%', description: '230-member Assembly elections.' }
    ],
    constituencies: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar']
  },
  { 
    id: 'odisha', 
    name: 'Odisha', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'od-asm-2024', title: 'Assembly Election 2024', status: 'completed', date: '2024-05-13', result: 'BJP won majority', voterTurnout: '74.44%', description: '147-member Assembly elections.' }
    ],
    constituencies: ['Bhubaneswar', 'Cuttack', 'Puri', 'Sambalpur', 'Berhampur', 'Rourkela']
  },
  { 
    id: 'punjab', 
    name: 'Punjab', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'pb-asm-2027', title: 'Assembly Election 2027', status: 'upcoming', date: '2027-02-20', phases: 1, totalSeats: 117, description: 'Next assembly election for 117 seats.' }
    ],
    constituencies: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali']
  },
  { 
    id: 'rajasthan', 
    name: 'Rajasthan', 
    voterHelpline: '1950', 
    upcomingElections: [
      { id: 'rj-asm-2023', title: 'Assembly Election 2023', status: 'completed', date: '2023-11-25', result: 'BJP won majority', voterTurnout: '74.62%', description: '200-member Assembly elections.' }
    ],
    constituencies: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner']
  },
  { 
    id: 'west-bengal', 
    name: 'West Bengal', 
    voterHelpline: '1950', 
    status: 'LIVE',
    chiefElectoralOfficer: { name: 'Dr. Ariz Aftab, IAS', phone: '033-2254 4964', website: 'https://ceowestbengal.nic.in/' },
    onlineServices: { registration: 'https://voters.eci.gov.in/', status: 'https://voters.eci.gov.in/track' },
    upcomingElections: [
      { id: 'wb-asm-2026', title: 'Assembly Election 2026', status: 'ongoing', date: '2026-04-10', phases: 8, currentPhase: 4, totalSeats: 294, description: 'Ongoing elections for 294 Assembly seats across 8 phases.', 
        liveUpdates: [
          { time: '10:00 AM', msg: 'Polling started in 44 constituencies for Phase 4.' },
          { time: '01:00 PM', msg: 'Average voter turnout recorded at 42.5% across polling stations.' },
          { time: '03:30 PM', msg: 'Peaceful polling reported; heavy security deployment in sensitive zones.' }
        ]
      }
    ],
    pastElections: [
      {
        id: 'wb-asm-2021',
        title: 'Assembly Election 2021',
        status: 'completed',
        date: '2021-05-02',
        result: 'AITC won majority (215 seats)',
        voterTurnout: '81.70%',
        description: 'TMC secured a historic third consecutive term.',
        trends: { shift: 'AITC consolidated rural vote, BJP surged in North Bengal' }
      },
      {
        id: 'wb-ls-2019',
        title: 'Lok Sabha Election 2019',
        status: 'completed',
        date: '2019-05-23',
        result: 'AITC (22), BJP (18)',
        voterTurnout: '81.76%',
        description: 'BJP emerged as the primary opposition, winning 18 seats.',
        trends: { shift: 'Massive shift of Left voters to BJP' }
      },
      {
        id: 'wb-asm-2016',
        title: 'Assembly Election 2016',
        status: 'completed',
        date: '2016-05-19',
        result: 'AITC won majority (211 seats)',
        voterTurnout: '83.02%',
        description: 'TMC retained power with a larger mandate.',
        trends: { shift: 'Left-Congress alliance failed to make an impact' }
      }
    ],
    constituencies: [
      { name: 'Kolkata North', candidates: [
          { name: 'Sudip Bandyopadhyay', party: 'AITC', symbol: '🌱', bio: 'Experienced Parliamentarian' },
          { name: 'Tapas Roy', party: 'BJP', symbol: '🪷', bio: 'Former MLA, Local Leader' },
          { name: 'Pradip Bhattacharya', party: 'INC', symbol: '✋', bio: 'Senior Leader & Scholar' }
        ],
        pastResults: [
          { year: 2021, winner: 'Sudip Bandyopadhyay', party: 'AITC', votes: 68432, turnout: '82.1%', margin: 18320, parties: [{ name: 'AITC', pct: 51, color: '#2dd4bf' }, { name: 'BJP', pct: 37, color: '#f97316' }, { name: 'INC', pct: 8, color: '#3b82f6' }, { name: 'Others', pct: 4, color: '#6b7280' }], insight: 'AITC held the seat with a strong majority despite a strong BJP challenge in urban wards.' },
          { year: 2016, winner: 'Sudip Bandyopadhyay', party: 'AITC', votes: 61890, turnout: '83.4%', margin: 24100, parties: [{ name: 'AITC', pct: 54, color: '#2dd4bf' }, { name: 'CPM', pct: 27, color: '#ef4444' }, { name: 'INC', pct: 12, color: '#3b82f6' }, { name: 'Others', pct: 7, color: '#6b7280' }], insight: 'TMC dominated as the Left-Congress alliance collapsed in this urban seat.' },
          { year: 2011, winner: 'Sudip Bandyopadhyay', party: 'AITC', votes: 58200, turnout: '80.2%', margin: 21000, parties: [{ name: 'AITC', pct: 52, color: '#2dd4bf' }, { name: 'CPM', pct: 34, color: '#ef4444' }, { name: 'INC', pct: 9, color: '#3b82f6' }, { name: 'Others', pct: 5, color: '#6b7280' }], insight: 'AITC swept to power statewide; Kolkata North was an early indicator of the TMC wave.' }
        ]
      },
      { name: 'Kolkata South', candidates: [
          { name: 'Mala Roy', party: 'AITC', symbol: '🌱', bio: 'Sitting MP & Social Worker' },
          { name: 'Debasree Chaudhuri', party: 'BJP', symbol: '🪷', bio: 'Former Union Minister' },
          { name: 'Saira Shah Halim', party: 'CPIM', symbol: '☭', bio: 'Activist & Public Speaker' }
        ],
        pastResults: [
          { year: 2021, winner: 'Mala Roy', party: 'AITC', votes: 72300, turnout: '80.5%', margin: 20100, parties: [{ name: 'AITC', pct: 53, color: '#2dd4bf' }, { name: 'BJP', pct: 38, color: '#f97316' }, { name: 'CPIM', pct: 6, color: '#ef4444' }, { name: 'Others', pct: 3, color: '#6b7280' }], insight: 'AITC won comfortably. BJP made gains but could not break through AITC\'s stronghold in South Kolkata.' },
          { year: 2016, winner: 'Mala Roy', party: 'AITC', votes: 67100, turnout: '82.8%', margin: 28900, parties: [{ name: 'AITC', pct: 57, color: '#2dd4bf' }, { name: 'CPM', pct: 26, color: '#ef4444' }, { name: 'INC', pct: 11, color: '#3b82f6' }, { name: 'Others', pct: 6, color: '#6b7280' }], insight: 'Dominant AITC performance with a 57% vote share. Left Front unable to recover losses from 2011.' },
          { year: 2011, winner: 'Mala Roy', party: 'AITC', votes: 61000, turnout: '79.1%', margin: 19500, parties: [{ name: 'AITC', pct: 50, color: '#2dd4bf' }, { name: 'CPM', pct: 36, color: '#ef4444' }, { name: 'INC', pct: 10, color: '#3b82f6' }, { name: 'Others', pct: 4, color: '#6b7280' }], insight: 'TMC\'s historic 2011 wave ended 34 years of Left rule. South Kolkata was a key battleground.' }
        ]
      },
      { name: 'Jadavpur', candidates: [
          { name: 'Sayani Ghosh', party: 'AITC', symbol: '🌱', bio: 'Youth Leader & Artist' },
          { name: 'Anirban Ganguly', party: 'BJP', symbol: '🪷', bio: 'Academic & Policy Expert' },
          { name: 'Srijan Bhattacharya', party: 'CPIM', symbol: '☭', bio: 'Dynamic Youth Icon' }
        ],
        pastResults: [
          { year: 2021, winner: 'Sayani Ghosh', party: 'AITC', votes: 74100, turnout: '85.2%', margin: 22800, parties: [{ name: 'AITC', pct: 49, color: '#2dd4bf' }, { name: 'BJP', pct: 36, color: '#f97316' }, { name: 'CPIM', pct: 12, color: '#ef4444' }, { name: 'Others', pct: 3, color: '#6b7280' }], insight: 'The Left Front retained a significant 12% vote in this intellectual hub, holding back BJP. AITC won narrowly.' },
          { year: 2016, winner: 'Sougata Roy (AITC)', party: 'AITC', votes: 68900, turnout: '84.1%', margin: 29200, parties: [{ name: 'AITC', pct: 52, color: '#2dd4bf' }, { name: 'CPM', pct: 31, color: '#ef4444' }, { name: 'INC', pct: 13, color: '#3b82f6' }, { name: 'Others', pct: 4, color: '#6b7280' }], insight: 'AITC held the seat with a comfortable margin. CPM remained the main opposition here, unlike most of the state.' },
          { year: 2011, winner: 'Sougata Roy (AITC)', party: 'AITC', votes: 62300, turnout: '82.6%', margin: 14100, parties: [{ name: 'AITC', pct: 47, color: '#2dd4bf' }, { name: 'CPM', pct: 38, color: '#ef4444' }, { name: 'INC', pct: 11, color: '#3b82f6' }, { name: 'Others', pct: 4, color: '#6b7280' }], insight: 'AITC won in a closely fought contest. Jadavpur\'s strong Left tradition made it one of the last holdouts.' }
        ]
      },
      { name: 'Darjeeling', candidates: [
          { name: 'Raju Bista', party: 'BJP', symbol: '🪷', bio: 'Advocate for Gorkha rights' },
          { name: 'Gopal Lama', party: 'AITC', symbol: '🌱', bio: 'Experienced Local Administrator' },
          { name: 'Munish Tamang', party: 'INC', symbol: '✋', bio: 'Intellectual & Community Leader' }
        ],
        pastResults: [
          { year: 2021, winner: 'Neeraj Zimba Tamang', party: 'BJP', votes: 59800, turnout: '79.4%', margin: 16200, parties: [{ name: 'BJP', pct: 52, color: '#f97316' }, { name: 'AITC', pct: 38, color: '#2dd4bf' }, { name: 'GJM', pct: 7, color: '#a855f7' }, { name: 'Others', pct: 3, color: '#6b7280' }], insight: 'BJP won decisively, leveraging Gorkha identity politics. Gorkha Janmukti Morcha (GJM) vote split aided BJP.' },
          { year: 2016, winner: 'Amar Singh Rai (GJM)', party: 'GJM', votes: 52100, turnout: '78.2%', margin: 9400, parties: [{ name: 'GJM', pct: 44, color: '#a855f7' }, { name: 'BJP', pct: 30, color: '#f97316' }, { name: 'AITC', pct: 22, color: '#2dd4bf' }, { name: 'Others', pct: 4, color: '#6b7280' }], insight: 'GJM dominated the hills. BJP was secondary, while AITC had minimal presence in this Gorkha stronghold.' },
          { year: 2011, winner: 'Amar Singh Rai (GJM)', party: 'GJM', votes: 48700, turnout: '76.9%', margin: 12800, parties: [{ name: 'GJM', pct: 48, color: '#a855f7' }, { name: 'CPM', pct: 27, color: '#ef4444' }, { name: 'INC', pct: 15, color: '#3b82f6' }, { name: 'Others', pct: 10, color: '#6b7280' }], insight: 'Gorkha politics dominated. GJM swept as the voice of the hill people, with Left Front as distant runners-up.' }
        ]
      }
    ]
  },
];

const TRANSLATIONS = {
  en: {
    appTitle: 'Election Assistant Pro',
    liveData: 'Live Election Data',
    states: 'States',
    selectState: 'Select State',
    askAbout: 'Ask about',
    thinking: 'Thinking...',
    welcome: 'Welcome! Select your state to get started.',
    elections: 'Elections',
    booths: 'Polling Booths',
    results: 'Past Results',
    dashboard: 'Information Dashboard',
    upcoming: 'Upcoming',
    past: 'Past',
    liveNow: 'LIVE NOW',
    register: 'Register',
    dates: 'Dates',
    booth: 'Booth',
    candidates: 'Candidates',
    helpline: 'Helpline',
    toggleDashboard: 'Toggle Dashboard',
    clearChat: 'Clear Chat',
    searchBooth: 'Search your booth location...',
    winner: 'Winner',
    turnout: 'Turnout',
    margin: 'Margin',
    voteShare: 'Vote Share',
    insight: 'Political Insight',
    history: 'Historical Analysis',
    voterId: 'Voter ID',
    ceo: 'CEO',
    guide: 'Civic Guide',
  },
  bn: {
    appTitle: 'নির্বাচন অ্যাসিস্ট্যান্ট প্রো',
    liveData: 'লাইভ নির্বাচনের তথ্য',
    states: 'রাজ্য',
    selectState: 'রাজ্য নির্বাচন করুন',
    askAbout: 'জিজ্ঞাসা করুন',
    thinking: 'চিন্তা করছি...',
    welcome: 'স্বাগতম! শুরু করতে আপনার রাজ্য নির্বাচন করুন।',
    elections: 'নির্বাচন',
    booths: 'ভোটকেন্দ্র',
    results: 'অতীতের ফলাফল',
    dashboard: 'তথ্য ড্যাশবোর্ড',
    upcoming: 'আসন্ন',
    past: 'অতীত',
    liveNow: 'লাইভ চলছে',
    register: 'নিবন্ধন',
    dates: 'তারিখ',
    booth: 'বুথ',
    candidates: 'প্রার্থী',
    helpline: 'হেল্পলাইন',
    toggleDashboard: 'ড্যাশবোর্ড টগল',
    clearChat: 'চ্যাট মুছুন',
    searchBooth: 'আপনার বুথ অবস্থান খুঁজুন...',
    winner: 'বিজয়ী',
    turnout: 'ভোটের হার',
    margin: 'ব্যবধান',
    voteShare: 'ভোটের অংশ',
    insight: 'রাজনৈতিক অন্তর্দৃষ্টি',
    history: 'ঐতিহাসিক বিশ্লেষণ',
    voterId: 'ভোটার আইডি',
    ceo: 'সিইও',
    guide: 'নাগরিক নির্দেশিকা',
  },
  hi: {
    appTitle: 'चुनाव सहायक प्रो',
    liveData: 'लाइव चुनाव डेटा',
    states: 'राज्य',
    selectState: 'राज्य चुनें',
    askAbout: 'पूछें',
    thinking: 'सोच रहा हूँ...',
    welcome: 'स्वागत है! शुरू करने के लिए अपना राज्य चुनें।',
    elections: 'चुनाव',
    booths: 'मतदान केंद्र',
    results: 'पुराने परिणाम',
    dashboard: 'सूचना डैशबोर्ड',
    upcoming: 'आगामी',
    past: 'पुराने',
    liveNow: 'अभी लाइव',
    register: 'पंजीकरण',
    dates: 'तारीखें',
    booth: 'बूथ',
    candidates: 'उम्मीदवार',
    helpline: 'हेल्पलाइन',
    toggleDashboard: 'डैशबोर्ड टॉगल',
    clearChat: 'चैट साफ़ करें',
    searchBooth: 'अपना बूथ खोजें...',
    winner: 'विजेता',
    turnout: 'मतदान प्रतिशत',
    margin: 'अंतर',
    voteShare: 'वोट शेयर',
    insight: 'राजनीतिक अंतर्दৃষ্টি',
    history: 'ऐतिहासिक विश्लेषण',
    voterId: 'वोटर आईडी',
    ceo: 'सीईओ',
    guide: 'नागरिक मार्गदर्शिका',
  }
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', flag: '🇮🇳', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳', native: 'मराठी' },
  { code: 'kn', label: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
];

const ChatPagePro = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [states, setStates] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showConstituencyModal, setShowConstituencyModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Translation helper
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
  };
  const [activeInfoTab, setActiveInfoTab] = useState('elections'); // elections, booths, results, guide
  const [checklist, setChecklist] = useState([false, false, false, false]);
  const messagesEndRef = useRef(null);

  // Fetch states on mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch constituencies when state changes
  useEffect(() => {
    if (selectedState) {
      fetchConstituencies(selectedState.id);
    }
  }, [selectedState]);

  const fetchStates = async () => {
    setStates(INDIAN_STATES);
  };

  const fetchConstituencies = async (stateId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/states/${stateId}/constituencies`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setConstituencies(data.constituencies || []);
    } catch (error) {
      console.error('Failed to fetch constituencies:', error);
      // Fallback to real constituencies from our data object if available
      const stateData = INDIAN_STATES.find(s => s.id === stateId);
      if (stateData && stateData.constituencies) {
        setConstituencies(stateData.constituencies.map((c, i) => ({
          id: `${stateId}-${i}`,
          name: typeof c === 'string' ? c : c.name,
          candidates: typeof c === 'string' ? null : c.candidates,
          voters: Math.floor(Math.random() * 500000) + 1000000
        })));
      } else {
        setConstituencies([
          { id: `${stateId}-1`, name: 'Constituency 1' },
          { id: `${stateId}-2`, name: 'Constituency 2' },
          { id: `${stateId}-3`, name: 'Constituency 3' },
        ]);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '🗳️ **Welcome!** Select your state to get started.',
        timestamp: new Date(),
        type: 'welcome',
        actionItems: [{ type: 'select_state', label: '📍 Select State' }]
      }]);
    }
  }, []);

  const handleSubmit = async (e, overrideQuery, overrideStateId, overrideConstituencyId, overrideConstituencyName) => {
    if (e) e.preventDefault();
    
    const userMessage = (overrideQuery || input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    
    if (!overrideQuery) {
      setMessages(prev => [...prev, {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }]);
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          stateId: overrideStateId || selectedState?.id,
          stateName: selectedState?.name,
          constituencyId: overrideConstituencyId || selectedConstituency?.id,
          constituencyName: overrideConstituencyName || selectedConstituency?.name,
          language
        })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        intent: data.intent,
        actionItems: data.actionItems
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateSelect = async (state) => {
    setSelectedState(state);
    setShowStateModal(false);
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: `Selected: ${state.name}`,
      timestamp: new Date(),
      isAction: true
    }]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'hello', stateId: state.id, language })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        intent: 'state_info',
        actionItems: [
          { type: 'select_constituency', label: '🏛️ Select Area' },
          { type: 'quick_action', label: '📋 Register', query: 'how do I register' },
          { type: 'quick_action', label: '🗓️ Dates', query: 'election dates' }
        ]
      }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConstituencySelect = (constituency) => {
    setSelectedConstituency(constituency);
    setShowConstituencyModal(false);
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: `Area: ${constituency.name}`,
      timestamp: new Date(),
      isAction: true
    }]);

    handleQuickAction(`Tell me about polling booths in ${constituency.name}`, selectedState?.id, constituency.id, constituency.name);
  };

  const handleQuickAction = (query, stateId, constituencyId, constituencyName) => {
    // If we're passing query from modal, don't show it as user message again since handleConstituencySelect already did
    handleSubmit(null, query, stateId, constituencyId, constituencyName);
  };

  const handleQuickActionQuery = (query) => {
    setInput(query);
    handleSubmit(null, query);
  };

  const handleActionClick = (action) => {
    if (action.type === 'select_state') {
      setShowStateModal(true);
    } else if (action.type === 'select_constituency') {
      setShowConstituencyModal(true);
    } else if (action.query) {
      handleQuickActionQuery(action.query);
    } else if (action.url) {
      // Open external links safely
      window.open(action.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Extract URLs from content
  const extractLinks = (content) => {
    if (!content) return [];
    const urlRegex = /(https?:\/\/[^\s\)\]\n]+)/g;
    const links = [];
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      // Clean trailing punctuation
      let url = match[0].replace(/[.,;!?]+$/, '');
      links.push(url);
    }
    return [...new Set(links)]; // Remove duplicates
  };

  // Format message with clickable links
  const formatMessage = (content) => {
    if (!content) return '';
    
    // Replace markdown bold with HTML
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace markdown links [text](url) with HTML
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-cyan hover:underline font-medium">$1</a>');
    
    // Replace bullet points
    formatted = formatted.replace(/• (.*)/g, '<li class="ml-4">$1</li>');
    
    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedState(null);
    setSelectedConstituency(null);
    setConstituencies([]);
    
    setTimeout(() => {
      setMessages([{
        role: 'assistant',
        content: '🗳️ **Welcome!** Select your state to get started.',
        timestamp: new Date(),
        type: 'welcome',
        actionItems: [{ type: 'select_state', label: '📍 Select State' }]
      }]);
    }, 100);
  };

  // Get election data for selected state
  const getStateElections = () => {
    if (!selectedState) return [];
    return selectedState.upcomingElections || [];
  };

  const getPastElections = () => {
    if (!selectedState) return [];
    return selectedState.pastElections || [];
  };

  // Filter elections by status
  const upcomingElections = getStateElections().filter(e => e.status === 'upcoming' || e.status === 'scheduled' || e.status === 'ongoing');
  const pastElections = getPastElections();

  return (
    <div 
      className="min-h-screen pt-16 pb-4 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      onClick={() => setShowLangMenu(false)}
    >
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-3 relative z-[100]">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between relative z-[100]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{t('appTitle')}</h1>
              <p className="text-xs text-gray-400">{t('liveData')} • {states.length} {t('states')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Location Quick Selector */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowStateModal(true); }}
              className="flex items-center space-x-2 glass px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label={`Select state. Current state: ${selectedState?.name || 'None'}`}
            >
              <MapPin className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm text-white">{selectedState?.name || t('selectState')}</span>
              {selectedConstituency && (
                <>
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span className="text-sm text-gray-300">{selectedConstituency.name}</span>
                </>
              )}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Custom Language Selector */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowLangMenu(prev => !prev)}
                className="flex items-center space-x-2 glass border border-white/10 rounded-xl px-3 py-2 text-sm text-white hover:border-accent-purple/50 transition-all"
                aria-label="Change language"
              >
                <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
                <span>{LANGUAGES.find(l => l.code === language)?.native}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 z-[110] rounded-xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" style={{ background: '#1a1f2e' }}>
                  <div className="py-1">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent-purple/20 transition-colors ${
                          language === lang.code ? 'bg-accent-purple/30 text-accent-purple' : 'text-gray-200'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <div className="text-left">
                          <p className="font-medium">{lang.native}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{lang.label}</p>
                        </div>
                        {language === lang.code && <div className="ml-auto w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setShowRightPanel(!showRightPanel); }}
              className={`p-2 glass rounded-xl transition-colors ${showRightPanel ? 'bg-accent-purple/30 text-accent-purple' : 'text-gray-400'}`}
              title={t('toggleDashboard')}
              aria-label={showRightPanel ? "Hide dashboard" : "Show dashboard"}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <button
              onClick={clearChat}
              className="p-2 glass rounded-xl hover:bg-white/10 text-gray-400 hover:text-white"
              title={t('clearChat')}
              aria-label="Clear chat history"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-8.5rem)] flex gap-4">
        
        {/* LEFT: Chat Interface */}
        <div className={`${showRightPanel ? 'w-[40%]' : 'w-full max-w-3xl mx-auto'} glass rounded-2xl overflow-hidden flex flex-col glow-blue transition-all duration-300`}>
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-accent-purple" />
              <span className="text-sm font-medium text-white">Chat Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-accent-purple to-accent-pink' 
                        : 'bg-gradient-to-br from-accent-blue to-accent-cyan'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className={`space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/20'
                          : message.isError
                          ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                          : 'glass text-gray-100 shadow-md border border-white/5'
                      }`}>
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        
                        {/* Verification Badge */}
                        {message.verification && (
                          <div className="mt-3 flex items-center space-x-1.5 text-[10px] px-2 py-1 bg-black/20 rounded border border-white/5 w-fit">
                            {message.verification.status === 'verified' ? (
                              <><span className="text-green-400 font-bold tracking-wide">✓ FACT-CHECKED</span><span className="text-gray-400">| Confidence: {Math.round((message.verification.confidence || 0.9) * 100)}%</span></>
                            ) : (
                              <><span className="text-yellow-400 font-bold tracking-wide">⚠ UNVERIFIED</span><span className="text-gray-400">| Please verify independently</span></>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {message.actionItems && message.actionItems.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.actionItems.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(action)}
                              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                action.type === 'select_state' || action.type === 'select_constituency'
                                  ? 'bg-accent-purple text-white'
                                  : action.url 
                                  ? 'bg-green-500/80 hover:bg-green-500 text-white'
                                  : 'glass text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {action.url && <ExternalLink className="w-3 h-3" />}
                              <span>{action.label}</span>
                              {!action.url && <ArrowRight className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Extracted Link Buttons */}
                      {(() => {
                        const links = extractLinks(message.content);
                        return links.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {links.map((url, i) => (
                              <button
                                key={i}
                                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all hover:scale-105 shadow-lg shadow-green-500/20 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>🔗 Open Link {links.length > 1 ? i + 1 : ''}</span>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {message.role === 'assistant' && !message.isError && (
                        <span className="text-[10px] text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass px-4 py-2 rounded-xl flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-accent-purple animate-spin" />
                  <span className="text-xs text-gray-400">{t('thinking')}</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {selectedState && (
            <div className="px-4 py-2.5 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                {[
                  { icon: FileText, label: t('register'), query: 'how do I register', color: 'cyan' },
                  { icon: Calendar, label: t('dates'), query: 'election dates', color: 'purple' },
                  { icon: Navigation, label: t('booth'), query: 'where is my polling booth', color: 'green' },
                  { icon: Users, label: t('candidates'), query: t('candidates'), color: 'pink' },
                  { icon: Phone, label: t('helpline'), query: 'voter helpline', color: 'orange' },
                ].map((item, i) => {
                  const colorMap = {
                    cyan:   { bg: 'hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:text-cyan-300', shadow: 'hover:shadow-cyan-500/40', icon: 'group-hover:text-cyan-300' },
                    purple: { bg: 'hover:bg-purple-500/20 hover:border-purple-400/60 hover:text-purple-300', shadow: 'hover:shadow-purple-500/40', icon: 'group-hover:text-purple-300' },
                    green:  { bg: 'hover:bg-green-500/20 hover:border-green-400/60 hover:text-green-300', shadow: 'hover:shadow-green-500/40', icon: 'group-hover:text-green-300' },
                    pink:   { bg: 'hover:bg-pink-500/20 hover:border-pink-400/60 hover:text-pink-300', shadow: 'hover:shadow-pink-500/40', icon: 'group-hover:text-pink-300' },
                    orange: { bg: 'hover:bg-orange-500/20 hover:border-orange-400/60 hover:text-orange-300', shadow: 'hover:shadow-orange-500/40', icon: 'group-hover:text-orange-300' },
                  };
                  const c = colorMap[item.color];
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(item.query)}
                      className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 transition-all duration-200 text-xs text-gray-300 whitespace-nowrap hover:shadow-lg ${c.bg} ${c.shadow}`}
                    >
                      <item.icon className={`w-3 h-3 transition-colors ${c.icon}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={selectedState ? `${t('askAbout')} ${selectedState.name}...` : t('selectState')}
                  className="w-full bg-gray-800/80 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-purple"
                  disabled={isLoading}
                  aria-label="Ask a question about elections"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: Info Dashboard (60%) */}
        {showRightPanel && (
          <div className="w-[60%] glass rounded-2xl overflow-hidden flex flex-col">
            {!selectedState ? (
              /* Informative Empty State */
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Election Overview</h2>
                    <p className="text-gray-400 text-sm">India National Dashboard</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-accent-purple" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Total Voters', value: '96.8 Cr', sub: '+6% from 2019', icon: Users, color: 'text-blue-400' },
                    { label: 'Polling Stations', value: '10.5 Lakh', sub: 'Across 28 States', icon: Navigation, color: 'text-accent-cyan' },
                    { label: 'Upcoming Elections', value: '3 States', sub: 'Next 6 months', icon: Calendar, color: 'text-accent-purple' },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-4 rounded-xl border-l-4 border-accent-purple">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-[10px] text-gray-500 font-medium">LIVE</span>
                      </div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                      <div className="text-[10px] text-green-400 mt-1">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <TrendingUp className="w-5 h-5 text-accent-pink mr-2" />
                    Major Election Trends
                  </h3>
                  <div className="grid gap-3">
                    {[
                      { title: 'Digital Voter Services', desc: 'Voter Helpline app downloads reached 100M+ in 2024.', icon: Phone },
                      { title: 'Youth Participation', desc: '1.8 Crore first-time voters registered for the 2024 elections.', icon: Award },
                      { title: 'Gender Equality', desc: 'Women voter turnout surpassed men in 12 states during recent polls.', icon: Flag },
                    ].map((trend, i) => (
                      <div key={i} className="glass p-4 rounded-xl flex items-start space-x-3">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <trend.icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{trend.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{trend.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-accent-purple animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Select a State to Continue</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-sm">Pick a state from the top menu or the button below to see local constituencies, polling booths, and results.</p>
                  <button 
                    onClick={() => setShowStateModal(true)}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl hover:scale-105 transition-all text-white font-bold shadow-lg shadow-accent-purple/20"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Choose Your State</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Dashboard Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-accent-blue/20 to-accent-cyan/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedState.name}</h2>
                      <p className="text-gray-400 text-sm">{t('dashboard')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        {upcomingElections.length} {t('upcoming')}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                        {pastElections.length} {t('past')}
                      </span>
                      {selectedState.status === 'LIVE' && (
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs flex items-center animate-pulse">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                          {t('liveNow')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex border-b border-white/10">
                  {[
                    { id: 'elections', label: t('elections'), icon: Calendar },
                    { id: 'booths', label: t('booths'), icon: Navigation, disabled: !selectedConstituency },
                    { id: 'results', label: t('results'), icon: Award },
                    { id: 'guide', label: t('guide'), icon: BookOpen },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => !tab.disabled && setActiveInfoTab(tab.id)}
                      disabled={tab.disabled}
                      className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                        activeInfoTab === tab.id
                          ? 'text-white border-b-2 border-accent-cyan bg-white/5'
                          : tab.disabled
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* CIVIC GUIDE TAB (Educational Pillar) */}
                  {activeInfoTab === 'guide' && (
                    <div className="space-y-6">
                      <div className="glass rounded-2xl p-6 border border-accent-pink/20 bg-accent-pink/5">
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 text-accent-pink mr-2" />
                            {t('guide')}
                          </h3>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                              { step: 1, title: 'Register', desc: 'Apply via Form 6 on NVSP portal.', icon: FileText, color: 'text-accent-purple' },
                              { step: 2, title: 'Verify', desc: 'Check name & booth in the Roll.', icon: CheckCircle, color: 'text-accent-cyan' },
                              { step: 3, title: 'Vote', desc: 'Visit booth with valid ID proof.', icon: Vote, color: 'text-accent-pink' },
                              { step: 4, title: 'Results', desc: 'Watch the live counting of votes.', icon: TrendingUp, color: 'text-green-400' },
                            ].map((s, i) => (
                              <div key={i} className="glass p-3 rounded-xl border border-white/5 hover:border-accent-cyan/30 transition-all cursor-help group bg-white/5">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">{s.step}</span>
                                  <s.icon className={`w-4 h-4 ${s.color} group-hover:scale-110 transition-transform`} />
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-accent-cyan transition-colors">{s.title}</h4>
                                <p className="text-[10px] text-gray-300 mt-1 leading-tight font-medium">{s.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* VOTER READINESS CHECKLIST */}
                        <div className="mb-2 p-4 rounded-2xl bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 border border-white/10">
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-wider">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            Your Election Day Readiness
                          </h3>
                          <div className="space-y-3">
                            {[
                              { id: 0, task: 'Check Enrollment', status: 'Verify Name', link: 'https://electoralsearch.eci.gov.in/' },
                              { id: 1, task: 'Identify Booth', status: 'Find Location', link: '#' },
                              { id: 2, task: 'Know Candidates', status: 'Read Affidavits', link: 'https://affidavit.eci.gov.in/' },
                              { id: 3, task: 'Carry ID Proof', status: 'EPIC or Aadhar', link: '#' },
                            ].map((item, i) => (
                              <div 
                                key={i} 
                                onClick={() => {
                                  const newChecklist = [...checklist];
                                  newChecklist[item.id] = !newChecklist[item.id];
                                  setChecklist(newChecklist);
                                }}
                                className={`flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-white/10 transition-all group cursor-pointer ${checklist[item.id] ? 'bg-accent-cyan/10' : 'hover:bg-white/5'}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${checklist[item.id] ? 'bg-accent-cyan border-accent-cyan shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'border-white/20'}`}>
                                    {checklist[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className={`text-xs transition-all ${checklist[item.id] ? 'text-white font-semibold line-through opacity-50' : 'text-gray-300'}`}>{item.task}</span>
                                </div>
                                <a 
                                  href={item.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] font-bold text-accent-cyan hover:underline underline-offset-4"
                                >
                                  {item.status} →
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ELECTIONS TAB */}
                  {activeInfoTab === 'elections' && (
                    <div className="space-y-6">
                      {/* PROMINENT CANDIDATES SECTION */}
                      <div className="glass rounded-2xl p-6 border border-accent-cyan/20 bg-accent-cyan/5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                          <Users className="w-5 h-5 text-accent-cyan mr-2" />
                          {selectedConstituency ? `Candidates for ${selectedConstituency.name}` : 'Constituency Candidates'}
                        </h3>
                        
                        {!selectedConstituency ? (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/10">
                              <Users className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-sm">Select a constituency to view the specific candidate list for your area.</p>
                            <button 
                              onClick={() => setShowConstituencyModal(true)}
                              className="mt-4 px-6 py-2 bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan text-xs font-bold rounded-full hover:bg-accent-cyan/30 transition-all"
                            >
                              📍 Select Area
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(selectedConstituency?.candidates || [
                              { name: 'Smt. Anjali Ghosh', party: 'AITC', symbol: '🌱', bio: 'Local governance expert' },
                              { name: 'Shri Rajat Sharma', party: 'BJP', symbol: '🪷', bio: 'Policy & infrastructure specialist' },
                              { name: 'Shri Debabrata Das', party: 'CPIM', symbol: '☭', bio: 'Social justice advocate' }
                            ]).map((candidate, idx) => (
                              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer group">
                                <div className="flex flex-col items-center text-center">
                                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl mb-3 border-2 border-white/10 group-hover:border-accent-cyan/50 transition-colors">
                                    👤
                                  </div>
                                  <h4 className="text-white font-bold text-sm">{candidate.name}</h4>
                                  <p className="text-[10px] text-gray-400 mt-1">{candidate.party}</p>
                                  <p className="text-[9px] text-gray-500 mt-2 italic px-2">{candidate.bio}</p>
                                  <div className="mt-3 text-2xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                    {candidate.symbol}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Upcoming Elections */}
                      {upcomingElections.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Clock className="w-5 h-5 text-accent-cyan mr-2" />
                            Ongoing / Upcoming Elections
                          </h3>
                          <div className="grid gap-3">
                            {upcomingElections.map((election) => (
                              <div key={election.id} className={`glass rounded-xl p-4 border-l-4 ${election.status === 'ongoing' ? 'border-red-500' : 'border-accent-cyan'}`}>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h4 className="text-white font-medium">{election.title}</h4>
                                      {election.status === 'ongoing' && (
                                        <span className="text-[10px] font-bold text-red-500 px-1.5 py-0.5 bg-red-500/10 rounded border border-red-500/20">LIVE</span>
                                      )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">{election.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {election.status === 'ongoing' ? 'Started ' : ''}{new Date(election.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </span>
                                      <span>{election.phases} Phase(s)</span>
                                      {election.currentPhase && <span className="text-accent-cyan font-medium">Phase {election.currentPhase} Ongoing</span>}
                                      <span>{election.totalSeats?.toLocaleString()} Seats</span>
                                    </div>
                                  </div>
                                  {election.isImportant && (
                                    <span className="px-2 py-1 rounded bg-accent-purple/30 text-accent-purple text-xs">
                                      Important
                                    </span>
                                  )}
                                </div>

                                {election.liveUpdates && (
                                  <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Live Polling Feed</h5>
                                      <span className="text-[10px] text-gray-500">Auto-updates every 5m</span>
                                    </div>
                                    <div className="space-y-3">
                                      {election.liveUpdates.map((update, idx) => (
                                        <div key={idx} className="flex space-x-3">
                                          <span className="text-[10px] font-mono text-accent-cyan mt-0.5">{update.time}</span>
                                          <p className="text-xs text-gray-400">{update.msg}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Past Elections */}
                      {pastElections.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                            Recent Elections
                          </h3>
                          <div className="grid gap-3">
                            {pastElections.slice(0, 2).map((election) => (
                              <div key={election.id} className="glass rounded-xl p-4 border-l-4 border-green-500">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-white font-medium">{election.title}</h4>
                                    <p className="text-gray-400 text-sm mt-1">{election.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                      <span>{new Date(election.date).toLocaleDateString('en-IN')}</span>
                                      <span className="flex items-center text-green-400">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Completed
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {election.result && (
                                  <div className="mt-3 pt-3 border-t border-white/10">
                                    <p className="text-xs text-gray-400 mb-1">Results:</p>
                                    <p className="text-sm text-green-400">{election.result}</p>
                                    {election.voterTurnout && (
                                      <p className="text-xs text-gray-500 mt-1">Turnout: {election.voterTurnout}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* BOOTHS TAB */}
                  {activeInfoTab === 'booths' && selectedConstituency && (
                    <div className="space-y-4">
                      <div className="glass rounded-xl p-4 bg-accent-purple/10">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Navigation className="w-5 h-5 text-accent-cyan mr-2" />
                          Polling Booths in {selectedConstituency.name}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{selectedConstituency.voters?.toLocaleString()} registered voters</p>
                      </div>

                      <div className="w-full h-80 rounded-xl overflow-hidden mt-4 relative border border-white/10 shadow-lg shadow-accent-cyan/10 group">
                        <iframe 
                          title="Interactive Polling Booth Map"
                          width="100%" 
                          height="100%" 
                          frameBorder="0" 
                          scrolling="no" 
                          marginHeight="0" 
                          marginWidth="0" 
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedConstituency.name + ', ' + selectedState.name + ', India')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          className="grayscale-[20%] contrast-[1.2] group-hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/20 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                          Live Map View
                        </div>
                      </div>

                      <div className="grid gap-3 pt-2">
                        {/* Summary Data */}
                        <div className="glass rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-accent-purple/20 rounded-lg">
                              <Users className="w-5 h-5 text-accent-purple" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Total Booths in Region</p>
                              <p className="text-lg font-bold text-white">~{Math.floor((selectedConstituency.voters || 1500000) / 1200)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              <Award className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Avg Voters/Booth</p>
                              <p className="text-lg font-bold text-white">1,200 max</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <a 
                        href="https://electoralsearch.eci.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-[1.02] shadow-lg shadow-green-500/20 rounded-xl text-white font-medium transition-all mt-4"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Find Your Exact Booth on ECI Website</span>
                      </a>
                    </div>
                  )}

                  {/* RESULTS TAB */}
                  {activeInfoTab === 'results' && (() => {
                    const constData = selectedConstituency
                      ? selectedState.constituencies?.find(c => c.name === selectedConstituency.name)
                      : null;
                    const constResults = constData?.pastResults || [];

                    return (
                      <div className="space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <Award className="w-5 h-5 text-yellow-400" />
                              Historical Election Analysis
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {constData ? `${constData.name} constituency — 2011 to 2021` : 'Select a constituency to see detailed results'}
                            </p>
                          </div>
                          {constData && (
                            <span className="text-[10px] bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-full font-medium border border-accent-purple/30">
                              3 Elections
                            </span>
                          )}
                        </div>

                        {!constData ? (
                          /* Placeholder when no constituency selected */
                          <div className="text-center py-10">
                            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Select a constituency to view its detailed election history, vote share trends, and political insights.</p>
                          </div>
                        ) : (
                          constResults.map((r, idx) => (
                            <div key={idx} className="glass rounded-2xl p-5 border border-white/5 hover:border-accent-purple/30 transition-all">
                              {/* Year + Winner Banner */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center font-bold text-white text-sm border border-accent-purple/30">
                                    {r.year}
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold text-sm">{r.winner}</p>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                                      style={{ background: r.parties[0].color + '20', color: r.parties[0].color }}>
                                      {r.party}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-bold">{r.votes.toLocaleString('en-IN')}</p>
                                  <p className="text-gray-500 text-xs">votes won</p>
                                </div>
                              </div>

                              {/* Vote Share Bars */}
                              <div className="space-y-2 mb-4">
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Vote Share</p>
                                {r.parties.map((p, pi) => (
                                  <div key={pi}>
                                    <div className="flex justify-between items-center mb-0.5">
                                      <span className="text-xs text-gray-400">{p.name}</span>
                                      <span className="text-xs font-bold" style={{ color: p.color }}>{p.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                                      <div
                                        className="h-1.5 rounded-full transition-all duration-700"
                                        style={{ width: `${p.pct}%`, background: p.color }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Stats Row */}
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="bg-black/20 rounded-lg p-2 text-center">
                                  <p className="text-[10px] text-gray-500">Turnout</p>
                                  <p className="text-sm font-bold text-accent-cyan">{r.turnout}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2 text-center">
                                  <p className="text-[10px] text-gray-500">Margin</p>
                                  <p className="text-sm font-bold text-green-400">{r.margin.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2 text-center">
                                  <p className="text-[10px] text-gray-500">Winner %</p>
                                  <p className="text-sm font-bold text-accent-purple">{r.parties[0].pct}%</p>
                                </div>
                              </div>

                              {/* Insight Card */}
                              <div className="bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 rounded-xl p-3 border border-accent-purple/20">
                                <p className="text-[11px] text-accent-purple font-semibold mb-1">📊 Political Insight</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{r.insight}</p>
                              </div>
                            </div>
                          ))
                        )}

                        {/* State-level summary at bottom */}
                        {pastElections.length > 0 && (
                          <div className="glass rounded-xl p-4 border border-white/5">
                            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">West Bengal State Overview</p>
                            <div className="space-y-2">
                              {pastElections.map(e => (
                                <div key={e.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                                  <div>
                                    <p className="text-xs text-white font-medium">{e.title}</p>
                                    <p className="text-[10px] text-gray-500">{e.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[11px] text-green-400 font-bold">{e.voterTurnout}</span>
                                    <p className="text-[10px] text-gray-500">turnout</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Dashboard Footer */}
                <div className="px-6 py-3 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        Helpline: {selectedState.voterHelpline}
                      </span>
                      <span className="flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        CEO: <a href={selectedState.chiefElectoralOfficer?.website} target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-accent-cyan underline decoration-accent-cyan/30 underline-offset-2 transition-colors">
                          {selectedState.chiefElectoralOfficer?.name || 'Portal'}
                        </a>
                      </span>
                    </div>
                    <a 
                      href={selectedState.onlineServices?.registration}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan hover:underline"
                    >
                      Register Online →
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* State Selection Modal */}
      <AnimatePresence>
        {showStateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-2xl w-full rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Select Your State</h2>
                    <p className="text-gray-400">Choose to view election information</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {states.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => handleStateSelect(state)}
                    className="flex items-center space-x-4 p-4 glass rounded-xl hover:bg-white/10 transition-all group text-left"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🇮🇳</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{state.name}</h3>
                      <p className="text-gray-400 text-sm">{state.upcomingElections?.length || 0} election(s)</p>
                      <p className="text-accent-cyan text-xs mt-1">Helpline: {state.voterHelpline}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Constituency Selection Modal */}
      <AnimatePresence>
        {showConstituencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-2xl w-full rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Select Constituency</h2>
                    <p className="text-gray-400">{selectedState?.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowConstituencyModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {constituencies.map((constituency) => (
                  <button
                    key={constituency.id}
                    onClick={() => handleConstituencySelect(constituency)}
                    className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all group text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-purple/50 to-accent-pink/50 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{constituency.name}</h3>
                        <p className="text-gray-400 text-sm capitalize">{constituency.type} Constituency</p>
                        <p className="text-accent-cyan text-xs mt-1">{constituency.voters?.toLocaleString()} voters</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPagePro;
