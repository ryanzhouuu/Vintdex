export class ParsingUtils {
    static extractPrice(priceText: string): number | null {
        try {
          const cleanPrice = priceText.replace(/[^0-9.]/g, '');
          const price = parseFloat(cleanPrice);
          return isNaN(price) ? null : price;
        } catch {
          return null;
        }
    }

    static parseSoldDate(dateText: string): Date | null {
        try {
          const cleanDate = dateText.replace('Sold', '').trim();
          const date = new Date(cleanDate);
          return isNaN(date.getTime()) ? null : date;
        } catch {
          return null;
        }
    }

    static parseImageUrl(url: string | undefined): string | null {
        if (!url) return null;
        try {
          // Remove any tracking parameters and ensure HTTPS
          const cleanUrl = url.split('?')[0].replace(/^http:/, 'https:').replace(/s-l\d+\.webp$/, "s-l1000.jpeg");;
          return cleanUrl || null;
        } catch {
          return null;
        }
    }

    static parseListingUrl(url: string | undefined): string | null {
        if (!url) return null;
        try {
          // Keep only essential URL parameters
          const urlObj = new URL(url);
          const itemId = urlObj.pathname.split('/')[2];
          return `https://www.ebay.com/itm/${itemId}` || null;
        } catch {
          return null;
        }
    }
}