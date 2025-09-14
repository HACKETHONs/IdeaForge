import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Rocket, Brain, Users, BarChart, DollarSign, Target, TrendingUp } from 'lucide-react';

const StartupForge = () => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    market: '',
    industry: ''
  });
  const [connectedMentors, setConnectedMentors] = useState(new Set());
  const [visitedBefore, setVisitedBefore] = useState(true);
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Welcome modal for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisitedBefore(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleValidation = async () => {
    if (!formData.title || !formData.description || !formData.market || !formData.industry) {
      return;
    }
    
    setIsValidating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = generateValidationResults(formData.title, formData.industry, formData.market);
    setValidationResults(results);
    setIsValidating(false);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('validation-results')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const generateValidationResults = (title, industry, market) => {
    const marketScore = Math.floor(Math.random() * 30) + 70;
    const competitionScore = Math.floor(Math.random() * 40) + 60;
    const viabilityScore = Math.floor(Math.random() * 35) + 65;
    const overallScore = Math.floor((marketScore + competitionScore + viabilityScore) / 3);

    const recommendations = [
      "Consider conducting user interviews to validate market demand",
      "Research key competitors and identify your unique value proposition",
      "Develop a minimum viable product (MVP) to test core assumptions",
      `Explore potential funding sources in the ${industry} sector`,
      `Connect with mentors experienced in ${industry} industry`
    ];

    return {
      overallScore,
      marketScore,
      competitionScore,
      viabilityScore,
      recommendations: recommendations.slice(0, 3),
      industry
    };
  };

  const handleMentorConnect = (mentorId, mentorName) => {
    setConnectedMentors(prev => new Set([...prev, mentorId]));
    setTimeout(() => {
      alert(`Connection request sent to ${mentorName}! They will contact you within 24 hours.`);
    }, 500);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const AnimatedStat = ({ value, label, suffix = "", delay = 0 }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
      if (statsAnimated) {
        const timer = setTimeout(() => {
          const numericValue = parseInt(value.toString().replace(/[^\d]/g, ''));
          let current = 0;
          const increment = numericValue / 50;
          const interval = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              setCurrentValue(numericValue);
              clearInterval(interval);
            } else {
              setCurrentValue(Math.floor(current));
            }
          }, 30);
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [statsAnimated, value, delay]);

    return (
      <div className="stat-card">
        <div className="stat-number">{currentValue}{suffix}</div>
        <div className="stat-label">{label}</div>
      </div>
    );
  };

  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      expertise: "FinTech Expert",
      avatar: "SJ",
      description: "Former VP at Goldman Sachs, Founded 2 successful FinTech startups. 15+ years in financial services."
    },
    {
      id: 2,
      name: "Mark Rodriguez",
      expertise: "AI/ML Specialist",
      avatar: "MR",
      description: "Lead AI Engineer at Google, Expert in machine learning and product development. 10+ years experience."
    },
    {
      id: 3,
      name: "Lisa Kim",
      expertise: "Growth Marketing",
      avatar: "LK",
      description: "Growth strategist who scaled 5 startups to $10M+ revenue. Expert in customer acquisition and retention."
    },
    {
      id: 4,
      name: "David Anderson",
      expertise: "E-commerce",
      avatar: "DA",
      description: "Built and sold 3 e-commerce companies. Expert in supply chain, logistics, and online marketplace strategy."
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Validation",
      description: "Advanced algorithms analyze market trends, competition, and viability to provide data-driven insights on your startup idea's potential for success."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Mentor Matching",
      description: "Connect with industry experts and successful entrepreneurs who align with your vision, industry, and stage of development."
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Trusted Data Ecosystem",
      description: "Access verified market data, funding insights, and success metrics to make informed decisions about your startup strategy."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Funding Readiness",
      description: "Get actionable recommendations to improve your funding prospects and connect with relevant investors and funding opportunities."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Market Intelligence",
      description: "Real-time market analysis, competitor tracking, and customer insight tools to help you stay ahead of the curve."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Acceleration",
      description: "Personalized roadmaps and milestone tracking to accelerate your startup's growth from idea to market success."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        :root {
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --secondary: #f59e0b;
          --accent: #06b6d4;
          --dark: #1e293b;
          --light: #f8fafc;
          --gray: #64748b;
        }

        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .card-shadow {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .mentor-card:hover {
          transform: translateY(-5px);
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
          background: var(--light);
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: var(--primary);
          color: white;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .stat-card:hover .stat-number {
          color: white;
        }

        .stat-label {
          font-weight: 600;
          color: var(--gray);
        }

        .stat-card:hover .stat-label {
          color: rgba(255,255,255,0.9);
        }

        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-indigo-100">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-indigo-600">StartupForge</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('validate')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Validate
            </button>
            <button onClick={() => scrollToSection('mentors')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Mentors
            </button>
            <button onClick={() => scrollToSection('data')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Data
            </button>
          </div>
          
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all">
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg pt-24 pb-16 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="floating-animation absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="floating-animation absolute top-40 right-20 w-24 h-24 bg-white rounded-full" style={{animationDelay: '2s'}}></div>
          <div className="floating-animation absolute bottom-20 left-1/3 w-16 h-16 bg-white rounded-full" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Validate. Connect. Succeed.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            AI-powered platform that validates your startup ideas, connects you with expert mentors, and creates a trusted data ecosystem to accelerate your entrepreneurial journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('validate')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transform hover:-translate-y-1 transition-all"
            >
              Validate Your Idea
            </button>
            <button 
              onClick={() => scrollToSection('mentors')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transform hover:-translate-y-1 transition-all"
            >
              Find Mentors
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Empowering Entrepreneurs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights to transform your startup ideas into successful ventures
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card bg-white p-8 rounded-2xl card-shadow transition-all duration-300 border border-indigo-50 fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validation Tool Section */}
      <section id="validate" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Validate Your Startup Idea</h2>
            <p className="text-xl text-gray-600">Get AI-powered insights and validation for your startup concept</p>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-8 card-shadow">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Startup Idea Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AI-powered fitness coach app"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe Your Idea
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Explain your startup idea, target market, and value proposition..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="market" className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Market
                  </label>
                  <input
                    type="text"
                    id="market"
                    name="market"
                    value={formData.market}
                    onChange={handleInputChange}
                    placeholder="e.g., Health-conscious millennials in urban areas"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., HealthTech, FinTech, EdTech"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <button
                onClick={handleValidation}
                disabled={isValidating || !formData.title || !formData.description || !formData.market || !formData.industry}
                className="w-full gradient-bg text-white py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <span className="flex items-center justify-center">
                    <Brain className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Validate with AI
                  </span>
                )}
              </button>
            </div>
            
            {validationResults && (
              <div id="validation-results" className="mt-8 p-6 bg-white rounded-2xl border-l-4 border-indigo-500 fade-in">
                <h3 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Validation Results
                </h3>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Overall Validation Score: {validationResults.overallScore}%
                  </h4>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl font-bold text-indigo-600">{validationResults.marketScore}%</div>
                      <div className="text-sm text-gray-600">Market Opportunity</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl font-bold text-indigo-600">{validationResults.competitionScore}%</div>
                      <div className="text-sm text-gray-600">Competition Analysis</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl font-bold text-indigo-600">{validationResults.viabilityScore}%</div>
                      <div className="text-sm text-gray-600">Business Viability</div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Recommendations:</h4>
                  <ul className="space-y-2 mb-6">
                    {validationResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="gradient-bg text-white p-6 rounded-2xl text-center">
                    <h4 className="text-xl font-semibold mb-2">Ready to take the next step?</h4>
                    <p className="mb-4 opacity-90">Connect with our expert mentors to refine your idea and develop a go-to-market strategy.</p>
                    <button 
                      onClick={() => scrollToSection('mentors')}
                      className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:-translate-y-1 transition-all"
                    >
                      Find Mentors
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section id="mentors" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Connect with Expert Mentors</h2>
            <p className="text-xl text-gray-600">Get guidance from successful entrepreneurs and industry experts</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor, index) => (
              <div key={mentor.id} className="mentor-card bg-white p-6 rounded-2xl text-center card-shadow transition-all duration-300 fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {mentor.avatar}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{mentor.name}</h4>
                <p className="text-indigo-600 font-medium mb-3">{mentor.expertise}</p>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{mentor.description}</p>
                <button
                  onClick={() => handleMentorConnect(mentor.id, mentor.name)}
                  disabled={connectedMentors.has(mentor.id)}
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                    connectedMentors.has(mentor.id)
                      ? 'bg-amber-500 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-1'
                  }`}
                >
                  {connectedMentors.has(mentor.id) ? 'Connected!' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Ecosystem Section */}
      <section id="data" ref={statsRef} className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted Data Ecosystem</h2>
            <p className="text-xl text-gray-600">Access verified data and insights to make informed decisions about your startup journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            <AnimatedStat value="50" suffix="K+" label="Validated Ideas" delay={0} />
            <AnimatedStat value="2.5" suffix="K+" label="Expert Mentors" delay={200} />
            <AnimatedStat value="2.8" suffix="B+" label="Funding Raised" delay={400} />
            <AnimatedStat value="85" suffix="%" label="Success Rate" delay={600} />
            <AnimatedStat value="150" suffix="+" label="Industries" delay={800} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold text-indigo-400">StartupForge</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering entrepreneurs with AI-driven insights, expert mentorship, and trusted data to build successful startups.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-indigo-400 mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Idea Validation</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Mentor Network</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Data Analytics</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Funding Hub</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-indigo-400 mb-4">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Success Stories</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">API Documentation</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Help Center</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-indigo-400 mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © {new Date().getFullYear()} StartupForge. All rights reserved. Built with ❤️ for entrepreneurs.
            </p>
          </div>
        </div>
      </footer>

      {/* Welcome Modal */}
      {!visitedBefore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl text-center max-w-md mx-auto card-shadow pulse-animation">
            <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Welcome to StartupForge! 🚀</h2>
            <p className="text-gray-600 mb-6">
              Your journey from idea to successful startup begins here. Get AI-powered validation, connect with expert mentors, and access trusted data to build your dream company.
            </p>
            <button
              onClick={() => setVisitedBefore(true)}
              className="gradient-bg text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Let's Get Started!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupForge;