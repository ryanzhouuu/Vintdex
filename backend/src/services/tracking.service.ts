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

    private async initialize() {
        if (!this.isInitialized) {
            await this.imageSimilarity.ensureInitialized();
            this.isInitialized = true;
        }
    }

    async trackNewItem(sourceImage: Buffer, title: string): Promise<any> {
        await this.initialize();
        const options: SearchOptions = {
            results: "240",
            category: "11450"
        }
        const soldItems = await this.scraper.searchSoldItems(title, options);
        console.log('Fetched sold items: ', + soldItems.length);
        const imageSimilarities = await this.imageSimilarity.compareSimilarity(
            sourceImage,
            soldItems.map(item => item.imageUrl || "")
        );

        const results = soldItems.map((item, index) => ({
            soldItem: item,
            imageSimilarity: imageSimilarities[index].similarityScore,
            queryMatch: this.queryMatcher.matchQuery(title, [item])[0].matchScore
        }))
        .filter(result => result.imageSimilarity > 0.7)
        .sort((a, b) => b.imageSimilarity - a.imageSimilarity);

        return {
            success: true,
            data: results,
            count: results.length
        }
    }
}