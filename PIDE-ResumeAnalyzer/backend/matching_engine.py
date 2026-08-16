"""
Matching and Scoring Engine
Implements keyword-based, semantic, and hybrid matching for resume-job pairing
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re
from typing import Dict, List, Tuple, Optional

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')


class KeywordMatcher:
    """
    Keyword-based matching engine
    Compares extracted resume attributes against job requirements
    """
    
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        # Synonym dictionary for domain-specific terms
        self.synonyms = {
            'python': ['python', 'py', 'python3', 'python 3'],
            'java': ['java', 'j2ee', 'spring', 'springboot'],
            'sql': ['sql', 'mysql', 'postgresql', 'oracle', 'database'],
            'machine learning': ['machine learning', 'ml', 'deep learning', 'neural networks'],
            'data science': ['data science', 'data scientist', 'analytics', 'big data'],
            'frontend': ['frontend', 'front-end', 'ui', 'user interface', 'web ui'],
            'backend': ['backend', 'back-end', 'api', 'server-side'],
            'devops': ['devops', 'dev-ops', 'ci/cd', 'deployment', 'infrastructure'],
            'aws': ['aws', 'amazon web services', 'ec2', 's3'],
            'azure': ['azure', 'microsoft azure', 'cloud'],
            'dashboard': ['dashboard', 'dashboarding', 'data visualization', 'tableau'],
        }
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        text = text.lower()
        # Remove special characters
        text = re.sub(r'[^a-z0-9\s]', '', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        normalized = self.normalize_text(text)
        tokens = word_tokenize(normalized)
        # Filter out stopwords and short tokens
        keywords = [t for t in tokens if t not in self.stop_words and len(t) > 2]
        return keywords
    
    def find_synonym_match(self, keyword: str) -> Optional[str]:
        """Find canonical form of keyword if it's a synonym"""
        keyword_lower = keyword.lower()
        for canonical, synonyms_list in self.synonyms.items():
            if keyword_lower in synonyms_list:
                return canonical
        return None
    
    def calculate_keyword_score(self, 
                               resume_text: str, 
                               requirements: Dict[str, List[str]]) -> Tuple[float, Dict]:
        """
        Calculate keyword-based matching score
        
        Args:
            resume_text: Extracted resume text
            requirements: Dict of requirement categories and their keywords
            
        Returns:
            Tuple of (score 0-100, detailed breakdown)
        """
        resume_keywords = set(self.extract_keywords(resume_text))
        
        # Expand keywords with synonyms
        expanded_resume = set()
        for keyword in resume_keywords:
            expanded_resume.add(keyword)
            synonym = self.find_synonym_match(keyword)
            if synonym:
                expanded_resume.add(synonym)
        
        matched_by_category = {}
        total_required = 0
        total_matched = 0
        
        # Score each requirement category
        for category, req_keywords in requirements.items():
            category_matched = 0
            category_total = len(req_keywords)
            total_required += category_total
            
            for req_keyword in req_keywords:
                req_norm = self.normalize_text(req_keyword)
                req_tokens = set(self.extract_keywords(req_norm))
                
                # Check for exact or partial matches
                if req_tokens & expanded_resume:  # Intersection
                    category_matched += 1
                    total_matched += 1
            
            matched_by_category[category] = {
                'matched': category_matched,
                'total': category_total,
                'percentage': (category_matched / category_total * 100) if category_total > 0 else 0
            }
        
        # Calculate overall score
        overall_score = (total_matched / total_required * 100) if total_required > 0 else 0
        
        return overall_score, {
            'overall': overall_score,
            'by_category': matched_by_category,
            'total_matched': total_matched,
            'total_required': total_required
        }


