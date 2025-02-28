import axios from 'axios';
import { AppError } from '../../api/middleware/error';

export class EbayClient {
    private readonly baseUrl: string = 'https://api.ebay.com';
    private readonly appId: string;
    private readonly certId: string;
    private readonly devId: string;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;

    constructor() {
        this.appId = process.env.EBAY_APP_ID!;
        this.certId = process.env.EBAY_CERT_ID!;
        this.devId = process.env.EBAY_DEV_ID!;

        if(!this.appId || !this.certId || !this.devId) {
            throw new Error('Missing eBay API credentials');
        }
    }

    private async getAccessToken(): Promise<string> {
        if(this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
            return this.accessToken;
        }

        try {
            const response = await axios({
                method: 'post',
                url: this.baseUrl + '/identity/v1/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${this.appId}:${this.certId}`).toString('base64')}`
                },
                data: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
            });

            this.accessToken = response.data.access_token;
            if(!this.accessToken) throw new Error('Access token is null');
            this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

            return this.accessToken;
        } catch (error) {
            throw new AppError('Failed to get eBay access token', 500);
        }
    }
}
