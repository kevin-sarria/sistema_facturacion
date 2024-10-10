import { createBrowserRouter } from "react-router-dom";
import { AdminTemplate, AuthTemplate, Dashboard, ForgotPassword, Inventory, Login, Register, Sales, Shopping } from "../views";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthTemplate />,
        children: [
            {
                index: true,
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />
            }
        ]
    },
    {
        path: '/dashboard',
        element: <AdminTemplate />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: '/dashboard/inventario',
                element: <Inventory />
            },
            {
                path: '/dashboard/ventas',
                element: <Sales />
            },
            {
                path: '/dashboard/compras',
                element: <Shopping />
            },
        ]
    }
]);
