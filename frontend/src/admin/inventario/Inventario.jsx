import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadingData } from '../../store';

import { Navbar } from "../components"
import { InventarioPage } from "./"


async function traerDatos() {
  try {
    const token = localStorage.getItem('token') ?? '';
    const url = import.meta.env.VITE_API_URL + '/inventario';
    const respuesta = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const datos = await respuesta.json();

    return datos;

  } catch (error) {
    throw new Error(error);
  }

}

export const Inventario = () => {

  const dispatch = useDispatch();

  useEffect(() => {

    const datos = traerDatos();

    console.log(datos)
    // dispatch(loadingData('inventario'));
  }, []);


  return (

    <section className='flex h-screen lg:h-auto'>
      <Navbar />
      <InventarioPage />
    </section>

  )
}
