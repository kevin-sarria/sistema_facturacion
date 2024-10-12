import { ReactNode, useState } from "react";
import { ModalBody, Modal as ModalChakra, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { ModalProps } from "../../interfaces";

export const useModal = () => {

    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ contentModal, setContentModal ] = useState<null | ReactNode>(null);

    const closeModal = () => {
        setIsModalOpen(false);
        setContentModal(null);
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    // Forms Functions
    const addPurchase = () => {

    }

    const Modal = ({ title = 'Title Here!' }: ModalProps) => {

        return (
            <ModalChakra
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
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
    Modal
  }
}
