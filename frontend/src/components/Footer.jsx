import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark-section text-secondary border-t border-dark-border text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary text-sm">
                Polar Outreach Agent
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-dark-card text-teal-400 border border-dark-border">
                MoES • SIH26063
              </span>
            </div>
            <p className="text-secondary text-xs leading-relaxed max-w-lg">
              Educational resource organization platform developed for the Ministry of Earth Sciences (MoES), Government of India. Organizing polar science, Antarctica, Arctic, and climate research through content analysis, unsupervised topic clustering, and audience-based discovery.
            </p>
          </div>

          {/* Core Pipeline */}
          <div>
            <h4 className="text-primary font-semibold text-xs uppercase tracking-wider mb-2 font-mono">
              Pipeline Stack
            </h4>
            <ul className="space-y-1 text-secondary text-xs font-mono">
              <li>• FastAPI & Python 3</li>
              <li>• TF-IDF Vectorization</li>
              <li>• K-Means Clustering (k=10)</li>
              <li>• Cosine Similarity Retrieval</li>
            </ul>
          </div>

          {/* Academic Integrity */}
          <div>
            <h4 className="text-primary font-semibold text-xs uppercase tracking-wider mb-2 font-mono">
              Research Integrity
            </h4>
            <p className="text-secondary text-xs leading-relaxed">
              354 curated polar educational resources. All clustering metrics, coherence ratings, and distributions are computed directly from authentic dataset records.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted gap-2 font-mono">
          <p>© {new Date().getFullYear()} Polar Outreach Agent. Ministry of Earth Sciences.</p>
          <div className="flex items-center gap-3 text-secondary">
            <span>Unsupervised Clustering</span>
            <span>•</span>
            <span>Zero Paid APIs</span>
            <span>•</span>
            <span>SIH26063</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
