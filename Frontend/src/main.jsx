import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
  import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Users, 
  Brain, 
  Star, 
  Plus, 
  Search, 
  Filter, 
  MessageCircle, 
  TrendingUp,
  Award,
  User,
  Settings,
  Bell,
  ChevronRight,
  Heart,
  Share2,
  BookOpen,
  Code,
  Palette,
  Zap
} from 'lucide-react';

const IdeaForge = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data
  const ideas = [
    {
      id: 1,
      title: "AI-Powered Code Review Assistant",
      description: "An intelligent system that provides real-time code suggestions and identifies potential bugs using machine learning.",
      author: "Sarah Chen",
      category: "AI/ML",
      score: 8.7,
      likes: 142,
      comments: 23,
      trending: true,
      tags: ["AI", "Development", "Automation"],
      stage: "Prototype"
    },
    {
      id: 2,
      title: "Sustainable Urban Farming Platform",
      description: "IoT-enabled vertical farming solution for urban areas with automated nutrient monitoring.",
      author: "Marcus Rodriguez",
      category: "Sustainability",
      score: 9.2,
      likes: 298,
      comments: 45,
      trending: true,
      tags: ["IoT", "Agriculture", "Sustainability"],
      stage: "MVP"
    },
    {
      id: 3,
      title: "Blockchain-Based Learning Credentials",
      description: "Decentralized platform for verifying and storing educational achievements and skills.",
      author: "Aisha Patel",
      category: "Education",
      score: 7.9,
      likes: 87,
      comments: 12,
      trending: false,
      tags: ["Blockchain", "Education", "Credentials"],
      stage: "Concept"
    }
  ];

  const mentors = [
    {
      name: "Dr. Emily Watson",
      expertise: "AI/ML, Data Science",
      rating: 4}]}