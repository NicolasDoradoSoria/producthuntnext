import React, {useEffect, useState} from 'react';
import firebase from '../firebase'

function useAutenticacion(){
    const [usuarioAUtenticado, setusuarioAutenticado] = useState(null)

    useEffect(()=>{

        const unsuswcribe = firebase.auth.onAuthStateChanged(usuario =>{
            if(usuario){
                setusuarioAutenticado(usuario)
            }else{
                setusuarioAutenticado(null)
            }
        })
        return () => unsuswcribe()
    }, [])

    return usuarioAUtenticado
}

export default useAutenticacion