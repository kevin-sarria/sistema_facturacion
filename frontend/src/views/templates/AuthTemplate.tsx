import { Box, Grid, GridItem, Image } from "@chakra-ui/react"
import { Outlet, useLocation } from "react-router-dom"

import loginImage from '../../../public/img/login-image.jpg';
import registerImage from '../../../public/img/register-image.jpg';

export const AuthTemplate = () => {

    const { pathname } = useLocation();
    const image = pathname == '/' ? loginImage : registerImage;

  return (
    <Box
        style={{
            height: '100vh'
        }}
    >
        <Grid
            templateColumns={{base: 'unset', sm: 'repeat(2, 1fr)'}}
            h='100%'
        >
            <GridItem
                display={{ base: 'none', sm: 'block' }}
                h='100vh'
                filter='auto'
                brightness='60%'
            >
                <Image
                    src={image}
                    alt='Imagen Ilustrativa'
                    boxSize='100%'
                />
            </GridItem>

            <GridItem>
                <Outlet />
            </GridItem>

        </Grid>
    </Box>
  )
}
