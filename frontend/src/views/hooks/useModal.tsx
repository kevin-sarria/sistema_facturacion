import { ReactNode, useState } from "react";
import { ModalBody, Modal as ModalChakra, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { AddProductForm } from "../purchases";

export const useModal = () => {

    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ titleModal, setTitleModal ] = useState<string>('Title Here!');
    const [ contentModal, setContentModal ] = useState<null | ReactNode>(null);

    const closeModal = () => {
        setIsModalOpen(false);
        setTitleModal('Title Here!');
        setContentModal(null);
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    // Forms Functions
    const addPurchase = () => {
        setContentModal(<AddProductForm />);
        setTitleModal('Agregar Producto');
        setIsModalOpen(true);
    }

    const Modal = () => {

        return (
            <ModalChakra
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{titleModal}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        { contentModal }
                    </ModalBody>
                </ModalContent>
            </ModalChakra>
        );

    }

  return {
    isModalOpen,
    openModal,
    closeModal,
    addPurchase,
    Modal,
  }
}
