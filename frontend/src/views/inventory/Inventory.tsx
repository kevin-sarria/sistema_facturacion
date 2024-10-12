import { Box, Heading } from "@chakra-ui/react";
import { Table } from "./components";
import { AddRecord, Paginator, SearchBar } from "../components";
import { useModal } from "../hooks";
import { useNavigate } from "react-router-dom";

export const Inventory = () => {

  const { Modal } = useModal();

  const navigate = useNavigate();

  return (
    <Box>
        <Heading color='blue.600' pb={5}>Inventario</Heading>
        <SearchBar />
        <Table />
        <Paginator totalRecords={10} />
        <Modal />
        <AddRecord onClick={() => navigate('/dashboard/compras/crear')} />
    </Box>
  )
}
