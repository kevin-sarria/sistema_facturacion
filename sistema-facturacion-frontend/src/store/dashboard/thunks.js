import { clearDataSearched, dataFound, loadData, loading, notLoadData, notLoading, pageBlank } from "./";

export const loadingData = (data = []) => {
    return async (dispatch) => {

        dispatch(loading());

        if (data.length < 1) return dispatch(notLoadData({ msg: "No se han encontrado registros, por favor ingrese nuevos.", type: "info" }));

        dispatch(loadData(data));

    }
}

export const searchingData = (dataToSearch = "") => {

    // Datos de prueba
    const dataNew = [
        { id: 5, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 6, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 7, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 8, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 9, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 10, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        { id: 11, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
    ];

    return async (dispatch) => {

        dispatch(loading());

        if (dataNew.map( (item )=> item.nombre).includes(dataToSearch)) {
            return dispatch(dataFound(dataNew))
        } else {
            return dispatch(notLoading({ msg: 'No se encontro ningun registro', type: "info" }));
        }

    }

}

export const clearingWantedData = () => {

    return (dispatch) => {
        dispatch(clearDataSearched());
    }

}

export const initNewPage = () => {
    return (dispatch) =>  {

        dispatch(pageBlank());

    }
}