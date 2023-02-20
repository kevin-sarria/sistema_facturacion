import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearingWantedData, searchingData } from "../../store";



export const Buscador = () => {

    const { data } = useSelector( state => state.dashboard );

    const [busqueda, setBusqueda] = useState('');
    const dispatch = useDispatch();

    useEffect( () => {

        if( busqueda.length < 1  ) {
            dispatch(clearingWantedData());
        }

    }, [busqueda] );

    if( !data ) return;

    const handleSearch = (e) => {

        e.preventDefault();

        if (busqueda.length > 1) {
            dispatch(searchingData(busqueda));
        }
    }

    return (
        <div className="flex justify-center lg:justify-end w-full lg:w-10/12 mx-auto mt-10">

            <form onSubmit={ (e) => handleSearch(e) }>
                <div className="flex w-fit border border-blue-400 rounded-sm rigth p-1">

                    <label htmlFor="buscador" className="cursor-pointer">

                        <img
                            src="https://cdn.icon-icons.com/icons2/3468/PNG/128/web_ui_interface_magnifying_glass_magnifier_find_search_icon_219794.png"
                            alt="Icono buscador"
                            className="w-10 h-10"
                        />
                    </label>

                    <input type="text" className="text-lg p-2 outline-none" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>

                <input
                    type="submit"
                    id="buscador"
                    className="hidden"
                    value=""
                    onClick={(e) => handleSearch(e)}
                />
            </form>

        </div>
    )
}
