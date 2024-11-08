import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
});

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

const callApi = {
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await callApi.request<T>(url, "GET", null, config);
  },
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await callApi.request<T>(url, "POST", data, config);
  },
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await callApi.request<T>(url, "PUT", data, config);
  },
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await callApi.request<T>(url, "DELETE", null, config);
  },
  async request<T = any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // const token = await getAccessToken();
      const session: any = await getSession();

      const headers = {
        ...(session?.user.accessToken
          ? { Authorization: `Bearer ${session?.user.accessToken}` }
          : {}),
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
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log("API Error:", error.message);
        throw error.response?.data || error.message;
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  },
};

export default callApi;
