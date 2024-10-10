import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

interface Props {
    totalRecords: number;
    separator?: number;
}

export const Paginator = ({ totalRecords, separator = 5 }: Props) => {
    
    const totalButtons = totalRecords / separator;
    const [ currentPage, setCurrentPage ] = useState(1);



    const drawPaginator = () => {

        let buttons = [];

        for (let index = 0; index < totalButtons; index++) {
            const button = 
                <Button
                    key={index}
                    colorScheme="blue"
                    variant={ currentPage === index+1 ? 'solid' : 'outline'}
                    onClick={() => setCurrentPage(index+1)}
                >
                    {index + 1}
                </Button>;
            buttons.push(button);
        }

        return buttons;
    }

  return (
    <Box
        w='full'
        my={5}
        display='flex'
        gap={2}
        justifyContent='center'
    >
        <Button
            colorScheme="blue"
            variant='outline'
        >
            <FaAnglesLeft />
        </Button>
        
        {
            drawPaginator()
        }

        <Button
            colorScheme="blue"
            variant='outline'
        >
            <FaAnglesRight />
        </Button>
    </Box>
  )
}
