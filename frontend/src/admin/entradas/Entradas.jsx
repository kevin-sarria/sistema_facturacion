import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { loadingData } from "../../store";

import { Navbar } from "../components"
import { EntradasPage } from "./pages"


const data = [
  { id: 1, nombre: 'Lapicero', cantidad: 22 },
   { id: 2, nombre: 'Cuaderno', cantidad: 2 },
   { id: 3, nombre: 'Borrador', cantidad: 5 },
   { id: 4, nombre: 'Sacapuntas', cantidad: 10 },
    // Cosas de mas
    // { id: 5, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // { id: 6, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // { id: 7, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // { id: 8, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // { id: 9, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // { id: 10, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
    // { id: 11, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700},
];

export const Entradas = () => {

  const dispatch = useDispatch();

  useEffect( () => {
    dispatch(loadingData(data));
  }, [] );

  return (
    <section className="flex h-screen lg:h-auto">
        
      <Navbar />

      <EntradasPage />

    </section>
  )
}
