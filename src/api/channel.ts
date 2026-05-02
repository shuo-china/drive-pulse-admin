import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export function getChannelPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<Pagination>({
    url: "/channel/pagination",
    method: "get",
    params,
    ...options,
  });
}

export function getChannelOptionsApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/channel/options",
    method: "get",
    params,
    ...options,
  });
}

export function createChannelApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/channel/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateChannelApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/channel/update",
    method: "post",
    data,
    ...options,
  });
}

export function deleteChannelApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/channel/delete",
    method: "post",
    data: { id },
    ...options,
  });
}

export function getChannelDetailApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/channel/detail",
    method: "get",
    params: { id },
    ...options,
  });
}

export function getApplyPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<Pagination>({
    url: "/channel/applyPagination",
    method: "get",
    params,
    ...options,
  });
}

export function auditApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/channel/audit`,
    method: "post",
    data,
    ...options,
  });
}
