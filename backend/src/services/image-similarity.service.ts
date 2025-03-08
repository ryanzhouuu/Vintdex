import { pipeline } from '@xenova/transformers';
import { ImageSimilarityScore } from '@vintdex/types';

export class ImageSimilarityService {
  private clipPipeline!: any;
  private isInitialized: boolean = false;

  constructor() {
    this.initModel().catch(error => {
      console.error('Failed to initialize CLIP model:', error);
      throw error;
    });
  }

  private async initModel(): Promise<void> {
    try {
      console.log('Initializing Fashion CLIP model...');
      this.clipPipeline = await pipeline('image-feature-extraction', 'Xenova/clip-vit-large-patch14');
      this.isInitialized = true;
      console.log('Fashion CLIP model initialized successfully');
    } catch (error) {
      console.error('Error initializing Fashion CLIP model:', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initModel();
    }
  }

  private async getImageFeatures(imageBuffer: Buffer): Promise<Float32Array> {
    try {
      await this.ensureInitialized();
      console.log('Processing image buffer...');

      const { default: sharp } = await import('sharp');
      
      const metadata = await sharp(imageBuffer).metadata();
      console.log('Original image metadata:', metadata);

      const processedImageBuffer = await sharp(imageBuffer)
        .resize(224, 224, { fit: 'cover' })
        .normalize()
        .modulate({
          brightness: 1.1,
        })
        .jpeg({ quality: 95 })
        .toBuffer();

      const blob = new Blob([processedImageBuffer], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      console.log('Created blob URL for processed image');

      try {
        const output = await this.clipPipeline(imageUrl);
        console.log('Raw output from CLIP:', output);

        if (!output.data || output.data.length === 0) {
          throw new Error('No embeddings received from CLIP model');
        }

        const features = new Float32Array(output.data);
        
        const maxVal = Math.max(...features.map(Math.abs));
        const normalizedFeatures = new Float32Array(
          features.map(val => {
            const normalized = val / maxVal;
            if (Math.abs(normalized) < 0.15) return 0;
            return Math.sign(normalized) * Math.pow(Math.abs(normalized), 0.7);
          })
        );

        console.log('Feature vector stats:', {
          length: normalizedFeatures.length,
          nonZero: normalizedFeatures.filter(v => v !== 0).length,
          max: Math.max(...normalizedFeatures),
          min: Math.min(...normalizedFeatures)
        });
        
        return normalizedFeatures;
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    } catch (error) {
      console.error('Error extracting features:', error);
      throw error;
    }
  }

  private cosineSimilarity(features1: Float32Array, features2: Float32Array): number {
    try {
      if (features1.length === 0 || features2.length === 0) {
        console.error('Empty feature vectors received');
        return 0;
      }

      if (features1.length !== features2.length) {
        console.error(`Feature vector length mismatch: ${features1.length} vs ${features2.length}`);
        return 0;
      }

      let strongMatches = 0;
      let totalStrong = 0;
      let dotProduct = 0;
      let norm1 = 0;
      let norm2 = 0;

      for (let i = 0; i < features1.length; i++) {
        if (Math.abs(features1[i]) > 0.3 || Math.abs(features2[i]) > 0.3) {
          totalStrong++;
          if (Math.sign(features1[i]) === Math.sign(features2[i]) && 
              Math.abs(features1[i] - features2[i]) < 0.3) {
            strongMatches++;
          }
        }

        dotProduct += features1[i] * features2[i];
        norm1 += features1[i] * features1[i];
        norm2 += features2[i] * features2[i];
      }

      const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
      
      const matchQuality = totalStrong > 0 ? strongMatches / totalStrong : 0;
      console.log('Match quality:', matchQuality);

      const combinedScore = (similarity * 0.6) + (matchQuality * 0.4);
      
      const finalScore = Math.pow(combinedScore, 0.7);

      console.log('Similarity metrics:', {
        rawSimilarity: similarity,
        strongMatches,
        totalStrong,
        matchQuality,
        combinedScore,
        finalScore
      });

      return isNaN(finalScore) ? 0 : Math.min(1, Math.max(0, finalScore));
    } catch (error) {
      console.error('Error in similarity calculation:', error);
      return 0;
    }
  }

  async compareSimilarity(
    sourceImageBuffer: Buffer,
    targetImageUrls: string[]
  ): Promise<ImageSimilarityScore[]> {
    try {
      console.log('Starting similarity comparison...');
      const sourceFeatures = await this.getImageFeatures(sourceImageBuffer);

      const similarities = await Promise.all(
        targetImageUrls.map(async (imageUrl, index) => {
          try {
            console.log(`Processing target image ${index + 1}/${targetImageUrls.length}`);
            const targetResponse = await fetch(imageUrl);
            
            if (!targetResponse.ok) {
              throw new Error(`Failed to fetch image: ${imageUrl}`);
            }
            
            const targetBuffer = Buffer.from(await targetResponse.arrayBuffer());
            const targetFeatures = await this.getImageFeatures(targetBuffer);
            const similarity = this.cosineSimilarity(sourceFeatures, targetFeatures);
            
            return {
              imageUrl: imageUrl,
              similarityScore: similarity,
              confidence: this.calculateConfidence(similarity)
            };
          } catch (error) {
            console.error(`Error processing image ${imageUrl}:`, error);
            return {
              imageUrl: imageUrl,
              similarityScore: 0,
              confidence: 0
            };
          }
        })
      );

      console.log(`Found ${similarities.length} strong matches`);
      return similarities;
    } catch (error) {
      console.error('Error in similarity comparison:', error);
      throw error;
    }
  }

  private calculateConfidence(similarity: number): number {
    if (similarity > 0.85) return 1.0;
    if (similarity > 0.75) return 0.8;
    if (similarity > 0.65) return 0.6;
    return 0.0;
  }
}