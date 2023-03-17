import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = {}, formValidations = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );
    const [ formValidation, setFormValidation ] = useState( {} );
    const [ isFormComplete, setIsFormComplete ] = useState(false);

    useEffect( () => {
        createValidators();
    }, [ formState ] );

    useEffect( () => {

        setFormState( initialForm );

    }, [initialForm] );

    const isFormValid = useMemo( () => {

        for (const formValue of Object.keys( formValidation ) ) {

            if( formValidation[formValue] !== null ) return false;
        }

        return true;

    }, [ formValidation ] );

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onInputChangeManual = ( data = {} ) => {

        if( Object.entries(data).length < 1 ) return setFormState(initialForm);

        setFormState(prevState => {
            return Object.keys(data).reduce((state, key) => {
              return {
                ...state,
                [key]: data[key]
              };
            }, prevState);
          });
        
        
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const createValidators = () => {

        const formCheckedValues = {};

        for (const formField of Object.keys( formValidations ) ) {
            const [ fn, errorMessage = 'Este campo es requerido' ] = formValidations[formField];

            formCheckedValues[`${formField}Valid`] = fn( formState[formField]) ? null : errorMessage;
        }

        setFormValidation( formCheckedValues );

    }

    return {
        ...formState,
        formState,
        isFormComplete,
        setIsFormComplete,
        onInputChange,
        onInputChangeManual,
        onResetForm,
        ...formValidation,
        isFormValid
    }
}
