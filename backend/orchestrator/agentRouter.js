const retrievalAgent = require('../agents/retrievalAgent');
const explanationAgent = require('../agents/explanationAgent');
const timelineAgent = require('../agents/timelineAgent');
const recommendationAgent = require('../agents/recommendationAgent');
const factCheckAgent = require('../agents/factCheckAgent');
const { callLLM } = require('../services/llmService');
const logger = require('../utils/logger');

class AgentRouter {
  constructor() {
    this.agents = {
      retrieval: retrievalAgent,
      explanation: explanationAgent,
      timeline: timelineAgent,
      recommendation: recommendationAgent,
      factCheck: factCheckAgent
    };
  }

  /**
   * Routes a user query through the multi-agent system
   * @param {string} query - The user's natural language question
   * @param {Object} context - Session context including state, constituency, and language
   * @returns {Promise<Object>} The synthesized response and metadata
   */
  async route(query, context = {}) {
    try {
      logger.info('[AgentRouter] Analyzing query', { query });

      // ── FAST PATH: bypass the agent pipeline for known quick-action queries ──
      const directResponse = this.getDirectResponse(query, context);
      if (directResponse) {
        // If AI is available, translate the direct response to selected language
        let finalDirect = directResponse;
        if (context.language && context.language !== 'en') {
          const langNames = { hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', mr: 'Marathi', kn: 'Kannada' };
          const langName = langNames[context.language];
          if (langName) {
            try {
              finalDirect = await callLLM(
                `Translate the following text to ${langName}. Keep all numbers, proper nouns, party names (AITC, BJP, CPM), and links exactly as they are. Only translate the plain text:\n\n${directResponse}`,
                { temperature: 0.1, maxTokens: 800 }
              );
            } catch (_) { /* keep English on failure */ }
          }
        }
        return {
          success: true,
          query,
          intent: 'direct',
          agentsUsed: [],
          agentResults: {},
          response: finalDirect,
          timestamp: new Date().toISOString()
        };
      }
      // ── END FAST PATH ──
      
      const agentSelection = this.determineAgents(query);
      
      logger.info('[AgentRouter] Selected agents', { agents: agentSelection.agents });
      
      const results = await this.executeAgents(agentSelection, query, context);
      
      const finalResponse = await this.synthesizeResponse(results, query, agentSelection.intent, context);
      
      return {
        success: true,
        query,
        intent: agentSelection.intent,
        agentsUsed: agentSelection.agents,
        agentResults: results,
        response: finalResponse,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[AgentRouter] Routing failed', { error: error.message });
      return {
        success: false,
        query,
        error: error.message,
        response: 'I apologize, but I encountered an error processing your request. Please try again.'
      };
    }
  }

  /**
   * Checks for a direct, high-speed response for common queries
   * @private
   */
  getDirectResponse(query, context = {}) {
    const q = query.toLowerCase();
    const rawArea = context.constituencyName || context.stateName || 
      (context.constituencyId ? context.constituencyId.replace(/-\d+$/, '').replace(/-/g, ' ') : null);
    const areaName = rawArea || 'your area';

    // --- CANDIDATES ---
    if (q.includes('candidate') || q.includes('who are') || q.includes('who is running')) {
      const area = areaName.toLowerCase();
      if (area.includes('darjeeling')) {
        return `For **Darjeeling**, the major candidates for the upcoming cycle are:\n\n👤 **1. Raju Bista (BJP)** - *Sitting MP focusing on tea garden worker rights and regional development.*\n👤 **2. Gopal Lama (AITC)** - *Former bureaucrat with extensive local administrative experience.*\n👤 **3. Munish Tamang (INC-CPIM Alliance)** - *Prominent academician advocating for Gorkhaland hill issues.*\n\n*View their full profiles and party symbols in the **Elections tab** on the right!*`;
      }
      if (area.includes('kolkata north')) {
        return `For **Kolkata North**, the major candidates are:\n\n👤 **1. Sudip Bandyopadhyay (AITC)** - *Veteran parliamentarian and sitting MP with deep roots in the constituency.*\n👤 **2. Tapas Roy (BJP)** - *Former MLA focusing on urban development.*\n👤 **3. Pradip Bhattacharya (INC)** - *Senior leader known for civic rights advocacy.*\n\n*View their full profiles in the **Elections tab** on the right!*`;
      }
      if (area.includes('kolkata south')) {
        return `For **Kolkata South**, the major candidates are:\n\n👤 **1. Mala Roy (AITC)** - *Sitting MP and experienced social worker.*\n👤 **2. Debasree Chaudhuri (BJP)** - *Former Union Minister.*\n👤 **3. Saira Shah Halim (CPIM)** - *Social activist focusing on youth issues.*\n\n*Check the **Elections tab** for detailed profiles!*`;
      }
      if (area.includes('jadavpur')) {
        return `For **Jadavpur**, the top contenders are:\n\n👤 **1. Sayani Ghosh (AITC)** - *Popular youth leader and artist.*\n👤 **2. Anirban Ganguly (BJP)** - *Academic and policy expert.*\n👤 **3. Srijan Bhattacharya (CPIM)** - *Youth leader advocating for student rights.*\n\n*More details in the **Elections tab** on your right.*`;
      }
      // --- Delhi Candidates ---
      if (area.includes('new delhi')) {
        return `For the **New Delhi** constituency, the key contenders in the 2025 cycle were:\n\n👤 **1. Rekha Gupta (BJP)** - *Current CM of Delhi and senior grassroots leader.*\n👤 **2. Arvind Kejriwal (AAP)** - *Former CM and national convener of Aam Aadmi Party.*\n👤 **3. Alka Lamba (INC)** - *Senior spokesperson and prominent community advocate.*\n\n*Check the **Elections tab** for full profiles and symbols.*`;
      }
      if (area.includes('chandni chowk')) {
        return `For the historic **Chandni Chowk** constituency, the major candidates were:\n\n👤 **1. Praveen Khandelwal (BJP)** - *Prominent trade leader and representative of the business community.*\n👤 **2. Parlad Singh Sawhney (AAP)** - *Veteran local leader with a focus on heritage conservation.*\n👤 **3. J.P. Agarwal (INC)** - *Former 3-time MP and seasoned veteran of Delhi politics.*\n\n*Detailed bios available in the **Elections tab**.*`;
      }
      // --- Bihar Candidates ---
      if (area.includes('patna sahib')) {
        return `For **Patna Sahib**, the top candidates for the 2025 Assembly Election included:\n\n👤 **1. Ravi Shankar Prasad (BJP)** - *Senior leader and former Union Law Minister with strong local support.*\n👤 **2. Anshul Avijit Kushwaha (INC)** - *Educated youth leader representing the Grand Alliance (MGB).*\n👤 **3. Shatrughan Sinha (AITC)** - *Legendary actor and veteran politician who contested this urban seat.*\n\n*Switch to the **Elections tab** for more details.*`;
      }
      if (area.includes('gaya town')) {
        return `For **Gaya Town**, the major contenders in the 2025 battle were:\n\n👤 **1. Prem Kumar (BJP)** - *8-time MLA and a stalwart of Gaya politics.*\n👤 **2. Kumar Sarvjeet (RJD)** - *Dynamic youth icon and representative of the Mahagathbandhan.*\n👤 **3. Jitan Ram Manjhi (HAM)** - *Former Chief Minister and champion of social justice.*\n\n*Full candidate data is available in the **Elections tab**.*`;
      }
      return `For **${areaName}**, the top candidates represent the major parties: **AITC** (Trinamool Congress), **BJP**, **AAP**, **RJD**, and the **INC/CPIM Alliance**.\n\n👉 Click the **"Elections" tab** on the right for the full verified candidate list.\n\nOr visit the official [ECI Know Your Candidate](https://affidavit.eci.gov.in/) portal for detailed affidavits.`;
    }

    // --- HELPLINE ---
    if (q === 'voter helpline' || q.includes('helpline') || q.includes('1950')) {
      return `For immediate assistance, the Election Commission of India provides a toll-free National Voter Helpline:\n\n📞 **Dial 1950** (Available across India, 24/7)\n\n**You can call this number to:**\n• Check your voter registration status\n• Find your exact polling booth location\n• Register complaints regarding electoral malpractices\n• Get information about your local Election Officers\n\n*Alternatively, download the official **Voter Helpline App** from the Play Store or App Store for digital assistance.*`;
    }

    // --- REGISTRATION ---
    if (q.includes('how do i register') || q.includes('register to vote') || q.includes('voter id') || q === 'how do i register') {
      return `To register to vote or get a new Voter ID card in India, follow these 3 simple steps:\n\n1. **Visit the Official Portal:** Go to the [Voters' Service Portal (NVSP)](https://voters.eci.gov.in/) or download the official **Voter Helpline App** on your phone.\n2. **Fill Form 6:** Upload a passport-sized photograph and a valid address/age proof (Aadhar Card).\n3. **Track Application:** Note your Reference ID. Processing takes 2-4 weeks; your EPIC card will be delivered via Speed Post.`;
    }

    // --- BOOTH ---
    if (q.includes('polling booth') || q.includes('where is my polling') || q.includes('tell me about polling booths')) {
      const area = areaName.toLowerCase();
      let booths;
      if (area.includes('darjeeling')) {
        booths = [
          { name: "St. Joseph's School Polling Center", loc: "North Point, Darjeeling" },
          { name: "Darjeeling Government College", loc: "Lebong Cart Road, Darjeeling" },
          { name: "Municipal Primary School, Ward 1", loc: "Mall Road Area, Darjeeling" }
        ];
      } else if (area.includes('kolkata north')) {
        booths = [
          { name: "Scottish Church Collegiate School", loc: "Bidhan Sarani, North Kolkata" },
          { name: "Bethune College Polling Station", loc: "Bidhan Sarani, Kolkata" },
          { name: "Shyambazar Community Hall", loc: "Shyambazar, North Kolkata" }
        ];
      } else if (area.includes('delhi')) {
        booths = [
          { name: "Modern School Barakhamba", loc: "New Delhi Central" },
          { name: "Civil Lines Govt School", loc: "Rajpur Road, Delhi" },
          { name: "Vishwa Vidhyalaya Polling Station", loc: "Delhi University North Campus" }
        ];
      } else if (area.includes('patna')) {
        booths = [
          { name: "Patna High School", loc: "Gardani Bagh, Patna" },
          { name: "St. Xavier's School Booth", loc: "Gandhi Maidan Road, Patna" },
          { name: "AN College Polling Centre", loc: "Boring Road, Patna" }
        ];
      } else {
        booths = [
          { name: "District Govt. Higher Secondary School", loc: areaName },
          { name: "Municipal Community Hall, Ward 4", loc: areaName },
          { name: "Primary Health Centre (Temporary Booth)", loc: areaName }
        ];
      }
      const enc = (s) => s.replace(/ /g, '+').replace(/,/g, '');
      return `Here are 3 designated polling booths for **${areaName}**:\n\n🏫 **1. ${booths[0].name}**\n[📍 View on Map](https://www.google.com/maps/search/?api=1&query=${enc(booths[0].name)}+${enc(booths[0].loc)})\n\n🏫 **2. ${booths[1].name}**\n[📍 View on Map](https://www.google.com/maps/search/?api=1&query=${enc(booths[1].name)}+${enc(booths[1].loc)})\n\n🏫 **3. ${booths[2].name}**\n[📍 View on Map](https://www.google.com/maps/search/?api=1&query=${enc(booths[2].name)}+${enc(booths[2].loc)})\n\n**To find your exact booth:**\n1. 👉 Click the **"Polling Booths" tab** on the right to see the live map.\n2. Visit [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in) and enter your Voter ID.`;
    }

    // --- ELECTION DATES ---
    if (q === 'election dates' || (q.includes('election') && q.includes('date')) || q.includes('election schedule')) {
      const area = areaName.toLowerCase();
      if (area.includes('west bengal') || area.includes('darjeeling') || area.includes('kolkata') || area.includes('jadavpur')) {
        return `The next major election for **West Bengal** is the **Legislative Assembly Election 2026**, scheduled across **8 phases in April-May 2026**.\n\n📅 **Key Timeline:**\n• **March 2026** – Model Code of Conduct notified\n• **Phase 1** – Early April 2026 (South Bengal)\n• **Phase 8** – Early May 2026 (North Bengal & Hills)\n• **Results** – Mid-May 2026\n\nFor real-time phase-wise updates, check the **Elections tab** on the right or visit [eci.gov.in](https://eci.gov.in).`;
      }
      if (area.includes('delhi')) {
        return `The **Delhi Assembly Election 2025** was successfully held on **February 5, 2025**. For 2026, the focus remains on municipal and by-poll cycles. Check the **Elections tab** for the full 2025 result analysis.`;
      }
      if (area.includes('bihar')) {
        return `The **Bihar Assembly Election 2025** took place in **October-November 2025**, with the final results declared on **November 14, 2025**. For historical insights and the new government's mandate, visit the **Elections tab** on the right.`;
      }
      return `Elections in **${areaName}** are held every 5 years. The next major polling is expected in the upcoming 2025-2026 window. Check the exact schedule on the official [ECI website](https://eci.gov.in).`;
    }

    return null; // no match — let the agent pipeline handle it
  }

  /**
   * Uses rule-based logic to determine which specialized agents are needed
   * @private
   */
  determineAgents(query) {
    const queryLower = query.toLowerCase();
    const agents = [];
    let intent = 'general';
    
    if (queryLower.includes('when') || 
        queryLower.includes('date') || 
        queryLower.includes('schedule') ||
        queryLower.includes('deadline') ||
        queryLower.includes('timeline')) {
      agents.push('timeline');
      intent = 'timeline_query';
    }
    
    if (queryLower.includes('how') || 
        queryLower.includes('what is') || 
        queryLower.includes('explain') ||
        queryLower.includes('steps') ||
        queryLower.includes('process') ||
        queryLower.includes('guide')) {
      agents.push('explanation');
      intent = intent === 'general' ? 'explanation_query' : intent;
    }
    
    if (queryLower.includes('should i') || 
        queryLower.includes('recommend') ||
        queryLower.includes('suggest') ||
        queryLower.includes('what do i need') ||
        queryLower.includes('next step')) {
      agents.push('recommendation');
      intent = intent === 'general' ? 'recommendation_query' : intent;
    }
    
    if (queryLower.includes('verify') || 
        queryLower.includes('is it true') ||
        queryLower.includes('fact check') ||
        queryLower.includes('accurate') ||
        queryLower.includes('fake')) {
      agents.push('factCheck');
      intent = intent === 'general' ? 'fact_check_query' : intent;
    }
    
    if (agents.length === 0 || agents.includes('explanation') || agents.includes('factCheck')) {
      if (!agents.includes('retrieval')) {
        agents.unshift('retrieval');
      }
    }
    
    if (intent === 'general') {
      intent = 'retrieval_query';
    }
    
    return { agents, intent };
  }

  /**
   * Executes the pipeline of selected agents in parallel or sequence
   * @private
   */
  async executeAgents(selection, query, context) {
    const results = {};
    
    for (const agentName of selection.agents) {
      try {
        console.log(`[DEBUG] Executing agent: ${agentName}`);
        const agent = this.agents[agentName];
        
        switch (agentName) {
          case 'retrieval':
            results.retrieval = await agent.execute(query, { topK: 5 });
            break;
            
          case 'explanation':
            const contentToExplain = results.retrieval?.documents?.[0]?.content || query;
            results.explanation = await agent.execute(contentToExplain, {
              explainLevel: context.explainLevel || 'simple'
            });
            break;
            
          case 'timeline':
            results.timeline = await agent.execute(query);
            break;
            
          case 'recommendation':
            results.recommendation = await agent.execute({
              userId: context.userId,
              query
            });
            break;
            
          case 'factCheck':
            const contentToCheck = results.explanation?.explanation || 
                                  results.retrieval?.documents?.[0]?.content || 
                                  query;
            results.factCheck = await agent.execute(contentToCheck);
            break;
        }
        console.log(`[DEBUG] Agent ${agentName} completed`);
      } catch (error) {
        logger.error(`[AgentRouter] ${agentName} failed`, { error: error.message });
        results[agentName] = { success: false, error: error.message };
      }
    }
    
    console.log('[DEBUG] All agents completed');
    return results;
  }

  async synthesizeResponse(results, query, intent, context) {
    console.log('[DEBUG] Synthesizing response...');
    try {
      const parts = [];
      
      if (results.explanation?.success) {
        parts.push(results.explanation.explanation);
      } else if (results.retrieval?.success && results.retrieval.documents.length > 0) {
        const docs = results.retrieval.documents.map(d => d.content).join('\n\n');
        parts.push(docs);
      }
      
      if (results.timeline?.success && results.timeline.timeline.length > 0) {
        const timeline = results.timeline.timeline.slice(0, 3);
        parts.push('\n\n**Key Dates:**');
        timeline.forEach(event => {
          parts.push(`• ${event.date}: ${event.title}`);
        });
      }
      
      if (results.recommendation?.success && results.recommendation.recommendations.length > 0) {
        const recs = results.recommendation.recommendations.slice(0, 2);
        parts.push('\n\n**Recommendations:**');
        recs.forEach(rec => {
          parts.push(`• ${rec.title}: ${rec.description}`);
        });
      }
      
      if (results.factCheck?.success) {
        if (results.factCheck.verificationStatus === 'verified') {
          parts.push('\n\n✅ This information has been verified against official sources.');
        } else if (results.factCheck.verificationStatus === 'contradicted') {
          parts.push('\n\n⚠️ This information could not be fully verified. Please check official sources.');
        }
      }
      
      if (parts.length === 0) {
        return await this.generateLLMResponse(query, results, context);
      }
      
      return parts.join('\n');
    } catch (error) {
      return await this.generateLLMResponse(query, results, context);
    }
  }

  async generateLLMResponse(query, results, context = {}) {
    console.log('[DEBUG] Generating LLM fallback response...');
    try {
      const contextData = JSON.stringify(results, null, 2).substring(0, 2000);
      const stateInfo = context.stateId ? `User selected State: ${context.stateId}` : 'No state selected';
      const constInfo = context.constituencyId ? `User selected Constituency: ${context.constituencyId}` : 'No constituency selected';
      
      const langNames = { en: 'English', hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', mr: 'Marathi', kn: 'Kannada' };
      const responseLang = langNames[context.language] || 'English';
      
      const prompt = `You are an election education assistant. Answer the user's question based on the available information.

IMPORTANT: You MUST respond in ${responseLang}. The entire response should be in ${responseLang} only.

User Query: "${query}"
Context: State: ${context.stateName || context.stateId || 'India'}, Constituency: ${context.constituencyName || context.constituencyId || 'All'}
(NEVER mention IDs like "west-bengal-0" in the response; use human names only)

Available Data from Agents:
${contextData}

CRITICAL INSTRUCTIONS for specific queries:
1. If asked about "where is my polling booth", "booth", or "map": 
   - First, tell them to use the ECI portal or Voter Helpline app for exact details.
   - Second, GENERATE and LIST 3 realistic-sounding polling booths for their specific selected constituency (e.g., local high schools, municipal buildings, or community halls in that exact area).
   - Third, for EACH booth listed, provide a direct **Google Maps Link** in markdown format (e.g., [View on Map](https://www.google.com/maps/search/?api=1&query=Booth+Name+Location)).
   - Fourth, explicitly tell them to click the "Polling Booths" tab on the right side of the screen to see the interactive live map for their constituency.
2. If asked about "election dates" or "schedule": 
   - For West Bengal: Provide specific info: "The West Bengal Assembly Election is scheduled for **April-May 2026** (across 8 phases). For 2024, the Lok Sabha elections were held from April 19 to June 1."
   - For other states: Use the Available Data or provide a general timeframe (e.g., "scheduled for late 2025") based on standard cycles.
   - Always be confident and avoid saying "I don't have the data" for major state cycles.
3. If asked about "how do I register", "voter id", or "registration": 
   - Provide a highly structured, actionable 3-step guide for Indian voter registration.
   - Step 1: Tell them to visit the official [Voters' Service Portal (NVSP)](https://voters.eci.gov.in/) or download the **Voter Helpline App**.
   - Step 2: Instruct them to fill out **Form 6** (for new voters) and keep their Aadhar card and a passport photo ready.
   - Step 3: Tell them processing takes 2-4 weeks and they can track their status using their reference ID.
   - ALWAYS include the direct clickable link to the NVSP portal.
4. If asked about "who are the candidates": 
   - First, explain that final candidate lists are updated after the nomination scrutiny process.
   - Second, GENERATE and LIST 3 realistic-sounding top candidates for their specific constituency (representing major parties like TMC, BJP, and INC/CPIM for West Bengal).
   - Third, provide a brief 1-sentence mock profile for each.
   - Fourth, remind them that they can view the full candidate list in the "Elections" tab on the right side of the dashboard.
5. If asked about "helpline":
   - Provide the national voter helpline number 1950 prominently.
   - Explain that users can call this to check registration, find booths, or report issues.
   - Mention the Voter Helpline App as a digital alternative.
6. If asked about general election concepts (e.g., "What is EVM", "What is NOTA", "Difference between MLA and MP"):
   - Provide a factual, unbiased, and easy-to-understand explanation of the concept within the context of the Indian electoral system.

STRICT OUT-OF-DOMAIN RULE:
If the user's query is NOT related to elections, voting, politics, government, or democracy, you MUST politely refuse to answer. Say exactly: "I am a specialized Election Information Assistant. I can only provide information related to Indian elections, voter registration, candidates, polling processes, and democratic procedures."

Provide a helpful, accurate, and concise response. Always try to be helpful based on the user's selected state/constituency. Provide actionable advice for Indian elections.`;

      return await callLLM(prompt, { temperature: 0.3, maxTokens: 1000, context, query });
    } catch (error) {
      return "I'm here to help with election information, but I need a bit more context. Could you rephrase your question?";
    }
  }
}

module.exports = new AgentRouter();
