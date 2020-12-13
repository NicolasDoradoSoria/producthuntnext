import Layout from "../components/layout/Layout";
import React, {useState} from "react";
import Router from 'next/router'
import { css } from "@emotion/react";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import firebase from '../firebase'

//validaciones
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSecion";

const STATE_INICIAL = {
  email: "",
  password: "",
};
const login = () => {

  const [error, seterror] = useState(false)

  const {
    valores,
    errores,
    handleChange,
    handleSubmit,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSecion);

  const {email, password } = valores;
  async function iniciarSecion(){
   try {
     await firebase.login(email, password)
     Router.push("/")
   } catch (error) {
    console.log("hubo un error al autenticar un uysaurio", error.message)
    seterror(error.message)
   }
    
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            iniciar sesion
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            
            <Campo>
              <label htmlFor="email">email</label>
              <input
                type="email"
                id="email"
                placeholder="email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">password</label>
              <input
                type="password"
                id="password"
                placeholder="password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}

            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="iniciar sesion" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default login;
