import { FormControl, FormLabel } from "@chakra-ui/react";
import { useFormik } from "formik"

export const AddPurchaseForm = () => {

    const {  } = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: () => {

        }
    });

  return (
    <form>

        <FormControl>
            <FormLabel></FormLabel>
        </FormControl>

    </form>
  )
}
