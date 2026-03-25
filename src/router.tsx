import {
  createBrowserRouter,
  redirect,
  type RouteObject,
} from "react-router-dom";
import SignInPage from "./pages/auth/sign-in-page/ui";
import ListStockPage from "./pages/list-stock/ui";
import SignUpPage from "./pages/auth/sign-up-page/ui";
import AuthLayout from "./layouts/auth-layout";
import MainLayout from "./layouts/main-layout";
import { ACCESS_TOKEN } from "./utils/const/local-storage-const";

const routes: RouteObject[] = [
  {
    path: "/",
    loader: () => redirect("/auth/sign-in"),
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        loader: () => {
          const token = localStorage.getItem(ACCESS_TOKEN);
          if (token) return redirect("/app/list-stock");
          return null;
        },
        Component: SignInPage,
      },
      {
        path: "sign-up",
        Component: SignUpPage,
      },
      { index: true, Component: SignInPage },
    ],
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        path: "list-stock",
        Component: ListStockPage,
      },
    ],
  },
  {
    path: "*",
    loader: async () => {
      return redirect("/");
    },
  },
];

export const router = createBrowserRouter(routes);