class SemanticMatcher:
    """
    Semantic matching using embeddings
    Uses sentence transformers for semantic similarity
    """
    
    def __init__(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.available = True
        except ImportError:
            print("Warning: sentence_transformers not installed. Semantic matching disabled.")
            self.available = False
    
    def get_embedding(self, text: str) -> np.ndarray:
        """Get embedding for text"""
        if not self.available:
            return np.zeros(384)
        return self.model.encode(text, convert_to_numpy=True)
    
    def calculate_semantic_score(self,
                                resume_text: str,
                                requirement_text: str) -> Tuple[float, Dict]:
        """
        Calculate semantic similarity score using embeddings
        
        Args:
            resume_text: Extracted resume text
            requirement_text: Job requirement text
            
        Returns:
            Tuple of (score 0-100, breakdown)
        """
        if not self.available:
            return 0.0, {'error': 'Semantic matcher not available'}
        
        # Get embeddings
        resume_embedding = self.get_embedding(resume_text)
        requirement_embedding = self.get_embedding(requirement_text)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(
            [resume_embedding], 
            [requirement_embedding]
        )[0][0]
        
        # Normalize to 0-100 scale
        semantic_score = float(similarity) * 100
        
        # Apply threshold (65% = potential match)
        is_match = semantic_score >= 65
        
        return semantic_score, {
            'similarity': float(similarity),
            'score': semantic_score,
            'is_match': is_match,
            'threshold': 65,
            'embedding_dim': 384
        }


class HybridScorer:
    """
    Hybrid scoring combining keyword and semantic matching
    Supports configurable weighting per posting
    """
    
    def __init__(self):
        self.keyword_matcher = KeywordMatcher()
        self.semantic_matcher = SemanticMatcher()
        self.default_weights = {
            'keyword': 0.4,
            'semantic': 0.6
        }
    
    def calculate_hybrid_score(self,
                              resume_text: str,
                              requirements: Dict[str, List[str]],
                              requirement_text: str,
                              weights: Optional[Dict] = None) -> Dict:
        """
        Calculate hybrid score combining keyword and semantic matching
        
        Args:
            resume_text: Extracted resume text
            requirements: Dict of requirement categories
            requirement_text: Full requirement text
            weights: Optional custom weights {keyword: 0.4, semantic: 0.6}
            
        Returns:
            Dict with detailed scoring breakdown
        """
        # Use provided weights or defaults
        weights = weights or self.default_weights
        
        # Validate weights sum to 1
        weight_sum = weights['keyword'] + weights['semantic']
        if weight_sum != 1.0:
            # Normalize weights
            weights['keyword'] /= weight_sum
            weights['semantic'] /= weight_sum
        
        # Calculate keyword score
        keyword_score, keyword_breakdown = self.keyword_matcher.calculate_keyword_score(
            resume_text, 
            requirements
        )
        
        # Calculate semantic score
        semantic_score, semantic_breakdown = self.semantic_matcher.calculate_semantic_score(
            resume_text,
            requirement_text
        )
        
        # Calculate hybrid score
        hybrid_score = (
            weights['keyword'] * keyword_score +
            weights['semantic'] * semantic_score
        )
        
        # Interpret score
        if hybrid_score >= 80:
            interpretation = "Excellent match - Interview recommended"
        elif hybrid_score >= 60:
            interpretation = "Good match - Screen for fit"
        elif hybrid_score >= 40:
            interpretation = "Moderate match - Consider if pipeline is thin"
        elif hybrid_score >= 20:
            interpretation = "Weak match - Consider for future roles"
        else:
            interpretation = "No match - Archive"
        
        return {
            'hybrid_score': round(hybrid_score, 2),
            'interpretation': interpretation,
            'keyword_score': round(keyword_score, 2),
            'semantic_score': round(semantic_score, 2),
            'weights': weights,
            'keyword_breakdown': keyword_breakdown,
            'semantic_breakdown': semantic_breakdown,
            'confidence': round(max(keyword_score, semantic_score), 2)
        }


class CandidateRanker:
    """
    Ranks candidates based on hybrid scores
    """
    
    def __init__(self):
        self.scorer = HybridScorer()
    
    def rank_candidates(self,
                       candidates: List[Dict],
                       job_posting: Dict,
                       weights: Optional[Dict] = None) -> List[Dict]:
        """
        Rank multiple candidates against a job posting
        
        Args:
            candidates: List of candidate dicts with 'name', 'email', 'resume_text'
            job_posting: Dict with 'title', 'requirements', 'full_text'
            weights: Optional custom scoring weights
            
        Returns:
            List of ranked candidates with scores
        """
        ranked = []
        
        for candidate in candidates:
            # Calculate score
            score_result = self.scorer.calculate_hybrid_score(
                candidate['resume_text'],
                job_posting['requirements'],
                job_posting['full_text'],
                weights
            )
            
            # Add to ranked list with candidate info
            ranked_candidate = {
                'candidate_name': candidate.get('name', 'Unknown'),
                'email': candidate.get('email', ''),
                'resume_preview': candidate['resume_text'][:300],
                'scores': score_result
            }
            ranked.append(ranked_candidate)
        
        # Sort by hybrid score (descending)
        ranked.sort(key=lambda x: x['scores']['hybrid_score'], reverse=True)
        
        # Add rank
        for idx, candidate in enumerate(ranked, 1):
            candidate['rank'] = idx
        
        return ranked


# Example usage and testing
if __name__ == "__main__":
    print("=" * 80)
    print("MATCHING & SCORING ENGINE DEMONSTRATION")
    print("=" * 80)
    
    # Sample resume
    sample_resume = """
    John Smith
    Senior Data Scientist
    
    Skills: Python, Machine Learning, SQL, Tableau, AWS, TensorFlow
    Experience: 7 years in data science and analytics
    Education: MS in Computer Science
    Certifications: AWS Solutions Architect
    """
    
    # Sample job requirements
    job_requirements = {
        'technical_skills': ['Python', 'Machine Learning', 'SQL', 'Spark'],
        'education': ['Bachelor in CS', 'Master preferred'],
        'experience': ['5+ years data science', 'Analytics background'],
        'certifications': ['AWS certification']
    }
    
    job_text = """
    Senior Data Scientist
    Required: Python, ML, SQL, 5+ years experience, AWS knowledge
    Preferred: Spark, Advanced ML models
    """
    
    # Initialize scorer
    scorer = HybridScorer()
    
    # Calculate score with default weights
    result = scorer.calculate_hybrid_score(
        sample_resume,
        job_requirements,
        job_text
    )
    
    print("\nDEFAULT WEIGHTS (Keyword: 40%, Semantic: 60%)")
    print(f"Hybrid Score: {result['hybrid_score']}/100")
    print(f"Keyword Score: {result['keyword_score']}/100")
    print(f"Semantic Score: {result['semantic_score']}/100")
    print(f"Interpretation: {result['interpretation']}")
    
    # Try custom weights
    custom_weights = {'keyword': 0.7, 'semantic': 0.3}
    result_custom = scorer.calculate_hybrid_score(
        sample_resume,
        job_requirements,
        job_text,
        custom_weights
    )
    
    print("\nCUSTOM WEIGHTS (Keyword: 70%, Semantic: 30%)")
    print(f"Hybrid Score: {result_custom['hybrid_score']}/100")
    print(f"Keyword Score: {result_custom['keyword_score']}/100")
    print(f"Semantic Score: {result_custom['semantic_score']}/100")
    print(f"Interpretation: {result_custom['interpretation']}")
    
    print("\n" + "=" * 80)
    print("Testing complete!")
