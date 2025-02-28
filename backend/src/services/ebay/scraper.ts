import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchOptions, SoldItem } from './types';
import { AppError } from '../../api/middleware/error';
import { ParsingUtils } from '../../utils/parsing.utils';

export class EbayScraper {
    private readonly BASE_URL = 'https://www.ebay.com/sch/i.html';
    private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

    async searchSoldItems(keywords: string, options: SearchOptions = {}): Promise<SoldItem[]> {
        try {
            const searchUrl = this.buildSearchUrl(keywords, options);
            const res = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': this.USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
            });

            const $ = cheerio.load(res.data);
            return this.parseSoldListings($);
        } catch (error) {
            console.error('Scraping error:', error);
            throw new AppError('Failed to fetch sold items', 500);
        }
    }

    private buildSearchUrl(keywords: string, options: SearchOptions): string {
        const params = new URLSearchParams({
            '_nkw': keywords.split(' ').join('+'), // Search keywords
            'LH_Sold': '1',            // Sold items
            '_sop': '13',              // Sort by end date (recent first)
            'rt': 'nc',                // No 'did you mean'
        })

        if (options.category) {
            params.append('_sacat', options.category);
        }
      
        if (options.condition) {
            params.append('LH_ItemCondition', options.condition);
        }

        if (options.page) {
            params.append('_pgn', options.page);
        }

        if(options.results) {
            params.append('_ipg', options.results);
        }

        return `${this.BASE_URL}?${params.toString()}`;
    }

    private parseSoldListings($: cheerio.CheerioAPI): SoldItem[] {
        const items: SoldItem[] = [];

        $('li.s-item.s-item__pl-on-bottom[data-viewport][id][data-view]').each((_, element) => {
            try {
                const item = this.parseListingElement($, element);
                if (item) {
                    items.push(item);
                }
            } catch (error) {
                console.warn('Error parsing listing:', error);
            }
        });

        return items;
    }

    private parseListingElement($: cheerio.CheerioAPI, element: any): SoldItem | null {
        const wrapper = $(element);

        if(!wrapper.find('.s-item__title').length) {
            return null;
        }

        try {
            const title = wrapper.find('.s-item__title').text().trim();
            const price = ParsingUtils.extractPrice(
                wrapper.find('.s-item__price').first().text().trim()
            );
            const imageUrl = ParsingUtils.parseImageUrl(
                wrapper.find('.s-item__image-wrapper > img').attr('src')
            );
            const listingUrl = ParsingUtils.parseListingUrl(
                wrapper.find('a.s-item__link').attr('href')
            );
            const soldDate = ParsingUtils.parseSoldDate(
                wrapper.find('.s-item__caption > .s-item__caption--row > .s-item__caption--signal > span').text().trim()
            );
            const condition = wrapper.find('.s-item__subtitle .SECONDARY_INFO').text().trim();

            if(!price || !soldDate || title.toLowerCase().includes('shop on ebay')) {
                return null;
            }

            return {
                title,
                soldPrice: {
                    value: price,
                    currency: 'USD'
                },
                imageUrl: imageUrl!,
                listingUrl: listingUrl!,
                soldDate,
                condition
            }

        } catch (error) {
            console.warn('Error parsing individual listing:', error);
            return null;
        }
    }
}