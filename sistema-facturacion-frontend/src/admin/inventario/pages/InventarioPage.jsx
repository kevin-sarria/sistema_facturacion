import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from '../../'
import { Buscador, Paginador, NuevoRegistro, Table, Alerta } from '../../components';

export const InventarioPage = () => {

  const { data, isLoading } = useSelector( state => state.dashboard );


  if( isLoading ) {
    return <div className="m-auto custom-loader"></div>;
  }

  return (
    <section className='flex-1 h- max-h-screen overflow-auto pb-5'>

      <Menu title='Inventario' />

      <Alerta />

      <Buscador />
      
      <Table data={data} />
      
      <Paginador />

      <NuevoRegistro link="/registrar-entrada" />

    </section>
  )
}
