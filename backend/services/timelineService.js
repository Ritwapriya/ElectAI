const { getDB } = require('../db/mongo');
const { getCachedQuery, cacheQuery } = require('../db/redis');
const logger = require('../utils/logger');

class TimelineService {
  constructor() {
    this.cacheTTL = 3600;
  }

  async getElectionTimeline(electionId, options = {}) {
    try {
      const cacheKey = `timeline:${electionId}`;
      
      if (!options.skipCache) {
        const cached = await getCachedQuery(cacheKey);
        if (cached) return cached;
      }
      
      const db = getDB();
      
      const query = electionId ? { _id: electionId } : {};
      const elections = await db.collection('elections').find(query).toArray();
      
      const timeline = this.buildTimeline(elections);
      
      const result = {
        timeline,
        totalEvents: timeline.length,
        elections: elections.map(e => e.name),
        generatedAt: new Date().toISOString()
      };
      
      await cacheQuery(cacheKey, result, this.cacheTTL);
      
      return result;
    } catch (error) {
      logger.error('[TimelineService] Failed to get timeline', { error: error.message });
      throw error;
    }
  }

  async getUpcomingEvents(days = 30, filters = {}) {
    try {
      const db = getDB();
      const now = new Date();
      const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      
      const query = {
        'events.date': {
          $gte: now.toISOString().split('T')[0],
          $lte: future.toISOString().split('T')[0]
        }
      };
      
      if (filters.electionType) {
        query.type = filters.electionType;
      }
      
      if (filters.country) {
        query.country = filters.country;
      }
      
      const elections = await db.collection('elections').find(query).toArray();
      
      const events = [];
      elections.forEach(election => {
        if (election.events) {
          election.events.forEach(event => {
            const eventDate = new Date(event.date);
            if (eventDate >= now && eventDate <= future) {
              events.push({
                ...event,
                electionName: election.name,
                electionId: election._id,
                daysUntil: Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24))
              });
            }
          });
        }
      });
      
      return events.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      logger.error('[TimelineService] Failed to get upcoming events', { error: error.message });
      return [];
    }
  }

  buildTimeline(elections) {
    const events = [];
    
    elections.forEach(election => {
      if (election.events) {
        election.events.forEach(event => {
          events.push({
            date: event.date,
            title: event.title,
            description: event.description,
            type: event.type || 'general',
            electionName: election.name,
            importance: event.importance || 'medium',
            phase: event.phase
          });
        });
      }
      
      if (election.phases) {
        election.phases.forEach(phase => {
          events.push({
            date: phase.startDate,
            title: `${phase.name} Begins`,
            description: phase.description,
            type: 'phase_start',
            electionName: election.name,
            importance: 'high',
            phase: phase.name
          });
          
          if (phase.endDate) {
            events.push({
              date: phase.endDate,
              title: `${phase.name} Ends`,
              description: `Last day for ${phase.name.toLowerCase()}`,
              type: 'phase_end',
              electionName: election.name,
              importance: 'high',
              phase: phase.name
            });
          }
        });
      }
      
      if (election.keyDates) {
        Object.entries(election.keyDates).forEach(([key, date]) => {
          events.push({
            date,
            title: this.formatKeyDateTitle(key),
            description: this.formatKeyDateDescription(key, election.name),
            type: 'key_date',
            electionName: election.name,
            importance: 'critical',
            key
          });
        });
      }
    });
    
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  formatKeyDateTitle(key) {
    const titles = {
      voterRegistrationDeadline: 'Voter Registration Deadline',
      earlyVotingStart: 'Early Voting Begins',
      earlyVotingEnd: 'Early Voting Ends',
      electionDay: 'Election Day',
      resultsAnnouncement: 'Results Announcement',
      ballotMailingStarts: 'Ballot Mailing Starts',
      ballotDeadline: 'Ballot Return Deadline',
      nominationDeadline: 'Candidate Nomination Deadline',
      campaignStart: 'Campaign Period Begins'
    };
    return titles[key] || key.replace(/([A-Z])/g, ' $1').trim();
  }

  formatKeyDateDescription(key, electionName) {
    const descriptions = {
      voterRegistrationDeadline: `Last day to register to vote in the ${electionName}`,
      earlyVotingStart: `Early voting period begins for ${electionName}`,
      earlyVotingEnd: `Last day for early voting in ${electionName}`,
      electionDay: `Official voting day for ${electionName}`,
      resultsAnnouncement: `Election results will be announced`,
      ballotMailingStarts: `Mail ballots begin being sent for ${electionName}`,
      ballotDeadline: `Deadline to return mail ballots for ${electionName}`
    };
    return descriptions[key] || `Important date for ${electionName}`;
  }

  async addElection(electionData) {
    try {
      const db = getDB();
      
      const election = {
        ...electionData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('elections').insertOne(election);
      
      logger.info('[TimelineService] Added new election', { 
        electionId: result.insertedId,
        name: election.name 
      });
      
      return { success: true, electionId: result.insertedId };
    } catch (error) {
      logger.error('[TimelineService] Failed to add election', { error: error.message });
      throw error;
    }
  }
}

module.exports = new TimelineService();
