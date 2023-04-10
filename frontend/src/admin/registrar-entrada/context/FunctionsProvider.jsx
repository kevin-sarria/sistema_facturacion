import { useState } from "react";
import { FucntionsContext } from "./";
import { Modal } from "../../components/Factura/components";


export const FunctionsProvider = ({ children }) => {
  
  const [ isModalActive, setIsModalActive ] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setIsModalActive(true);
  }

  return (
    <FucntionsContext.Provider value={{ isModalActive, setIsModalActive, Modal, openModal }}>
        { children }
    </FucntionsContext.Provider>
  )
}
