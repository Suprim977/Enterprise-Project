import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// ===== MOCK DATA WITH UNICODE ICONS =====
const mockData = {
  kpiData: [
    { title: 'TOTAL LISTENERS', value: '15,000', change: '+3.2% vs 2024', icon: '👥' },
    { title: 'AVG DAILY PLAYS', value: '16.7', change: 'Per day avg', icon: '⏯️' },
    { title: 'COMPLETION RATE', value: '63.0%', change: '-1.2% vs 2024', icon: '✅' },
    { title: 'PREMIUM USERS', value: '7,500', change: '50% of total', icon: '⭐' },
    { title: 'TOP GENRE', value: 'Bollywood', change: '8.9% share', icon: '🎵' },
    { title: 'PEAK HOUR', value: '19:00', change: 'Highest activity', icon: '⏰' }
  ],
  yearlyTrendData: [
    { year: '2024', plays: 150000, color: '#4F46E5' },
    { year: '2025', plays: 180000, color: '#7C3AED' },
    { year: '2026', plays: 170000, color: '#EC4899' }
  ],
  genreData: [
    { name: 'Bollywood', value: 8.9 },
    { name: 'Classical Indian', value: 6.9 },
    { name: 'Adhunik Geet', value: 6.9 },
    { name: 'Ghazal', value: 6.8 },
    { name: 'Nepali Folk', value: 6.7 },
    { name: 'Lok Dohori', value: 5.8 },
    { name: 'Nepali Rock', value: 5.7 },
    { name: 'Others', value: 53.3 }
  ],
  areaData: [
    { area: 'Thamel', listeners: 1245 },
    { area: 'Patan', listeners: 1120 },
    { area: 'Bouddha', listeners: 980 },
    { area: 'Kalanki', listeners: 890 },
    { area: 'Balaju', listeners: 845 },
    { area: 'Lagankhel', listeners: 820 },
    { area: 'Chabahil', listeners: 790 },
    { area: 'Kirtipur', listeners: 760 },
    { area: 'Gaushala', listeners: 730 },
    { area: 'Swayambhu', listeners: 710 }
  ],
  platformData: [
    { name: 'Spotify', value: 10 },
    { name: 'JioSaavn', value: 10 },
    { name: 'Apple Music', value: 10 },
    { name: 'YouTube Music', value: 10 },
    { name: 'Others', value: 60 }
  ],
  highlightCards: [
    { title: 'HIGHEST LISTENER AREA', value: 'Thamel (1,245 listeners / 8.3%)', icon: '📍' },
    { title: 'SAFEST AREA', value: 'Patan (Lowest skip rate)', icon: '📈' },
    { title: 'MOST POPULAR GENRE', value: 'Bollywood (8.9%)', icon: '🎵' },
    { title: 'PEAK LISTENING DAY', value: 'Saturday (+12% vs weekday avg)', icon: '📅' }
  ],
  diagnosticAlerts: [
    {
      title: 'High Skip Rate Spike',
      description: '+8.3% in 2025; Correlated with new releases, low energy tracks.',
      icon: '⏭️',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30'
    },
    {
      title: 'Low Completion Rate',
      description: 'Only 63% songs completed; Genre: Lo-Fi (45%), K-Pop (52%).',
      icon: '🔉',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: 'Key Correlations',
      description: 'Strong relationships: Age 18-24 ↔ K-Pop (r=0.78), Premium ↔ Higher completion (r=0.65).',
      icon: '↗️',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Declining Categories',
      description: 'Indie (-12% since 2024), Acoustic (-8%).',
      icon: '📉',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/30'
    }
  ],
  genreCompletionData: [
    { genre: 'Bollywood', rate: 72 },
    { genre: 'Nepali Folk', rate: 68 },
    { genre: 'Classical Indian', rate: 65 },
    { genre: 'Adhunik Geet', rate: 64 },
    { genre: 'Ghazal', rate: 62 },
    { genre: 'Nepali Rock', rate: 58 },
    { genre: 'K-Pop', rate: 52 },
    { genre: 'Lo-Fi', rate: 45 }
  ],
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    plays: Math.floor(Math.random() * 1000) + (i === 19 ? 2000 : 0)
  })),
  seasonalData: [
    { season: 'Spring', value: 85 },
    { season: 'Monsoon', value: 95 },
    { season: 'Autumn', value: 90 },
    { season: 'Winter', value: 80 }
  ],
  rootCauseData: [
    { pattern: 'Summer Surge', impact: '+15% plays', cause: 'Increased indoor time', evidence: 'Weather correlation r=0.82' },
    { pattern: 'Weekend Spike', impact: '+12% plays', cause: 'Leisure time availability', evidence: 'Consistent across demographics' },
    { pattern: 'Monsoon Peak', impact: '+18% plays', cause: 'Rainy weather indoor activity', evidence: 'Seasonal analysis confirmed' },
    { pattern: 'Dashain Festival', impact: '+25% plays', cause: 'Family gatherings & celebrations', evidence: 'Annual recurring pattern' }
  ],
  forecastCards: [
    { title: '2026 LISTENER FORECAST', value: '18,750', detail: '+3.8% predicted increase — 82% confidence', icon: '🔮' },
    { title: 'HIGHEST RISK AREA', value: 'Thamel', detail: '1,000 predicted listeners — 78% confidence', icon: '⚠️' },
    { title: 'PEAK RISK PERIOD', value: 'July 2026', detail: 'Peak listener activity — 85% confidence', icon: '⏳' },
    { title: 'EXPECTED DECLINE', value: 'Indie genre', detail: '-8% predicted decline — 75% confidence', icon: '📉' }
  ],
  listenerForecastData: [
    { period: '2024-Q1', actual: 35000, forecast: null },
    { period: '2024-Q2', actual: 38000, forecast: null },
    { period: '2024-Q3', actual: 42000, forecast: null },
    { period: '2024-Q4', actual: 35000, forecast: null },
    { period: '2025-Q1', actual: 40000, forecast: null },
    { period: '2025-Q2', actual: 45000, forecast: null },
    { period: '2025-Q3', actual: 50000, forecast: null },
    { period: '2025-Q4', actual: 45000, forecast: null },
    { period: '2026-Q1', actual: null, forecast: 42000, lower: 38000, upper: 46000 },
    { period: '2026-Q2', actual: null, forecast: 48000, lower: 44000, upper: 52000 },
    { period: '2026-Q3', actual: null, forecast: 52000, lower: 48000, upper: 56000 },
    { period: '2026-Q4', actual: null, forecast: 45000, lower: 41000, upper: 49000 }
  ],
  genreRiskData: [
    { genre: 'K-Pop', change: 12, color: '#10B981' },
    { genre: 'Nepali Pop', change: 8, color: '#10B981' },
    { genre: 'EDM', change: 6, color: '#10B981' },
    { genre: 'Bollywood', change: 3, color: '#10B981' },
    { genre: 'Nepali Rock', change: -2, color: '#EF4444' },
    { genre: 'Indie', change: -8, color: '#EF4444' },
    { genre: 'Acoustic', change: -12, color: '#EF4444' }
  ],
  areaRiskData: [
    { area: 'Swayambhu', score: 85 },
    { area: 'Thamel', score: 82 },
    { area: 'Patan', score: 78 },
    { area: 'Bouddha', score: 75 },
    { area: 'Kalanki', score: 72 },
    { area: 'Balaju', score: 68 },
    { area: 'Lagankhel', score: 65 },
    { area: 'Chabahil', score: 62 }
  ],
  modelPerformanceData: [
    { subject: 'Accuracy', hotspot: 85, category: 78 },
    { subject: 'Precision', hotspot: 82, category: 75 },
    { subject: 'Recall', hotspot: 79, category: 72 },
    { subject: 'F1 Score', hotspot: 81, category: 74 },
    { subject: 'AUC', hotspot: 88, category: 82 }
  ],
  aiPredictions: [
    { title: "New Year's Eve", detail: '+45% spike predicted', icon: '🎆', color: 'bg-sky-500/20 text-sky-400' },
    { title: 'Emerging Hotspot', detail: 'Swayambhu (+15% growth)', icon: '📍', color: 'bg-emerald-500/20 text-emerald-400' },
    { title: 'New Release Surge', detail: 'Q3 2026 launches', icon: '🚀', color: 'bg-violet-500/20 text-violet-400' },
    { title: 'Skip Rate Surge', detail: 'Lo-Fi genre alert', icon: '⚠️', color: 'bg-rose-500/20 text-rose-400' },
    { title: 'Declining Genre', detail: 'Indie (-8% predicted)', icon: '📉', color: 'bg-amber-500/20 text-amber-400' },
    { title: 'Peak Risk Time', detail: 'Friday 19:00', icon: '⏰', color: 'bg-indigo-500/20 text-indigo-400' }
  ],
  interventionCards: [
    { title: 'Targeted Premium Offers', icon: '💎', impact: '-15% churn rate' },
    { title: 'Personalized Playlists', icon: '🎧', impact: '+22% engagement' },
    { title: 'Family Plan Expansion', icon: '👨‍👩‍👧‍👦', impact: '+18% conversion' },
    { title: 'Localized Content Strategy', icon: '🌐', impact: '+25% retention' },
    { title: 'Community Engagement', icon: '💬', impact: '-12% skip rate' }
  ],
  recommendations: [
    {
      title: 'Predictive Playlist Optimization',
      description: 'Deploy playlists to hotspots (Thamel, Patan)',
      impact: '-18% skip rate',
      icon: '🎯'
    },
    {
      title: 'AI-Powered Genre Recognition',
      description: 'Expand AI-powered genre recognition for better recommendations',
      impact: '+25% completion rate',
      icon: '🤖'
    },
    {
      title: 'Night Time Economy Strategy',
      description: 'Dedicated night teams for high-engagement areas',
      impact: '-22% night-time skip rate',
      icon: '🌙'
    },
    {
      title: 'Community Engagement Program',
      description: 'Neighborhood watch for high-risk areas',
      impact: '-12% anti-social behavior (low engagement)',
      icon: '🏘️'
    }
  ],
  costBenefitData: [
    { strategy: 'Premium Offers', cost: 65, benefit: 85 },
    { strategy: 'Playlist Optimization', cost: 45, benefit: 78 },
    { strategy: 'Family Plan Expansion', cost: 55, benefit: 82 },
    { strategy: 'Localized Content', cost: 70, benefit: 90 },
    { strategy: 'Community Engagement', cost: 40, benefit: 72 }
  ],
  geographicData: [
    { area: 'Thamel', density: 95, listeners: 1245, topGenre: 'Bollywood' },
    { area: 'Patan', density: 88, listeners: 1120, topGenre: 'Adhunik Geet' },
    { area: 'Bouddha', density: 82, listeners: 980, topGenre: 'Nepali Folk' },
    { area: 'Swayambhu', density: 78, listeners: 710, topGenre: 'K-Pop' },
    { area: 'Kalanki', density: 75, listeners: 890, topGenre: 'EDM' },
    { area: 'Balaju', density: 72, listeners: 845, topGenre: 'Nepali Rock' },
    { area: 'Lagankhel', density: 68, listeners: 820, topGenre: 'Classical Indian' },
    { area: 'Chabahil', density: 65, listeners: 790, topGenre: 'Ghazal' }
  ],
  monthlyTrendData: [
    { month: 'Jan', plays: 12000, likes: 1800 },
    { month: 'Feb', plays: 11500, likes: 1725 },
    { month: 'Mar', plays: 13000, likes: 1950 },
    { month: 'Apr', plays: 12500, likes: 1875 },
    { month: 'May', plays: 14000, likes: 2100 },
    { month: 'Jun', plays: 15000, likes: 2250 },
    { month: 'Jul', plays: 18000, likes: 2700 },
    { month: 'Aug', plays: 19000, likes: 2850 },
    { month: 'Sep', plays: 16000, likes: 2400 },
    { month: 'Oct', plays: 17000, likes: 2550 },
    { month: 'Nov', plays: 14500, likes: 2175 },
    { month: 'Dec', plays: 13500, likes: 2025 }
  ],
  dayOfWeekData: [
    { day: 'Monday', plays: 65000 },
    { day: 'Tuesday', plays: 68000 },
    { day: 'Wednesday', plays: 70000 },
    { day: 'Thursday', plays: 72000 },
    { day: 'Friday', plays: 78000 },
    { day: 'Saturday', plays: 88000 },
    { day: 'Sunday', plays: 82000 }
  ],
  festivalImpactData: [
    { event: 'Dashain', impact: 25, month: 'Oct' },
    { event: 'Tihar', impact: 22, month: 'Nov' },
    { event: 'Holi', impact: 15, month: 'Mar' },
    { event: 'Teej', impact: 12, month: 'Aug' },
    { event: 'New Year', impact: 18, month: 'Jan' }
  ],
  weatherImpactData: [
    { condition: 'Sunny', plays: 12000, completion: 65 },
    { condition: 'Rainy', plays: 18000, completion: 72 },
    { condition: 'Foggy', plays: 14000, completion: 68 },
    { condition: 'Cloudy', plays: 13000, completion: 64 }
  ]
};

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F43F5E', '#06B6D4', '#10B981', '#F59E0B', '#64748B'];

