import { NavLink } from 'react-router-dom';

export const NuevoRegistro = ({ link }) => {

  return (
    <div className="flex m-10 w-11/12 justify-end">
        <div className="flex items-center justify-center bg-green-500 hover:bg-green-400 w-20 h-20 rounded-full cursor-pointer">
            <div className="text-white text-5xl">
                <NavLink to={link} className="block h-fit">+</NavLink>
            </div>
        </div>
    </div>
  )
}