import { clearDataSearched, clearProvider, dataFound, getProviders, haveError, loadData, loading, notLoadData, notLoading, pageBlank, selectProvider, setNewImplement } from "./";

export const loadingData = (seccion = '') => {
    return async (dispatch) => {

        dispatch(loading());

        if(data.length < 1) return dispatch(notLoadData({ msg: "No se han encontrado registros, por favor ingrese nuevos.", type: "info" }));

        dispatch(loadData(data));

    }
}

export const searchingData = (dataToSearch = "") => {

    // Datos de prueba
    const testData = [
        { id: 1, nombre: 'Lapicero', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 2, nombre: 'Cuaderno', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 3, nombre: 'Lapicero', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 4, nombre: 'Borrador', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 5, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 6, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 7, nombre: 'Cuaderno', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 8, nombre: 'Cuaderno', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 9, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 10, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 11, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
    ];

    return async (dispatch) => {

        dispatch(loading());

        if ( testData.filter( item => item.nombre.toLowerCase().includes(dataToSearch)).length < 1  ) {
            return dispatch(notLoading({ msg: 'No se encontro ningun registro', type: "info" }));
        }

        const dataNew = testData.filter( item => item.nombre.toLowerCase().includes(dataToSearch));

        return dispatch(dataFound(dataNew))

    }

}

export const clearingWantedData = () => {

    return (dispatch) => {
        dispatch(clearDataSearched());
    }

}

export const initingNewPage = () => {
    return (dispatch) =>  {

        dispatch(pageBlank());

    }
}

export const gettingProviders = () => {

    return async( dispatch ) => {

        dispatch( loading() );

        const providers = [
            { id: 1, nombre: 'Alphina', nit: '10298374', direccion: 'crr. 12 # 20 - 05', numero_contacto: '315 459 6109' },
            { id: 2, nombre: 'Algarra', nit: '10298444', direccion: 'crr. 12 # 20 - 05', numero_contacto: '312 452 6120' },
            { id: 3, nombre: 'Cacharreria Uriel', nit: '12298374', direccion: 'crr. 12 # 20 - 05', numero_contacto: '315 459 6109' }
        ];

        dispatch( getProviders(providers) );
    }
}

export const settingSelectProvider = ( providerSelected = {} ) => {

    return async( dispatch ) => {

        dispatch( loading() );

        if (providerSelected.length < 1) return dispatch( haveError({ msg: "No se han encontrado registros.", type: "info" }) );

        const providers = [
            { id: 1, nombre: 'Alphina', nit: '10298374', direccion: 'crr. 12 # 20 - 05', numero_contacto: '315 459 6109' },
            { id: 2, nombre: 'Algarra', nit: '10298444', direccion: 'crr. 12 # 20 - 05', numero_contacto: '312 452 6120' },
            { id: 3, nombre: 'Cacharreria Uriel', nit: '12298374', direccion: 'crr. 12 # 20 - 05', numero_contacto: '315 459 6109' }
        ];


        // Preguntar a la BD si existe un proovedor con este id, en caso de no hacerlo, dar un error
        const datos = providers.filter( provider => provider.id == providerSelected );

        if( datos.length < 1 ) return dispatch(  haveError({ msg: "No se han encontrado registros.", type: "info" }));

        dispatch( selectProvider(datos[0]) );

    }

}

export const clearingSelectProvider = () => {

    return async( dispatch ) => {
        dispatch(clearProvider());
    }

}

export const settingNewImplement = (implementos = {} ) => {

    return async( dispatch ) => {

        if( Object.entries(implementos).length < 1 ) return dispatch( haveError({ msg: "Ha ocurrido un error", type: "error" }) );

        dispatch(setNewImplement(implementos));

    }

}