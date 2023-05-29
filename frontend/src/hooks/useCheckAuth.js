import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import jwt_decode from 'jwt-decode';

import { login, logout, renewingToken } from '../store';

export const useCheckAuth = () =>{

    const { status } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    
    const token = localStorage.getItem('token') ?? null;

    

    useEffect( () => {

        if( !token ) {
            dispatch( logout() );
            return;
        }

        const user = jwt_decode(token);

        const { id_user, email_user, name_user, isAdmin_user, exp } = user;

        const fechaAhora = new Date().getTime();
        const diferenciaFechas = exp * 1000 - fechaAhora;
        const segundosDiferencia = Math.floor(diferenciaFechas / 1000 );


        if( segundosDiferencia <= 0) {
            localStorage.removeItem('token');
            dispatch( logout() );
            return;
        } else if( segundosDiferencia < 300 ) {
            dispatch( renewingToken() );
            return;
        }

        dispatch( login({ id: id_user, correo: email_user, nombre: name_user, admin: isAdmin_user, token }) );

    }, [] );

    return status;

}