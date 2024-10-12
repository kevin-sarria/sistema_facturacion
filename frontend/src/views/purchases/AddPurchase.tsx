import { Box, Grid, GridItem, FormControl, FormLabel, Input, useMediaQuery, Heading, Button, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex } from '@chakra-ui/react';
import { TableProduct } from './components';

const borderStyle = '1px solid #4299e1';

export const AddPurchase = () => {

    const [ desktopSize ] = useMediaQuery('(min-width: 768px)');

  return (
    <Box>

        <Heading my={10} color='blue.600'>Crear Factura Compra</Heading>

        <Flex
            w='100%'
            placeContent='end'
            my={10}
        >
            <Box>
                <Text color='blue.600' fontWeight='medium' fontSize='xl' mb={2}>Es un proveedor antiguo?</Text>
                <Input type='text' name='search_provider' placeholder='Buscalo aqui...' />
            </Box>

        </Flex>

        <Grid
            templateColumns='repeat(2, 1fr)'
            border={borderStyle}
            rounded='md'
        >
            {/* Row 1 */}
            <GridItem
                px={4}
                py={2}
                colSpan={ desktopSize ? 1 : 2}
                borderBottom={borderStyle}
                borderRight={desktopSize ? borderStyle : 'none'}
            >
                <FormControl
                    display='flex'
                >
                    <FormLabel color='blue.600'>Nombre del proveedor</FormLabel>
                    <Input type='text' name='name_provider' />
                </FormControl>
            </GridItem>

            <GridItem
                px={4}
                py={2}
                colSpan={ desktopSize ? 1 : 2}
                borderBottom={borderStyle}
            >
                <FormControl
                    display='flex'
                >
                    <FormLabel color='blue.600'>Fecha</FormLabel>
                    <Input type='date' name='purchase_date' />
                </FormControl>
            </GridItem>

            {/* Row 2 */}
            <GridItem
                px={4}
                py={2}
                colSpan={ desktopSize ? 1 : 2}
                borderBottom={borderStyle}
                borderRight={desktopSize ? borderStyle : 'none'}
            >
                <FormControl
                    display='flex'
                >
                    <FormLabel color='blue.600'>CC o Nit</FormLabel>
                    <Input type='text' name='nit_provider' />
                </FormControl>
            </GridItem>

            <GridItem
                px={4}
                py={2}
                colSpan={ desktopSize ? 1 : 2}
                borderBottom={borderStyle}
            >
                <FormControl
                    display='flex'
                >
                    <FormLabel color='blue.600'>Direccion</FormLabel>
                    <Input type='text' name='direction_provider' />
                </FormControl>
            </GridItem>

            {/* Row 3 */}
            <GridItem
                px={4}
                py={2}
                colSpan={2}
            >
                <FormControl
                    display='flex'
                >
                    <FormLabel color='blue.600'>Numero de Contacto</FormLabel>
                    <Input type='text' name='phone_provider' />
                </FormControl>
            </GridItem>
        </Grid>

        <Box
            my={5}
        >
            <TableProduct />
        </Box>

        <Flex
            justifyContent='space-between'
            alignItems='center'
            mt={20}
            mb={10}
            flexDir={ desktopSize ? 'row' :  'column' }
            gap={5}
        >

            <Box>
                <FormControl>
                    <FormLabel fontSize='xl' color='blue.600'>Esta factura tiene IVA?</FormLabel>
                    <Text>En caso de no tener IVA, poner 0</Text>
                    <NumberInput name='iva' defaultValue={0} min={0} max={100}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
            </Box>

            <Box>
                <Button variant='outline' colorScheme='blue'>Nuevo Producto</Button>
            </Box>

        </Flex>

    </Box>
  )
}
