import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

import Swal from 'sweetalert2';

export const Alerta = () => {

  const { authError } = useSelector( state => state.auth );
  const { haveError } = useSelector( state => state.dashboard );
  const [ error, setError ] = useState({ msg: "", type: "" });

  useEffect( () => {
    if( haveError !== null ) {
      setError({ msg: haveError.msg, type: haveError.type });
    }
  }, [haveError] );

  useEffect( () => {
    if( authError !== null ) {
      setError({ msg: authError.msg, type: authError.type });
    }
  }, [authError] );

  if( haveError ) {
    Swal.fire({
      icon: `${error.type}`,
      title: 'Oops...',
      text: `${error.msg}`
    });
    
  } else if( authError ) {
    Swal.fire({
      icon: `${error.type}`,
      title: 'Oops...',
      text: `${error.msg}`
    });
  }

}
