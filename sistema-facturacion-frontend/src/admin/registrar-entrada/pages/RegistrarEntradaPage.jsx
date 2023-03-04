import { Alerta, FacturaInput, Menu } from "../../components"


export const RegistrarEntradaPage = () => {
  return (
    <section className="flex-1 h- max-h-screen overflow-auto pb-5">
        
        <Menu title="Registrar entradas" />

        <FacturaInput />

        <Alerta />

    </section>
  )
}
