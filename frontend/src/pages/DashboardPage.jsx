import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../services/api';
import { BarChart3, Info } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load dashboard analytics from backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-teal-500 border-t-transparent mb-3" />
        <p className="text-secondary text-xs font-mono">Aggregating dataset distributions...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-rose-400 text-xs font-mono">
        <p>{error || 'No data available.'}</p>
      </div>
    );
  }

  // Format charts data
  const topicData = Object.entries(stats.topic_distribution || {}).map(([name, count]) => ({
    name,
    count,
  }));

  const audienceData = Object.entries(stats.audience_distribution || {}).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));

  const readingLevelData = Object.entries(stats.reading_level_distribution || {}).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: count,
  }));

  const complexityData = Object.entries(stats.complexity_distribution || {}).map(([lvl, count]) => ({
    level: `L${lvl}`,
    count,
  }));

  // Dark scientific palette for Recharts
  const PIE_COLORS = ['#14B8A6', '#0F766E', '#334155'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-primary">
      {/* Header */}
      <div className="border-b border-dark-border pb-4">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-teal-400 mb-1">
          <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
          <span>Analytics Overview</span>
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Dataset Distribution & Metrics
        </h1>
        <p className="text-secondary text-xs mt-1">
          Quantitative breakdown of the {stats.total_resources} educational resources across scientific topics, audience segments, and reading complexity.
        </p>
      </div>

      {/* 4 Compact Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-card p-4 rounded-md border border-dark-border shadow-card">
          <span className="text-[10px] font-mono uppercase text-muted block">Catalog Resources</span>
          <div className="text-2xl font-bold text-primary mt-1">{stats.total_resources}</div>
          <p className="text-[11px] text-secondary mt-0.5">Educational records</p>
        </div>

        <div className="bg-dark-card p-4 rounded-md border border-dark-border shadow-card">
          <span className="text-[10px] font-mono uppercase text-muted block">Disciplines</span>
          <div className="text-2xl font-bold text-teal-400 mt-1">{stats.total_topics}</div>
          <p className="text-[11px] text-secondary mt-0.5">50 items per discipline</p>
        </div>

        <div className="bg-dark-card p-4 rounded-md border border-dark-border shadow-card">
          <span className="text-[10px] font-mono uppercase text-muted block">ML Clusters</span>
          <div className="text-2xl font-bold text-primary mt-1">{stats.total_clusters}</div>
          <p className="text-[11px] text-secondary mt-0.5">Discovered thematic groups</p>
        </div>

        <div className="bg-dark-card p-4 rounded-md border border-dark-border shadow-card">
          <span className="text-[10px] font-mono uppercase text-muted block">Mean Abstract Length</span>
          <div className="text-2xl font-bold text-primary mt-1">{stats.avg_word_count}</div>
          <p className="text-[11px] text-secondary mt-0.5">Words per abstract</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Breakdown Chart */}
        <div className="bg-dark-card p-5 rounded-md border border-dark-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-dark-border pb-2">
            <h3 className="font-semibold text-primary text-xs uppercase tracking-wider font-mono">
              Topic Distribution (10 Disciplines)
            </h3>
            <span className="text-[11px] text-muted font-mono">50 items each</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip 
                  formatter={(value) => [`${value} resources`, 'Count']} 
                  contentStyle={{ backgroundColor: '#111827', color: '#F4F7FA', borderRadius: '4px', fontSize: '11px', border: '1px solid #263244', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#14B8A6" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reading Level Breakdown */}
        <div className="bg-dark-card p-5 rounded-md border border-dark-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-dark-border pb-2">
            <h3 className="font-semibold text-primary text-xs uppercase tracking-wider font-mono">
              Reading Level Tiers
            </h3>
            <span className="text-[11px] text-muted font-mono">Verified Labels</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readingLevelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {readingLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', color: '#F4F7FA', borderRadius: '4px', fontSize: '11px', border: '1px solid #263244', fontFamily: 'monospace' }} />
                <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Audience Distribution */}
        <div className="bg-dark-card p-5 rounded-md border border-dark-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-dark-border pb-2">
            <h3 className="font-semibold text-primary text-xs uppercase tracking-wider font-mono">
              Audience Categories (5 Demographics)
            </h3>
            <span className="text-[11px] text-muted font-mono">100 items each</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 120]} />
                <Tooltip 
                  formatter={(val) => [`${val} items`, 'Count']} 
                  contentStyle={{ backgroundColor: '#111827', color: '#F4F7FA', borderRadius: '4px', fontSize: '11px', border: '1px solid #263244', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#2DD4BF" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scientific Complexity Scale */}
        <div className="bg-dark-card p-5 rounded-md border border-dark-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-dark-border pb-2">
            <h3 className="font-semibold text-primary text-xs uppercase tracking-wider font-mono">
              Complexity Scale (Level 1 to 5)
            </h3>
            <span className="text-[11px] text-muted font-mono">100 items each</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complexityData}>
                <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 120]} />
                <Tooltip 
                  formatter={(val) => [`${val} items`, 'Count']} 
                  contentStyle={{ backgroundColor: '#111827', color: '#F4F7FA', borderRadius: '4px', fontSize: '11px', border: '1px solid #263244', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#64748B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Academic Transparency Note */}
      <div className="p-4 rounded-md bg-dark-card border border-dark-border text-xs text-secondary flex items-start gap-3">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5 stroke-[1.75]" />
        <div className="space-y-0.5">
          <span className="font-semibold text-primary">Dataset Transparency Note:</span>
          <p className="leading-relaxed">
            The dataset (<code>polar_science_outreach_dataset_final.csv</code>) does not include a temporal publication date column. To maintain scientific honesty, this dashboard presents authentic structural and categorical distributions rather than speculative chronological curves.
          </p>
        </div>
      </div>
    </div>
  );
}
