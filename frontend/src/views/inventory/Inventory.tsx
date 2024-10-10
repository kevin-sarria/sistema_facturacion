import { Box, Heading } from "@chakra-ui/react";
import { Table } from "./components";

export const Inventory = () => {
  return (
    <Box>
        <Heading pb={5}>Inventario</Heading>
        <Table />
    </Box>
  )
}
