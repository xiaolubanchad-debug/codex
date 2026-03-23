"use client";

import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LoginOutlined,
  PictureOutlined,
  ProfileOutlined,
  SettingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Authenticated, Refine, useGetIdentity, useLogout } from "@refinedev/core";
import { ThemedLayout, ThemedTitle } from "@refinedev/antd";
import routerProvider, { NavigateToResource } from "@refinedev/nextjs-router/app";
import { ConfigProvider, Layout, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { adminAuthProvider } from "@/components/admin/auth-provider";
import { adminDataProvider } from "@/components/admin/data-provider";

type AdminShellProps = {
  children: React.ReactNode;
};

function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return null;
}

function AdminIdentityBar() {
  const { data: identity } = useGetIdentity<{ name: string; id: string }>();
  const { mutate: logout } = useLogout();

  return (
    <div className="admin-topbar">
      <div>
        <strong>策展后台</strong>
        <span>内容编辑、发布流转、栏目维护、媒体管理</span>
      </div>
      <button className="admin-topbar-button" onClick={() => logout()} type="button">
        <LoginOutlined />
        退出登录
      </button>
      <span className="admin-identity">{identity?.name ?? "编辑部"}</span>
    </div>
  );
}

function AdminFrame({ children }: AdminShellProps) {
  return (
    <ThemedLayout Header={() => <AdminIdentityBar />} Title={(titleProps) => <ThemedTitle {...titleProps} text="策展后台" />}>
      <div className="admin-content-shell">{children}</div>
    </ThemedLayout>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#e61f1f",
          borderRadius: 10,
          fontFamily:
            '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC","Source Han Sans SC",sans-serif',
        },
      }}
    >
      <Layout className="admin-root-layout">
        <Refine
          authProvider={adminAuthProvider}
          dataProvider={adminDataProvider}
          routerProvider={routerProvider}
          resources={[
            {
              name: "dashboard",
              list: "/admin",
              meta: { label: "总览", icon: <DashboardOutlined /> },
            },
            {
              name: "posts",
              list: "/admin/posts",
              create: "/admin/posts/create",
              edit: "/admin/posts/edit/:id",
              show: "/admin/posts/show/:id",
              meta: { label: "文章", icon: <FileTextOutlined /> },
            },
            {
              name: "media",
              list: "/admin/media",
              meta: { label: "媒体库", icon: <PictureOutlined /> },
            },
            {
              name: "categories",
              list: "/admin/categories",
              create: "/admin/categories/create",
              edit: "/admin/categories/edit/:id",
              meta: { label: "分类", icon: <AppstoreOutlined /> },
            },
            {
              name: "tags",
              list: "/admin/tags",
              create: "/admin/tags/create",
              edit: "/admin/tags/edit/:id",
              meta: { label: "标签", icon: <TagsOutlined /> },
            },
            {
              name: "account",
              list: "/admin/account",
              meta: { label: "超级管理员", icon: <SettingOutlined /> },
            },
            {
              name: "site",
              list: "/admin/site",
              meta: { label: "站点文案", icon: <ProfileOutlined /> },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          {isLoginRoute ? (
            <Authenticated fallback={children} key="admin-login-guard">
              <NavigateToResource resource="posts" />
            </Authenticated>
          ) : (
            <Authenticated fallback={<RedirectToLogin />} key="admin-protected-guard">
              <AdminFrame>{children}</AdminFrame>
            </Authenticated>
          )}
        </Refine>
      </Layout>
    </ConfigProvider>
  );
}
