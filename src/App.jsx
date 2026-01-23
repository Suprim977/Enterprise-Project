import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  Users, Play, SkipForward, Target, Music, Clock,
  MapPin, TrendingUp, Volume2, Calendar, Users2,
  Map, CalendarClock, Lightbulb, Coins, RotateCcw,
  Package, Globe, MessageSquare, Sun, Moon,
  CloudSun, CloudMoon, Star, Upload, Trash2
} from 'lucide-react';
import Papa from 'papaparse';

// ===== MOCK DATA (used when no CSV uploaded) =====
const mockData = {
  kpiData: [
    { title: 'TOTAL LISTENERS', value: '15,000', change: '+3.2% vs 2024', icon: Users },
    { title: 'AVG DAILY PLAYS', value: '16.7', change: 'Per day avg', icon: Play },
    { title: 'COMPLETION RATE', value: '63.0%', change: '-1.2% vs 2024', icon: SkipForward },
    { title: 'PREMIUM USERS', value: '7,500', change: '50% of total', icon: Target },
    { title: 'TOP GENRE', value: 'Bollywood', change: '8.9% share', icon: Music },
    { title: 'PEAK HOUR', value: '19:00', change: 'Highest activity', icon: Clock }
  ],
  yearlyTrendData: [
    { year: '2024', plays: 150000, color: '#3B82F6' },
    { year: '2025', plays: 180000, color: '#8B5CF6' },
    { year: '2026', plays: 170000, color: '#EF4444' }
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
    { title: 'HIGHEST LISTENER AREA', value: 'Thamel (1,245 listeners / 8.3%)', icon: MapPin },
    { title: 'SAFEST AREA', value: 'Patan (Lowest skip rate)', icon: TrendingUp },
    { title: 'MOST POPULAR GENRE', value: 'Bollywood (8.9%)', icon: Music },
    { title: 'PEAK LISTENING DAY', value: 'Saturday (+12% vs weekday avg)', icon: Calendar }
  ],
  diagnosticAlerts: [
    {
      title: 'High Skip Rate Spike',
      description: '+8.3% in 2025; Correlated with new releases, low energy tracks.',
      icon: SkipForward,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30'
    },
    {
      title: 'Low Completion Rate',
      description: 'Only 63% songs completed; Genre: Lo-Fi (45%), K-Pop (52%).',
      icon: Volume2,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/30'
    },
    {
      title: 'Key Correlations',
      description: 'Strong relationships: Age 18-24 ↔ K-Pop (r=0.78), Premium ↔ Higher completion (r=0.65).',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/30'
    },
    {
      title: 'Declining Categories',
      description: 'Indie (-12% since 2024), Acoustic (-8%).',
      icon: Music,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30'
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
    { title: '2026 LISTENER FORECAST', value: '18,750', detail: '+3.8% predicted increase — 82% confidence', icon: Users2 },
    { title: 'HIGHEST RISK AREA', value: 'Thamel', detail: '1,000 predicted listeners — 78% confidence', icon: MapPin },
    { title: 'PEAK RISK PERIOD', value: 'July 2026', detail: 'Peak listener activity — 85% confidence', icon: CalendarClock },
    { title: 'EXPECTED DECLINE', value: 'Indie genre', detail: '-8% predicted decline — 75% confidence', icon: Music }
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
    { title: 'New Year’s Eve', detail: '+45% spike predicted', icon: Calendar, color: 'bg-blue-500/20 text-blue-400' },
    { title: 'Emerging Hotspot', detail: 'Swayambhu (+15% growth)', icon: MapPin, color: 'bg-green-500/20 text-green-400' },
    { title: 'New Release Surge', detail: 'Q3 2026 launches', icon: RotateCcw, color: 'bg-purple-500/20 text-purple-400' },
    { title: 'Skip Rate Surge', detail: 'Lo-Fi genre alert', icon: SkipForward, color: 'bg-red-500/20 text-red-400' },
    { title: 'Declining Genre', detail: 'Indie (-8% predicted)', icon: Music, color: 'bg-yellow-500/20 text-yellow-400' },
    { title: 'Peak Risk Time', detail: 'Friday 19:00', icon: Clock, color: 'bg-indigo-500/20 text-indigo-400' }
  ],
  interventionCards: [
    { title: 'Targeted Premium Offers', icon: Coins, impact: '-15% churn rate' },
    { title: 'Personalized Playlists', icon: Package, impact: '+22% engagement' },
    { title: 'Family Plan Expansion', icon: Users2, impact: '+18% conversion' },
    { title: 'Localized Content Strategy', icon: Globe, impact: '+25% retention' },
    { title: 'Community Engagement', icon: MessageSquare, impact: '-12% skip rate' }
  ],
  recommendations: [
    {
      title: 'Predictive Playlist Optimization',
      description: 'Deploy playlists to hotspots (Thamel, Patan)',
      impact: '-18% skip rate',
      icon: Package
    },
    {
      title: 'AI-Powered Genre Recognition',
      description: 'Expand AI-powered genre recognition for better recommendations',
      impact: '+25% completion rate',
      icon: Lightbulb
    },
    {
      title: 'Night Time Economy Strategy',
      description: 'Dedicated night teams for high-engagement areas',
      impact: '-22% night-time skip rate',
      icon: Moon
    },
    {
      title: 'Community Engagement Program',
      description: 'Neighborhood watch for high-risk areas',
      impact: '-12% anti-social behavior (low engagement)',
      icon: Users2
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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

// ===== HELPER COMPONENTS =====
const renderKPI = (item) => {
  const IconComponent = item.icon;
  return (
    <div key={item.title} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <IconComponent className="w-8 h-8 text-blue-400" />
        <span className="text-xs font-medium text-slate-400">{item.change}</span>
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{item.title}</h3>
      <p className="text-white text-2xl font-bold">{item.value}</p>
    </div>
  );
};

const renderHighlightCard = (card) => {
  const IconComponent = card.icon;
  return (
    <div key={card.title} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
      <div className="flex items-start space-x-3">
        <IconComponent className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-slate-400 text-sm font-medium">{card.title}</h4>
          <p className="text-white text-sm font-medium">{card.value}</p>
        </div>
      </div>
    </div>
  );
};

// ===== TAB COMPONENTS (accept data prop) =====
const OverviewTab = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">Descriptive Analytics Overview</h2>
        <p className="text-slate-400">What happened? Listener statistics across Kathmandu 2024–2026</p>
      </div>
      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">LIVE DATA</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.kpiData.map(renderKPI)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Listener Trend by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.yearlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
            <Bar dataKey="plays">
              {data.yearlyTrendData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Genre Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.genreData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {data.genreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Share']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Top 10 Areas by Listener Count</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.areaData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="area" type="category" stroke="#94a3b8" width={80} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <Bar dataKey="listeners" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Platform Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.platformData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.platformData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Market Share']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.highlightCards.map(renderHighlightCard)}
    </div>
  </div>
);

const DiagnosticTab = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white">Diagnostic Analytics</h2>
      <p className="text-slate-400">Why did it happen? Root cause analysis & correlations</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.diagnosticAlerts.map((alert, index) => {
        const IconComponent = alert.icon;
        return (
          <div key={index} className={`${alert.bg} rounded-xl p-4`}>
            <IconComponent className={`w-5 h-5 ${alert.color} mb-2`} />
            <h4 className={`${alert.color} font-medium text-sm mb-1`}>{alert.title}</h4>
            <p className="text-white text-xs">{alert.description}</p>
          </div>
        );
      })}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Year-over-Year Change by Genre</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.genreData.slice(0, 7)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
            <YAxis stroke="#94a3b8" domain={[-15, 15]} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Change']} />
            <Bar dataKey="value">
              {data.genreData.slice(0, 7).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10B981' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Completion Rate by Genre</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.genreCompletionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="genre" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Completion Rate']} />
            <Bar dataKey="rate" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Listening Time of Day</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="hour" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="plays" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Seasonal Listening Patterns</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.seasonalData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="season" stroke="#94a3b8" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
            <Radar name="Listening Index" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}`, 'Index']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Root Cause Analysis Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-2 px-3 text-slate-400">Pattern</th>
              <th className="text-left py-2 px-3 text-slate-400">Impact</th>
              <th className="text-left py-2 px-3 text-slate-400">Root Cause</th>
              <th className="text-left py-2 px-3 text-slate-400">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {data.rootCauseData.map((row, index) => (
              <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="py-2 px-3 text-white">{row.pattern}</td>
                <td className="py-2 px-3 text-green-400">{row.impact}</td>
                <td className="py-2 px-3 text-white">{row.cause}</td>
                <td className="py-2 px-3 text-slate-300">{row.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PredictiveTab = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white">Predictive Analytics</h2>
      <p className="text-slate-400">What will happen? Forecast & risk predictions for 2026</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.forecastCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <IconComponent className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="text-slate-400 font-medium text-sm mb-1">{card.title}</h4>
            <p className="text-white font-bold text-lg mb-1">{card.value}</p>
            <p className="text-slate-400 text-xs">{card.detail}</p>
          </div>
        );
      })}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Listener Forecast 2026</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.listenerForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="period" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'actual') return [value.toLocaleString(), 'Actual'];
                if (name === 'forecast') return [value.toLocaleString(), 'Forecast'];
                return [value, name];
              }}
            />
            <Area type="monotone" dataKey="actual" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Actual" />
            <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Genre Risk Assessment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.genreRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="genre" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
            <YAxis stroke="#94a3b8" domain={[-15, 15]} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Predicted Change']} />
            <Bar dataKey="change">
              {data.genreRiskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Area Risk Scores</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.areaRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="area" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}`, 'Risk Score']} />
            <Bar dataKey="score">
              {data.areaRiskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score > 75 ? '#10B981' : entry.score > 65 ? '#F59E0B' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Model Performance Validation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.modelPerformanceData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
            <Radar name="Hotspot Model" dataKey="hotspot" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Radar name="Category Model" dataKey="category" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">AI-Powered Predictions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.aiPredictions.map((prediction, index) => {
          const IconComponent = prediction.icon;
          return (
            <div key={index} className={`${prediction.color} rounded-lg p-4`}>
              <div className="flex items-center space-x-3 mb-2">
                <IconComponent className="w-5 h-5" />
                <h4 className="font-medium">{prediction.title}</h4>
              </div>
              <p className="text-sm opacity-90">{prediction.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const PrescriptiveTab = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white">Prescriptive Analytics</h2>
      <p className="text-slate-400">What should we do? Evidence-based listener engagement recommendations</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {data.interventionCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 text-center">
            <IconComponent className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h4 className="text-slate-400 font-medium text-sm mb-1">{card.title}</h4>
            <p className="text-green-400 text-xs font-medium">{card.impact}</p>
          </div>
        );
      })}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {data.recommendations.map((rec, index) => {
        const IconComponent = rec.icon;
        return (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">{rec.title}</h4>
                <p className="text-slate-400 mb-3">{rec.description}</p>
                <div className="inline-flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {rec.impact}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Cost-Benefit Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.costBenefitData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="strategy" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
          <Legend />
          <Bar dataKey="cost" name="Cost" fill="#F59E0B" />
          <Bar dataKey="benefit" name="Benefit" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const GeographicTab = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white">Geographic Analytics</h2>
      <p className="text-slate-400">Interactive map of Kathmandu Valley listener density and insights</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <Map className="w-8 h-8 text-blue-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Total Areas Covered</h4>
        <p className="text-white font-bold text-xl">49</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <Users className="w-8 h-8 text-green-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Highest Density Area</h4>
        <p className="text-white font-bold text-xl">Thamel</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <Music className="w-8 h-8 text-purple-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Most Popular Genre</h4>
        <p className="text-white font-bold text-xl">Bollywood</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <TrendingUp className="w-8 h-8 text-yellow-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Emerging Hotspot</h4>
        <p className="text-white font-bold text-xl">Swayambhu</p>
      </div>
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Top Areas by Listener Density</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-2 px-3 text-slate-400">Area</th>
              <th className="text-left py-2 px-3 text-slate-400">Listener Density</th>
              <th className="text-left py-2 px-3 text-slate-400">Total Listeners</th>
              <th className="text-left py-2 px-3 text-slate-400">Top Genre</th>
              <th className="text-left py-2 px-3 text-slate-400">Growth Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.geographicData.map((area, index) => (
              <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="py-2 px-3 text-white font-medium">{area.area}</td>
                <td className="py-2 px-3">
                  <div className="flex items-center">
                    <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
                      <div className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: `${area.density}%` }}></div>
                    </div>
                    <span className="text-white text-sm">{area.density}%</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-white">{area.listeners.toLocaleString()}</td>
                <td className="py-2 px-3 text-slate-300">{area.topGenre}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    index === 0 ? 'bg-green-500/20 text-green-400' :
                    index === 1 ? 'bg-green-500/20 text-green-400' :
                    index === 2 ? 'bg-yellow-500/20 text-yellow-400' :
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Genre Distribution by Area</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.geographicData.slice(0, 6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="area" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <Bar dataKey="listeners" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Premium vs Free by Area</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: 'Premium', value: 7500 },
                { name: 'Free', value: 7500 }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="name"
            >
              <Cell fill="#10B981" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const TemporalTab = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white">Temporal Analytics</h2>
      <p className="text-slate-400">Monthly/weekly trends with time filters and seasonal patterns</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <Calendar className="w-8 h-8 text-blue-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Peak Month</h4>
        <p className="text-white font-bold text-xl">August</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <CalendarClock className="w-8 h-8 text-green-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Peak Day</h4>
        <p className="text-white font-bold text-xl">Saturday</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <Clock className="w-8 h-8 text-purple-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Peak Hour</h4>
        <p className="text-white font-bold text-xl">19:00</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <Star className="w-8 h-8 text-yellow-400 mb-2" />
        <h4 className="text-slate-400 font-medium text-sm mb-1">Festival Impact</h4>
        <p className="text-white font-bold text-xl">+25%</p>
      </div>
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Monthly Listening Trends (2024-2026)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.monthlyTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
          <Legend />
          <Area type="monotone" dataKey="plays" name="Total Plays" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
          <Area type="monotone" dataKey="likes" name="Likes" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Listening by Day of Week</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [value.toLocaleString(), 'Plays']} />
            <Bar dataKey="plays">
              {data.dayOfWeekData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.day === 'Saturday' ? '#10B981' : '#3B82F6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Festival Impact on Listening</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.festivalImpactData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="event" stroke="#94a3b8" height={60} angle={-45} textAnchor="end" />
            <YAxis stroke="#94a3b8" domain={[0, 30]} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`${value}%`, 'Impact']} />
            <Bar dataKey="impact" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Weather Impact on Listening Behavior</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.weatherImpactData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis dataKey="condition" type="category" stroke="#94a3b8" width={80} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
          <Legend />
          <Bar dataKey="plays" name="Total Plays" fill="#3B82F6" />
          <Bar dataKey="completion" name="Completion Rate (%)" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">Time of Day Listening Patterns</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { period: 'Morning (6-12)', plays: 85000, icon: Sun },
          { period: 'Afternoon (12-17)', plays: 92000, icon: CloudSun },
          { period: 'Evening (17-22)', plays: 145000, icon: Moon },
          { period: 'Night (22-6)', plays: 78000, icon: CloudMoon }
        ].map((period, index) => {
          const IconComponent = period.icon;
          return (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4 text-center">
              <IconComponent className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-slate-300 text-sm mb-1">{period.period}</h4>
              <p className="text-white font-bold text-lg">{period.plays.toLocaleString()}</p>
              <p className="text-slate-400 text-xs">plays</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const ModelDescriptionTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Model Description & Methodology</h2>
        <p className="text-slate-400">Detailed explanation of all calculations, formulas, and analytical methods used in this dashboard</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">TABLE OF CONTENTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">1. Descriptive Metrics</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Total Listener Count</li>
              <li>• Average Daily Plays</li>
              <li>• Completion Rate Calculation</li>
              <li>• Genre Distribution</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-green-400 font-medium mb-2">2. Diagnostic Analytics</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Year-over-Year Change</li>
              <li>• Correlation Coefficient</li>
              <li>• Engagement Score Formula</li>
              <li>• Weekend Spike Analysis</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-2">3. Predictive Models</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Listener Forecasting</li>
              <li>• Genre Risk Assessment</li>
              <li>• Confidence Intervals</li>
              <li>• Model Performance Metrics</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Glossary of Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">YoY (Year-over-Year)</h4>
            <p className="text-slate-400 text-xs">Comparison of a metric between the same period in consecutive years</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">Solve Rate</h4>
            <p className="text-slate-400 text-xs">Percentage of songs resulting in a positive outcome (like, save, repeat)</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">Confidence Interval (CI)</h4>
            <p className="text-slate-400 text-xs">Range likely to contain the true value with specified probability (usually 95%)</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">AUC-ROC</h4>
            <p className="text-slate-400 text-xs">Area Under Receiver Operating Characteristic curve; measures classifier quality</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">F1 Score</h4>
            <p className="text-slate-400 text-xs">Harmonic mean of precision and recall; balances both metrics</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">Seasonal Index</h4>
            <p className="text-slate-400 text-xs">Ratio of period average to overall average; 100 = exactly average</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">Correlation (r)</h4>
            <p className="text-slate-400 text-xs">Statistical measure of linear relationship strength (-1 to +1)</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-slate-300 font-medium mb-1">ROI (Return on Investment)</h4>
            <p className="text-slate-400 text-xs">Percentage gain/loss relative to investment cost</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">DATA SOURCES & METHODOLOGY NOTES</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-slate-300 font-medium mb-2">Data Sources:</h4>
            <ul className="text-slate-400 text-xs space-y-1">
              <li>• Synthetic listener event logs (History1.xlsx – History10.xlsx)</li>
              <li>• Listener demographics (nepal_music_listeners.csv)</li>
              <li>• Geospatial coordinates filtered to Kathmandu Valley (27.6°N–27.8°N, 85.2°E–85.4°E)</li>
              <li>• Platform, device, and audio quality metadata</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-300 font-medium mb-2">Methodology Notes:</h4>
            <ul className="text-slate-400 text-xs space-y-1">
              <li>• All percentages rounded to 1 decimal place</li>
              <li>• Forecasts assume trend continuation (linear model)</li>
              <li>• Cost figures are estimates for illustration</li>
              <li>• Model metrics based on historical validation</li>
              <li>• Engagement score capped at 1.0 for fair comparison</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== UPLOAD TAB COMPONENT =====
const UploadTab = () => {
  const [uploaded, setUploaded] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          console.log("CSV Parsed:", results.data);
          setUploaded(true);
          alert("File uploaded successfully! (Visualization update logic not implemented yet)");
        }
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        alert("Failed to parse CSV. Please check format.");
      }
    });
  };

  const handleRemove = () => {
    setUploaded(false);
    alert("File removed. All tabs reset to original data.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Upload Listener Data</h2>
        <p className="text-slate-400">Upload a CSV file to update analytics across all tabs (except Model Description).</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 max-w-md mx-auto text-center">
        <Upload className="w-16 h-16 text-slate-400 mx-auto mb-6" />

        {!uploaded ? (
          <>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block">
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-slate-400 text-sm mt-4">Supports .csv files only</p>
          </>
        ) : (
          <>
            <div className="text-green-400 mb-6">✅ File uploaded successfully!</div>
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-2 bg-red-700/50 hover:bg-red-600 text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove File
            </button>
          </>
        )}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-3">Instructions</h3>
        <ul className="text-slate-300 text-sm space-y-2 list-disc pl-5">
          <li>CSV must contain headers (e.g., <code>genre</code>, <code>area</code>, <code>plays</code>, etc.)</li>
          <li>After upload, switch to other tabs to see updated visualizations</li>
          <li>“Model Description” tab remains unchanged</li>
          <li>Click “Remove File” to restore original mock data</li>
        </ul>
      </div>
    </div>
  );
};

