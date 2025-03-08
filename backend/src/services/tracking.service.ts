import { EbayScraper } from "./ebay/scraper";
import { ImageSimilarityService } from "./image-similarity.service";
import { QueryMatcherService } from "./query-matcher.service";
import { ApiResponse, MatchResult, SearchOptions } from "@vintdex/types";
import { AppError } from '../api/middleware/error';

export class TrackingService {
    private imageSimilarity: ImageSimilarityService;
    private queryMatcher: QueryMatcherService;
    private scraper: EbayScraper;
    private isInitialized: boolean = false;

    constructor() {
        this.imageSimilarity = new ImageSimilarityService();
        this.queryMatcher = new QueryMatcherService();
        this.scraper = new EbayScraper();
    }


    async trackNewItem(sourceImage: Buffer, title: string): Promise<any> {
        const options: SearchOptions = {
            results: "60",
            category: "11450"
        }
        const soldItems = await this.scraper.searchSoldItems(title, options);
        console.log('Fetched sold items: ', + soldItems.length);
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
        .filter(result => result.imageSimilarity >= 0.55)
        .sort((a, b) => b.imageSimilarity - a.imageSimilarity);

        return {
            success: true,
            data: results,
            count: results.length
        }
    }
}