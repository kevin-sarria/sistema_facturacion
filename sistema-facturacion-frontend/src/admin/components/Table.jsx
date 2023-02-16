export const Table = ({ data = [] }) => {
  
  

  const columnas = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex max-w-full overflow-auto mx-2 xl:mx-auto">
      <table className="w-5/6 mx-auto mt-6 justify-center">
      <thead className="border border-spacing-2 text-center">
        <tr className="bg-blue-400 text-white">
          {columnas.map((columna) => (
            <th key={columna} className='p-5 text-md uppercase font-bold'>{columna}</th>
          ))}
        </tr>
      </thead>
      <tbody className="border border-spacing-2 text-center">
        {data.map((objeto) => (
          <tr key={objeto.id} className="even:bg-slate-200">
            {columnas.map((columna) => (
              <td key={columna} className='p-3 text-lg'>{objeto[columna]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );

};
