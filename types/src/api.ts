export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
    error?: string;
}
  
export interface AppErrorType {
    message: string;
    statusCode: number;
}

export interface TrackingRequestData {
    imageData: string;
    title?: string;
}