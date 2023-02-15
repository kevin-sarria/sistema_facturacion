import { loadData, notLoadData } from "./";

export const loadingData = ( data = [] ) => {
    return async( dispatch ) => {
        
        if(data.length < 1) return dispatch(notLoadData());

        dispatch( loadData(data) );

    }
}