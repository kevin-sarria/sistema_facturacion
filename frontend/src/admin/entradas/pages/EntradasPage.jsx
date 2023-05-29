import { useSelector } from "react-redux";

import { Alerta } from '../../../components';
import { Buscador, Menu, NuevoRegistro, Paginador, Table } from "../../components"

export const EntradasPage = () => {

  const { isLoading } = useSelector( state => state.dashboard );

  if( isLoading ) {
    return <div className="m-auto custom-loader"></div>;
  }

  return (
    <section className="flex-1 h- max-h-screen overflow-auto pb-5">
        
        <Menu title="Entradas" />

        <Alerta />

        <Buscador />

        <Table facturaLink="/ver-factura" opciones={true} />

        <Paginador />

        <NuevoRegistro link="/registrar-entrada" />

    </section>
  )
}
