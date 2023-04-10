import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { settingNewImplement } from "../../../../../store";
import { FucntionsContext } from "../../../../registrar-entrada";


export const UseModal = ( data = {}, validations = {}, onResetForm = '' ) => {

    const [formSubmitted, setFormSubmitted] = useState(false);

    const { nombre_producto, cantidad, valor_medida, valor_unitario, porcentaje_ganancia } = data;
    const { nombre_productoValid, cantidadValid, valor_medidaValid, valor_unitarioValid, porcentaje_gananciaValid } = validations;

    const { isModalActive, setIsModalActive } = useContext( FucntionsContext );

    const dispatch = useDispatch();

    const handleSubmmit = (e, id = 0) => {

        e.preventDefault();
        setFormSubmitted(true);

        for (const value of Object.values(validations) ) {
            if( value ) {
                return;
            }    
        }

        if( nombre_productoValid || cantidadValid || valor_medidaValid || valor_unitarioValid || porcentaje_gananciaValid ) {
            return;
        }

        const valor_total = Number(cantidad) * Number(valor_unitario);
        let new_valor_medida = '';

        switch ( Number(valor_medida) ) {
            case 1:
                new_valor_medida = 'Unidad';
                break;
        
            case 2:

            new_valor_medida = 'Paquete';
            break;

            default:
                break;
        }

        const formStateFinal = {
            nombre_producto,
            cantidad,
            new_valor_medida,
            valor_unitario,
            valor_total,
            porcentaje_ganancia
        };

        if( id !== 0 ) {
            dispatch(settingNewImplement(formStateFinal));
        } else {
            dispatch(settingNewImplement(formStateFinal));
        }



        closeModal();

    }

    const closeModal = () => {
        setIsModalActive(false);
        setFormSubmitted(false);
        onResetForm();
    }

    return {
        // Metodos
        closeModal,
        handleSubmmit,

        // Variables
        isModalActive,
        formSubmitted
    }
}
