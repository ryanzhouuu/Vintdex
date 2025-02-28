import express from 'express';
import { TrackingService } from '../../services/tracking.service';
import { EbayScraper } from '../../services/ebay/scraper';
import { SearchOptions } from '@vintdex/types';
import { AppError } from '../middleware/error';

const router = express.Router();
const trackingService = new TrackingService();
const scraper = new EbayScraper();

interface SearchQueryParams {
    query?: string,
    limit?: string,
    category?: string,
    resultsPerPage?: "60" | "120" | "240",
    condition?: string,
    page?: string
}

router.get('/ebay_search', async (req, res, next) => {
    try {
        const { 
            query,
            category,
            resultsPerPage,
            condition,
            page
        } = req.query as SearchQueryParams;

        if(!query) throw new AppError('Query is required', 400);

        const queryTerms = decodeURI(query.toString());
        const options: SearchOptions = {
            category: category,
            results: resultsPerPage,
            condition: condition,
            page: page
        }

        const results = await scraper.searchSoldItems(queryTerms, options);
        res.json({
            success: true,
            data: results,
            count: results.length,
            queryTerms,
            options
        })

    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Failed to search sold items', 500));
    }
})

export default router;