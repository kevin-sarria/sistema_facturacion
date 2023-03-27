import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

import Swal from 'sweetalert2';


export const Alerta = () => {

  const { haveError } = useSelector( state => state.dashboard );
  const [ error, setError ] = useState({ msg: "", type: "" });

  useEffect( () => {

    if( haveError !== null ) {
      setError({ msg: haveError.msg, type: haveError.type });
    }

  }, [haveError] );

  
  if( haveError ) {
    Swal.fire({
      icon: `${error.type}`,
      title: 'Oops...',
      text: `${error.msg}`
    })
  }
  

}
