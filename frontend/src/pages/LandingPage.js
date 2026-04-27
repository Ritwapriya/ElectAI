import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, History, Sparkles, Shield, MessageCircle, ChevronRight, Vote, BookOpen, Users } from 'lucide-react';

const LandingPage = () => {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const phrases = [
    "Democracy at your fingertips.",
    "Your Vote, Your Voice, Your Future.",
    "Decoding the Ballot with AI.",
    "Real-time Election Intelligence.",
    "Empowering Every Citizen."
  ];

  React.useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length + (isDeleting ? -1 : 1)));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Ask anything about elections and get instant, accurate answers powered by our RAG-based multi-agent system.',
      color: 'from-accent-purple to-accent-pink'
    },
    {
      icon: History,
      title: 'Interactive Timeline',
      description: 'Visualize election schedules, deadlines, and key events with our dynamic timeline interface.',
      color: 'from-accent-blue to-accent-cyan'
    },
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Get personalized suggestions on what you should do next and deadlines you shouldn\'t miss.',
      color: 'from-accent-pink to-accent-purple'
    },
    {
      icon: Shield,
      title: 'Fact-Checked Information',
      description: 'Every response is cross-verified with trusted sources to ensure accuracy and prevent misinformation.',
      color: 'from-accent-cyan to-accent-blue'
    }
  ];

  const stats = [
    { value: '5', label: 'Specialized AI Agents', icon: Bot },
    { value: '100%', label: 'Fact-Checked Data', icon: Shield },
    { value: '24/7', label: 'AI Support', icon: MessageCircle },
    { value: '∞', label: 'Questions Answered', icon: Sparkles }
  ];
  
  return (
    <div className="min-h-screen pt-10"> {/* Added padding to avoid navbar overlap */}
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* ... animated background ... */}
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl animate-float animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8 border border-white/10 shadow-lg shadow-accent-purple/10">
              <Sparkles className="w-4 h-4 text-accent-pink animate-pulse" />
              <span className="text-sm font-medium text-gray-200">Powered by Multi-Agent AI System</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-white">Understand Elections</span>
              <br />
              <span className="text-gradient drop-shadow-2xl">Like Never Before</span>
            </h1>

            <div className="h-12 mb-8">
              <p className="text-2xl md:text-3xl text-accent-cyan font-mono font-medium">
                {displayText}
                <span className="inline-block w-1 h-8 bg-accent-cyan ml-1 animate-pulse">|</span>
              </p>
            </div>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the future of civic education. Our AI-powered platform uses 
              specialized agents to deliver accurate, personalized election information.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/chat" className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg glow-purple">
                <MessageCircle className="w-5 h-5" />
                <span>Start Exploring</span>
              </Link>
              <Link to="/timeline" className="btn-secondary flex items-center space-x-2 px-8 py-4 text-lg">
                <History className="w-5 h-5" />
                <span>View Timeline</span>
              </Link>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <div className="glass p-6 text-left card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Agent System</h3>
              <p className="text-gray-400 text-sm">5 specialized AI agents working together to deliver precise answers</p>
            </div>

            <div className="glass p-6 text-left card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">RAG-Powered</h3>
              <p className="text-gray-400 text-sm">Retrieval-Augmented Generation ensures responses are grounded in facts</p>
            </div>

            <div className="glass p-6 text-left card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-pink to-accent-purple rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Recommendations</h3>
              <p className="text-gray-400 text-sm">Personalized guidance based on your location and voting status</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 mb-4">
                  <stat.icon className="w-8 h-8 text-accent-purple" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Powered by <span className="text-gradient">Advanced AI</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our multi-agent architecture ensures every interaction is accurate, 
              personalized, and backed by verified sources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 card-hover group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our intelligent orchestrator routes your questions to the right agents for optimal results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: MessageCircle, title: 'Ask', desc: 'Type your question' },
              { icon: Bot, title: 'Route', desc: 'AI selects agents' },
              { icon: BookOpen, title: 'Retrieve', desc: 'Search knowledge base' },
              { icon: Shield, title: 'Verify', desc: 'Fact-check response' },
              { icon: Sparkles, title: 'Answer', desc: 'Get accurate info' }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-3xl glow-purple"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Informed?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of citizens using AI to understand elections better. 
              Your voice matters—make it count with the right information.
            </p>
            <Link to="/chat" className="btn-primary inline-flex items-center space-x-2">
              <Vote className="w-5 h-5" />
              <span>Start Your Journey</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
