import re
import string
from typing import List, Dict, Any

# Domain-neutral boilerplate terms common to outreach formats that should be removed
# to allow true polar science terminology to drive clustering
OUTREACH_BOILERPLATE = {
    "article", "infographic", "guide", "summary", "transcript", "video", 
    "panel", "readers", "examines", "explains", "section", "outlines", 
    "presents", "combines", "readers", "learners", "activity", "narrative",
    "resource", "short", "first", "relevant", "implications"
}

def clean_text(text: str) -> str:
    """
    Cleans raw text: converts to lowercase, removes punctuation and redundant whitespace.
    """
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[' + re.escape(string.punctuation) + ']', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def count_syllables(word: str) -> int:
    """
    Estimates syllable count using heuristic vowel group matching.
    """
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
    word = re.sub(r'^y', '', word)
    matches = re.findall(r'[aeiouy]{1,2}', word)
    return max(1, len(matches))

def compute_readability_metrics(text: str) -> Dict[str, Any]:
    """
    Computes heuristic readability metrics (Flesch Reading Ease, average sentence length,
    syllable density) for explainability and comparison with verified reading labels.
    """
    sentences = [s.strip() for s in re.split(r'[\.\?!]+', text) if s.strip()]
    num_sentences = max(1, len(sentences))
    words = re.findall(r'\b[a-zA-Z]+\b', text)
    num_words = max(1, len(words))
    num_syllables = sum(count_syllables(w) for w in words)
    
    # Flesch Reading Ease formula
    fre = 206.835 - (1.015 * (num_words / num_sentences)) - (84.6 * (num_syllables / num_words))
    fre = max(0.0, min(100.0, round(fre, 1)))
    
    # Vocabulary uniqueness (Type-Token Ratio)
    unique_words = len(set(w.lower() for w in words))
    ttr = round(unique_words / num_words, 2)
    
    # Estimated difficulty tier based purely on readability heuristics
    if fre >= 60:
        heuristic_level = "beginner"
    elif fre >= 35:
        heuristic_level = "intermediate"
    else:
        heuristic_level = "advanced"
        
    return {
        "flesch_reading_ease": fre,
        "avg_words_per_sentence": round(num_words / num_sentences, 1),
        "syllables_per_word": round(num_syllables / num_words, 2),
        "lexical_diversity_ttr": ttr,
        "heuristic_estimated_level": heuristic_level
    }

def build_combined_corpus(title: str, description: str, keywords: str) -> str:
    """
    Constructs an information-dense text representation emphasizing scientific keywords,
    titles, and descriptions while filtering format-specific boilerplate.
    """
    clean_kw = keywords.replace(";", " ") if isinstance(keywords, str) else ""
    # Weight keywords and title by repeating them to prioritize core domain terminology
    combined = f"{title} {clean_kw} {clean_kw} {description}"
    return clean_text(combined)

