const { MongoClient } = require('mongodb');
const { initVectorDB, addDocuments } = require('../db/vectorDB');
const { generateEmbeddings } = require('../services/embeddingService');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const sampleDocuments = [
  {
    content: `Voter Registration Process: To register to vote, you must be a U.S. citizen, at least 18 years old by Election Day, and meet your state's residency requirements. You can register online, by mail, or in person at your local election office. Required documents typically include a driver's license or state ID number and the last four digits of your Social Security number. Some states require full SSN. Registration deadlines vary by state, typically 15-30 days before an election.`,
    metadata: {
      source: 'Election Commission Official Guide',
      category: 'voter_registration',
      date: '2024-01-15'
    }
  },
  {
    content: `Early Voting Options: Most states offer early voting periods ranging from 4 days to 45 days before Election Day. You can vote early in person at designated polling locations or by mail using an absentee ballot. Mail ballots must typically be postmarked by Election Day and received within 3-7 days after. Some states require an excuse for absentee voting, while others offer "no-excuse" absentee voting. Check your state's specific rules for early voting locations and deadlines.`,
    metadata: {
      source: 'Federal Voting Assistance Program',
      category: 'early_voting',
      date: '2024-01-20'
    }
  },
  {
    content: `Voter ID Requirements: Voter ID laws vary by state. Strict photo ID states require government-issued photo ID (driver's license, passport, etc.). Non-strict states accept non-photo IDs like utility bills or bank statements. Some states have no ID requirement for registered voters. First-time voters who registered by mail may need to show ID. If you don't have ID on Election Day, you can usually cast a provisional ballot and provide ID later.`,
    metadata: {
      source: 'National Conference of State Legislatures',
      category: 'voter_id',
      date: '2024-02-01'
    }
  },
  {
    content: `Election Day Procedures: On Election Day, polls are typically open from 7 AM to 7 PM, though hours vary by state and location. Bring your ID if required by your state. You'll receive a ballot with candidates and ballot measures. Follow instructions carefully - some states use paper ballots, others use electronic voting machines. If you make a mistake, ask for a new ballot. After voting, you'll receive an "I Voted" sticker. If your name isn't on the rolls, ask for a provisional ballot.`,
    metadata: {
      source: 'Election Commission Official Guide',
      category: 'election_day',
      date: '2024-02-10'
    }
  },
  {
    content: `Mail-in and Absentee Voting: To vote by mail, request an absentee ballot from your local election office. Complete the ballot following all instructions, including signature requirements. Some states require a witness signature or notarization. Return your ballot by mail (postmarked by Election Day) or drop it at an official drop box. Track your ballot online if your state offers this service. Military and overseas voters have special procedures under the Uniformed and Overseas Citizens Absentee Voting Act (UOCAVA).`,
    metadata: {
      source: 'Election Assistance Commission',
      category: 'mail_voting',
      date: '2024-02-15'
    }
  },
  {
    content: `Understanding Ballot Measures: Ballot measures (propositions, initiatives, referendums) allow citizens to vote directly on laws and constitutional amendments. Read the official voter guide sent to all registered voters. Understand what a "YES" vote means versus a "NO" vote. Research who supports and opposes each measure. Consider the fiscal impact - some measures affect taxes or spending. Your vote on ballot measures directly shapes state and local law.`,
    metadata: {
      source: 'Ballotpedia Education',
      category: 'ballot_measures',
      date: '2024-02-20'
    }
  },
  {
    content: `Voting Rights Protection: Federal law protects your right to vote. The Voting Rights Act prohibits discrimination based on race, color, or language minority status. The Americans with Disabilities Act requires accessible polling places. If you experience intimidation, discrimination, or barriers to voting, contact the Election Protection hotline at 1-866-OUR-VOTE. You have the right to request assistance if you need help voting due to disability or language barriers.`,
    metadata: {
      source: 'Department of Justice - Civil Rights Division',
      category: 'voting_rights',
      date: '2024-03-01'
    }
  },
  {
    content: `Checking Your Voter Registration: Verify your registration status online through your state's election website or Vote.org. Confirm your name, address, and polling location are current. Update your registration if you've moved, changed your name, or want to change your party affiliation. Check your registration at least 30 days before an election to allow time for corrections. Some states offer same-day registration on Election Day.`,
    metadata: {
      source: 'Vote.org Official Resources',
      category: 'registration_status',
      date: '2024-03-05'
    }
  },
  {
    content: `First-Time Voter Guide: Congratulations on registering to vote! Before Election Day, research candidates using nonpartisan sources like Ballotpedia, Voter Guides, or candidate websites. Find your polling location online. Review a sample ballot beforehand. Bring required ID. Poll workers are there to help - don't hesitate to ask questions. Voting is your voice in democracy - make it count!`,
    metadata: {
      source: 'Campus Vote Project',
      category: 'first_time_voters',
      date: '2024-03-10'
    }
  },
  {
    content: `Provisional Ballots: If your eligibility is questioned at the polls, you have the right to cast a provisional ballot. This ensures no eligible voter is turned away. Election officials will verify your registration after Election Day. You'll receive information on how to check if your ballot was counted. Provisional ballots are counted once eligibility is confirmed. Common reasons for provisional ballots include: name not on rolls, ID issues, or voting at wrong precinct.`,
    metadata: {
      source: 'Help America Vote Act Guidelines',
      category: 'provisional_ballots',
      date: '2024-03-15'
    }
  }
];

async function seedMongoDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/election_education';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    await db.collection('elections').deleteMany({});
    await db.collection('documents').deleteMany({});
    
    await db.collection('documents').insertMany(sampleDocuments.map(doc => ({
      ...doc,
      createdAt: new Date()
    })));
    
    console.log('MongoDB seeded with documents');
  } catch (error) {
    console.error('MongoDB seed error:', error);
  } finally {
    await client.close();
  }
}

async function seedVectorDB() {
  try {
    await initVectorDB();
    
    const contents = sampleDocuments.map(d => d.content);
    const embeddings = await generateEmbeddings(contents);
    const ids = contents.map(() => uuidv4());
    const metadatas = sampleDocuments.map(d => d.metadata);
    
    await addDocuments(contents, embeddings, ids, metadatas);
    
    console.log('Vector DB seeded with documents');
  } catch (error) {
    console.error('Vector DB seed error:', error);
  }
}

async function seedAll() {
  console.log('Starting database seeding...');
  await seedMongoDB();
  await seedVectorDB();
  console.log('Seeding complete!');
  process.exit(0);
}

if (require.main === module) {
  seedAll();
}

module.exports = { seedAll, sampleDocuments };
