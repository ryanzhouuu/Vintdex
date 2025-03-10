import { EbayScraper } from "./ebay/scraper";
import { ImageSimilarityService } from "./image-similarity.service";
import { QueryMatcherService } from "./query-matcher.service";
import { ApiResponse, MatchResult, PriceDataEntry, SearchOptions, SoldItem } from "@vintdex/types";
import { AppError } from '../api/middleware/error';
import { SupabaseService } from "../db/supabase";
import { projectPrice } from "../utils/price-analysis";

export class TrackingService {
    private imageSimilarity: ImageSimilarityService;
    private queryMatcher: QueryMatcherService;
    private scraper: EbayScraper;
    private supabase: SupabaseService;

    constructor() {
        this.imageSimilarity = new ImageSimilarityService();
        this.queryMatcher = new QueryMatcherService();
        this.scraper = new EbayScraper();
        this.supabase = new SupabaseService();
    }

    private async getSoldItems(title: string): Promise<SoldItem[]> {
        const options: SearchOptions = {
            results: "60",
            category: "11450"
        }
        const soldItems = await this.scraper.searchSoldItems(title, options);
        console.log('Fetched sold items: ', + soldItems.length);

        return soldItems;
    }

    async trackNewItem(sourceImage: Buffer, title: string, category: string, decade: string, brand: string): Promise<any> {
        // TODO: Add a check to see if the item has been sold before

        // Search for sold items
        const soldItems = await this.getSoldItems(title);
        
        // Compare the source image to the sold items
        const imageSimilarities = await this.imageSimilarity.compareSimilarity(
            sourceImage,
            soldItems.map(item => item.imageUrl || "")
        );

        console.log('Image similarities: ', imageSimilarities);

        const results = soldItems.map((item, index) => ({
            soldItem: item,
            imageSimilarity: imageSimilarities[index].similarityScore,
            confidence: imageSimilarities[index].confidence,
            queryMatch: this.queryMatcher.matchQuery(title, [item])[0].matchScore
        }))
        .filter(result => result.imageSimilarity >= 0.7)
        .sort((a, b) => b.imageSimilarity - a.imageSimilarity);

        const projectedPrice = projectPrice(results.map((item) => item.soldItem));
        
        const priceData = results.map((item) => <PriceDataEntry>{
            price: item.soldItem.soldPrice.value,
            currency: item.soldItem.soldPrice.currency,
            sold_date: item.soldItem.soldDate.toISOString(),
            condition: item.soldItem.condition,
            size: 'XL',
            listing_url: item.soldItem.listingUrl,
            listing_id: item.soldItem.listingUrl?.split('/').pop()
        });

        const trackedItem = await this.supabase.createTrackedItem({
            title,
            decade,
            price_data: priceData,
            projected_price: Number(projectedPrice?.projectedPrice.toFixed(2)),
            category,
            brand,
            image: sourceImage,
        })

        return {
            success: true,
            data: trackedItem
        }
    }
}