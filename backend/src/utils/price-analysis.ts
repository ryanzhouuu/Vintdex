// Ideas: 
// weighted average market price projection model

// 1) Calculate time decay weights
// Let d = number of days between current date and sale date
// Let h = (1/2) * (days between most recent sale and oldest sale)
// weight w = e^(-d/h)

// 2) Normalize weights so they sum to 1
// Let w' be the normalized weight
// Let s = the sum of all raw weights
// For each element, w' = w/s

// 3) Use weighted average calculation
// Let p be the final projected price
// Let pn be the price of the nth item
// p = (w1'*p1) + (w2'*p2) + ... + (wn'*pn)

// 4) Calculate confidence
// Let s be the standard deviation
// s = sqrt( w1'*(p1 - p)^2 + w2'*(p2 - p)^2 + ... )
// confidence  = 1 / (1 + s/p)

import { SoldItem, PriceProjection } from "@vintdex/types";

const daysBetween = (date1: Date, date2: Date): number => {
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export const projectPrice = (items: SoldItem[]) : PriceProjection => {
    if (!items.length) {
        throw new Error("No sold listings provided");
    }

    const prices = items.map((item) => item.soldPrice.value);

    let oldest: Date = items[0].soldDate;
    let recent: Date = items[0].soldDate;
    const days = items.map(item => {
        if (item.soldDate < oldest) {
            oldest = item.soldDate;
        }
        if (item.soldDate > recent) {
            recent = item.soldDate;
        }
        return daysBetween(item.soldDate, new Date());
    });
    const h = 0.5 * daysBetween(oldest, recent);

    let totalWeight = 0;
    const e = Math.E;
    const weights = days.map((diff) => {
        const exponent = (-1 * diff) / h;
        const weight = Math.pow(e, exponent);
        totalWeight += weight;
        return weight;
    })

    const normalizedWeights = weights.map(weight => weight/totalWeight);
    
    let projection = 0;
    for (let i = 0; i < items.length; i++) {
        projection += prices[i] * normalizedWeights[i];
    }
    let variance = 0;
    for (let i = 0; i < items.length; i++) {
        const diff = prices[i] - projection;
        variance += normalizedWeights[i] * Math.pow(diff, 2);
    }
    const stdDeviation = Math.sqrt(variance);
    const c = 1 / (1 + (stdDeviation/projection));

    return {
        projectedPrice: projection,
        confidence: c
    };
}