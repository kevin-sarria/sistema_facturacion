import { clearDataSearched, dataFound, loadData, loading, notLoadData, notLoading } from "./";

export const loadingData = (data = []) => {
    return async (dispatch) => {

        dispatch(loading());

        if (data.length < 1) return dispatch(notLoadData({ msg: "No se han encontrado registros, por favor ingrese nuevos.", type: "info" }));

        dispatch(loadData(data));

    }
}

export const searchingData = (dataToSearch = "") => {

    const dataNew = [
        // { id: 1, nombre: 'Lapicero', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        // { id: 2, nombre: 'Cuaderno', cantidad: 22, valor_medida: 'paquete', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        // { id: 3, nombre: 'Borrador', cantidad: 22, valor_medida: 'paquete', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        // { id: 4, nombre: 'Sacapuntas', cantidad: 22, valor_medida: 'unidad', precio_compra: 1200, porcentaje_ganancia: 30, precio_venta: 1700 },
        // Cosas de mas
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
            return dispatch(notLoading({ error: true, msg: 'No se encontro ningun registro' }));
        }

    }

}

export const clearingWantedData = () => {

    return (dispatch) => {
        dispatch(clearDataSearched());
    }

}