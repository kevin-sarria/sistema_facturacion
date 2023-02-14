import { loadData } from "./";

export const loadingData = () => {
    return ( dispatch ) => {
        dispatch( loadData() );
    }
}