// ===== HELPER COMPONENTS =====
const renderKPI = (item) => {
  return (
    <motion.div 
      key={item.title} 
      className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80 hover:border-slate-600 transition-all duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl text-indigo-400">{item.icon}</span>
        <span className="text-xs font-medium text-slate-400">{item.change}</span>
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{item.title}</h3>
      <p className="text-white text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">{item.value}</p>
    </motion.div>
  );
};

const renderHighlightCard = (card) => {
  return (
    <motion.div 
      key={card.title} 
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 hover:border-slate-600 transition-all duration-300"
      whileHover={{ x: 5 }}
    >
      <div className="flex items-start space-x-3">
        <span className="text-xl text-emerald-400 mt-0.5 shrink-0">{card.icon}</span>
        <div>
          <h4 className="text-slate-400 text-sm font-medium">{card.title}</h4>
          <p className="text-white text-sm font-medium">{card.value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ===== TAB COMPONENTS =====
const OverviewTab = ({ data }) => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Descriptive Analytics Overview
        </h2>
        <p className="text-slate-400 mt-2">What happened? Listener statistics across Kathmandu 2024–2026</p>
      </div>
      <motion.span 
        className="px-4 py-2 bg-rose-500/15 text-rose-400 rounded-full text-sm font-medium border border-rose-500/30 flex items-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      >
        <span className="animate-pulse inline-block w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
        LIVE DATA STREAMING
      </motion.span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.kpiData.map(renderKPI)}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-indigo-400 text-xl mr-2">📊</span>
          Listener Trend by Year
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.yearlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              labelStyle={{ color: '#94a3b8' }} 
              cursor={{ fill: 'rgba(56, 189, 248, 0.2)' }}
            />
            <Bar dataKey="plays" radius={[8, 8, 0, 0]}>
              {data.yearlyTrendData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={entry.color.replace('400', '300')}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-indigo-400 text-xl mr-2">🥧</span>
          Genre Distribution
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data.genreData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.genreData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="rgba(0,0,0,0.2)"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                color: '#0f172a'
              }} 
              formatter={(value) => [`${value}%`, 'Market Share']} 
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
              wrapperStyle={{ 
                paddingTop: '20px',
                color: '#94a3b8'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-indigo-400 text-xl mr-2">🗺️</span>
          Top 10 Areas by Listener Count
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.areaData} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              dataKey="area" 
              type="category" 
              stroke="#94a3b8" 
              width={100}
              tick={{ fill: '#cbd5e1', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              cursor={{ fill: 'rgba(236, 72, 153, 0.2)' }}
            />
            <Bar dataKey="listeners" fill="#EC4899" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-indigo-400 text-xl mr-2">📱</span>
          Platform Usage
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data.platformData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.platformData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="rgba(0,0,0,0.2)"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                color: '#0f172a'
              }} 
              formatter={(value) => [`${value}%`, 'Market Share']} 
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
              wrapperStyle={{ 
                paddingTop: '20px',
                color: '#94a3b8'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.highlightCards.map(renderHighlightCard)}
    </div>
  </div>
);

const DiagnosticTab = ({ data }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-rose-500">
        Diagnostic Analytics
      </h2>
      <p className="text-slate-400 mt-2">Why did it happen? Root cause analysis & correlations</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.diagnosticAlerts.map((alert, index) => (
        <motion.div 
          key={index} 
          className={`${alert.bg} rounded-2xl p-5 border-l-4 ${alert.color.replace('text', 'border')}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className={`text-2xl ${alert.color} mb-3 block`}>{alert.icon}</span>
          <h4 className={`${alert.color} font-bold text-base mb-2`}>{alert.title}</h4>
          <p className="text-slate-200 text-sm leading-relaxed">{alert.description}</p>
        </motion.div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-amber-400 text-xl mr-2">🔄</span>
          Year-over-Year Change by Genre
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.genreData.slice(0, 7)} margin={{ top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              height={80} 
              angle={-45} 
              textAnchor="end"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={[-15, 15]} 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [`${value}%`, 'Change']} 
              cursor={{ fill: 'rgba(16, 185, 129, 0.2)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.genreData.slice(0, 7).map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 0 ? '#10B981' : '#EF4444'} 
                  stroke={entry.value > 0 ? '#059669' : '#dc2626'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-emerald-400 text-xl mr-2">✅</span>
          Completion Rate by Genre
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.genreCompletionData} margin={{ top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="genre" 
              stroke="#94a3b8" 
              height={80} 
              angle={-45} 
              textAnchor="end"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={[0, 100]} 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [`${value}%`, 'Completion Rate']} 
              cursor={{ fill: 'rgba(79, 70, 229, 0.2)' }}
            />
            <Bar dataKey="rate" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-cyan-400 text-xl mr-2">⏰</span>
          Listening Time of Day
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.hourlyData} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="hour" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              cursor={{ fill: 'rgba(79, 70, 229, 0.2)' }}
            />
            <Line 
              type="monotone" 
              dataKey="plays" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-violet-400 text-xl mr-2">🌀</span>
          Seasonal Listening Patterns
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.seasonalData}>
            <PolarGrid stroke="rgba(56, 189, 248, 0.2)" />
            <PolarAngleAxis 
              dataKey="season" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
            />
            <Radar 
              name="Listening Index" 
              dataKey="value" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
              fillOpacity={0.6} 
              dot={{ r: 4, fill: '#c084fc' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(139, 92, 246, 0.4)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [`${value}`, 'Index']} 
            />
            <Legend 
              formatter={() => <span className="text-slate-300">Listening Index</span>}
              wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-rose-400 text-xl mr-2">🔍</span>
        Root Cause Analysis Table
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/80">
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Pattern</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Impact</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Root Cause</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {data.rootCauseData.map((row, index) => (
              <tr 
                key={index} 
                className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4 text-white font-medium">{row.pattern}</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">{row.impact}</td>
                <td className="py-3 px-4 text-slate-200">{row.cause}</td>
                <td className="py-3 px-4 text-slate-300">{row.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PredictiveTab = ({ data }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
        Predictive Analytics
      </h2>
      <p className="text-slate-400 mt-2">What will happen? Forecast & risk predictions for 2026</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.forecastCards.map((card, index) => (
        <motion.div 
          key={index} 
          className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/80"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-2xl text-cyan-400 mb-3 block">{card.icon}</span>
          <h4 className="text-slate-400 font-medium text-sm mb-1">{card.title}</h4>
          <p className="text-white font-bold text-2xl mb-2">{card.value}</p>
          <p className="text-slate-400 text-xs">{card.detail}</p>
        </motion.div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-blue-400 text-xl mr-2">🔮</span>
          Listener Forecast 2026
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.listenerForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="period" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }}
              formatter={(value, name) => {
                if (name === 'actual') return [value.toLocaleString(), 'Actual'];
                if (name === 'forecast') return [value.toLocaleString(), 'Forecast'];
                return [value, name];
              }}
              cursor={{ fill: 'rgba(16, 185, 129, 0.2)' }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#3B82F6" 
              fill="url(#actualGradient)" 
              fillOpacity={0.3} 
              name="Actual" 
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              stroke="#10B981" 
              fill="url(#forecastGradient)" 
              fillOpacity={0.3} 
              name="Forecast" 
            />
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-rose-400 text-xl mr-2">⚠️</span>
          Genre Risk Assessment
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.genreRiskData} margin={{ top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="genre" 
              stroke="#94a3b8" 
              height={80} 
              angle={-45} 
              textAnchor="end"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={[-15, 15]} 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [`${value}%`, 'Predicted Change']} 
              cursor={{ fill: 'rgba(239, 68, 68, 0.2)' }}
            />
            <Bar dataKey="change" radius={[4, 4, 0, 0]}>
              {data.genreRiskData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={entry.color.replace('400', '300')}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-amber-400 text-xl mr-2">🗺️</span>
          Area Risk Scores
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.areaRiskData} margin={{ top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="area" 
              stroke="#94a3b8" 
              height={80} 
              angle={-45} 
              textAnchor="end"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={[0, 100]} 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [`${value}`, 'Risk Score']} 
              cursor={{ fill: 'rgba(245, 158, 11, 0.2)' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.areaRiskData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score > 75 ? '#10B981' : entry.score > 65 ? '#F59E0B' : '#EF4444'} 
                  stroke={entry.score > 75 ? '#059669' : entry.score > 65 ? '#d97706' : '#dc2626'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-indigo-400 text-xl mr-2">🤖</span>
          Model Performance Validation
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.modelPerformanceData}>
            <PolarGrid stroke="rgba(56, 189, 248, 0.2)" />
            <PolarAngleAxis 
              dataKey="subject" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
            />
            <Radar 
              name="Hotspot Model" 
              dataKey="hotspot" 
              stroke="#4F46E5" 
              fill="#4F46E5" 
              fillOpacity={0.6} 
              dot={{ r: 4, fill: '#818cf8' }}
            />
            <Radar 
              name="Category Model" 
              dataKey="category" 
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6} 
              dot={{ r: 4, fill: '#34d399' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(79, 70, 229, 0.4)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
            />
            <Legend 
              formatter={(value) => <span className="text-slate-300">{value}</span>}
              wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-violet-400 text-xl mr-2">🧠</span>
        AI-Powered Predictions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.aiPredictions.map((prediction, index) => (
          <motion.div 
            key={index} 
            className={`${prediction.color} rounded-xl p-5 border border-opacity-30`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-xl">{prediction.icon}</span>
              <h4 className="font-bold text-lg">{prediction.title}</h4>
            </div>
            <p className="text-sm opacity-90">{prediction.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const PrescriptiveTab = ({ data }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-fuchsia-500">
        Prescriptive Analytics
      </h2>
      <p className="text-slate-400 mt-2">What should we do? Evidence-based listener engagement recommendations</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      {data.interventionCards.map((card, index) => (
        <motion.div 
          key={index} 
          className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/80 text-center"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-3xl text-fuchsia-400 mx-auto mb-3 block">{card.icon}</span>
          <h4 className="text-slate-300 font-medium text-sm mb-2">{card.title}</h4>
          <p className="text-emerald-400 text-xs font-bold">{card.impact}</p>
        </motion.div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
      {data.recommendations.map((rec, index) => (
        <motion.div 
          key={index} 
          className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start space-x-5">
            <div className="bg-indigo-500/20 p-4 rounded-xl flex-shrink-0">
              <span className="text-2xl text-indigo-400">{rec.icon}</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-xl mb-3">{rec.title}</h4>
              <p className="text-slate-300 mb-4 leading-relaxed">{rec.description}</p>
              <div className="inline-flex items-center bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
                <span className="text-lg mr-2">↗️</span>
                {rec.impact}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-amber-400 text-xl mr-2">⚖️</span>
        Cost-Benefit Analysis
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data.costBenefitData} margin={{ top: 20, bottom: 40, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
          <XAxis 
            dataKey="strategy" 
            stroke="#94a3b8" 
            height={80} 
            angle={-45} 
            textAnchor="end"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis 
            stroke="#94a3b8" 
            domain={[0, 100]} 
            tick={{ fill: '#cbd5e1' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(56, 189, 248, 0.3)', 
              borderRadius: '12px',
              color: '#f1f5f9'
            }} 
            cursor={{ fill: 'rgba(245, 158, 11, 0.2)' }}
          />
          <Legend 
            formatter={(value) => <span className="text-slate-300">{value}</span>}
            wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }}
          />
          <Bar dataKey="cost" name="Implementation Cost" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="benefit" name="Expected Benefit" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const GeographicTab = ({ data }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Geographic Analytics
      </h2>
      <p className="text-slate-400 mt-2">Interactive map of Kathmandu Valley listener density and insights</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-blue-400 mb-3 block">🗺️</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Total Areas Covered</h4>
        <p className="text-white font-bold text-2xl">49</p>
      </div>
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-emerald-400 mb-3 block">📍</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Highest Density Area</h4>
        <p className="text-white font-bold text-2xl">Thamel</p>
      </div>
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-violet-400 mb-3 block">🎵</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Most Popular Genre</h4>
        <p className="text-white font-bold text-2xl">Bollywood</p>
      </div>
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-amber-400 mb-3 block">📈</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Emerging Hotspot</h4>
        <p className="text-white font-bold text-2xl">Swayambhu</p>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-blue-400 text-xl mr-2">📊</span>
        Top Areas by Listener Density
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/80">
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Area</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Listener Density</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Total Listeners</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Top Genre</th>
              <th className="text-left py-3 px-4 text-slate-300 font-bold">Growth Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.geographicData.map((area, index) => (
              <tr 
                key={index} 
                className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4 text-white font-medium">{area.area}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-full bg-slate-700 rounded-full h-2.5 mr-3">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${area.density}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm font-medium">{area.density}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-white font-medium">{area.listeners.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-300">{area.topGenre}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    index === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                    index === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                    index === 2 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {index === 0 ? '+15%' : index === 1 ? '+12%' : index === 2 ? '+8%' : '+5%'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-indigo-400 text-xl mr-2">🎭</span>
          Genre Distribution by Area
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.geographicData.slice(0, 6)} margin={{ top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="area" 
              stroke="#94a3b8" 
              height={80} 
              angle={-45} 
              textAnchor="end"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              cursor={{ fill: 'rgba(79, 70, 229, 0.2)' }}
            />
            <Bar dataKey="listeners" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-amber-400 text-xl mr-2">👥</span>
          Premium vs Free by Area
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Premium', value: 7500 },
                { name: 'Free', value: 7500 }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              nameKey="name"
            >
              <Cell fill="#10B981" stroke="#059669" />
              <Cell fill="#F59E0B" stroke="#d97706" />
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                color: '#0f172a'
              }} 
            />
            <Legend 
              formatter={(value) => <span className="text-slate-300">{value}</span>}
              wrapperStyle={{ 
                paddingTop: '20px',
                color: '#94a3b8'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const TemporalTab = ({ data }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
        Temporal Analytics
      </h2>
      <p className="text-slate-400 mt-2">Monthly/weekly trends with time filters and seasonal patterns</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-blue-400 mb-3 block">📅</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Peak Month</h4>
        <p className="text-white font-bold text-2xl">August</p>
      </div>
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-emerald-400 mb-3 block">📆</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Peak Day</h4>
        <p className="text-white font-bold text-2xl">Saturday</p>
      </div>
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-violet-400 mb-3 block">⏰</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Peak Hour</h4>
        <p className="text-white font-bold text-2xl">19:00</p>
      </div>
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <span className="text-3xl text-amber-400 mb-3 block">⭐</span>
        <h4 className="text-slate-400 font-medium text-sm mb-1">Festival Impact</h4>
        <p className="text-white font-bold text-2xl">+25%</p>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-cyan-400 text-xl mr-2">📈</span>
        Monthly Listening Trends (2024-2026)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data.monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#94a3b8" 
            tick={{ fill: '#cbd5e1' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#cbd5e1' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(56, 189, 248, 0.3)', 
              borderRadius: '12px',
              color: '#f1f5f9'
            }} 
            cursor={{ fill: 'rgba(79, 70, 229, 0.2)' }}
          />
          <Legend 
            formatter={(value) => <span className="text-slate-300">{value}</span>}
            wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }}
          />
          <Area 
            type="monotone" 
            dataKey="plays" 
            name="Total Plays" 
            stroke="#4F46E5" 
            fill="url(#playsGradient)" 
            fillOpacity={0.3} 
          />
          <Area 
            type="monotone" 
            dataKey="likes" 
            name="Likes" 
            stroke="#10B981" 
            fill="url(#likesGradient)" 
            fillOpacity={0.3} 
          />
          <defs>
            <linearGradient id="playsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-emerald-400 text-xl mr-2">🗓️</span>
          Listening by Day of Week
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.dayOfWeekData} margin={{ top: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [value.toLocaleString(), 'Plays']} 
              cursor={{ fill: 'rgba(16, 185, 129, 0.2)' }}
            />
            <Bar dataKey="plays" radius={[4, 4, 0, 0]}>
              {data.dayOfWeekData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.day === 'Saturday' ? '#10B981' : '#4F46E5'} 
                  stroke={entry.day === 'Saturday' ? '#059669' : '#4338ca'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-5 flex items-center">
          <span className="text-rose-400 text-xl mr-2">🎉</span>
          Festival Impact on Listening
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.festivalImpactData} margin={{ top: 20, bottom: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
            <XAxis 
              dataKey="event" 
              stroke="#94a3b8" 
              height={80} 
              angle={-45} 
              textAnchor="end"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={[0, 30]} 
              tick={{ fill: '#cbd5e1' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(56, 189, 248, 0.3)', 
                borderRadius: '12px',
                color: '#f1f5f9'
              }} 
              formatter={(value) => [`${value}%`, 'Impact']} 
              cursor={{ fill: 'rgba(244, 63, 94, 0.2)' }}
            />
            <Bar dataKey="impact" fill="#F43F5E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-sky-400 text-xl mr-2">🌦️</span>
        Weather Impact on Listening Behavior
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data.weatherImpactData} layout="vertical" margin={{ left: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" horizontal={false} />
          <XAxis 
            type="number" 
            stroke="#94a3b8" 
            tick={{ fill: '#cbd5e1' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis 
            dataKey="condition" 
            type="category" 
            stroke="#94a3b8" 
            width={90}
            tick={{ fill: '#cbd5e1', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(56, 189, 248, 0.3)', 
              borderRadius: '12px',
              color: '#f1f5f9'
            }} 
            cursor={{ fill: 'rgba(79, 70, 229, 0.2)' }}
          />
          <Legend 
            formatter={(value) => <span className="text-slate-300">{value}</span>}
            wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }}
          />
          <Bar dataKey="plays" name="Total Plays" fill="#4F46E5" radius={[0, 4, 4, 0]} />
          <Bar dataKey="completion" name="Completion Rate (%)" fill="#10B981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/80">
      <h3 className="text-white font-bold text-xl mb-5 flex items-center">
        <span className="text-amber-400 text-xl mr-2">🌅</span>
        Time of Day Listening Patterns
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { period: 'Morning (6-12)', plays: 85000, icon: '☀️' },
          { period: 'Afternoon (12-17)', plays: 92000, icon: '🌤️' },
          { period: 'Evening (17-22)', plays: 145000, icon: '🌆' },
          { period: 'Night (22-6)', plays: 78000, icon: '🌙' }
        ].map((period, index) => (
          <motion.div 
            key={index} 
            className="bg-slate-800/50 rounded-xl p-5 text-center border border-slate-700/70 hover:border-slate-600 transition-all"
            whileHover={{ y: -3 }}
          >
            <span className="text-3xl text-amber-400 mx-auto mb-3 block">{period.icon}</span>
            <h4 className="text-slate-300 text-sm font-medium mb-2">{period.period}</h4>
            <p className="text-white font-bold text-2xl">{period.plays.toLocaleString()}</p>
            <p className="text-slate-400 text-xs mt-1">total plays</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const ModelDescriptionTab = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
          Model Description & Methodology
        </h2>
        <p className="text-slate-400 mt-3 max-w-3xl mx-auto">
          Detailed explanation of all calculations, formulas, and analytical methods used in this dashboard
        </p>
      </div>
      
      {/* Table of Contents */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-xl mb-6 text-center">TABLE OF CONTENTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-indigo-400 font-bold text-lg mb-3 flex items-center">
              <span className="text-xl mr-2">1️⃣</span>
              Descriptive Metrics
            </h4>
            <ul className="text-slate-300 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">•</span>
                <span>Total Listener Count</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">•</span>
                <span>Average Daily Plays</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">•</span>
                <span>Completion Rate Calculation</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-1">•</span>
                <span>Genre Distribution</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-emerald-400 font-bold text-lg mb-3 flex items-center">
              <span className="text-xl mr-2">2️⃣</span>
              Diagnostic Analytics
            </h4>
            <ul className="text-slate-300 space-y-2">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Year-over-Year Change</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Correlation Coefficient</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Engagement Score Formula</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Weekend Spike Analysis</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-rose-400 font-bold text-lg mb-3 flex items-center">
              <span className="text-xl mr-2">3️⃣</span>
              Predictive Models
            </h4>
            <ul className="text-slate-300 space-y-2">
              <li className="flex items-start">
                <span className="text-rose-400 mr-2 mt-1">•</span>
                <span>Listener Forecasting</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-400 mr-2 mt-1">•</span>
                <span>Genre Risk Assessment</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-400 mr-2 mt-1">•</span>
                <span>Confidence Intervals</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-400 mr-2 mt-1">•</span>
                <span>Model Performance Metrics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 1. Descriptive Metrics */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
          <span className="text-indigo-400 text-2xl mr-3">📊</span>
          1. Descriptive Metrics & Calculations
        </h3>
        
        {/* 1.1 Total Listener Count */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-indigo-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-1"></span>
            1.1 Total Listener Count
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            The total number of unique listeners across Kathmandu Valley during the analysis period.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Total Listeners = COUNT(DISTINCT listener_id)
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Step-by-Step Calculation:</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Collect listener records from all 49 Kathmandu Valley areas.</li>
              <li className="list-decimal">Remove duplicates based on <code className="text-cyan-300">listener_id</code>.</li>
              <li className="list-decimal">Count remaining unique IDs: 15,000 total listeners.</li>
            </ol>
          </div>
        </div>
        
        {/* 1.2 Average Daily Plays */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-indigo-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-1"></span>
            1.2 Average Daily Plays
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            The mean number of plays per listener per day across the entire analysis period.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Average Daily Plays = Total Plays / (Number of Days × Number of Listeners)
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Step-by-Step Calculation:</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Total plays in dataset: 8,235,000</li>
              <li className="list-decimal">Analysis period: 365 days (Jan 2024 – Dec 2024)</li>
              <li className="list-decimal">Number of listeners: 15,000</li>
              <li className="list-decimal">Calculation: 8,235,000 ÷ (365 × 15,000) = 16.7 plays/day/listener</li>
            </ol>
          </div>
        </div>
        
        {/* 1.3 Completion Rate */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-indigo-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-1"></span>
            1.3 Completion Rate
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            The percentage of songs played to completion (≥95% of track length).
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Completion Rate (%) = (Completed Plays / Total Plays) × 100
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Step-by-Step Calculation:</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Completed plays: 5,200,000</li>
              <li className="list-decimal">Total plays: 8,235,000</li>
              <li className="list-decimal">Calculation: (5,200,000 ÷ 8,235,000) × 100 = 63.0%</li>
            </ol>
          </div>
        </div>
        
        {/* 1.4 Genre Distribution */}
        <div>
          <h4 className="text-indigo-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-1"></span>
            1.4 Genre Distribution
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Calculating the proportion of each genre relative to the total.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Genre Percentage = (Genre Count / Total Plays) × 100
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: Bollywood Percentage</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Bollywood plays: 730,000</li>
              <li className="list-decimal">Total plays: 8,235,000</li>
              <li className="list-decimal">Calculation: (730,000 ÷ 8,235,000) × 100 = 8.9%</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">Bollywood = 8.9% of all plays</span></li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* 2. Diagnostic Analytics */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
          <span className="text-emerald-400 text-2xl mr-3">🔍</span>
          2. Diagnostic Analytics & Root Cause Analysis
        </h3>
        
        {/* 2.1 Year-over-Year Change */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-emerald-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-1"></span>
            2.1 Year-over-Year (YoY) Change
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Measures the percentage change in listens between two consecutive years to identify trends.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              YoY Change (%) = ((Current Year - Previous Year) / Previous Year) × 100
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: Total Listens YoY (2024 to 2025)</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">2025 listens: 50,456</li>
              <li className="list-decimal">2024 listens: 48,234</li>
              <li className="list-decimal">Difference: 50,456 - 48,234 = 2,222</li>
              <li className="list-decimal">Calculation: (2,222 ÷ 48,234) × 100 = 4.6%</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">+4.6% increase in 2025</span></li>
            </ol>
          </div>
        </div>
        
        {/* 2.2 Correlation Coefficient (Pearson's r) */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-emerald-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-1"></span>
            2.2 Correlation Coefficient (Pearson's r)
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Measures the strength and direction of the linear relationship between two variables. Values range from -1 (perfect negative) to +1 (perfect positive).
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula (Pearson's r):</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              r = Σ[(xᵢ - x̄)(yᵢ - ȳ)] / √[Σ(xᵢ - x̄)² × Σ(yᵢ - ȳ)²]
            </pre>
            <p className="text-slate-400 text-sm mt-2">where x̄ = mean of x, ȳ = mean of y</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Interpretation Guide:</span>
            </div>
            <table className="w-full text-sm text-slate-300 mt-3">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-2 px-3 text-left font-medium">r value</th>
                  <th className="py-2 px-3 text-left font-medium">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3">0.7 to 1.0</td>
                  <td className="py-2 px-3">Strong positive correlation</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3">0.4 to 0.7</td>
                  <td className="py-2 px-3">Moderate positive correlation</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3">0.0 to 0.4</td>
                  <td className="py-2 px-3">Weak positive correlation</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">-1.0 to 0.0</td>
                  <td className="py-2 px-3">Negative correlation (inverse)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Key Correlations Found:</span>
            </div>
            <ul className="text-slate-300 space-y-2 pl-6">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Age 18-24 ↔ K-Pop: r = 0.78 — Strong — Higher youth engagement with K-Pop</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Premium ↔ Higher completion: r = 0.65 — Moderate — Premium users listen more attentively</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2 mt-1">•</span>
                <span>Weather (Rainy) ↔ Evening listening: r = 0.62 — Moderate — Rain drives indoor evening activity</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 2.3 Engagement Score Formula */}
        <div>
          <h4 className="text-emerald-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-1"></span>
            2.3 Engagement Score Formula
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            A composite score (0–1) that combines passive and active listening signals to measure user engagement.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Engagement Score = min(1, (completion_rate / 100) + (liked × 0.3) + 
                                     (added_to_playlist × 0.2) + (repeated × 0.1))
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: High Engagement User</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Completion rate: 95% → 0.95</li>
              <li className="list-decimal">Liked: TRUE → 0.3</li>
              <li className="list-decimal">Added to playlist: TRUE → 0.2</li>
              <li className="list-decimal">Repeated: FALSE → 0.0</li>
              <li className="list-decimal">Sum: 0.95 + 0.3 + 0.2 + 0.0 = 1.45 → Clamped to 1.0</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">Engagement Score = 1.0 (Maximum)</span></li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* 3. Predictive Models */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
          <span className="text-rose-400 text-2xl mr-3">🔮</span>
          3. Predictive Analytics & Forecasting Models
        </h3>
        
        {/* 3.1 Listener Forecasting (ETS) */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-rose-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 mt-1"></span>
            3.1 Listener Forecasting (ETS)
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Uses Exponential Smoothing with Seasonal Adjustment (ETS) to project future listener counts based on historical trend and seasonality.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula (ETS):</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Forecast = Trend + Seasonal + Residual
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              Where Trend = smoothed level, Seasonal = repeating pattern, Residual = noise
            </p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">2026 Forecast Calculation:</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Historical data points: 2024 (48,234), 2025 (50,456), 2026 (projected)</li>
              <li className="list-decimal">Calculate average YoY increase: (50,456 - 48,234) / 2 = 1,111 per year</li>
              <li className="list-decimal">Apply to 2025 base: 50,456 + 1,111 = 51,567</li>
              <li className="list-decimal">Add seasonal adjustment (based on Q3 peak): + 3,183</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">54,750 predicted listeners for 2026 (+3.8%)</span></li>
            </ol>
          </div>
        </div>
        
        {/* 3.2 Genre Risk Assessment */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-rose-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 mt-1"></span>
            3.2 Genre Risk Assessment
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Quantifies risk by calculating 6-month rolling percentage change and volatility thresholds.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Risk Score = Rolling 6-Month % Change
            </pre>
            <p className="text-slate-400 text-sm mt-2">Threshold: ±5% sustained change triggers alert</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: Indie Genre Risk</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Jan 2025: 12,000 plays</li>
              <li className="list-decimal">Jul 2025: 10,000 plays</li>
              <li className="list-decimal">% Change: (10,000 - 12,000) / 12,000 × 100 = -16.7%</li>
              <li className="list-decimal">Result: <span className="text-rose-400">Indie genre flagged as high risk (-16.7%)</span></li>
            </ol>
          </div>
        </div>
        
        {/* 3.3 Confidence Intervals */}
        <div>
          <h4 className="text-rose-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 mt-1"></span>
            3.3 Confidence Intervals
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Range of values within which the true future value is likely to fall, based on historical variance (95% confidence).
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula (95% CI):</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              CI = Forecast ± (1.96 × σ)
            </pre>
            <p className="text-slate-400 text-sm mt-2">where σ = standard deviation of residuals</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: July 2026 Confidence Interval</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Forecast (ŷ): 5,450 plays</li>
              <li className="list-decimal">Standard deviation (σ): 200 plays</li>
              <li className="list-decimal">Margin of error: 1.96 × 200 = 392</li>
              <li className="list-decimal">Lower bound: 5,450 - 392 = 5,058</li>
              <li className="list-decimal">Upper bound: 5,450 + 392 = 5,842</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">95% CI = [5,058 to 5,842]</span></li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* 4. Prescriptive Analytics */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
          <span className="text-amber-400 text-2xl mr-3">💡</span>
          4. Prescriptive Analytics & Impact Calculations
        </h3>
        
        {/* 4.1 Expected Impact Calculation */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-amber-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1"></span>
            4.1 Expected Impact Calculation
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Estimates the listener retention potential of interventions based on research evidence and effect sizes.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Expected Retention = Baseline Listeners × Effect Size × Coverage Rate
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: Playlist Optimization Impact</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Baseline listeners in target areas: 15,000</li>
              <li className="list-decimal">Research-based effect size: 25% increase in retention</li>
              <li className="list-decimal">Coverage rate: 70% of high-risk areas targeted</li>
              <li className="list-decimal">Calculation: 15,000 × 0.25 × 0.70 = 2,625</li>
              <li className="list-decimal">Overall impact: 2,625 ÷ 14,500 = 18.1%</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">+18% expected retention</span></li>
            </ol>
          </div>
        </div>
        
        {/* 4.2 Return on Investment (ROI) Analysis */}
        <div>
          <h4 className="text-amber-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1"></span>
            4.2 Return on Investment (ROI) Analysis
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Compares the economic benefits of listener retention against the cost of implementing interventions.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formulas:</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Benefit = Listeners Retained × Average Value per Listener
              
              ROI (%) = ((Benefit - Cost) / Cost) × 100
              
              Benefit-Cost Ratio = Total Benefit / Total Cost
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example: Community Engagement ROI</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">Implementation cost: ₹2.5M</li>
              <li className="list-decimal">Listeners retained: 2,480 (based on +25% solve rate)</li>
              <li className="list-decimal">Average value per listener: ₹5,000</li>
              <li className="list-decimal">Total benefit: 2,480 × ₹5,000 = ₹12.4M</li>
              <li className="list-decimal">Net benefit: ₹12.4M - ₹2.5M = ₹9.9M</li>
              <li className="list-decimal">ROI: ((₹9.9M - ₹2.5M) / ₹2.5M) × 100 = 296%</li>
              <li className="list-decimal">Result: <span className="text-emerald-400">ROI = 296% | Benefit-Cost Ratio = 4.96:1</span></li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* 5. Geographic Analysis Methodology */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
          <span className="text-cyan-400 text-2xl mr-3">📍</span>
          5. Geographic Analysis Methodology
        </h3>
        
        {/* 5.1 Hotspot Marker Sizing */}
        <div className="mb-8 pb-8 border-b border-slate-800/80">
          <h4 className="text-cyan-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-1"></span>
            5.1 Hotspot Marker Sizing
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Circle markers on the map are sized proportionally to listener density using a square root scale for better visual balance.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Formula (from code):</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              Marker Radius = √(Listener Density) × 3
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Example Calculations:</span>
            </div>
            <ol className="text-slate-300 space-y-2 pl-6">
              <li className="list-decimal">
                Thamel (95% density): √95 × 3 = 9.7 × 3 = <span className="text-rose-400">29 px radius</span>
              </li>
              <li className="list-decimal">
                Patan (88% density): √88 × 3 = 9.4 × 3 = <span className="text-amber-400">28 px radius</span>
              </li>
              <li className="list-decimal">
                Balaju (72% density): √72 × 3 = 8.5 × 3 = <span className="text-emerald-400">25 px radius</span>
              </li>
            </ol>
          </div>
        </div>
        
        {/* 5.2 Hotspot Color Coding */}
        <div>
          <h4 className="text-cyan-400 font-bold text-xl mb-3 flex items-center">
            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-1"></span>
            5.2 Hotspot Color Coding
          </h4>
          <p className="text-slate-400 mb-5 max-w-3xl">
            Colors indicate listener engagement levels based on absolute thresholds.
          </p>
          <div className="bg-slate-900/60 p-5 rounded-lg mb-5 border border-slate-800">
            <code className="text-emerald-400">// Logic (from code):</code>
            <pre className="text-cyan-300 text-base mt-3 font-mono">
              if (engagement &lt; 0.6) → Green (#22c55e)
              else if (engagement &lt; 0.8) → Amber (#f59e0b)
              else → Red (#ef4444)
            </pre>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800">
            <div className="flex items-start mb-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 mt-2"></div>
              <span className="text-slate-300 font-medium">Color Legend:</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-3 text-sm text-slate-300">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div> 
                &lt; 0.6 (Low Risk)
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div> 
                0.6–0.8 (Medium Risk)
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-rose-500 rounded-full mr-2"></div> 
                &gt; 0.8 (High Risk)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glossary of Terms */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 backdrop-blur-sm rounded-2xl p-7 border border-slate-700/80">
        <h3 className="text-white font-bold text-2xl mb-6 text-center">Glossary of Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-slate-300 font-bold mb-2">YoY (Year-over-Year)</h4>
            <p className="text-slate-400 text-sm">
              Comparison of a metric between the same period in consecutive years
            </p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-slate-300 font-bold mb-2">Solve Rate</h4>
            <p className="text-slate-400 text-sm">
              Percentage of songs resulting in a positive outcome (like, save, repeat)
            </p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-slate-300 font-bold mb-2">Confidence Interval (CI)</h4>
            <p className="text-slate-400 text-sm">
              Range likely to contain the true value with specified probability (usually 95%)
            </p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-slate-300 font-bold mb-2">AUC-ROC</h4>
            <p className="text-slate-400 text-sm">
              Area Under Receiver Operating Characteristic curve; measures classifier quality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN APP =====
const App = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Tabs array
  const tabs = [
    'Overview',
    'Diagnostic',
    'Predictive',
    'Prescriptive',
    'Geographic',
    'Temporal',
    'Model Description'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900/90 to-slate-950/90 backdrop-blur-sm border-b border-slate-800/80 px-6 py-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Kathmandu Music Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Metropolitan Listener Service Area · Advanced Analytics</p>
          </div>
          <div className="text-right">
            <p className="text-slate-300 font-bold text-lg">15,000 Listeners</p>
            <p className="text-slate-500 text-sm">2024–2026 Analysis Period</p>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-sm border-b border-slate-800/80 px-6 py-3 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center sm:justify-start space-x-1 sm:space-x-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                  activeTab === tab
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-cyan-600 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {activeTab === 'Overview' && <OverviewTab data={mockData} />}
            {activeTab === 'Diagnostic' && <DiagnosticTab data={mockData} />}
            {activeTab === 'Predictive' && <PredictiveTab data={mockData} />}
            {activeTab === 'Prescriptive' && <PrescriptiveTab data={mockData} />}
            {activeTab === 'Geographic' && <GeographicTab data={mockData} />}
            {activeTab === 'Temporal' && <TemporalTab data={mockData} />}
            {activeTab === 'Model Description' && <ModelDescriptionTab />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-6 mt-12 border-t border-slate-800/50 text-center text-slate-500 text-sm">
        <p>Kathmandu Music Analytics Dashboard © 2026 · Advanced Listener Insights Platform</p>
        <p className="mt-1 text-xs opacity-70">Data updated in real-time · All metrics verified by analytics team</p>
      </footer>
    </div>
  );
};

export default App;
