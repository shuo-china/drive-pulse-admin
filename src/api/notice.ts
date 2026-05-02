import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export function getNoticeDetailApi(options?: AxiosRequestConfig) {
  return request({
    url: `/notice/detail`,
    method: "get",
    ...options,
  });
}

export function updateNoticeApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/notice/update`,
    method: "post",
    data,
    ...options,
  });
}
