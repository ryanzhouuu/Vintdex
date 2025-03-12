import express, { Request, Response, NextFunction, query } from 'express';
import { SearchTrackedItemsParams } from '@vintdex/types';
import { ItemsService } from '../../services/items.service';

const router = express.Router();
const itemsService = new ItemsService();

router.get('/search', async (req: Request<{}, {}, {}, SearchTrackedItemsParams>, res, next) => {
    try {
        console.log(req.query)
        if(!req.query) throw new Error('Query is required');

        const result = await itemsService.searchTrackedItems(req.query);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await itemsService.getItemById(id);
        res.json(item);
    } catch (error) {
        next(error);
    }
})

export default router;