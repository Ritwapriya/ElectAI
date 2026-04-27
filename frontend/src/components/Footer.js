import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-gray-900/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">ElectAI</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering voters with AI-driven education. Understand elections, 
              know your rights, and make informed decisions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/chat" className="text-gray-400 hover:text-white transition-colors">
                  AI Chat Assistant
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="text-gray-400 hover:text-white transition-colors">
                  Election Timeline
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Voter Registration
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Polling Locations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ElectAI. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 mx-1 text-accent-pink" /> for democracy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
