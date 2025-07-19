import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useFormik } from "formik"

export const AddProductForm = () => {

    const { values, handleChange, handleSubmit } = useFormik({
        initialValues: {
            nombre_producto: '',
            cantidad: 0,
            presentacion: '',
            valor_unitario: 0,
            porcentaje_ganancia: 0
        },
        onSubmit: () => {
            console.log(values);
        }
    });

  return (
    <form onSubmit={handleSubmit}>

        <FormControl>
            <FormLabel htmlFor="nombre_producto">Nombre</FormLabel>
            <Input
                type="text"
                id="nombre_producto"
                name="nombre_producto"
                placeholder="Nombre del producto..."
                value={values.nombre_producto}
                onChange={handleChange}
            />
        </FormControl>

        <FormControl>
            <FormLabel htmlFor="cantidad">Cantidad</FormLabel>
            <Input
                type="number"
                id="cantidad"
                name="cantidad"
                value={values.cantidad}
                onChange={handleChange}
                min={0}
            />
        </FormControl>

        <FormControl>
            <FormLabel htmlFor="presentacion">Presentacion</FormLabel>
            <Select
                name="presentacion"
                id="presentacion"
                placeholder='Select option'
                value={values.presentacion}
                onChange={handleChange}
            >
                <option value='1'>Caja x24</option>
                <option value='2'>Unidad</option>
                <option value='3'>Caja x12</option>
            </Select>
        </FormControl>

        <FormControl>
            <FormLabel htmlFor="valor_unitario">Valor Unitario</FormLabel>
            <Input
                type="number"
                id="valor_unitario"
                name="valor_unitario"
                value={values.valor_unitario}
                onChange={handleChange}
                min={0}
            />
        </FormControl>

        <FormControl>
            <FormLabel htmlFor="porcentaje_ganancia">Porcentaje Ganancia</FormLabel>
            <Input
                type="number"
                id="porcentaje_ganancia"
                name="porcentaje_ganancia"
                value={values.porcentaje_ganancia}
                onChange={handleChange}
                min={0}
            />
        </FormControl>

        <Button type="submit" colorScheme="blue" my={5} w='full'>Agregar Producto</Button>
    </form>
  )
}
