import React from 'react';
import { Compass, Users, Sparkles } from 'lucide-react';

export default function ResourceCard({ resource, onSelect }) {
  // Reading level tags in subtle dark research theme
  const levelStyles = {
    beginner: 'bg-dark-bg text-secondary border-dark-border',
    intermediate: 'bg-teal-950/40 text-teal-400 border-teal-800/50',
    advanced: 'bg-dark-nav text-primary border-dark-border',
  };

  const levelClass = levelStyles[resource.reading_level.toLowerCase()] || 'bg-dark-bg text-secondary border-dark-border';

  return (
    <div 
      onClick={() => onSelect(resource.resource_id)}
      className="bg-dark-card rounded-md border border-dark-border hover:border-slate-500/60 shadow-card transition-all duration-150 flex flex-col justify-between p-4 cursor-pointer group"
    >
      <div>
        {/* Header row: ID, Format, Relevance */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[11px] font-medium text-secondary">
              {resource.resource_id}
            </span>
            <span className="text-dark-border">•</span>
            <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
              {resource.content_type}
            </span>
          </div>

          {resource.similarity_score !== undefined && resource.similarity_score !== null && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium text-teal-400 bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-800/50">
              <Sparkles className="w-2.5 h-2.5 text-teal-400" />
              <span>{Math.round(resource.similarity_score * 100)}% Match</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-primary text-sm leading-snug group-hover:text-teal-400 transition-colors mb-2 line-clamp-2">
          {resource.title}
        </h3>

        {/* Topic Tag */}
        <div className="mb-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-dark-bg text-teal-400 border border-dark-border">
            <Compass className="w-3 h-3 text-teal-400 stroke-[1.75]" />
            <span>{resource.topic}</span>
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-secondary line-clamp-3 leading-relaxed mb-3.5 font-normal">
          {resource.description}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1 mb-3.5">
          {resource.keywords.slice(0, 3).map((kw, i) => (
            <span 
              key={i} 
              className="px-1.5 py-0.5 bg-dark-bg text-secondary text-[10px] font-mono rounded border border-dark-border"
            >
              #{kw}
            </span>
          ))}
          {resource.keywords.length > 3 && (
            <span className="px-1 py-0.5 text-muted text-[10px] font-mono">
              +{resource.keywords.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="pt-2.5 border-t border-dark-border flex items-center justify-between text-xs text-secondary">
        <div className="flex items-center gap-2">
          {/* Reading Level Pill */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${levelClass}`}>
            {resource.reading_level}
          </span>

          {/* Target Audience */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted capitalize">
            <Users className="w-3 h-3 text-muted" />
            <span className="truncate max-w-[100px]">{resource.target_audience}</span>
          </span>
        </div>

        {/* Complexity Indicator */}
        <div className="flex items-center gap-1.5" title={`Complexity: Level ${resource.scientific_complexity} of 5`}>
          <span className="font-mono text-[10px] text-muted">L{resource.scientific_complexity}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <span
                key={lvl}
                className={`w-1.5 h-1.5 rounded-xs ${
                  lvl <= resource.scientific_complexity ? 'bg-teal-500' : 'bg-dark-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
