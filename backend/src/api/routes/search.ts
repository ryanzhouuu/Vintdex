import express from 'express';
import { SearchService } from '../../services/search.service';

const router = express.Router();
const searchService = new SearchService();

export default router;