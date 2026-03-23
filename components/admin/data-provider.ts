"use client";

import type { DataProvider } from "@refinedev/core";

const API_URL = "/api/admin";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "后台请求失败");
  }

  return response.json() as Promise<T>;
}

function buildListUrl(resource: string, params: any) {
  const url = new URL(`${API_URL}/${resource}`, window.location.origin);

  params.filters?.forEach((filter: any) => {
    if ("field" in filter && "value" in filter && filter.value) {
      url.searchParams.set(String(filter.field), String(filter.value));
    }
  });

  return `${url.pathname}${url.search}`;
}

export const adminDataProvider: DataProvider = {
  getApiUrl: () => API_URL,
  getList: async (params: any) => {
    const payload = await request<any>(buildListUrl(params.resource, params));
    return payload;
  },
  getOne: async (params: any) => {
    const payload = await request<any>(`${API_URL}/${params.resource}/${params.id}`);
    return payload;
  },
  getMany: async (params: any) => {
    const results = await Promise.all(
      params.ids.map((id: string | number) =>
        request<any>(`${API_URL}/${params.resource}/${id}`).then((payload) => payload.data),
      ),
    );

    return { data: results };
  },
  create: async (params: any) => {
    const payload = await request<any>(`${API_URL}/${params.resource}`, {
      method: "POST",
      body: JSON.stringify(params.variables),
    });
    return payload;
  },
  createMany: async (params: any) => {
    const results = await Promise.all(
      params.variables.map((variables: any) =>
        adminDataProvider.create({
          resource: params.resource,
          variables,
        }),
      ),
    );
    return { data: results.map((result) => result.data) };
  },
  update: async (params: any) => {
    const payload = await request<any>(`${API_URL}/${params.resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.variables),
    });
    return payload;
  },
  updateMany: async (params: any) => {
    const results = await Promise.all(
      params.ids.map((id: string | number) =>
        adminDataProvider.update({
          ...params,
          id,
        }),
      ),
    );

    return { data: results.map((result) => result.data) };
  },
  deleteOne: async (params: any) => {
    const payload = await request<any>(`${API_URL}/${params.resource}/${params.id}`, {
      method: "DELETE",
    });
    return payload;
  },
  deleteMany: async (params: any) => {
    const results = await Promise.all(
      params.ids.map((id: string | number) =>
        adminDataProvider.deleteOne({
          ...params,
          id,
        }),
      ),
    );

    return { data: results.map((result) => result.data) };
  },
  custom: async () => {
    throw new Error("Custom requests are not implemented yet.");
  },
};
