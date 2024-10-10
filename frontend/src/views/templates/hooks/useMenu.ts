import { useState } from "react"

export const useMenu = () => {
  
  const [ isOpen, setIsOpen ] = useState(true);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  }

  return {
    isOpen,
    handleMenuToggle
  }
}
