export const Table = ({ data = [] }) => {
  // ejemplo = (<td key={data.id}>{data.id}</td>)

  let titulos = Object.keys(data[0]);
  let rows = [];

  for (let index = 0; index < data.length; index++) {
    rows = [
      ...rows,
      <>
        <tr key={data[index].id}>
          <td key={`00${index}00`}>{index + 1}</td>
          <td key={data[index].nombre}>{data[index].nombre}</td>
          <td key={data[index].cantidad}>{data[index].cantidad}</td>
          <td key={data[index].valor_medida}>{data[index].valor_medida}</td>
          <td key={data[index].precio_compra}>{data[index].precio_compra}</td>
          <td key={data[index].porcentaje_ganancia}>
            {data[index].porcentaje_ganancia}
          </td>
          <td key={data[index].precio_venta}>{data[index].precio_venta}</td>
        </tr>
      </>,
    ];
  }

  titulos = titulos.map((item) => item.replace("_", " "));

  // console.log(rows);

  return (
    <div className="flex max-w-full h-1/2 overflow-auto mx-auto">
      <table className="w-5/6 mx-auto mt-6 justify-center">
        <thead className="border border-spacing-2 text-center">
          <tr>
            {titulos.map((element) => {
              return <td key={element}>{element}</td>;
            })}
          </tr>
        </thead>

        <tbody className="border border-spacing-2 text-center">
          {rows}
        </tbody>
      </table>
    </div>
  );
};
