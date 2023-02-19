import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadingData } from '../../store';

import { Navbar } from "../components"
import { InventarioPage } from "./"

const data = [
  { id: 1, nombre: 'Lapicero', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
   { id: 2, nombre: 'Cuaderno', cantidad: 22, valor_medida: 'paquete', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
   { id: 3, nombre: 'Borrador', cantidad: 22, valor_medida: 'paquete', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
   { id: 4, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // Cosas de mas
    { id: 5, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    { id: 6, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    { id: 7, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    { id: 8, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    { id: 9, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    { id: 10, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    { id: 11, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 12, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 13, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 14, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 15, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 16, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 17, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 18, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 19, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 20, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 21, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 22, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 23, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 24, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 25, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 26, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 27, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 28, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 29, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 30, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 31, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 32, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 33, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 34, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 35, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 36, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 37, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 38, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 39, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 40, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 41, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 42, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 43, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 44, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 45, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 46, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 47, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 48, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 49, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 50, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 51, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 52, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
  //  { id: 53, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
];


export const Inventario = () => {

  const dispatch = useDispatch();

  useEffect( () => {
    dispatch(loadingData());
  }, [] );
  

  return (
    
    <div className='flex h-screen lg:h-auto'>
      <Navbar />
      <InventarioPage />
    </div>

  )
}
