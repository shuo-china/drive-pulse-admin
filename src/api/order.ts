import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export function getOrderPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<Pagination>({
    url: "/order/pagination",
    method: "get",
    params,
    ...options,
  });
}
