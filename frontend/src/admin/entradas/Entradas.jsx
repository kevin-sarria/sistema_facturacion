import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { loadingData } from "../../store";

import { Navbar } from "../components"
import { EntradasPage } from "./pages"


const data = [
  { id: 1, nombre: 'Lapicero', cantidad: 22 },
   { id: 2, nombre: 'Cuaderno', cantidad: 2 },
   { id: 3, nombre: 'Borrador', cantidad: 5 },
   { id: 4, nombre: 'Sacapuntas', cantidad: 10 }
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
