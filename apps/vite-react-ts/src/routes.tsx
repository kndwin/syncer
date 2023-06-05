import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { HomeRoute } from "~/modules/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
