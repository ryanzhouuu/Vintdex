export interface SearchOptions {
  category?: string;
  condition?: string;
  results?: "60" | "120" | "240",
  page?: string;
}

export interface SoldItem {
  title: string;
  soldPrice: {
    value: number;
    currency: string;
  };
  imageUrl?: string;
  listingUrl?: string;
  soldDate: Date;
  condition?: string;
}