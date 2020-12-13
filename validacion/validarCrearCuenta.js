export default function validarCrearCuenta(valores){
    let errores = {}

    //validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre= "el nombre es obligatiorio"
    }

    
    //validar el email del usuario
    if(!valores.email){
        errores.nombre= "el email es obligatiorio"
    } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = "email no valido"
    }

    //validar el password
    if(!valores.password){
        errores.password =" el password es obligatirio"
    }
    else if(valores.password.length < 6){
        errores.password = "el password debe ser de al menos 6 caracteres"
    }

    return errores

}