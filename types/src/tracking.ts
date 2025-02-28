import { SoldItem } from "./ebay";

export interface ImageSimilarityScore {
  listingUrl: string;
  imageUrl: string;
  similarityScore: number;
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