import { Route, Routes } from "react-router-dom"
import { LoginPage } from "./login/LoginPage"
import { ForgotPassword } from "./forgotPassword/ForgotPassword"
import { Dashboard } from "./admin/dashboard/pages/Dashboard"

export const App = () => {

  return (
    <div className="min-w-screen min-h-screen">
      <Routes>
        <Route path="/" element={ <Dashboard /> } />
        <Route path="/recuperar-cuenta" element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}