import { Box, Heading } from "@chakra-ui/react";
import { Table } from "./components";
import { Paginator, SearchBar } from "../components";

export const Inventory = () => {
  return (
    <Box>
        <Heading color='blue.600' pb={5}>Inventario</Heading>
        <SearchBar />
        <Table />
        <Paginator totalRecords={10} />
    </Box>
  )
}
