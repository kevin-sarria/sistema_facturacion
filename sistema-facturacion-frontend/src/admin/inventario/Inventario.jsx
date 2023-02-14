import { useEffect } from 'React';
import { useDispatch } from 'react-redux';
import { loadingData } from '../../store';

import { Navbar } from "../components"
import { InventarioPage } from "./"


export const Inventario = () => {

  const dispatch = useDispatch();

  dispatch(loadingData);
  

  return (
    
    <div className='flex'>
      <Navbar />
      <InventarioPage />
    </div>

  )
}
