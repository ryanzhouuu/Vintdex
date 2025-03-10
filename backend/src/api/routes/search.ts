import express, { Request, Response, NextFunction, query } from 'express';
import { SearchService } from '../../services/search.service';
import { SearchTrackedItemsParams } from '@vintdex/types';

const router = express.Router();
const searchService = new SearchService();

router.get('/', async (req: Request<{}, {}, {}, SearchTrackedItemsParams>, res, next) => {
    try {
        console.log(req.query)
        if(!req.query) throw new Error('Query is required');

        const result = await searchService.searchTrackedItems(req.query);
        res.send(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
})

export default router;