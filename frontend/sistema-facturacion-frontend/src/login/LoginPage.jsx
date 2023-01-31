import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (

      <div className="flex flex-col items-center justify-center mx-auto h-screen">
        
        <div className="text-center p-5 w-80 sm:w-96">

          <h1 className='text-6xl text-indigo-600 font-semibold uppercase mb-16'>Iniciar Sesion</h1>

          <form className='formulario'>
    
            <div className="mb-5">
              <input type="text" placeholder='Correo electronico' className="w-full bg-gray-200 p-3 rounded-sm" />
            </div>

            <div className="mb-5">
              <input type="password" placeholder='Contraseña' className="w-full bg-gray-200 p-3 rounded-sm" />
            </div>

            <div className="text-right mb-5 text-indigo-600 hover:text-indigo-700">
              <Link to="/recuperar-cuenta">¿Has Olvidado tu contraseña?</Link>
            </div>

            <input type="submit" value="Entrar" className="w-full text-xl p-3 rounded-sm bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" />

          </form>
        </div>
      </div>
  )
}
