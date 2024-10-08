import { useEffect, useState } from "react"

export const useAuth = () => {

    const [ isAuth, setIsAuth ] = useState<boolean>(false);

    useEffect( () => {
        setIsAuth(false);
    }, [] );

    return {
        isAuth
    }

}