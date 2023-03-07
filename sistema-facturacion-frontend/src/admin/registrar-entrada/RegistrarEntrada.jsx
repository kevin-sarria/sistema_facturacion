import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { initNewPage } from '../../store';

import { Navbar } from '../components/Navbar';
import { RegistrarEntradaPage } from './';


export const RegistrarEntrada = () => {

    const dispatch = useDispatch();

    useEffect( () => {
      dispatch(initNewPage());
    }, [] );

    return (
      <section className="flex h-screen lg:h-auto">
          
        <Navbar />
  
        <RegistrarEntradaPage />
  
      </section>
    )
}
