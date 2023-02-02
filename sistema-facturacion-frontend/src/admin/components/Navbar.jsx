import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"

export const Navbar = () => {

  const styleActive = 'border border-blue-500 rounded-lg';

  const { isAdmin, displayName } = useSelector( state => state.auth )


  return (

    <header className='w-72 shadow-xl h-screen p-5 overflow-hidden'>

            <div className='flex mb-5'>
                <img src="https://cdn-icons-png.flaticon.com/128/9205/9205233.png" alt="Icono Admin" className='w-24' />
                <p className='text-xl font-bold flex items-center text-blue-500'>Bienvenido/a, { displayName }</p>
            </div>

            <hr className='w-full mb-5 border border-blue-500' />

            <nav className="flex flex-col text-center gap-2">

              <NavLink className={ ({isActive}) => `text-blue-500 p-3 ${isActive ? styleActive : '' }`} to="/">Dashboard</NavLink>
              <NavLink className={ ({isActive}) => `text-blue-500 p-3 ${isActive ? styleActive : '' }`} to="/inventario">Inventario</NavLink>
              <NavLink className={ ({isActive}) => `text-blue-500 p-3 ${isActive ? styleActive : '' }`} to="/entradas">Entradas</NavLink>
              <NavLink className={ ({isActive}) => `text-blue-500 p-3 ${isActive ? styleActive : '' }`} to="/salidas">Salidas</NavLink>
              <NavLink className={ ({isActive}) => `text-blue-500 p-3 ${isActive ? styleActive : '' }`} to="/proveedores">Proveedores</NavLink>
              {
                isAdmin && <NavLink className={ ({isActive}) => `text-blue-500 p-3 ${isActive ? styleActive : '' }`} to="/usuarios">Usuarios</NavLink>
              }
    
            </nav>

        </header>
  )
}
