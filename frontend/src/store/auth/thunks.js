import { checkingCredentials, authError, login, logout, clearAuthErrors } from "./"


export const checkingAuthentication = ( email, password ) => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        const url = import.meta.env.VITE_API_URL;

        const formData = new FormData();
        formData.append('correo', email);
        formData.append('password', password);

        const respuestaServer = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: formData
        }).then( response => response.json() );

        if( respuestaServer?.error ) {
            dispatch( authError({ msg: respuestaServer.error[0], type: "error" }) );

            setTimeout( () => {
                dispatch( clearAuthErrors() );
            }, [500] );

            return;
        }

        localStorage.setItem('token', respuestaServer.token);

        return dispatch( login(respuestaServer) );

    }
}

export const renewingToken = () => {

    return async( dispatch ) => {

        const url = import.meta.env.VITE_API_URL + '/revalidar-token';
        const oldToken = localStorage.getItem('token') ?? '';

        const respuestaServer = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${oldToken}`
            }
        }).then( response => response.json() );

        if( respuestaServer?.error ) {
            dispatch( authError({ msg: respuestaServer.error[0], type: "error" }) );

            setTimeout( () => {
                dispatch( clearAuthErrors() );
            }, [500] );

            return;
        }

        return localStorage.setItem('token', respuestaServer.newToken);

    }

}