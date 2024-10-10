import { Box, Grid, GridItem, Image } from "@chakra-ui/react"
import { Outlet, useLocation } from "react-router-dom"
import { useTemplateImage } from "./hooks";

export const AuthTemplate = () => {

    const { pathname } = useLocation();
    // const image = pathname == '/' ? loginImage : registerImage;

    const { image } = useTemplateImage({ pathname });

  return (
    <Box
        style={{
            height: '100vh'
        }}
    >
        <Grid
            templateColumns={{base: 'unset', md: 'repeat(2, 1fr)'}}
            h='100%'
        >
            <GridItem
                display={{ base: 'none', md: 'block' }}
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

            <GridItem
                minW='80'
            >
                <Outlet />
            </GridItem>

        </Grid>
    </Box>
  )
}
