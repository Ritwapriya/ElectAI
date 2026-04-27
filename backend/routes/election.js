const express = require('express');
const timelineService = require('../services/timelineService');
const { getDB } = require('../db/mongo');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/timeline', async (req, res) => {
  try {
    const { electionId, days = 30 } = req.query;
    
    let result;
    if (electionId) {
      result = await timelineService.getElectionTimeline(electionId);
    } else {
      result = await timelineService.getElectionTimeline(null);
    }
    
    res.json(result);
  } catch (error) {
    logger.error('Timeline endpoint error', { error: error.message });
    res.status(500).json({ error: 'Failed to get timeline' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const { days = 30, country, type } = req.query;
    
    const events = await timelineService.getUpcomingEvents(parseInt(days), {
      country,
      electionType: type
    });
    
    res.json({
      events,
      total: events.length,
      period: `Next ${days} days`
    });
  } catch (error) {
    logger.error('Upcoming events error', { error: error.message });
    res.status(500).json({ error: 'Failed to get upcoming events' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const db = getDB();
    
    const elections = await db.collection('elections')
      .find({})
      .project({
        name: 1,
        type: 1,
        country: 1,
        date: 1,
        status: 1
      })
      .toArray();
    
    res.json({
      elections,
      total: elections.length
    });
  } catch (error) {
    logger.error('Election list error', { error: error.message });
    res.status(500).json({ error: 'Failed to get elections' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    
    const election = await db.collection('elections').findOne({ _id: id });
    
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    logger.error('Election detail error', { error: error.message });
    res.status(500).json({ error: 'Failed to get election details' });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const sampleElections = [
      {
        _id: 'wb-assembly-2026',
        name: 'West Bengal Assembly Election 2026',
        type: 'assembly',
        country: 'India',
        state: 'West Bengal',
        date: '2026-04-23',
        status: 'upcoming',
        description: 'The 2026 West Bengal Legislative Assembly election to elect all 294 members of the Vidhan Sabha.',
        keyDates: {
          voterRegistrationDeadline: '2026-01-01',
          nominationDeadline: '2026-03-25',
          electionDay: '2026-04-23',
          resultsAnnouncement: '2026-05-04'
        },
        events: [
          {
            date: '2025-01-01',
            title: 'Special Intensive Revision (SIR) Starts',
            description: 'ECI begins door-to-door verification and intensive revision of electoral rolls across West Bengal.',
            type: 'milestone',
            importance: 'high'
          },
          {
            date: '2025-08-15',
            title: 'Independence Day Voter Drive',
            description: 'State-wide awareness campaign for new voter registrations (First-time voters 18+).',
            type: 'campaign',
            importance: 'medium'
          },
          {
            date: '2025-11-01',
            title: 'Draft Electoral Roll Publication',
            description: 'Publication of draft rolls for public inspection and filing of claims/objections.',
            type: 'milestone',
            importance: 'high'
          },
          {
            date: '2026-01-01',
            title: 'Final Registration Deadline',
            description: 'Last date to submit Form 6 for inclusion in the final electoral roll for the 2026 elections.',
            type: 'deadline',
            importance: 'critical'
          },
          {
            date: '2026-02-28',
            title: 'Final Electoral Roll Publication',
            description: 'Official publication of the verified final voter list by the CEO West Bengal.',
            type: 'milestone',
            importance: 'critical'
          },
          {
            date: '2026-03-15',
            title: 'Model Code of Conduct (MCC)',
            description: 'MCC comes into force immediately upon the announcement of election dates by ECI.',
            type: 'milestone',
            importance: 'critical'
          },
          {
            date: '2026-04-23',
            title: 'Phase 1 Polling',
            description: 'Polling for the first phase of Assembly elections across South Bengal districts.',
            type: 'election',
            importance: 'critical'
          },
          {
            date: '2026-04-29',
            title: 'Phase 2 Polling',
            description: 'Polling for the second phase covering North Bengal and Hill regions.',
            type: 'election',
            importance: 'critical'
          },
          {
            date: '2026-05-04',
            title: 'Counting Day & Results',
            description: 'Simultaneous counting of votes across all 294 constituencies and declaration of results.',
            type: 'milestone',
            importance: 'critical'
          }
        ],
        phases: [
          {
            name: 'Revision Phase',
            startDate: '2025-01-01',
            endDate: '2026-02-28',
            description: 'Preparation and verification of electoral rolls.'
          },
          {
            name: 'Nomination Phase',
            startDate: '2026-03-15',
            endDate: '2026-03-30',
            description: 'Filing and scrutiny of candidate nominations.'
          },
          {
            name: 'Election Phase',
            startDate: '2026-04-23',
            endDate: '2026-05-04',
            description: 'Polling and result declaration.'
          }
        ]
      }
    ];
    
    const db = getDB();
    
    await db.collection('elections').deleteMany({});
    await db.collection('elections').insertMany(sampleElections);
    
    res.json({ 
      message: 'Database seeded with West Bengal 2026 Election data',
      count: sampleElections.length 
    });
  } catch (error) {
    logger.error('Seed error', { error: error.message });
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

module.exports = router;
