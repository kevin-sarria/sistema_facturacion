import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../../../hooks/UseForm";
import { clearingSelectProvider, gettingProviders, initingNewPage, settingSelectProvider } from "../../../../store/dashboard";


const fecha = new Date();
const fechaOutput = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

let initialForm = {
    nombre: '',
    nit: '',
    direccion: '',
    numero_contacto: ''
}

export const HeaderFactura = () => {

    const [resultado, setResultado] = useState([]);
    const [provider, setProvider] = useState();
    const [ isSelectProvider, setIsSelectProvider ] = useState(true);

    const { data } = useSelector(state => state.dashboard);
    const { providers, implementos, providerSelected } = data;
    const dispatch = useDispatch();

    const { nombre, nit, direccion, numero_contacto, onInputChange, onInputChangeManual, isFormComplete, setIsFormComplete } = useForm(initialForm);

    useEffect(() => {
        // Vaciamos todos los datos anteriormente almacenados en el store
        dispatch(initingNewPage());
        // Obtener todos los proveedores y ponerlos en el store
        dispatch(gettingProviders());
    }, []);

    useEffect( () => {
        if( providerSelected !== undefined || providerSelected !== null ) setProvider(providerSelected);
    }, [providerSelected] );


    useEffect( () => {
        if( provider === undefined || Object.entries(provider).length < 1 ) return;
        viewDataProviderInHeader( provider );
        setIsSelectProvider(false);
        setIsFormComplete(true);
    }, [provider] );

    const findProvider = (wordToFind = '') => {

        if (wordToFind.trim().length < 2) {
            return setResultado([]);
        }

        setResultado(providers.filter(obj => obj.nombre.toLowerCase().includes(wordToFind)));

    }

    const selectProvider = (id = 0) => {
        if (Number(id) <= 0) return;
        setResultado([]);
        dispatch(settingSelectProvider(id));
    }

    const viewDataProviderInHeader = ( providerData = {} ) => {
        if( Object.entries(providerData).length < 1 ) return;
        onInputChangeManual( providerData );
    }

    const clearProviderSelected = () => {
        setIsSelectProvider(true);
        dispatch(clearingSelectProvider());
        onInputChangeManual({});
        setIsFormComplete(false);
    }


    return (
        <>
            <section className="flex flex-col my-10 items-center lg:items-end">

                <h3 className="text-xl text-blue-500 mb-3">¿Es un proveedor antiguo?</h3>

                <div className="flex items-center lg:items-stretch flex-col-reverse lg:flex-row gap-5">

                    <button
                        className="w-fit p-2 text-blue-600 hover:bg-blue-500 hover:text-white border border-blue-500 rounded disabled:border-gray-500 disabled:text-gray-500 disabled:hover:bg-transparent"
                        disabled={isSelectProvider}
                        onClick={ () => clearProviderSelected() }
                    >Limpiar</button>

                    <div className="flex relative gap-2 border border-blue-500 p-1">
                        <label htmlFor="proveedor_old">
                            <img src="public/img/lupa.png" alt="icono lupa" className="w-8 hover:cursor-pointer" />
                        </label>

                        <input type="text" id="proveedor_old" className="outline-none" onInput={(e) => findProvider(e.target.value)} />

                        <ul className="w-56 mx-auto absolute top-10">

                            {
                                resultado.map(({ id, nit, nombre }) =>
                                    <li className="text-gray-600 border p-2 bg-white hover:bg-blue-200 hover:text-gray-900 hover:cursor-pointer transition-colors duration-100" key={id} onClick={() => selectProvider(id)} > <span className="font-semibold">Nit:</span> {nit} - {nombre} </li>
                                )
                            }

                        </ul>
                    </div>

                </div>


            </section>


            <section>

                <form className="lg:grid lg:grid-cols-4 border border-blue-500 rounded">

                    <div className="lg:col-span-3 flex flex-col lg:flex-row gap-x-2 border-b lg:border-r border-blue-500 p-5 gap-2">
                        <label htmlFor="nombre">Nombre del proveedor:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={nombre}
                            onChange={onInputChange}
                            disabled={isFormComplete}
                            className="3/4 lg:w-2/4 outline-none border-b border-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-2 p-5 border-b border-blue-400">
                        <span>Fecha:</span>
                        {fechaOutput}
                    </div>

                    <div className="lg:col-span-2 flex flex-col lg:flex-row gap-x-2 border-b lg:border-r border-blue-500 p-5 gap-2">
                        <label htmlFor="nit">C.C o Nit:</label>
                        <input
                            type="text"
                            id="nit"
                            name="nit"
                            value={nit}
                            onChange={onInputChange}
                            disabled={isFormComplete}
                            className="3/4 lg:w-2/4 outline-none border-b border-blue-500"
                        />
                    </div>

                    <div className="lg:col-span-2 flex flex-col lg:flex-row gap-x-2 border-b border-blue-400 p-5 gap-2">
                        <label htmlFor="direccion">Dirección:</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={direccion}
                            onChange={onInputChange}
                            disabled={isFormComplete}
                            className="3/4 lg:w-2/4 outline-none border-b border-blue-500"
                        />
                    </div>

                    <div className="lg:col-span-4 flex flex-col lg:flex-row gap-x-2 p-5 gap-2">
                        <label htmlFor="numero_contacto">Número de contacto:</label>
                        <input
                            type="text"
                            id="numero_contacto"
                            name="numero_contacto"
                            value={numero_contacto}
                            onChange={onInputChange}
                            disabled={isFormComplete}
                            className="3/4 lg:w-2/4 outline-none border-b border-blue-500"
                        />
                    </div>

                </form>

            </section>
        </>
    )
}
