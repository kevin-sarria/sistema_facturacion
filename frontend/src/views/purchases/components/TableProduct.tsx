import { Table as TableChakra, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { functions } from "../../../helpers";
import { Producto } from "../../../interfaces";

interface Props {
    data?: Array<Producto>
}

export const TableProduct = ({ data = [] }: Props) => {

    const { formatToCurrency } = functions;

  return (
    <TableContainer>
        <TableChakra variant='striped' colorScheme="blue">

            <Thead
                bgColor='blue.500'
            >
                <Tr>
                    <Th color='white'>Cantidad</Th>
                    <Th color='white'>Nombre</Th>
                    <Th color='white'>Presentacion</Th>
                    <Th color='white'>Valor Unitario</Th>
                    <Th color='white'>Valor Total</Th>
                    <Th color='white'>Porcentaje Ganancia</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    data.map( ({ nombre, cantidad, presentacion, precio_compra, porcentaje_ganancia, precio_venta }, index) => (
                        <Tr
                            key={index}
                        >
                            <Td isNumeric>{ cantidad }</Td>
                            <Td>{ nombre }</Td>
                            <Td>{ presentacion }</Td>
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
