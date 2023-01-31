import { Link } from "react-router-dom"

export const Navbar = () => {

  

  return (

    <nav className="flex flex-col text-center gap-2">

        <Link className="text-blue-500 p-3 border border-blue-500 rounded-lg " to="/">Dashboard</Link>
        <Link className="text-blue-500 p-3 rounded-lg" to="/inventario">Inventario</Link>
        <Link className="text-blue-500 p-3 rounded-lg" to="/entradas">Entradas</Link>
        <Link className="text-blue-500 p-3 rounded-lg" to="/salidas">Salidas</Link>
        <Link className="text-blue-500 p-3 rounded-lg" to="/proveedores">Proveedores</Link>
        <Link className="text-blue-500 p-3 rounded-lg" to="/usuarios">Usuarios</Link>
    
    </nav>
  )
}
