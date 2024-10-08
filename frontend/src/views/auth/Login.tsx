import { Box, Button, Flex, FormControl, FormLabel, Link as ChakraLink, Heading, Input, Stack } from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router-dom"

export const Login = () => {
  return (
    <Flex
        p={{base: '5', sm: '1'}}
        justifyContent='center'
        alignItems='center'
        w='100%'
        h='100%'
    >
        <Box
            display='flex'
            flexDirection='column'
            gap={10}
            width={{ base: '90%', sm: '60%' }}
        >
            <Stack>
                <Heading as='h1' size='xl' color='blue.600'>Iniciar Sesion</Heading>
                <Heading as='h3' size='sm' color='blue.700'>Inicia sesion y empieza a administrar tu negocio!</Heading>
            </Stack>

            <form
            >

                {/* Email */}
                <FormControl
                    mb={5}
                >
                    <FormLabel color='blue.700'>Email</FormLabel>
                    <Input type="email" name="email" id="email" />
                </FormControl>

                {/* Password */}
                <FormControl
                    mb={5}
                >
                    <FormLabel color='blue.700'>Password</FormLabel>
                    <Input type="password" name="password" id="password" />
                </FormControl>

                <Stack
                    mb={5}
                >
                    <ChakraLink
                        as={ReactRouterLink}
                        to='/register'
                        color='blue.900'
                        fontWeight='semibold'
                    >
                        Aun no tienes cuenta?, Registrate
                    </ChakraLink>

                    <ChakraLink
                        as={ReactRouterLink}
                        to='/forgot-password'
                        color='blue.900'
                        fontWeight='semibold'
                    >
                        Olvidaste tu password?, Recupera tu cuenta!
                    </ChakraLink>
                </Stack>

                <Button
                    bgColor='blue.500'
                    color='white'
                    _hover={{ bgColor: 'blue.600' }}
                    type="submit"
                >
                    Iniciar Sesion
                </Button>

            </form>
        </Box>
    </Flex>
  )
}
