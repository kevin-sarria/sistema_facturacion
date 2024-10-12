import { IconButton } from "@chakra-ui/react"
import { FaPlus } from "react-icons/fa6"

interface Props {
    onClick?: () => void;
}

export const AddRecord = ({ onClick }: Props) => {

  return (
    <IconButton
        colorScheme="blue"
        aria-label="Add Record"
        isRound
        icon={<FaPlus />}
        w={14}
        h={14}
        fontSize={25}
        position='fixed'
        right={5}
        bottom={5}
        onClick={onClick}
    />
  )
}
