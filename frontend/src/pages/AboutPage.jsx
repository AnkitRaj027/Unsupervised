import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const pipelineSteps = [
    { title: 'Dataset', desc: '354 curated records across 10 disciplines' },
    { title: 'Text Preprocessing', desc: 'Boilerplate removal & domain weighting' },
    { title: 'TF-IDF (1500-D)', desc: 'N-gram feature vectorization' },
    { title: 'K-Means (k=10)', desc: 'Centroid clustering & keyword synthesis' },
    { title: 'Resource Organization', desc: 'Difficulty tiers & audience taxonomy' },
    { title: 'Evaluation', desc: 'Silhouette, Coherence & Baselines' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-primary">
      {/* Header */}
      <div className="border-b border-dark-border pb-4">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-teal-400 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>System Architecture</span>
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Methodology & Machine Learning Pipeline
        </h1>
        <p className="text-secondary text-xs mt-1 leading-relaxed">
          Technical methodology, algorithms, and system design for SIH Problem Statement SIH26063 (Ministry of Earth Sciences).
        </p>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="p-4 rounded-md bg-dark-card border border-dark-border space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
          ML Architecture Pipeline
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded bg-dark-bg border border-dark-border space-y-1 text-center">
              <span className="text-[10px] font-mono text-teal-400 font-bold block">0{idx + 1}</span>
              <h4 className="text-xs font-semibold text-primary">{step.title}</h4>
              <p className="text-[10px] text-muted leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Context */}
      <div className="p-4 rounded-md bg-dark-card border border-dark-border space-y-1.5">
        <span className="font-semibold text-primary text-sm font-mono block">
          Ministry of Earth Sciences (MoES) Outreach Mandate
        </span>
        <p className="text-secondary text-xs leading-relaxed">
          India conducts active research across Antarctica (Maitri, Bharati), the Arctic (Himadri), and the Southern Ocean. The Polar Outreach Agent bridges complex research data and the public by systematically organizing 354 educational resources into discoverable, difficulty-rated pathways using unsupervised natural language processing.
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-primary uppercase font-mono">
          Detailed Methodology
        </h2>

        <div className="space-y-2.5">
          {/* Step 1 */}
          <div className="bg-dark-card p-4 rounded-md border border-dark-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-primary font-mono">
              <span className="w-5 h-5 rounded bg-dark-bg text-teal-400 text-[11px] flex items-center justify-center border border-dark-border">1</span>
              <span>Text Preprocessing & Template Boilerplate Removal</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed pl-7">
              Initial audit revealed recurring format phrases across abstracts (e.g. <em>"This infographic presents 4 panels..."</em>, <em>"This educational guide invites learners..."</em>). Without preprocessing, naive clustering groups items by publication format rather than scientific topic. We implemented a domain preprocessor that removes outreach template stop words and weights scientific keywords (<code>title + keywords + keywords + description</code>), ensuring clusters group around true disciplines like glaciology, sea ice, and polar oceans.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-dark-card p-4 rounded-md border border-dark-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-primary font-mono">
              <span className="w-5 h-5 rounded bg-dark-bg text-teal-400 text-[11px] flex items-center justify-center border border-dark-border">2</span>
              <span>TF-IDF Vectorization</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed pl-7">
              Cleaned text is vectorized into a 1500-dimensional sparse feature space using <strong>Term Frequency-Inverse Document Frequency (TF-IDF)</strong> with unigrams and bigrams (<code>ngram_range=(1,2)</code>). Domain terms specific to polar disciplines (*permafrost*, *troposphere*, *salinity*, *krill*) receive high discriminative weights.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-dark-card p-4 rounded-md border border-dark-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-primary font-mono">
              <span className="w-5 h-5 rounded bg-dark-bg text-teal-400 text-[11px] flex items-center justify-center border border-dark-border">3</span>
              <span>K-Means Clustering (k=10) & Centroid Keywords</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed pl-7">
              We apply <strong>K-Means clustering</strong> ($k=10$, <code>random_state=42</code>) to group resources into 10 cohesive clusters. For each cluster centroid, the pipeline extracts the highest-weighted coordinate features to synthesize human-readable cluster labels (e.g., <em>"Glaciology Focus (Ice, Basal, Firn)"</em>) without manual tagging.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-dark-card p-4 rounded-md border border-dark-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-primary font-mono">
              <span className="w-5 h-5 rounded bg-dark-bg text-teal-400 text-[11px] flex items-center justify-center border border-dark-border">4</span>
              <span>Cosine Similarity Search & Recommendations</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed pl-7">
              Queries are projected into the fitted TF-IDF vector space, and <strong>Cosine Similarity</strong> [cos(&theta;) = (u &middot; v) / (||u|| ||v||)] calculates angular distances against all 500 documents. Nearest neighbors generate related resource recommendations for every catalog record.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-dark-card p-4 rounded-md border border-dark-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-primary font-mono">
              <span className="w-5 h-5 rounded bg-dark-bg text-teal-400 text-[11px] flex items-center justify-center border border-dark-border">5</span>
              <span>Linguistic Readability vs. Verified Labels</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed pl-7">
              We distinguish between <strong>verified pedagogical levels</strong> (curated as Beginner, Intermediate, Advanced) and <strong>algorithmic metrics</strong>. We implemented an empirical Flesch Reading Ease scorer based on syllable density and sentence length. Because abstracts maintain uniform sentence lengths (~101 words), mathematical Flesch scores are standardized (~31.5), proving why human-curated pedagogical intent is essential for educational discovery.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Specifications */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-primary uppercase font-mono">Technology Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded bg-dark-card border border-dark-border space-y-1.5">
            <span className="text-teal-400 font-semibold block uppercase">Backend Services</span>
            <ul className="space-y-1 text-secondary">
              <li>• FastAPI (REST API Framework)</li>
              <li>• Scikit-Learn (TF-IDF & K-Means)</li>
              <li>• Pandas & NumPy (Data Operations)</li>
              <li>• Pydantic v2 (Schema Validation)</li>
            </ul>
          </div>

          <div className="p-3.5 rounded bg-dark-card border border-dark-border space-y-1.5">
            <span className="text-teal-400 font-semibold block uppercase">Frontend Interface</span>
            <ul className="space-y-1 text-secondary">
              <li>• React 18 & Vite (Fast Rendering)</li>
              <li>• Tailwind CSS (Dark Theme System)</li>
              <li>• Recharts (Data Visualizations)</li>
              <li>• Lucide React (Clean Scientific Icons)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
