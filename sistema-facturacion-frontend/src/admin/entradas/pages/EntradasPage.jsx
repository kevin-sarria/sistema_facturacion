import { Alerta, Buscador, Menu, NuevoRegistro, Paginador, Table } from "../../components"


export const EntradasPage = () => {
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
