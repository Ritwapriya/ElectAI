const { getDB } = require('../db/mongo');
const { callLLM } = require('../services/llmService');
const logger = require('../utils/logger');

class RecommendationAgent {
  constructor() {
    this.name = 'RecommendationAgent';
    this.description = 'Suggests next steps and important deadlines';
  }

  async execute(userContext, options = {}) {
    try {
      logger.info(`[${this.name}] Generating recommendations`, { userContext });
      
      const db = getDB();
      const userProfile = await this.getUserProfile(userContext.userId, db);
      
      const upcomingDeadlines = await this.getUpcomingDeadlines(db);
      
      const recommendations = this.generateRecommendations(userProfile, upcomingDeadlines);
      
      const personalizedAdvice = await this.getPersonalizedAdvice(
        userProfile, 
        recommendations, 
        userContext.query
      );
      
      logger.info(`[${this.name}] Generated ${recommendations.length} recommendations`);
      
      return {
        agent: this.name,
        userId: userContext.userId,
        recommendations: [...recommendations, ...personalizedAdvice],
        deadlines: upcomingDeadlines.slice(0, 5),
        success: true
      };
    } catch (error) {
      logger.error(`[${this.name}] Execution failed`, { error: error.message });
      return {
        agent: this.name,
        userId: userContext.userId,
        recommendations: this.getDefaultRecommendations(),
        deadlines: [],
        success: false,
        error: error.message
      };
    }
  }

  async getUserProfile(userId, db) {
    if (!userId) return null;
    
    try {
      return await db.collection('users').findOne({ _id: userId });
    } catch (error) {
      return null;
    }
  }

  async getUpcomingDeadlines(db) {
    try {
      const elections = await db.collection('elections').find({
        'keyDates': { $exists: true }
      }).toArray();
      
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const deadlines = [];
      
      elections.forEach(election => {
        if (election.keyDates) {
          Object.entries(election.keyDates).forEach(([key, dateStr]) => {
            const date = new Date(dateStr);
            if (date > now && date <= thirtyDaysFromNow) {
              deadlines.push({
                date: dateStr,
                title: this.formatDeadlineTitle(key),
                election: election.name,
                daysRemaining: Math.ceil((date - now) / (1000 * 60 * 60 * 24)),
                urgency: date < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) ? 'critical' : 'upcoming'
              });
            }
          });
        }
      });
      
      return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
    } catch (error) {
      return [];
    }
  }

  formatDeadlineTitle(key) {
    const titles = {
      voterRegistrationDeadline: 'Register to Vote',
      earlyVotingStart: 'Start Early Voting',
      earlyVotingEnd: 'Last Day for Early Voting',
      electionDay: 'Vote on Election Day',
      ballotMailingStarts: 'Mail Your Ballot',
      ballotDeadline: 'Ballot Return Deadline'
    };
    return titles[key] || key.replace(/([A-Z])/g, ' $1').trim();
  }

  generateRecommendations(profile, deadlines) {
    const recommendations = [];
    
    if (!profile || !profile.isRegistered) {
      recommendations.push({
        type: 'action',
        priority: 'high',
        title: 'Register to Vote',
        description: 'Make sure you\'re registered to vote in upcoming elections.',
        action: 'Check registration status',
        link: '/register'
      });
    }
    
    deadlines.forEach(deadline => {
      if (deadline.daysRemaining <= 3) {
        recommendations.push({
          type: 'deadline',
          priority: 'critical',
          title: `URGENT: ${deadline.title}`,
          description: `${deadline.election} - Only ${deadline.daysRemaining} days left!`,
          date: deadline.date,
          action: 'Take action now'
        });
      }
    });
    
    recommendations.push({
      type: 'info',
      priority: 'medium',
      title: 'Learn About Candidates',
      description: 'Review candidate profiles and their positions on key issues.',
      action: 'View candidates',
      link: '/candidates'
    });
    
    recommendations.push({
      type: 'info',
      priority: 'medium',
      title: 'Find Your Polling Place',
      description: 'Locate your polling station and check voting hours.',
      action: 'Find polling place',
      link: '/polling-locations'
    });
    
    return recommendations;
  }

  async getPersonalizedAdvice(profile, recommendations, query) {
    if (!query) return [];
    
    try {
      const prompt = `Given this user query: "${query}"
      
And these recommendations: ${JSON.stringify(recommendations)}

Generate 2-3 personalized action items that would help this user. Return as JSON array with fields: type, title, description, priority.`;

      const response = await callLLM(prompt, { temperature: 0.3, maxTokens: 500 });
      
      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Return empty if parsing fails
      }
    } catch (error) {
      logger.warn('Personalized advice generation failed');
    }
    
    return [];
  }

  getDefaultRecommendations() {
    return [
      {
        type: 'action',
        priority: 'high',
        title: 'Check Voter Registration',
        description: 'Verify your registration status before upcoming elections.',
        action: 'Check now'
      },
      {
        type: 'info',
        priority: 'medium',
        title: 'Learn About Voting Options',
        description: 'Explore early voting, mail-in ballots, and election day voting.',
        action: 'Learn more'
      }
    ];
  }
}

module.exports = new RecommendationAgent();
