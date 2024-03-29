import { Route, Routes, Navigate } from 'react-router-dom'
import { useCheckAuth } from '../hooks';
import { LoginPage, ForgotPassword } from '../auth';
import { Dashboard, Inventario, Entradas, RegistrarEntrada } from '../admin';

export const AppRouter = () => {

  const status = useCheckAuth();

  if (status === 'checking') {
    return (
      <h3>Cargando...</h3>
    );
  }


  return (

    <Routes>

      {
        // Rutas Privadas
        (status === 'authenticated')
          ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/entradas" element={<Entradas />} />
              <Route path="/registrar-entrada" element={<RegistrarEntrada />} />

              <Route path="/*" element={<Navigate to='/' />} />
            </>
          ):
          // Rutas públicas
          <>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            <Route path='/*' element={<Navigate to='/auth/login' />} />
          </>
      }
    </Routes>
  )
}
