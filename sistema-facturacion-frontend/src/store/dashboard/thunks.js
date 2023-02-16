import { dataFound, loadData, loading, notLoadData, notLoading } from "./";

export const loadingData = ( data = [] ) => {
    return async( dispatch ) => {
        
        if(data.length < 1) return dispatch(notLoadData());

        dispatch( loadData(data) );

    }
}

export const searchingData = ( dataToSearch = "" ) => {

    const dataNew = [
        { id: 1, nombre: 'Lapicero', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 }
    ];

    return async( dispatch ) => {
        
        dispatch(loading());

        if( dataNew.map( item => item.nombre ).includes(dataToSearch) ) {
            return dispatch( dataFound(dataNew) )
        } else {
            return dispatch(notLoading({ error: true, msg: 'No se encontro ningun registro' }));
        }

    }

}