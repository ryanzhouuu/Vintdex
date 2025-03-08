import { SoldItem } from "./ebay";

export interface ImageSimilarityScore {
  imageUrl: string;
  similarityScore: number;
  confidence: number
}

export interface QueryMatchScore {
  listingUrl: string;
  matchScore: number;
  matchedTerms: string[];
}

export interface MatchResult {
  soldItem: SoldItem;
  imageSimilarity: number;
  queryMatch: number;
  totalScore: number;
}

export interface PriceProjection {
  projectedPrice: number;
  confidence: number;
}