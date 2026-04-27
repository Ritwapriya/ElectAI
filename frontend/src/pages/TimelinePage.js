import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Calendar, AlertCircle, CheckCircle, 
  ChevronRight, Filter, Download, Share2, Info
} from 'lucide-react';
import { getTimeline, getUpcomingEvents } from '../services/api';

const TimelinePage = () => {
  const [timeline, setTimeline] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [timelineData, upcomingData] = await Promise.all([
        getTimeline(),
        getUpcomingEvents(90)
      ]);
      
      setTimeline(timelineData.timeline || []);
      setUpcoming(upcomingData.events || []);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'deadline':
      case 'key_date':
        return AlertCircle;
      case 'election':
        return CheckCircle;
      case 'milestone':
        return Clock;
      default:
        return Calendar;
    }
  };

  const getEventColor = (importance, type) => {
    if (type === 'deadline' || type === 'key_date') return 'bg-red-500';
    if (importance === 'critical') return 'bg-red-500';
    if (importance === 'high') return 'bg-accent-purple';
    if (importance === 'medium') return 'bg-accent-blue';
    return 'bg-gray-500';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredTimeline = filter === 'all' 
    ? timeline 
    : timeline.filter(event => event.importance === filter);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Election <span className="text-gradient">Timeline</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Stay informed about important dates, deadlines, and events. 
            Never miss a critical election milestone.
          </p>
        </motion.div>

        {/* Upcoming Events Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="glass p-6 animate-pulse">
                  <div className="h-8 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/10 rounded w-full mb-2" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ))
            ) : upcoming.length > 0 ? (
              upcoming.slice(0, 3).map((event, index) => {
                const daysUntil = getDaysUntil(event.date);
                const Icon = getEventIcon(event.type);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass p-6 card-hover ${daysUntil <= 7 ? 'border-red-500/30' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${getEventColor(event.importance, event.type)} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        daysUntil <= 7 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-accent-purple/20 text-accent-purple'
                      }`}>
                        {daysUntil} days
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-3 glass p-8 text-center">
                <Info className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming events found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Timeline Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Filter by importance:</span>
            {['all', 'critical', 'high', 'medium'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-accent-purple text-white'
                    : 'glass text-gray-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8"
        >
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4 animate-pulse">
                  <div className="w-4 h-4 bg-white/10 rounded-full mt-1" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTimeline.length > 0 ? (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-purple via-accent-pink to-accent-cyan" />

              <div className="space-y-6">
                {filteredTimeline.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  const daysUntil = getDaysUntil(event.date);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="relative flex items-start space-x-4 group cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`relative z-10 w-12 h-12 ${getEventColor(event.importance, event.type)} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 glass p-4 group-hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-accent-purple font-semibold">
                                {formatDate(event.date)}
                              </span>
                              {daysUntil > 0 && daysUntil <= 30 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  daysUntil <= 7 
                                    ? 'bg-red-500/20 text-red-400' 
                                    : 'bg-accent-purple/20 text-accent-purple'
                                }`}>
                                  {daysUntil} days left
                                </span>
                              )}
                            </div>
                            <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                            <p className="text-gray-400 text-sm">{event.description}</p>
                            {event.electionName && (
                              <p className="text-xs text-gray-500 mt-2">
                                {event.electionName}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No events found for the selected filter</p>
            </div>
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Critical Deadline</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-purple rounded-full" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-blue rounded-full" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <span>General Event</span>
          </div>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-8 rounded-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className={`w-16 h-16 ${getEventColor(selectedEvent.importance, selectedEvent.type)} rounded-2xl flex items-center justify-center`}>
                {React.createElement(getEventIcon(selectedEvent.type), { className: 'w-8 h-8 text-white' })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                <p className="text-accent-purple font-semibold">{formatDate(selectedEvent.date)}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">{selectedEvent.description}</p>
            {selectedEvent.electionName && (
              <p className="text-sm text-gray-500 mb-4">
                Related to: {selectedEvent.electionName}
              </p>
            )}
            <button
              onClick={() => setSelectedEvent(null)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TimelinePage;
