import { Outlet } from "react-router-dom";
import { LinkStyleInterface } from "../../interfaces";
import { Avatar, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Stack, Button, Img, Text, Container, useMediaQuery } from '@chakra-ui/react';
import { Link } from "../components";
import { FaAngleLeft, FaArrowRightFromBracket, FaBars, FaBox, FaFileImport, FaFileInvoiceDollar, FaPenToSquare, FaRegNewspaper } from "react-icons/fa6";
import { useMenu } from "./hooks";

const LinkStyle: LinkStyleInterface = {
    color: 'gray.400',
    fontSize: '20px',
    fontWeight: 'semibold',
    paddingBlock: '10px',
    display: 'flex',
    alignItems: 'center',
    columnGap: '15px',
    justifyContent: 'center',
    "&:hover": {
        textDecoration: 'none',
        backgroundColor: 'gray.50',
        transition: "100ms background ease-in-out"
    }
}

const borderAside: string = '1px solid rgba(0, 0, 0, 0.15)';
const transitionAside: string = '300ms all ease-in-out';

export const AdminTemplate = () => {

    const { isOpen, handleMenuToggle } = useMenu();
    const [ biggerThanTabletSize ] = useMediaQuery('(min-width: 768px)');

    const asideWidth = biggerThanTabletSize ? '240px' : '100%';

    const marginLeftAside = () => {
        if( biggerThanTabletSize && !isOpen ) { // SI es mas grande la pantalla que el size de tablet y el drawer NO esta abierto
            return '-240px';
        } else if( biggerThanTabletSize && isOpen ) { // SI es mas grande la pantalla que el size de tablet y el drawer SI esta abierto
            return '0px';
        } else if( !biggerThanTabletSize && !isOpen ) { // Si NO es mas grande la pantalla que el size de tablet y el drawer NO esta abierto
            return '-100vw';
        } else { // SI es mas grande la pantalla que el size de tablet y el drawer SI esta abierto
            return '0px';
        }
    }

  return (
    <Box
        w='100vw'
        h='100vh'
        overflowX='hidden'
    >
        

        <Flex
            w='100%'
            h='100%'
        >
            {/* Start Aside */}
            <aside
                style={{
                    height: '100%',
                    width: asideWidth,
                    borderRight: `${borderAside}`,
                    marginLeft: ` ${marginLeftAside()}`,
                    transition: `${transitionAside}`
                }}
            >
                <Box
                    height='70px'
                    borderBottom={borderAside}
                >
                    <Flex
                        w='full'
                        h='full'
                        placeContent='end'
                        alignItems='center'
                        px='10px'
                    >
                        <Box
                            rounded='full'
                            display={ isOpen ? 'block' : 'none' }
                            zIndex={ isOpen ? '1' : '-1' }
                            cursor='pointer'
                            p='2px'
                            fontSize='22px'
                            color='gray.500'
                            onClick={handleMenuToggle}
                        >
                            <FaAngleLeft />
                        </Box>
                    </Flex>
                </Box>

                {/* Menu */}
                <Flex
                    w='100%'
                    h='calc(100% - 70px)'
                    flexDir='column'
                    justifyContent='space-between'
                >

                    <Flex
                        flexDir='column'
                        rowGap={50}
                    >
                        {/* Head Menu */}
                        <Flex
                            w='80px'
                            h='80px'
                            alignItems='center'
                            p={2}
                        >
                            {/* Icon Here */}
                            <Img src="/public/img/icons/icono-papeleria.png" />
                            <Text
                                fontSize='2xl'
                                fontWeight='bold'
                                color='blue.600'
                            >
                                Papeleria Universal
                            </Text>
                        </Flex>

                        {/* Body Menu */}
                        <Stack
                            w='full'
                            textAlign='center'
                        >
                            <Link
                                to="/dashboard"
                                sx={LinkStyle}
                                isActiveLink
                            >
                                <FaRegNewspaper />
                                Dashboard
                            </Link>

                            <Link
                                to="/dashboard/inventario"
                                sx={LinkStyle}
                                isActiveLink
                            >
                                <FaBox />
                                Inventario
                            </Link>

                            <Link
                                to="/dashboard/ventas"
                                sx={LinkStyle}
                                isActiveLink
                            >
                                <FaFileInvoiceDollar />
                                Ventas
                            </Link>

                            <Link
                                to="/dashboard/compras"
                                sx={LinkStyle}
                                isActiveLink
                            >
                                <FaFileImport />
                                Compras
                            </Link>
                        </Stack>

                    </Flex>



                    {/* Footer Menu */}
                    <Box
                        p={2}
                        color='gray.400'
                        fontWeight='medium'
                        textAlign='center'
                    >
                        &copy; Todos los derechos reservados. Papeleria Universal
                    </Box>

                </Flex>
            </aside>
            {/* End Aside */}

            {/* Start Main Content */}
            <Box
                width={ isOpen ? `calc(100% - ${asideWidth})` : '100%'}
                
                transition={transitionAside}
                overflowY='auto'
            >
                <header
                    style={{
                        width: '100%',
                        height: '70px',
                        backgroundColor: '#4299e1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingInline: '20px'
                    }}
                >
                    <Button
                        w='fit-content'
                        placeSelf='center'
                        color='white'
                        backgroundColor='unset'
                        padding={0}
                        margin={0}
                        _hover={{
                            backgroundColor: 'unset'
                        }}
                        zIndex={ !isOpen ? '1' : '-1' }
                        onClick={handleMenuToggle}
                    >
                        {
                            !isOpen &&
                            <FaBars fontSize='30px' />
                        }
                    </Button>


                    <Flex
                        alignSelf='end'
                        alignItems='center'
                        gap='10px'
                        h='100%'
                    >
                        <Text color='white' fontWeight='medium'>Bienvenido/a {'{user}'}!</Text>
                        <Menu>
                            {/* Options Button */}
                            <MenuButton color='gray.500'>
                                <Avatar />
                            </MenuButton>
                            <MenuList>
                                <MenuItem icon={<FaPenToSquare />} >
                                    Editar Perfil
                                </MenuItem>

                                <MenuItem icon={<FaArrowRightFromBracket />}>
                                    Cerrar Sesion
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </header>

                <Container
                    maxW='6xl'
                    paddingTop={10}
                    overflowY='auto'
                >
                    <Outlet />
                </Container>
            </Box>
            {/* End Main Content */}
        </Flex>
    </Box>
  )
}
