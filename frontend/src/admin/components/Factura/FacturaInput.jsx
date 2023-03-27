import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import { HeaderFactura, NewProduct, TableFactura } from "./components";



export const FacturaInput = () => {

    const [ rowsTable, setRowsTable ] = useState([]);

    const { data } = useSelector(state => state.dashboard);
    const implementos = data.implementos;

    useEffect( () => {
        if( implementos !== undefined ) {   
            implementos.length > 0 ? setRowsTable(implementos) : '';
        }
    }, [data.implementos] );


    const navigate = useNavigate();

    const volver = (e) => {
        e.preventDefault();

        navigate(-1);
    }

    const save = (e) => {

        e.preventDefault();



    }


    return (
        <section className="w-4/5 mx-auto">

            <HeaderFactura />

            <TableFactura datos={rowsTable.length >= 1 ? rowsTable : []} />
            
            <NewProduct />
            

            <section className="flex gap-2 justify-end">
                <button className="text-xl border border-amber-500 hover:bg-amber-500 rounded p-2 text-amber-500 hover:text-white" onClick={volver}>Cancelar</button>
                <button className="text-xl border border-green-500 hover:bg-green-500 rounded p-2 text-green-500 hover:text-white" onClick={save}>Guardar</button>
            </section>

        </section>
    )
}
