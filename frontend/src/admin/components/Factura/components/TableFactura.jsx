import { useContext } from "react";
import { FucntionsContext } from "../../../registrar-entrada/context";

const headersDefault = ['Nombre', 'Cantidad', 'Valor Medida', 'Valor Unitario', 'Valor Total', 'Porcenaje Ganancia', 'Opciones'];

export const TableFactura = ({ headers = headersDefault, datos = [] }) => {

    const { openModal } = useContext( FucntionsContext );

    const click = (e) => {
        console.log(e);
    }

    function renderTableRows( data = datos ) {
        return data?.map((row, rowIndex) => (
          <tr key={rowIndex} className='even:bg-blue-100'>
            {Object.values(row)?.map((value, columnIndex) => (
              <td key={columnIndex} className='text-center text-lg border border-blue-400 break-words'>{value}</td>
            ))}
            <td className="flex border border-blue-400">
                <button className="m-2 p-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded" onClick={click} data-id={rowIndex}>Editar</button>
                <button className="m-2 p-2 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white rounded">Eliminar</button>
            </td>
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
