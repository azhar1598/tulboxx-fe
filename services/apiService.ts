import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { createClient } from "@/utils/supabase/client";

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
    : process.env.NEXT_PUBLIC_BASE_URL || "";

export const api = axios.create({
  baseURL: BASE_URL,
});

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

const callApi = {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return callApi.request<T>(url, "GET", null, config);
  },
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return callApi.request<T>(url, "POST", data, config);
  },
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return callApi.request<T>(url, "PUT", data, config);
  },
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return callApi.request<T>(url, "PATCH", data, config);
  },
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return callApi.request<T>(url, "DELETE", null, config);
  },
  async request<T = any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Create a Supabase client and get the session
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Get the access token from the session if it exists
      const accessToken = session?.access_token;

      const headers = {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        isMock: false,
      };

      const response: AxiosResponse<T> = await api.request({
        url,
        method,
        data,
        headers,
        ...config,
      });
      return { data: response.data, status: response.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("API Error:", error, error.message);
        const apiError: ApiError = {
          message: error.response?.data?.error || error.message,
          status: error.response?.status,
          data: error.response?.data,
        };
        throw apiError;
      } else {
        console.error("Unexpected Error:", error);
        throw {
          message: "An unexpected error occurred",
          status: 500,
        } as ApiError;
      }
    }
  },
};

export default callApi;
