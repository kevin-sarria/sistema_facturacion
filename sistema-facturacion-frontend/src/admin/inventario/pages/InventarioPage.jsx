import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from '../../'
import { Buscador, Paginador } from '../../components';
import { Table } from '../components';

export const InventarioPage = () => {

  const [ newData, setNewData ] = useState([]);

  const { data, isLoading } = useSelector( state => state.dashboard );

  useEffect( () => {
    setNewData(data);
  }, [isLoading] );

  if( newData.length < 1 ) {
    return <div className="m-auto custom-loader"></div>;
  }

  return (
    <div className='flex-1 max-h-screen overflow-auto pb-40'>

      <Menu title='Inventario' />

      <Buscador />

      <Table data={data} />

      <Paginador />

    </div>
  )
}
