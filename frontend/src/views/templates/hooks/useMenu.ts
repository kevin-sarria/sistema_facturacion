import { useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react"

export const useMenu = () => {

  const [ mobileScreen ] = useMediaQuery('(max-width: 768px)');
  
  const [ isOpen, setIsOpen ] = useState(true);

  useEffect( () => {
    if( mobileScreen ) setIsOpen(false);
  }, [mobileScreen] );

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  }

  return {
    isOpen,
    handleMenuToggle
  }
}
