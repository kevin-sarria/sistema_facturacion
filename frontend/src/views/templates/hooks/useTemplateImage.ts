import { useEffect, useState } from "react"

import loginImage from '/public/img/login-image.jpg';
import registerImage from '/public/img/register-image.jpg';
import forgotPasswordImage from '/public/img/forgot-password-image.avif';

interface Props {
    pathname: string;
}

export const useTemplateImage = ({ pathname }:Props) => {

    const [image, setImage] = useState<string>('');

    useEffect( () => {
        if( pathname === '/' ) {
            setImage(loginImage);
        } else if( pathname === '/register' ) {
            setImage(registerImage);
        } else if( pathname === '/forgot-password' ) {
            setImage(forgotPasswordImage);
        } else {
            setImage('');
        }
    }, [pathname] );

    return {
        image
    }
}