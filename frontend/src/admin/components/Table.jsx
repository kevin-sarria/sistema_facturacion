import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



export const Table = ({ datos = [], facturaLink = "", opciones = false }) => {

  useEffect( () => {
    if( datos.length < 1 ) return;
  }, [datos] );
  
  const { data, dataSearch } = useSelector( state => state.dashboard )

  if( facturaLink.length > 1 ) {
    facturaLink += '/';
  }
  
  if( dataSearch.length >= 1 ) {
    datos = dataSearch;
  } else {
    datos = data;
  }

  const columnas = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex max-w-full overflow-auto mx-2 xl:mx-auto">
      <table className="w-5/6 mx-auto mt-6 justify-center">
      <thead className="border border-spacing-2 text-center">
        <tr className="bg-blue-400 text-white">
          {columnas.map((columna) => (
            <th key={columna} className='p-5 text-md uppercase font-bold'>{columna}</th>
          ))}

          {
            facturaLink.length > 1 && data.length > 1 && <th>FACTURA</th>
          }

          {
            opciones && data.length > 1 && <th>OPCIONES</th>
          }

        </tr>
      </thead>
      <tbody className="border border-spacing-2 text-center">
        {datos.map((objeto) => (
          <tr key={objeto.id} className="even:bg-slate-200">
            {columnas.map((columna) => (
              <td key={columna} className='p-3 text-lg'>{objeto[columna]}</td>
            ))}

            {
              facturaLink.length > 1 && <td><Link to={facturaLink + objeto.id}> <img src="public/img/documento-texto.png" alt="Icono PDf" className="w-12 mx-auto m-2" /> </Link></td>
            }

            {
              opciones && 
              <td>
                <div className="flex justify-evenly gap-5">
                  <Link className="text-amber-500 font-semibold" to={ `/editar-factura/` + objeto.id }>Editar</Link>
                  <Link className="text-red-500 font-semibold" to={ `/eliminar-factura/` + objeto.id }>Eliminar</Link>
                  </div>
              </td>
            }

          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );

};
