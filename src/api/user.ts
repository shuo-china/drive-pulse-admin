import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export function getUserPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<Pagination>({
    url: "/user/pagination",
    method: "get",
    params,
    ...options,
  });
}

export function getUserDetailApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/user/detail",
    method: "get",
    params: { id },
    ...options,
  });
}

export function updateUserApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/user/update`,
    method: "post",
    data,
    ...options,
  });
}
