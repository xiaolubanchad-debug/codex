"use client";

import type { AuthProvider } from "@refinedev/core";

async function readSession() {
  const response = await fetch("/api/admin/auth/session", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.data ?? null;
}

export const adminAuthProvider: AuthProvider = {
  login: async ({ email, password }) => {
    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "请输入邮箱和密码",
        },
      };
    }

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({
        message: "登录失败",
      }));

      return {
        success: false,
        error: {
          name: "LoginError",
          message: payload.message || "登录失败",
        },
      };
    }

    return {
      success: true,
      redirectTo: "/admin",
    };
  },
  logout: async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
    });

    return {
      success: true,
      redirectTo: "/admin/login",
    };
  },
  check: async () => {
    const session = await readSession();

    if (session) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/admin/login",
    };
  },
  getPermissions: async () => ["admin"],
  getIdentity: async () => {
    const session = await readSession();

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      name: session.name,
      avatar: "",
    };
  },
  onError: async (error) => {
    return {
      error,
    };
  },
};
