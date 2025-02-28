import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { ImageSimilarityScore } from '@vintdex/types';

export class ImageSimilarityService {
  private featureExtractor!: mobilenet.MobileNet;
  private objectDetector!: cocoSsd.ObjectDetection;
  private isInitialized: boolean = false;

  constructor() {
    this.initModels().catch(error => {
      console.error('Failed to initialize models:', error);
      throw error;
    });
  }

  private async initModels(): Promise<void> {
    try {
      this.featureExtractor = await mobilenet.load({
        version: 2,
        alpha: 1.0
      });

      this.objectDetector = await cocoSsd.load({
        base: 'mobilenet_v2'
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing models:', error);
      throw error;
    }
  }

  public async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initModels();
    }
  }

  private async extractItem(imageBuffer: Buffer): Promise<tf.Tensor3D> {
    await this.ensureInitialized();
    
    // Decode image and ensure it's 3D
    const image = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D;
    if (!image) {
      throw new Error("Failed to decode image. The image might be corrupted or invalid.");
    }    
    // Detect objects in the image
    const predictions = await this.objectDetector.detect(image);
    console.log("Predictions:", predictions);
    
    if (predictions.length === 0) {
      console.warn("No objects detected, using full image.");
      return tf.image.resizeBilinear(image, [224, 224]);
    }

    // Find the largest detected object (likely the main item)
    const mainItem = predictions.reduce((largest, current) => {
      const currentArea = current.bbox[2] * current.bbox[3];
      const largestArea = largest ? largest.bbox[2] * largest.bbox[3] : 0;
      return currentArea > largestArea ? current : largest;
    });

    if (!mainItem) {
      console.warn("No valid object found, using full image.");
      return tf.image.resizeBilinear(image, [224, 224]);
    }

    console.log("Largest detected object:", mainItem);

    // Crop to the detected item
    const [x, y, width, height] = mainItem.bbox;
    
    // Create a batch of one image (4D tensor) for cropping
    const batched = image.expandDims(0) as tf.Tensor4D;
    
    const cropped = tf.image.cropAndResize(
      batched,
      [[y/image.shape[0], x/image.shape[1], 
        (y+height)/image.shape[0], (x+width)/image.shape[1]]],
      [0],
      [224, 224]
    );

    // Return to 3D tensor and ensure proper shape
    return cropped.squeeze([0]) as tf.Tensor3D;
  }

  private async getImageFeatures(imageBuffer: Buffer): Promise<Float32Array> {
    try {
      // Extract the main item
      const itemImage = await this.extractItem(imageBuffer);
      
      // Get features using MobileNet
      const activation = this.featureExtractor.infer(
        itemImage,
        true // Set to true to get internal activations
      );

      // Get the feature vector
      const features = await (activation as tf.Tensor).data() as Float32Array;

      if (!features || features.length === 0) {
        throw new Error("Feature extraction failed: No features were extracted from the image.");
      }
      
      // Cleanup
      tf.dispose([itemImage, activation]);
      
      return features;
    } catch (error) {
      console.error('Error extracting features:', error);
      throw error;
    }
  }

  private cosineSimilarity(features1: Float32Array, features2: Float32Array): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < features1.length; i++) {
      dotProduct += features1[i] * features2[i];
      norm1 += features1[i] * features1[i];
      norm2 += features2[i] * features2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  async compareSimilarity(
    sourceImageBuffer: Buffer,
    targetImageUrls: string[]
  ): Promise<ImageSimilarityScore[]> {
    try {
      const sourceFeatures = await this.getImageFeatures(sourceImageBuffer);
      console.log('got source image features')

      const similarities = await Promise.all(
        targetImageUrls.map(async (imageUrl) => {
          try {
            const targetResponse = await fetch(imageUrl);
            if (!targetResponse.ok) {
              throw new Error(`Failed to fetch image: ${imageUrl}, Status: ${targetResponse.status}`);
            }
            const targetBuffer = await targetResponse.arrayBuffer();
            const targetFeatures = await this.getImageFeatures(Buffer.from(targetBuffer));

            const similarity = this.cosineSimilarity(sourceFeatures, targetFeatures);

            return {
              listingUrl: imageUrl,
              imageUrl: imageUrl,
              similarityScore: similarity
            };
          } catch (error) {
            console.error(`Error processing image ${imageUrl}:`, error);
            return {
              listingUrl: imageUrl,
              imageUrl: imageUrl,
              similarityScore: 0
            };
          }
        })
      );

      return similarities;
    } catch (error) {
      console.error('Error in similarity comparison:', error);
      throw error;
    }
  }
}