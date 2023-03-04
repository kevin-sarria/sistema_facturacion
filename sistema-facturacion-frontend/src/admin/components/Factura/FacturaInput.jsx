import { HeaderFactura, TableFactura } from "./components";

const headers = [ 'Cantidad', 'Nombre', 'Valor Medida', 'Valor Unitario', 'Valor Total', 'Porcenaje Ganancia' ];

export const FacturaInput = () => {

    return (
        <form className="w-4/5 mx-auto">

            <HeaderFactura />

            <section className="my-20">
                <TableFactura headers={headers} />
            </section>

            

            <section className="flex gap-2 justify-end">
                <button className="text-xl border border-amber-500 hover:bg-amber-500 rounded p-2 text-amber-500 hover:text-white">Cancelar</button>
                <button className="text-xl border border-green-500 hover:bg-green-500 rounded p-2 text-green-500 hover:text-white">Guardar</button>
            </section>

        </form>
    )
}
