import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Stack } from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router-dom"

export const Register = () => {
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
                <Heading as='h1' size='xl' color='blue.600'>Registrarse</Heading>
                <Heading as='h3' size='sm' color='blue.700'>Registrate y organiza mejor tu negocio!</Heading>
            </Stack>

            <form
            >

                {/* Email */}
                <FormControl
                    mb={5}
                >
                    <FormLabel htmlFor="email" color='blue.700'>Email</FormLabel>
                    <Input type="email" name="email" id="email" />
                </FormControl>

                {/* Name */}
                <FormControl
                    mb={5}
                >
                    <FormLabel htmlFor="name" color='blue.700'>Nombre</FormLabel>
                    <Input type="text" name="name" id="name" />
                </FormControl>

                {/* Password */}
                <FormControl
                    mb={5}
                >
                    <FormLabel htmlFor="password" color='blue.700'>Password</FormLabel>
                    <Input type="password" name="password" id="password" />
                </FormControl>

                {/* Repeat Password */}
                <FormControl
                    mb={5}
                >
                    <FormLabel htmlFor="password_confirmation" color='blue.700'>Repetir Password</FormLabel>
                    <Input type="password" name="password_confirmation" id="password_confirmation" />
                </FormControl>

                <Stack
                    mb={5}
                >
                    <ChakraLink
                        as={ReactRouterLink}
                        to='/'
                        color='blue.900'
                        fontWeight='semibold'
                    >
                        Ya tienes cuenta?, Inicia Sesion
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
                    Registrarse
                </Button>

            </form>
        </Box>
    </Flex>
  )
}
