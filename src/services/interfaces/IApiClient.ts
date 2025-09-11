// services/interfaces/IApiClient.ts
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API client interface following Clean Architecture principles
 * Defines the contract for HTTP operations
 */
export interface IApiClient {
  /**
   * Perform GET request
   * @param url - Request URL
   * @param config - Axios request configuration
   * @returns Promise<AxiosResponse<T>> - HTTP response
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  /**
   * Perform POST request
   * @param url - Request URL
   * @param data - Request data
   * @param config - Axios request configuration
   * @returns Promise<AxiosResponse<T>> - HTTP response
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  /**
   * Perform PUT request
   * @param url - Request URL
   * @param data - Request data
   * @param config - Axios request configuration
   * @returns Promise<AxiosResponse<T>> - HTTP response
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  /**
   * Perform DELETE request
   * @param url - Request URL
   * @param config - Axios request configuration
   * @returns Promise<AxiosResponse<T>> - HTTP response
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  /**
   * Perform PATCH request
   * @param url - Request URL
   * @param data - Request data
   * @param config - Axios request configuration
   * @returns Promise<AxiosResponse<T>> - HTTP response
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}
