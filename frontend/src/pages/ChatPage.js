import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Shield, Clock, 
  ChevronDown, Loader2, RefreshCw, ThumbsUp, ThumbsDown,
  BookOpen, CheckCircle, AlertCircle
} from 'lucide-react';
import { sendMessage } from '../services/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Election Education AI assistant. I can help you with:\n\n• Voter registration information\n• Election dates and deadlines\n• Voting procedures\n• Ballot measures\n• Voting rights\n\nWhat would you like to know about?',
      timestamp: new Date(),
      agentsUsed: ['explanation']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [explainLevel, setExplainLevel] = useState('simple');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage, { explainLevel });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        agentsUsed: response.agentsUsed || ['retrieval'],
        verification: response.verification,
        intent: response.intent
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m your Election Education AI assistant. What would you like to know about elections?',
      timestamp: new Date(),
      agentsUsed: ['explanation']
    }]);
  };

  const getAgentIcon = (agent) => {
    switch (agent) {
      case 'retrieval': return BookOpen;
      case 'explanation': return Sparkles;
      case 'factCheck': return Shield;
      case 'timeline': return Clock;
      case 'recommendation': return CheckCircle;
      default: return Bot;
    }
  };

  const getAgentColor = (agent) => {
    switch (agent) {
      case 'retrieval': return 'bg-accent-blue';
      case 'explanation': return 'bg-accent-purple';
      case 'factCheck': return 'bg-green-500';
      case 'timeline': return 'bg-accent-cyan';
      case 'recommendation': return 'bg-accent-pink';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
        <div className="glass h-full flex flex-col overflow-hidden glow-blue">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Election AI Assistant</h1>
                <p className="text-xs text-gray-400">Powered by 5 specialized agents</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={explainLevel}
                onChange={(e) => setExplainLevel(e.target.value)}
                className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-purple"
              >
                <option value="simple">Simple</option>
                <option value="detailed">Detailed</option>
                <option value="eli5">ELI5 Mode</option>
              </select>

              <button
                onClick={clearChat}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                title="Clear chat"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowAgents(!showAgents)}
                className={`p-2 rounded-lg transition-colors ${showAgents ? 'bg-accent-purple/20 text-accent-purple' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                title="Toggle agent info"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-accent-purple' 
                        : 'bg-gradient-to-br from-accent-blue to-accent-cyan'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className={`space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-accent-purple text-white'
                          : message.isError
                          ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                          : 'glass text-gray-100'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>

                      {message.role === 'assistant' && !message.isError && (
                        <div className="flex items-center space-x-2">
                          {showAgents && message.agentsUsed && (
                            <div className="flex items-center space-x-1">
                              {message.agentsUsed.map((agent, i) => {
                                const Icon = getAgentIcon(agent);
                                return (
                                  <div
                                    key={i}
                                    className={`w-5 h-5 ${getAgentColor(agent)} rounded flex items-center justify-center`}
                                    title={agent}
                                  >
                                    <Icon className="w-3 h-3 text-white" />
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {message.verification && (
                            <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                              message.verification.status === 'verified'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {message.verification.status === 'verified' ? (
                                <Shield className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              <span>{message.verification.confidence}% verified</span>
                            </div>
                          )}

                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
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
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-xl flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass px-4 py-3 rounded-2xl flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-accent-purple animate-spin" />
                  <span className="text-sm text-gray-400">Agents are thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about elections, voting, or deadlines..."
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-accent-purple rounded-lg hover:bg-accent-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>Responses are fact-checked against official sources</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-accent-purple transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="text-gray-500 hover:text-red-400 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
