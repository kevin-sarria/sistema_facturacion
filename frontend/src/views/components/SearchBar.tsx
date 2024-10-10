import { Box, Button, Input, InputGroup, InputLeftElement, useMediaQuery } from "@chakra-ui/react"
import { FaMagnifyingGlass } from "react-icons/fa6"

export const SearchBar = () => {

    const [ isLargerThan768 ] = useMediaQuery('(min-width: 768px)');

  return (
    <Box
        marginBlock={5}
        display='flex'
        justifyContent='flex-end'
    >
        <form>
            <InputGroup>

                <InputLeftElement>
                    <FaMagnifyingGlass color="#8a8a8a" />
                </InputLeftElement>

                <Input
                    type="text"
                    name="query"
                    width={ isLargerThan768 ? '240px' : '100%'}
                />

                <Button
                    ml='10px'
                    colorScheme="blue"
                >
                    Buscar
                </Button>
            </InputGroup>
        </form>
    </Box>
  )
}
