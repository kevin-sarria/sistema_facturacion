export const Table = ({ data = [], titulos = [] }) => {

  // ejemplo = (<td key={data.id}>{data.id}</td>)

 let columns = [];
 let rows = [];
 for ( let index = 0; index < data.length; index++) {
   rows = [...rows, `<td key=${data[index].id}>${data[index].nombre}</td>`];
  //  console.log(rows);
  //  return;
 }

 console.log(rows);

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
                {
                  // rows.map( row => row )
                }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
