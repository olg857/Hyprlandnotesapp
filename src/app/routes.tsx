import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
  },
]);
