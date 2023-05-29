import { useContext } from "react";
import { useForm } from "../../../../hooks/UseForm";
import { UseModal } from "./hooks"
import { FucntionsContext } from "../../../registrar-entrada";

const initialForm = {
    nombre_producto: '',
    cantidad: '',
    valor_medida: 0,
    valor_unitario: '',
    porcentaje_ganancia: ''
}

const formValidations = {
    nombre_producto: [(value) => value.length >= 2, 'El nombre debe de tener al menos 2 caracteres.'],
    cantidad: [(value) => isNaN(value) || value.length >= 1, 'La cantidad debe ser de al menos 1.'],
    valor_medida: [(value) => Number(value) >= 1],
    valor_unitario: [(value) => Number(value) >= 50, 'El valor del articulo debe de ser de minimo 50 pesos.'],
    porcentaje_ganancia: [(value) => Number(value) >= 1, 'El valor del procentaje de la ganancia debe de ser de al menos 1.'],
}

export const Modal = () => {

    const { nombre_producto, cantidad, valor_medida, valor_unitario, porcentaje_ganancia, onInputChange, nombre_productoValid, cantidadValid, valor_medidaValid, valor_unitarioValid, porcentaje_gananciaValid, onResetForm } = useForm(initialForm, formValidations);

    const { isModalActive } = useContext( FucntionsContext );

    const validations = {
        nombre_productoValid,
        cantidadValid,
        valor_medidaValid,
        valor_unitarioValid,
        porcentaje_gananciaValid
    };

    const data = {
        nombre_producto,
        cantidad,
        valor_medida,
        valor_unitario,
        porcentaje_ganancia
    }

    const { formSubmitted, closeModal, handleSubmmit } = UseModal(data, validations, onResetForm);

    const formSubmmit = (e) => {

        e.preventDefault();

        


    }

    return (

        <>
            <div
                className={`${!isModalActive ? 'hidden' : ''}flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 absolute top-0 left-0 py-20 overflow-y-auto`}
                hidden={!isModalActive}
            >
                <div className="relative bg-white rounded-sm p-10">

                    <button className="absolute -top-5 right-28 md:-right-3 flex items-center justify-center w-10 h-10 text-lg text-white font-bold p-3 rounded-full bg-red-700 hover:bg-red-600" onClick={() => closeModal()}>X</button>

                    <form className="flex flex-col w-52 lg:w-72 items-center gap-y-6 will-change-scroll" onSubmit={(e) => handleSubmmit(e)}>

                        <div className="flex flex-col gap-y-3 w-full mb-5">
                            <label htmlFor="nombre_producto" className="text-xl font-semibold text-blue-600">Nombre</label>
                            <input type="text" name="nombre_producto" id="nombre_producto" className="text-md border rounded outline-none w-full h-8 p-2" value={nombre_producto} onChange={onInputChange} />
                            {nombre_productoValid && formSubmitted && <p className="text-red-600 text-center">{nombre_productoValid}</p>}
                        </div>

                        <div className="flex flex-col gap-y-3 w-full mb-5">

                            <label htmlFor="cantidad" className="text-xl font-semibold text-blue-600">Cantidad</label>
                            <input type="number" name="cantidad" id="cantidad" className="text-md border rounded outline-none w-full h-8 p-2" value={cantidad} onChange={onInputChange} />
                            {cantidadValid && formSubmitted && <p className="text-red-600 text-center">{cantidadValid}</p>}
                        </div>

                        <div className="flex flex-col gap-y-3 w-full mb-5 p-2">
                            <label htmlFor="valor_medida" className="text-xl font-semibold text-blue-600">Valor Medida</label>
                            <select name="valor_medida" id="valor_medida" className="text-md border rounded outline-none w-full h-10" value={valor_medida} onChange={onInputChange} >
                                <option value="0" disabled>-- Seleccione una opcion --</option>
                                <option value="1">Unidad</option>
                                <option value="2">Paquete</option>
                            </select>
                            {valor_medidaValid && formSubmitted && <p className="text-red-600 text-center">{valor_medidaValid}</p>}
                        </div>

                        <div className="flex flex-col gap-y-3 w-full mb-5">
                            <label htmlFor="valor_unitario" className="text-xl font-semibold text-blue-600">Valor Unitario</label>
                            <input type="number" name="valor_unitario" id="valor_unitario" className="text-md border rounded outline-none w-full h-8 p-2" min={0} value={valor_unitario} onChange={onInputChange} />
                            {valor_unitarioValid && formSubmitted && <p className="text-red-600 text-center">{valor_unitarioValid}</p>}
                        </div>

                        <div className="flex flex-col gap-y-3 w-full mb-5">
                            <label htmlFor="porcentaje_ganancia" className="text-xl font-semibold text-blue-600">Porcentaje Ganancia</label>
                            <input type="number" name="porcentaje_ganancia" id="porcentaje_ganancia" placeholder="Solo el valor numerico, ej: 30" className="text-md border rounded outline-none w-full h-8 p-2" min={0} value={porcentaje_ganancia} onChange={onInputChange} />
                            {porcentaje_gananciaValid && formSubmitted && <p className="text-red-600 text-center">{porcentaje_gananciaValid}</p>}
                        </div>


                        <input type="submit" value="Guardar" className="w-full md:w-40 text-green-800 text-lg border border-green-600 hover:bg-green-600 hover:text-white hover:cursor-pointer p-3 rounded" />

                    </form>
                </div>
            </div>
        </>
    )
}
