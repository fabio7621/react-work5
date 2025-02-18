import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import ProductInner from "../pages/ProductInner";
import PageNotFound from "../pages/PageNotFound";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductPage />,
        children: [],
      },
      {
        path: "products/:id",
        element: <ProductInner />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
export default router;
