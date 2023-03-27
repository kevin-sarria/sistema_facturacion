const headersDefault = ['Nombre', 'Cantidad', 'Valor Medida', 'Valor Unitario', 'Valor Total', 'Porcenaje Ganancia'];

export const TableFactura = ({ headers = headersDefault, datos = [] }) => {

    function renderTableRows( data = datos ) {
        return data?.map((row, rowIndex) => (
          <tr key={rowIndex} className='even:bg-blue-100'>
            {Object.values(row)?.map((value, columnIndex) => (
              <td key={columnIndex} className='text-center text-lg border border-blue-400 break-words'>{value}</td>
            ))}
          </tr>
        ));
      }

    return (

        <section className="flex overflow-auto mx-2 xl:mx-auto my-20">

            <table className="w-full mx-auto mt-6 justify-center">

                <thead className="border border-spacing-2 text-center w-100">
                    <tr className="bg-blue-400 text-white">
                        {headers.map((header) => <th key={header} className='p-3 text-md uppercase font-bold border border-blue-400 w-1/6'>{header}</th>)}
                    </tr>
                </thead>

                <tbody>
                    {
                        renderTableRows()
                    }
                </tbody>

            </table>

        </section>

    )
}
