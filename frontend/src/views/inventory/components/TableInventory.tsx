import { Table as TableChakra, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { inventoryData } from "../../../data/inventoryData";
import { functions } from "../../../helpers";

const data = inventoryData;

export const Table = () => {

    const { formatToCurrency } = functions;

  return (
    <TableContainer>
        <TableChakra variant='striped' colorScheme="blue">

            <Thead>
                <Tr>
                    <Th>#</Th>
                    <Th>Nombre</Th>
                    <Th isNumeric>Cantidad</Th>
                    <Th>Presentacion</Th>
                    <Th>Precio Compra</Th>
                    <Th>Porcentaje Ganancia</Th>
                    <Th>Precio Venta</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    data.map( ({ nombre, cantidad, presentacion, precio_compra, porcentaje_ganancia, precio_venta }, index) => (
                        <Tr
                            key={index}
                        >
                            <Td>{ index + 1 }</Td>
                            <Td>{ nombre }</Td>
                            <Td isNumeric>{ cantidad }</Td>
                            <Td>{ presentacion?.nombre }</Td>
                            <Td>{ formatToCurrency(precio_compra) }</Td>
                            <Td>{ porcentaje_ganancia }</Td>
                            <Td>{ formatToCurrency(precio_venta) }</Td>
                        </Tr>
                    ) )
                }
                
            </Tbody>

        </TableChakra>
    </TableContainer>
  )
}
