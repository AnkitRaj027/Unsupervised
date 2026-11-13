import React, { useEffect, useState } from 'react';
import { Layers, Compass, ArrowRight } from 'lucide-react';
import { fetchClusters } from '../services/api';
import ResourceDetailModal from '../components/ResourceDetailModal';

export default function ClustersPage({ onSelectCluster }) {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  useEffect(() => {
    fetchClusters()
      .then((data) => {
        setClusters(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load clusters from backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-teal-500 border-t-transparent mb-3" />
        <p className="text-secondary text-xs font-mono">Loading K-Means cluster centroids...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-rose-400 text-xs font-mono">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-primary">
      {/* Header */}
      <div className="border-b border-dark-border pb-4">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-teal-400 mb-1">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Thematic Discovery</span>
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Unsupervised Topic Clusters
        </h1>
        <p className="text-secondary text-xs mt-1 max-w-3xl">
          Discovered automatically by K-Means ($k=10$) on 1500-D TF-IDF text features. Centroids identify the most influential scientific terminology without manual annotation.
        </p>
      </div>

      {/* Cluster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.map((cluster) => (
          <div
            key={cluster.cluster_id}
            className="bg-dark-card rounded-md border border-dark-border p-4 shadow-card hover:border-slate-500/60 transition-colors flex flex-col justify-between space-y-3.5"
          >
            <div>
              {/* Top metadata */}
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-mono text-[11px] font-semibold text-teal-400 bg-dark-bg px-2 py-0.5 rounded border border-dark-border">
                  Cluster #{cluster.cluster_id}
                </span>
                <span className="text-[11px] text-muted font-mono">
                  {cluster.size} resources
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-semibold text-primary mb-1 leading-snug">
                {cluster.name}
              </h3>

              {/* Dominant topic */}
              <div className="flex items-center gap-1.5 text-xs text-secondary mb-3">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Primary Discipline: <strong className="text-primary font-medium">{cluster.dominant_topic}</strong></span>
              </div>

              {/* Centroid Keywords */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-mono text-muted">Centroid Keywords</span>
                  <span className="text-[10px] font-mono text-teal-400 bg-dark-bg px-1.5 py-0.5 rounded border border-dark-border">
                    Coherence: {cluster.coherence_score}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cluster.top_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-dark-bg text-secondary border border-dark-border"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample resources */}
              <div className="space-y-1 pt-2 border-t border-dark-border text-xs">
                <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">
                  Sample Resources:
                </span>
                {cluster.resources.slice(0, 2).map((res) => (
                  <div
                    key={res.resource_id}
                    onClick={() => setSelectedResourceId(res.resource_id)}
                    className="p-1 rounded hover:bg-dark-bg cursor-pointer text-secondary truncate transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2 group-hover:text-teal-400 font-medium text-[11px]">
                      [{res.resource_id}] {res.title}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted group-hover:text-teal-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Explore CTA */}
            <button
              onClick={() => onSelectCluster(cluster.cluster_id, cluster.dominant_topic)}
              className="w-full py-1.5 rounded bg-dark-bg hover:bg-dark-border border border-dark-border text-secondary hover:text-primary font-medium text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore All {cluster.size} Resources</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

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
