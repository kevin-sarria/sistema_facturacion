export const TableCopy = ({ data = [], titulos = [] }) => {

    let columns = [];
    let rows = [];
    for (const iterator of data) {
      rows = [...rows, `<td>${data.id}</td>`];
    }
   
     return (
       <div className="flex w-5/6 h-1/2 overflow-auto mx-auto">
         <table className="w-5/6 mx-auto mt-6 justify-center">
           <thead className="border border-spacing-2 text-center">
             <tr>
               {titulos.map((element) => {
                 return <td key={element}>{element}</td>;
               })}
             </tr>
           </thead>
   
           <tbody className="border border-spacing-2 text-center">
             {data.map((dato, index) => {
               return (
                 <tr key={dato.id}>
                   <td>
                     {
                       (index += 1)
                     }
                   </td>
                   <td key={dato.nombre}>{dato.nombre}</td>
                   <td key={dato.cantidad}>{dato.cantidad}</td>
                   <td key={dato.valor_medida}>{dato.valor_medida}</td>
                   <td key={dato.precio_compra}>{dato.precio_compra}</td>
                   <td key={dato.porcentaje_ganancia}>
                     {dato.porcentaje_ganancia}
                   </td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   {/* Cosas de mas */}
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                   <td key={dato.precio_venta}>{dato.precio_venta}</td>
                 </tr>
               );
             })}
           </tbody>
         </table>
       </div>
     );
   };
   