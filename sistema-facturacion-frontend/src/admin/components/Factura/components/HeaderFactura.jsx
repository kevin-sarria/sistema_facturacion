import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gettingProviders, initingNewPage, settingSelectProvider } from "../../../../store/dashboard";


const fecha = new Date();
const fechaOutput = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

export const HeaderFactura = () => {

    const [ resultado, setResultado ] = useState([]);
    const [provider, setProvider] = useState({ id: '', nombre: '', nit: '', direccion: '', numero_contacto: '' });

    const { data } = useSelector(state => state.dashboard);
    const { providers, implementos, providerSelected } = data;
    const dispatch = useDispatch();

    useEffect(() => {
        // Vaciamos todos los datos anteriormente almacenados en el store
        dispatch(initingNewPage());
        // Obtener todos los proovedores y ponerlos en el store
        dispatch(gettingProviders());
    }, []);

    useEffect( () => {
        setProvider(providerSelected);

    }, [providerSelected] );



    const findProvider = ( wordToFind = '' ) => {

        if (wordToFind.trim().length < 2) {
            return setResultado([]);
        }

        setResultado( providers.filter(obj => obj.nombre.toLowerCase().includes(wordToFind)));

    }

    const selectProvider = ( id = 0 ) => {

        if( Number(id) <= 0 ) return;

        setResultado([]);
        dispatch( settingSelectProvider(id) );

    }


    return (
        <>
            <section className="flex flex-col my-10 items-center lg:items-end">

                <h3 className="text-xl text-blue-500 mb-3">¿Es un proovedor antiguo?</h3>

                <div className="flex items-center lg:items-stretch flex-col-reverse lg:flex-row gap-5">

                    <button className="hidden w-fit p-2 text-blue-600 hover:bg-blue-500 hover:text-white border border-blue-500 rounded">Limpiar</button>

                    <div className="flex relative gap-2 border border-blue-500 p-1">
                        <label htmlFor="proovedor_old">
                            <img src="public/img/lupa.png" alt="icono lupa" className="w-8 hover:cursor-pointer" />
                        </label>

                        <input type="text" id="proovedor_old" className="outline-none" onInput={(e) => findProvider(e.target.value)} />

                        <ul className="w-56 mx-auto absolute top-10">
                            
                            {
                                resultado.map( ({ id, nit, nombre }) => 
                                    <li className="text-gray-600 border p-2 bg-white hover:bg-blue-200 hover:text-gray-900 hover:cursor-pointer transition-colors duration-100" key={ id } onClick={ () => selectProvider(id) } > <span className="font-semibold">Nit:</span> { nit } - { nombre } </li>    
                                )
                            }
                            
                        </ul>
                    </div>

                </div>


            </section>


            <section className="lg:grid lg:grid-cols-4 border border-blue-500 rounded">

                <div className="lg:col-span-3 flex flex-col lg:flex-row gap-x-2 border-b lg:border-r border-blue-500 p-5 gap-2">
                    <label htmlFor="proovedor">Nombre del proovedor:</label>
                    <input type="text" id="proovedor" className="3/4 lg:w-2/4 outline-none border-b border-blue-500"   />
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-2 p-5 border-b border-blue-400">
                    <span>Fecha:</span>
                    {fechaOutput}
                </div>

                <div className="lg:col-span-2 flex flex-col lg:flex-row gap-x-2 border-b lg:border-r border-blue-500 p-5 gap-2">
                    <label htmlFor="nit">C.C o Nit:</label>
                    <input type="text" id="nit" className="3/4 lg:w-2/4 outline-none border-b border-blue-500" />
                </div>

                <div className="lg:col-span-2 flex flex-col lg:flex-row gap-x-2 border-b border-blue-400 p-5 gap-2">
                    <label htmlFor="direccion">Dirección:</label>
                    <input type="text" id="direccion" className="3/4 lg:w-2/4 outline-none border-b border-blue-500" />
                </div>

                <div className="lg:col-span-4 flex flex-col lg:flex-row gap-x-2 p-5 gap-2">
                    <label htmlFor="numero_contacto">Número de contacto:</label>
                    <input type="text" id="numero_contacto" className="3/4 lg:w-2/4 outline-none border-b border-blue-500" />
                </div>

            </section>
        </>
    )
}
