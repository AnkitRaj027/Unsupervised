import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchResources, fetchFilters } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import ResourceDetailModal from '../components/ResourceDetailModal';

export default function ExplorePage({ initialQuery = '', initialFilters = {} }) {
  // Filters State
  const [query, setQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState(initialFilters.topic || '');
  const [selectedAudience, setSelectedAudience] = useState(initialFilters.audience || '');
  const [selectedReadingLevel, setSelectedReadingLevel] = useState(initialFilters.reading_level || '');
  const [selectedContentType, setSelectedContentType] = useState(initialFilters.content_type || '');
  const [selectedComplexity, setSelectedComplexity] = useState(initialFilters.complexity || '');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);

  // Data & Options State
  const [filterOptions, setFilterOptions] = useState({
    topics: [],
    content_types: [],
    reading_levels: [],
    target_audiences: []
  });
  const [resourcesData, setResourcesData] = useState({ items: [], total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  // Load filter options on mount
  useEffect(() => {
    fetchFilters()
      .then(setFilterOptions)
      .catch((err) => console.error('Failed to load filter options', err));
  }, []);

  // Fetch resources when query, filters, sort, or page change
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
      page_size: 12
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

  // Reset all filters
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Search & Filter Control Panel */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-subtle space-y-4">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
            <input
              type="text"
              placeholder="Search concepts, topics, or keywords (e.g. 'albedo', 'tundra food web', 'salinity')..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-navy-700 text-xs sm:text-sm text-slate-800 placeholder-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-2 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-navy-700"
            >
              <option value="default">Default Catalog Order</option>
              {query && <option value="relevance">Similarity Relevance</option>}
              <option value="complexity_asc">Complexity: Low to High</option>
              <option value="complexity_desc">Complexity: High to Low</option>
              <option value="title_asc">Title: A to Z</option>
              <option value="word_count_desc">Word Count: High to Low</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-3 border-t border-slate-100 text-xs">
          {/* Topic */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Discipline</label>
            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
              className="w-full p-1.5 rounded border border-slate-200 bg-white text-slate-700 truncate focus:border-navy-700"
            >
              <option value="">All Topics (10)</option>
              {filterOptions.topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Audience</label>
            <select
              value={selectedAudience}
              onChange={(e) => { setSelectedAudience(e.target.value); setPage(1); }}
              className="w-full p-1.5 rounded border border-slate-200 bg-white text-slate-700 capitalize focus:border-navy-700"
            >
              <option value="">All Audiences (5)</option>
              {filterOptions.target_audiences.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Reading Level */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Reading Tier</label>
            <select
              value={selectedReadingLevel}
              onChange={(e) => { setSelectedReadingLevel(e.target.value); setPage(1); }}
              className="w-full p-1.5 rounded border border-slate-200 bg-white text-slate-700 capitalize focus:border-navy-700"
            >
              <option value="">All Tiers (3)</option>
              {filterOptions.reading_levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Format</label>
            <select
              value={selectedContentType}
              onChange={(e) => { setSelectedContentType(e.target.value); setPage(1); }}
              className="w-full p-1.5 rounded border border-slate-200 bg-white text-slate-700 focus:border-navy-700"
            >
              <option value="">All Formats (5)</option>
              {filterOptions.content_types.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Complexity</label>
            <select
              value={selectedComplexity}
              onChange={(e) => { setSelectedComplexity(e.target.value); setPage(1); }}
              className="w-full p-1.5 rounded border border-slate-200 bg-white text-slate-700 focus:border-navy-700"
            >
              <option value="">All Levels (1-5)</option>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] text-slate-400 font-mono mr-1">Active:</span>
            {selectedTopic && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ice-100 text-navy-800 text-[11px] font-medium border border-ice-200">
                Topic: {selectedTopic}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTopic('')} />
              </span>
            )}
            {selectedAudience && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ice-100 text-navy-800 text-[11px] font-medium border border-ice-200 capitalize">
                Audience: {selectedAudience}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAudience('')} />
              </span>
            )}
            {selectedReadingLevel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ice-100 text-navy-800 text-[11px] font-medium border border-ice-200 capitalize">
                Tier: {selectedReadingLevel}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedReadingLevel('')} />
              </span>
            )}
            {selectedContentType && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ice-100 text-navy-800 text-[11px] font-medium border border-ice-200">
                Format: {selectedContentType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedContentType('')} />
              </span>
            )}
            {selectedComplexity && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ice-100 text-navy-800 text-[11px] font-medium border border-ice-200">
                Complexity: Level {selectedComplexity}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedComplexity('')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
        <div>
          Showing <strong>{resourcesData.total}</strong> matching resources
          {query && <span> for "<strong>{query}</strong>"</span>}
        </div>
        <div>
          Page {page} of {resourcesData.total_pages || 1}
        </div>
      </div>

      {/* Grid or Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 animate-pulse">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : resourcesData.items.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5 stroke-[1.75]" />
          </div>
          <h3 className="font-semibold text-slate-900 text-sm">No matching resources found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Try adjusting your search terms or clearing some filters to explore more of the polar science collection.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded bg-navy-800 text-white font-medium text-xs transition-colors"
          >
            Clear Filters
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
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono text-slate-500 px-3">
            {page} / {resourcesData.total_pages}
          </span>

          <button
            disabled={page >= resourcesData.total_pages}
            onClick={() => setPage((p) => Math.min(resourcesData.total_pages, p + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal */}
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
