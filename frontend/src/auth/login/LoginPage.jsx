import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { checkingAuthentication } from '../../store';
import { Alerta } from '../../components';
import { useForm } from '../../hooks';


const initialForm = {
  email: '',
  password: ''
}

const formValidations = {
  email: [ (value) => value.includes('@'), 'El correo no es valido'  ],
  password: [ (value) => value.length >= 8, 'La contraseña no es valida' ]
}

export const LoginPage = () => {

  const [ formSubmitted, setFormSubmitted ] = useState(false);
  const { email, password, onInputChange, isFormValid, emailValid, passwordValid } = useForm(initialForm, formValidations);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {

    e.preventDefault();
    setFormSubmitted(true);

    if( !isFormValid ) return;

    dispatch(checkingAuthentication( email, password ));

  }  

  return (

      <div className="flex flex-col items-center justify-center mx-auto h-screen">
        
        <Alerta />

        <div className="text-center p-5 w-80 sm:w-96">

          <h1 className='text-6xl text-indigo-600 font-semibold uppercase mb-16'>Iniciar Sesion</h1>

          <form className='formulario' onSubmit={handleSubmit}>
    
            <div className="mb-2">
              <input type="text" name="email" placeholder='Correo electronico' className="w-full bg-gray-200 p-3 rounded-sm" value={email} onChange={onInputChange} />
            </div>

            { formSubmitted && emailValid && <p className="text-red-500 mb-3">{emailValid}</p> }

            <div className="mb-2">
              <input type="password" name="password" placeholder='Contraseña' className="w-full bg-gray-200 p-3 rounded-sm" value={password} onChange={onInputChange} />
            </div>

            { formSubmitted && passwordValid && <p className="text-red-500 mb-3">{passwordValid}</p> }

            <div className="text-right mb-5 text-indigo-600 hover:text-indigo-700">
              <Link to="/auth/forgot-password">¿Has Olvidado tu contraseña?</Link>
            </div>

            <input type="submit" value="Entrar" className="w-full text-xl p-3 rounded-sm bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" />

          </form>
        </div>

      </div>
  )
}
