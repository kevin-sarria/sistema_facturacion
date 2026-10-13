import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  AdminTemplate,
  AuthTemplate,
  Dashboard,
  ForgotPassword,
  Inventory,
  Login,
  Register,
  Sales,
  Purchase,
  Credits,
  CashShiftView,
} from "../views";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthTemplate />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <AdminTemplate />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/pos" replace />,
      },
      {
        path: "/dashboard/pos",
        element: <Sales />,
      },
      {
        path: "/dashboard/inventario",
        element: <Inventory />,
      },
      {
        path: "/dashboard/creditos",
        element: <Credits />,
      },
      {
        path: "/dashboard/compras",
        element: <Purchase />,
      },
      {
        path: "/dashboard/caja",
        element: <CashShiftView />,
      },
      {
        path: "/dashboard/metricas",
        element: <Dashboard />,
      },
    ],
  },
]);
