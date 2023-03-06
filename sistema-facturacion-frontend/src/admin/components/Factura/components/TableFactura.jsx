


export const TableFactura = ({ headers = ['Cantidad', 'Nombre', 'Valor Medida', 'Valor Unitario', 'Valor Total', 'Porcenaje Ganancia'], data = [] }) => {

    return (

        <section className="flex overflow-auto mx-2 xl:mx-auto my-20">

            <table className="w-full mx-auto mt-6 justify-center">

                <thead className="border border-spacing-2 text-center w-100">
                    <tr className="bg-blue-400 text-white">
                        {headers.map((header) => <th key={header} className='p-3 text-md uppercase font-bold'>{header}</th>)}
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        
                    </tr>
                </tbody>

            </table>

        </section>

    )
}
