export const Table = ({ data = [] }) => {

  let titulos = Object.keys(data[0]);
  
  const datos = data.map( ( dato, index) => 

    <tr key={index + Math.random()} className='even:bg-slate-200'>
      <td key={dato.id + Math.random() } className='p-3 text-lg' >{dato.id}</td>
      <td key={dato.nombre } className='p-3 text-lg' >{dato.nombre}</td>
      <td key={dato.cantidad + Math.random() } className='p-3 text-lg' >{dato.cantidad}</td>
      <td key={dato.valor_medida } className='p-3 text-lg' >{dato.valor_medida}</td>
      <td key={dato.precio_compra + Math.random() } className='p-3 text-lg' >{dato.precio_compra}</td>
      <td key={dato.porcentaje_ganancia + Math.random() } className='p-3 text-lg' >{dato.porcentaje_ganancia}</td>
      <td key={dato.precio_venta + Math.random()  } className='p-3 text-lg' >{dato.precio_venta}</td>
    </tr>

  );

  titulos = titulos.map((item) => item.replace("_", " "));

  return (
    <div className="flex max-w-full overflow-auto mx-2 xl:mx-auto">
      <table className="w-5/6 mx-auto mt-6 justify-center">
        <thead className="border border-spacing-2 text-center">
          <tr className="bg-blue-400 text-white">
            {titulos.map((element) => {
              return <td key={element} className='p-5 text-md uppercase font-bold'>{element}</td>;
            })}
          </tr>
        </thead>

        <tbody className="border border-spacing-2 text-center">
            {datos}
        </tbody>
      </table>
    </div>
  );
};
