import React, {useState, useEffect} from 'react';

const useValidacion = (stateIncial, validar, fn) => {

    const [valores, setvalores] = useState(stateIncial)
    const [errores, seterrores] = useState({})
    const [submitform, setsubmitform] = useState(false);
    
    useEffect(() =>{
        if(submitform){
            const noErrores = Object.keys(errores).length === 0

            if(noErrores){
                fn() // Fn = funcion que se ejecuta en el componente
            }

            setsubmitform(false)
        }

    }, [errores])

    //Funcion que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        setvalores({
            ...valores,
            [e.target.name]: e.target.value
        })
    } 

    //funcion que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault()

        const erroresValidacion = validar(valores)
        seterrores(erroresValidacion)
        setsubmitform(true)
    }

    // cuando se realiza el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores)
        seterrores(erroresValidacion)
    }
    
    return {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    };
}
 
export default useValidacion;