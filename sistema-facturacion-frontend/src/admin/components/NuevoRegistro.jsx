import { NavLink } from 'react-router-dom';

export const NuevoRegistro = ({ link }) => {

  return (
    <div className='mx-auto mt-10 w-10/12'>
      <div className="flex justify-center">
        <div className="flex items-center justify-center bg-green-500 hover:bg-green-400 w-20 h-20 rounded-full cursor-pointer">
          <div className="text-white text-5xl">
            <NavLink to={link} className="block h-fit">+</NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}