import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Shield, Clock, Sparkles, BookOpen,
  Code, Database, Cpu, Layers, GitBranch, ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  const agents = [
    {
      icon: BookOpen,
      name: 'Retrieval Agent',
      color: 'from-accent-blue to-accent-cyan',
      description: 'Searches the vector database for relevant election documents using semantic search.',
      role: 'Brain of the chatbot'
    },
    {
      icon: Sparkles,
      name: 'Explanation Agent',
      color: 'from-accent-purple to-accent-pink',
      description: 'Converts complex legal language into simple, step-by-step explanations.',
      role: 'Simplifies information'
    },
    {
      icon: Clock,
      name: 'Timeline Agent',
      color: 'from-accent-cyan to-accent-blue',
      description: 'Generates structured timelines of election events and key dates.',
      role: 'Time-aware responses'
    },
    {
      icon: Bot,
      name: 'Recommendation Agent',
      color: 'from-accent-pink to-accent-purple',
      description: 'Suggests next steps and warns about upcoming deadlines.',
      role: 'Personalized guidance'
    },
    {
      icon: Shield,
      name: 'Fact-Check Agent',
      color: 'from-green-400 to-green-600',
      description: 'Cross-checks all responses against trusted government sources.',
      role: 'Prevents misinformation'
    }
  ];

  const techStack = [
    { icon: Code, name: 'React + Tailwind', category: 'Frontend' },
    { icon: Layers, name: 'Node.js + Express', category: 'Backend' },
    { icon: Cpu, name: 'Gemini AI', category: 'LLM' },
    { icon: Database, name: 'MongoDB + Redis', category: 'Database' },
    { icon: GitBranch, name: 'ChromaDB', category: 'Vector DB' }
  ];

  const architectureSteps = [
    { title: 'User Query', desc: 'Question submitted via frontend' },
    { title: 'Orchestrator', desc: 'AI routes to appropriate agent(s)' },
    { title: 'Multi-Agent Layer', desc: 'Specialized agents process in parallel' },
    { title: 'RAG Pipeline', desc: 'Retrieval + LLM generates response' },
    { title: 'Fact Check', desc: 'Response verified against sources' },
    { title: 'Formatted Output', desc: 'Clean, accurate answer delivered' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-gradient">ElectAI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A cutting-edge multi-agent AI system designed to provide accurate, 
            trustworthy election education to every citizen.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl mb-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Democracy works best when everyone is informed. We're leveraging the power of 
            artificial intelligence to break down barriers to civic participation. Our 
            multi-agent system ensures every citizen has access to accurate, personalized 
            election information—whenever they need it.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            The <span className="text-gradient">Multi-Agent</span> System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass p-6 card-hover"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${agent.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <agent.icon className="w-7 h-7 text-white" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-accent-purple mb-3">
                  {agent.role}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{agent.name}</h3>
                <p className="text-gray-400 text-sm">{agent.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            System <span className="text-gradient">Architecture</span>
          </h2>
          <div className="glass p-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {architectureSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-xs">{step.desc}</p>
                  </div>
                  {index < architectureSteps.length - 1 && (
                    <div className="hidden md:block absolute top-6 -right-2">
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Technology <span className="text-gradient">Stack</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="glass p-6 text-center card-hover"
              >
                <tech.icon className="w-8 h-8 text-accent-purple mx-auto mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">{tech.name}</h3>
                <p className="text-gray-500 text-xs">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Multi-Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Why Multi-Agent?</h2>
            <ul className="space-y-4">
              {[
                'Each agent specializes in one task—excellence through focus',
                'Parallel processing for faster, more accurate responses',
                'Easy to extend with new agents for additional capabilities',
                'Built-in redundancy—if one agent fails, others continue',
                'Clear separation of concerns for maintainable code'
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent-purple text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-gray-300">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Why RAG?</h2>
            <ul className="space-y-4">
              {[
                'Eliminates AI hallucinations with grounded responses',
                'Real-time access to the latest election information',
                'Citations to trusted sources for every answer',
                'Domain-specific knowledge through custom embeddings',
                'Continuously updatable without retraining the model'
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-cyan/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3 h-3 text-accent-cyan" />
                  </div>
                  <p className="text-gray-300">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">Ready to experience the future of election education?</p>
          <a 
            href="/chat" 
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Bot className="w-5 h-5" />
            <span>Try the AI Assistant</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
