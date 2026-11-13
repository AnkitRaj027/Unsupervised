import React, { useEffect, useState } from 'react';
import { X, Compass, Layers, Users, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { fetchResourceById } from '../services/api';

export default function ResourceDetailModal({ resourceId, onClose, onSelectResource }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resourceId) return;
    setLoading(true);
    fetchResourceById(resourceId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load resource details.');
        setLoading(false);
      });
  }, [resourceId]);

  if (!resourceId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-dark-card rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-dark-border text-primary">
        {/* Modal Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-5 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-mono">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-dark-bg text-teal-400 border border-dark-border">
                {resourceId}
              </span>
              {data && (
                <span className="text-[11px] text-muted uppercase tracking-wider">
                  {data.content_type}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-primary leading-snug">
              {loading ? 'Loading metadata...' : data?.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-primary hover:bg-dark-bg transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.75]" />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-secondary">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-teal-500 border-t-transparent mb-3" />
            <p className="text-xs font-mono">Retrieving resource and nearest neighbors...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-xs font-mono">{error}</div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Topic & Cluster Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-dark-bg border border-dark-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1">
                  Scientific Discipline
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-teal-400 text-sm">
                  <Compass className="w-4 h-4 text-teal-400 stroke-[1.75]" />
                  <span>{data.topic}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-dark-bg border border-dark-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1">
                  ML Thematic Cluster
                </span>
                <div className="flex items-center gap-1.5 font-medium text-primary text-sm">
                  <Layers className="w-4 h-4 text-secondary stroke-[1.75]" />
                  <span className="truncate">{data.cluster_label}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2 font-mono">
                Scientific Abstract
              </h4>
              <p className="text-secondary text-xs sm:text-sm leading-relaxed p-4 rounded bg-dark-bg border border-dark-border font-normal">
                {data.description}
              </p>
            </div>

            {/* Reading Level & Pedagogy Evaluation */}
            <div className="p-4 rounded border border-dark-border bg-dark-bg/60 space-y-3">
              <div className="flex items-center justify-between border-b border-dark-border pb-2">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  Reading Level & Complexity Analysis
                </span>
                <span className="text-[11px] text-muted font-mono">Length: {data.word_count} words</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded bg-dark-card border border-dark-border">
                  <span className="text-muted block text-[10px] uppercase font-mono">Verified Level</span>
                  <span className="font-semibold text-primary capitalize">{data.reading_level}</span>
                </div>
                <div className="p-2.5 rounded bg-dark-card border border-dark-border">
                  <span className="text-muted block text-[10px] uppercase font-mono">Complexity</span>
                  <span className="font-semibold text-primary">Level {data.scientific_complexity} / 5</span>
                </div>
                <div className="p-2.5 rounded bg-dark-card border border-dark-border">
                  <span className="text-muted block text-[10px] uppercase font-mono">Flesch Score</span>
                  <span className="font-semibold text-primary font-mono">{data.flesch_reading_ease}</span>
                </div>
              </div>

              <p className="text-[11px] text-secondary leading-relaxed bg-dark-card p-2.5 rounded border border-dark-border">
                <strong>Pedagogical Distinction:</strong> The <em>Verified Level</em> is assigned by polar educators based on intended curriculum tier. The <em>Flesch Reading Ease score</em> is computed algorithmically as an empirical cross-check.
              </p>
            </div>

            {/* Target Audience & Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2 font-mono">
                  Target Demographic
                </h4>
                <div className="flex items-center gap-2 p-2.5 rounded bg-dark-bg border border-dark-border font-medium text-primary capitalize">
                  <Users className="w-3.5 h-3.5 text-muted" />
                  <span>{data.target_audience}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2 font-mono">
                  Scientific Keywords
                </h4>
                <div className="flex flex-wrap gap-1 p-2 rounded bg-dark-bg border border-dark-border">
                  {data.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-dark-card border border-dark-border text-secondary text-[11px] font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Similar Resources */}
            {data.similar_resources && data.similar_resources.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 stroke-[2]" />
                  <h4 className="text-xs font-semibold text-primary">
                    ML-Recommended Similar Resources (Cosine Similarity)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.similar_resources.map((sim) => (
                    <div
                      key={sim.resource_id}
                      onClick={() => onSelectResource(sim.resource_id)}
                      className="p-3 rounded border border-dark-border hover:border-teal-500/50 bg-dark-bg hover:bg-dark-card cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted font-mono mb-0.5">
                          <span>{sim.resource_id}</span>
                          <span>•</span>
                          <span className="text-teal-400 font-semibold">{Math.round(sim.similarity_score * 100)}% match</span>
                        </div>
                        <h5 className="text-xs font-medium text-primary truncate group-hover:text-teal-400">
                          {sim.title}
                        </h5>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-dark-bg border-t border-dark-border flex items-center justify-between text-xs text-muted font-mono">
          <span>MoES Polar Science Catalog</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-dark-card hover:bg-dark-border border border-dark-border text-primary font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
