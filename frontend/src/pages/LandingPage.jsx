import React, { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, Users, Award, Layers, ArrowRight, RotateCcw, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { fetchResources, fetchFilters } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import ResourceDetailModal from '../components/ResourceDetailModal';

export default function LandingPage({ setActivePage }) {
  // Search & Filter State
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedReadingLevel, setSelectedReadingLevel] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);

  // Data State
  const [filterOptions, setFilterOptions] = useState({
    topics: [],
    content_types: [],
    reading_levels: [],
    target_audiences: []
  });
  const [resourcesData, setResourcesData] = useState({ items: [], total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  // Fetch filter taxonomies
  useEffect(() => {
    fetchFilters()
      .then(setFilterOptions)
      .catch((err) => console.error('Failed to load filter options', err));
  }, []);

  // Fetch resources
  useEffect(() => {
    setLoading(true);
    const params = {
      query,
      topic: selectedTopic,
      target_audience: selectedAudience,
      reading_level: selectedReadingLevel,
      content_type: selectedContentType,
      complexity: selectedComplexity ? parseInt(selectedComplexity, 10) : undefined,
      sort_by: sortBy,
      page,
      page_size: 9
    };

    fetchResources(params)
      .then((data) => {
        setResourcesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching resources:', err);
        setLoading(false);
      });
  }, [query, selectedTopic, selectedAudience, selectedReadingLevel, selectedContentType, selectedComplexity, sortBy, page]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedTopic('');
    setSelectedAudience('');
    setSelectedReadingLevel('');
    setSelectedContentType('');
    setSelectedComplexity('');
    setSortBy('default');
    setPage(1);
  };

  const hasActiveFilters = query || selectedTopic || selectedAudience || selectedReadingLevel || selectedContentType || selectedComplexity;

  return (
    <div className="space-y-0 text-primary pb-16 animate-fade-in">
      {/* Editorial Hero Section */}
      <section className="bg-dark-bg border-b border-dark-border py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Small teal uppercase section label */}
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-teal-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span>MINISTRY OF EARTH SCIENCES • SIH26063</span>
          </div>

          {/* Large, elegant heading with selective bold emphasis */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-light tracking-tight text-primary leading-tight max-w-4xl">
            Discover the science of <strong className="font-bold text-white">our polar regions.</strong>
          </h1>

          {/* Short explanatory paragraph */}
          <p className="max-w-2xl text-sm sm:text-base text-secondary leading-relaxed font-normal">
            An intelligent educational resource discovery platform that organizes polar science materials through content analysis, topic clustering, and audience-based exploration.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#explore-section"
              className="px-5 py-2.5 rounded bg-teal-500 hover:bg-teal-600 text-dark-bg font-semibold text-xs tracking-wide transition-colors flex items-center gap-2"
            >
              <span>Explore Resources</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>

            <button
              onClick={() => setActivePage('about')}
              className="px-5 py-2.5 rounded bg-transparent hover:bg-dark-card border border-dark-border text-secondary hover:text-primary font-medium text-xs transition-colors"
            >
              View Methodology
            </button>
          </div>
        </div>
      </section>

      {/* 4 Compact Metric Cards Bar */}
      <section className="bg-dark-section border-b border-dark-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded bg-dark-card border border-dark-border">
            <span className="text-[10px] font-mono uppercase text-muted block">Catalog Resources</span>
            <div className="text-xl font-bold text-primary mt-0.5">{resourcesData.total || 354}</div>
            <p className="text-[11px] text-secondary">Verified records</p>
          </div>

          <div className="p-3.5 rounded bg-dark-card border border-dark-border">
            <span className="text-[10px] font-mono uppercase text-muted block">Disciplines</span>
            <div className="text-xl font-bold text-teal-400 mt-0.5">10</div>
            <p className="text-[11px] text-secondary">50 per domain</p>
          </div>

          <div className="p-3.5 rounded bg-dark-card border border-dark-border">
            <span className="text-[10px] font-mono uppercase text-muted block">Audiences</span>
            <div className="text-xl font-bold text-primary mt-0.5">5</div>
            <p className="text-[11px] text-secondary">From children to scholars</p>
          </div>

          <div className="p-3.5 rounded bg-dark-card border border-dark-border">
            <span className="text-[10px] font-mono uppercase text-muted block">Coverage</span>
            <div className="text-xl font-bold text-teal-400 mt-0.5">100%</div>
            <p className="text-[11px] text-secondary">Zero unmapped outliers</p>
          </div>
        </div>
      </section>

      {/* Main Exploration Section */}
      <section id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-teal-400 tracking-wider mb-1">
            Research Catalog
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Explore polar research and educational resources
          </h2>
          <p className="text-xs text-secondary mt-1">
            Filter by scientific discipline, target audience, format, or reading level.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-dark-card rounded-md p-4 border border-dark-border space-y-3">
          <div className="flex flex-col md:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search concepts or terms (e.g. 'albedo', 'tundra food web', 'salinity', 'permafrost')..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 rounded bg-dark-bg border border-dark-border text-xs sm:text-sm text-primary placeholder-muted focus:outline-none focus:border-teal-500"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-2 rounded bg-dark-bg border border-dark-border text-xs text-secondary focus:outline-none focus:border-teal-500 font-mono"
              >
                <option value="default">Default Order</option>
                {query && <option value="relevance">Similarity Relevance</option>}
                <option value="complexity_asc">Complexity: Low to High</option>
                <option value="complexity_desc">Complexity: High to Low</option>
                <option value="title_asc">Title: A to Z</option>
                <option value="word_count_desc">Word Count: High to Low</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-2.5 py-2 rounded bg-dark-bg border border-dark-border hover:bg-dark-border text-secondary hover:text-primary text-xs font-mono transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-muted" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-dark-border text-xs">
            <div>
              <label className="block text-[10px] uppercase font-mono text-muted mb-1">Discipline</label>
              <select
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
                className="w-full p-1.5 rounded bg-dark-bg border border-dark-border text-secondary truncate focus:border-teal-500"
              >
                <option value="">All Topics (10)</option>
                {filterOptions.topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-muted mb-1">Audience</label>
              <select
                value={selectedAudience}
                onChange={(e) => { setSelectedAudience(e.target.value); setPage(1); }}
                className="w-full p-1.5 rounded bg-dark-bg border border-dark-border text-secondary capitalize focus:border-teal-500"
              >
                <option value="">All Audiences (5)</option>
                {filterOptions.target_audiences.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-muted mb-1">Reading Tier</label>
              <select
                value={selectedReadingLevel}
                onChange={(e) => { setSelectedReadingLevel(e.target.value); setPage(1); }}
                className="w-full p-1.5 rounded bg-dark-bg border border-dark-border text-secondary capitalize focus:border-teal-500"
              >
                <option value="">All Tiers (3)</option>
                {filterOptions.reading_levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-muted mb-1">Format</label>
              <select
                value={selectedContentType}
                onChange={(e) => { setSelectedContentType(e.target.value); setPage(1); }}
                className="w-full p-1.5 rounded bg-dark-bg border border-dark-border text-secondary focus:border-teal-500"
              >
                <option value="">All Formats (5)</option>
                {filterOptions.content_types.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-muted mb-1">Complexity</label>
              <select
                value={selectedComplexity}
                onChange={(e) => { setSelectedComplexity(e.target.value); setPage(1); }}
                className="w-full p-1.5 rounded bg-dark-bg border border-dark-border text-secondary focus:border-teal-500"
              >
                <option value="">All Levels (1-5)</option>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <option key={lvl} value={lvl}>Level {lvl}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-muted font-mono px-0.5">
          <div>
            Showing <strong className="text-primary">{resourcesData.total}</strong> resources
            {query && <span> for "<span className="text-teal-400">{query}</span>"</span>}
          </div>
          <div>
            Page {page} of {resourcesData.total_pages || 1}
          </div>
        </div>

        {/* Resource Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-dark-card rounded-md border border-dark-border p-4 space-y-3 animate-pulse">
                <div className="h-3 w-20 bg-dark-bg rounded" />
                <div className="h-4 w-3/4 bg-dark-bg rounded" />
                <div className="h-3 w-24 bg-dark-bg rounded" />
                <div className="h-10 w-full bg-dark-bg/60 rounded" />
              </div>
            ))}
          </div>
        ) : resourcesData.items.length === 0 ? (
          <div className="bg-dark-card rounded-md p-10 text-center border border-dark-border space-y-3">
            <div className="w-9 h-9 rounded bg-dark-bg text-muted flex items-center justify-center mx-auto">
              <Search className="w-4 h-4 stroke-[1.75]" />
            </div>
            <h3 className="font-semibold text-primary text-sm">No matching resources found</h3>
            <p className="text-secondary text-xs max-w-sm mx-auto">
              Try adjusting your search terms or resetting filters to explore the polar science catalog.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded bg-teal-500 text-dark-bg font-semibold text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourcesData.items.map((resource) => (
              <ResourceCard
                key={resource.resource_id}
                resource={resource}
                onSelect={(id) => setSelectedResourceId(id)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {resourcesData.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-dark-border bg-dark-card text-xs font-mono text-secondary hover:text-primary hover:bg-dark-border disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="text-xs font-mono text-muted px-3">
              {page} / {resourcesData.total_pages}
            </span>

            <button
              disabled={page >= resourcesData.total_pages}
              onClick={() => setPage((p) => Math.min(resourcesData.total_pages, p + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-dark-border bg-dark-card text-xs font-mono text-secondary hover:text-primary hover:bg-dark-border disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedResourceId && (
        <ResourceDetailModal
          resourceId={selectedResourceId}
          onClose={() => setSelectedResourceId(null)}
          onSelectResource={(id) => setSelectedResourceId(id)}
        />
      )}
    </div>
  );
}
