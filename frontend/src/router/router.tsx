import { createBrowserRouter } from "react-router-dom";
import { AuthTemplate, Login, Register } from "../views";

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
            }
        ]
    }
]);
