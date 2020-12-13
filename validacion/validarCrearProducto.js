export default function validarCrearProducto(valores){
    let errores = {}

    //validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre= "el nombre es obligatiorio"
    }

    
    //validar el password del usuario
    if(!valores.empresa){
        errores.empresa = "Nombre de empresa es obligatorio"
    }

    //validar la url
    if(!valores.url){
        empresa.url = "la url del producto es obligatoria"
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url ="URL mal formateada o no valida"
    }

    //vvalidar descripcion
    if(!valores.descripcion){
        empresa.descripcion ="agrega una descripcion de tu producto"
    }

    return errores

} 