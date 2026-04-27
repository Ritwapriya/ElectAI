const { getDB } = require('../db/mongo');
const { callLLM } = require('../services/llmService');
const logger = require('../utils/logger');

class TimelineAgent {
  constructor() {
    this.name = 'TimelineAgent';
    this.description = 'Generates structured election timelines';
  }

  async execute(query, options = {}) {
    try {
      logger.info(`[${this.name}] Generating timeline`, { query });
      
      const db = getDB();
      const electionData = await db.collection('elections').find({}).toArray();
      
      if (electionData.length === 0) {
        return {
          agent: this.name,
          timeline: [],
          success: true
        };
      }
      
      const timeline = this.buildTimeline(electionData, query);
      
      const enrichedTimeline = await this.enrichWithLLM(timeline, query);
      
      logger.info(`[${this.name}] Timeline generated with ${enrichedTimeline.length} events`);
      
      return {
        agent: this.name,
        query,
        timeline: enrichedTimeline,
        totalEvents: enrichedTimeline.length,
        success: true
      };
    } catch (error) {
      logger.error(`[${this.name}] Execution failed`, { error: error.message });
      return {
        agent: this.name,
        query,
        timeline: [],
        success: false,
        error: error.message
      };
    }
  }

  buildTimeline(electionData, query) {
    const events = [];
    
    electionData.forEach(election => {
      if (election.events && Array.isArray(election.events)) {
        election.events.forEach(event => {
          events.push({
            date: event.date,
            title: event.title,
            description: event.description,
            type: event.type || 'general',
            electionName: election.name,
            importance: event.importance || 'medium'
          });
        });
      }
      
      if (election.keyDates) {
        Object.entries(election.keyDates).forEach(([key, date]) => {
          events.push({
            date: date,
            title: this.formatKeyDateTitle(key),
            description: `Important date for ${election.name}`,
            type: 'milestone',
            electionName: election.name,
            importance: 'high'
          });
        });
      }
    });
    
    return events
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter(event => this.matchesQuery(event, query));
  }

  matchesQuery(event, query) {
    if (!query || query.trim() === '') return true;
    
    const queryLower = query.toLowerCase().trim();
    // Don't filter if it's a generic query
    if (['election dates', 'dates', 'when', 'timeline', 'schedule', 'upcoming elections'].some(term => queryLower.includes(term))) {
      return true;
    }
    
    const searchableText = `${event.title} ${event.description} ${event.electionName}`.toLowerCase();
    
    return searchableText.includes(queryLower);
  }

  formatKeyDateTitle(key) {
    const titles = {
      voterRegistrationDeadline: 'Voter Registration Deadline',
      earlyVotingStart: 'Early Voting Begins',
      earlyVotingEnd: 'Early Voting Ends',
      electionDay: 'Election Day',
      resultsAnnouncement: 'Results Announcement',
      ballotMailingStarts: 'Ballot Mailing Starts',
      ballotDeadline: 'Ballot Return Deadline'
    };
    return titles[key] || key.replace(/([A-Z])/g, ' $1').trim();
  }

  async enrichWithLLM(timeline, query) {
    if (timeline.length === 0) return timeline;
    
    try {
      const prompt = `Given this election timeline data and user query "${query}", 
enhance each event with a brief, user-friendly description.

Timeline events:
${JSON.stringify(timeline.slice(0, 10), null, 2)}

Return ONLY a JSON array with the same structure but enhanced descriptions. Each event should have:
- date
- title  
- description (enhanced, user-friendly)
- type
- electionName
- importance`;

      const response = await callLLM(prompt, { temperature: 0.2 });
      
      try {
        const enriched = JSON.parse(response);
        if (Array.isArray(enriched) && enriched.length > 0) {
          return enriched;
        }
      } catch (e) {
        // If parsing fails, return original with minor enhancements
      }
    } catch (error) {
      logger.warn('LLM enrichment failed, using original timeline');
    }
    
    return timeline.map(event => ({
      ...event,
      description: event.description || `Important event for ${event.electionName}`
    }));
  }
}

module.exports = new TimelineAgent();