// ===== MAIN APP =====
const App = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [uploadedData, setUploadedData] = useState(null);

  // Updated tabs array — includes "Upload CSV" as 8th tab
  const tabs = [
    'Overview',
    'Diagnostic',
    'Predictive',
    'Prescriptive',
    'Geographic',
    'Temporal',
    'Model Description',
    'Upload CSV'  // ← Added here
  ];

  // Use uploaded data if available, else fallback to mock
  const currentData = uploadedData || mockData;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Kathmandu Music Analytics Dashboard</h1>
            <p className="text-slate-400">Metropolitan Listener Service Area · Advanced Analytics</p>
          </div>
          <div className="text-right">
            <p className="text-slate-300 font-medium">15,000 Listeners · 2024–2026</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs — now includes Upload CSV as a tab */}
      <nav className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700 px-6 py-3">
        <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'Overview' && <OverviewTab data={currentData} />}
        {activeTab === 'Diagnostic' && <DiagnosticTab data={currentData} />}
        {activeTab === 'Predictive' && <PredictiveTab data={currentData} />}
        {activeTab === 'Prescriptive' && <PrescriptiveTab data={currentData} />}
        {activeTab === 'Geographic' && <GeographicTab data={currentData} />}
        {activeTab === 'Temporal' && <TemporalTab data={currentData} />}
        {activeTab === 'Model Description' && <ModelDescriptionTab />}
        {activeTab === 'Upload CSV' && <UploadTab />} {/* ← Render Upload Tab */}
      </main>
    </div>
  );
};

export default App;