export interface VintageClothing {
    id: string;

    name: string;
    price: number;
    dateSold: string;
    type: string;
    brand: string;
    
    size: string;
    era: string;

    seller: string;
    imageUrl: string;
    description: string;
  }
  
  export interface SearchResult {
    items: VintageClothing[];
    total: number;
  }