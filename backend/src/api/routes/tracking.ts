import express, { Request } from 'express';
import { TrackingService } from '../../services/tracking.service';
import { EbayScraper } from '../../services/ebay/scraper';
import { SearchOptions, TrackingRequestData } from '@vintdex/types';
import { AppError } from '../middleware/error';

const router = express.Router();
const trackingService = new TrackingService();
const scraper = new EbayScraper();

interface EbaySearchQueryParams {
    query?: string,
    limit?: string,
    category?: string,
    resultsPerPage?: "60" | "120" | "240",
    condition?: string,
    page?: string
}

// TEST ENDPOINT
router.get('/ebay_search', async (req, res, next) => {
    try {
        const { 
            query,
            category,
            resultsPerPage,
            condition,
            page
        } = req.query as EbaySearchQueryParams;

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

router.post('/new', async (req: Request<{}, {}, TrackingRequestData>, res, next) => {
    try {
        const { imageData, title, category, decade, brand } = req.body;

        if(!imageData || !title ) throw new AppError('Image data and title are required', 400);

        const imageBuffer = Buffer.from(imageData, 'base64');
        console.log('Got image buffer ', imageBuffer.length);
        const trackingResult = await trackingService.trackNewItem(imageBuffer, title, category, decade, brand);
        
        res.send(trackingResult);
    } catch (error) {
        console.error('Error in tracking route:', error);
        next(error instanceof AppError ? error : new AppError('Failed to search sold items', 500));
    } 

})

export default router;