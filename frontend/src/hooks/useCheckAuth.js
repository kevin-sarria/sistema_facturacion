import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login, logout } from '../store';

   const user = {
       uid: '1',
       email: 'correo@correo.com',
       displayName: 'Kevin',
       isAdmin: false
   }

// const user = {};

export const useCheckAuth = () =>{

    const { status } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    

    useEffect( () => {

        if( Object.entries(user).length <= 0 ) {
            dispatch( logout() );
            return;
        }

        const { uid, email, displayName, isAdmin } = user;

        dispatch( login({ uid, email, displayName, isAdmin }) );

    }, [] );

    return status;

}