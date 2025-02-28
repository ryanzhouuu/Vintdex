import natural from 'natural';
import { QueryMatchScore, SoldItem } from '@vintdex/types';

export class QueryMatcherService {
  private tokenizer: natural.WordTokenizer;
  private tfidf: natural.TfIdf;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
  }

  matchQuery(
    query: string,
    listings: SoldItem[]
  ): QueryMatchScore[] {
    // Prepare query
    const queryTokens = this.tokenizer.tokenize(query.toLowerCase()) || [];
    
    // Calculate scores
    return listings.map(listing => {
      const listingText = listing.title.toLowerCase();
      const listingTokens = this.tokenizer.tokenize(listingText) || [];
      
      // Calculate token overlap and importance
      const matchedTerms = queryTokens.filter(token => 
        listingTokens.includes(token)
      );

      return {
        listingUrl: listing.listingUrl || '',
        matchScore: matchedTerms.length / queryTokens.length,
        matchedTerms
      };
    });
  }
} 