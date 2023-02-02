import { checkingCredentials, login, logout } from "./"


export const checkingAuthentication = ( email, password ) => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );

    }
}

export const startGoogleSingIn = () => {
    
    return async(dispatch) => {

        dispatch( checkingCredentials() );

        const result = await singInWithGoogle();

        if( !result.ok ) return dispatch(logout( result ));

        dispatch( login( result ) );

    }

}


export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {

    return async(dispatch) => {

        dispatch( checkingCredentials() );

        const { ok, uid, photoURL, errorMessage } = await registerUserWithEmailPassword({ email, password, displayName });

        if( !ok ) return dispatch( logout({errorMessage}) );

        dispatch(login({ uid, displayName, email, photoURL }));

    }

}


export const startLoginWithEmailPassword = ({ email, password }) => {

    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        const { uid, displayName, photoURL, ok, errorMessage } = await loginWithEmailPassword({ email, password });

        if( !ok ) return dispatch( logout({errorMessage}) );

        dispatch(login({ uid, displayName, email, ok, photoURL }));

    }


}



export const startLogout = () => {

    return async(dispatch) => {

        await logoutFirebase();

        dispatch( clearNotesLogout() );

        dispatch( logout() );

    }

}