import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";

import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";
import { route } from "next/dist/next-server/server/router";
const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const CreadorProducto = styled.p`
  padding: .5rem 2rem;
  background-color: #DA552F;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`
const Producto = () => {
  //state del componente
  const [producto, setproducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setconsultarDB] = useState(true)
  
  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //context de firebas
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setproducto(producto.data());
          setconsultarDB(false)
        } else {
          setError(true);
          setconsultarDB(false)
        }
      };
      obtenerProducto();
    }
  }, [id]);

  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }

    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    if (haVotado.includes(usuario.uid)) return;

    //guardar el ID del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //actualizar en la BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    //actualizar el state
    setproducto({
      ...producto,
      votos: nuevoTotal,
    });

    setconsultarDB(true) // hay un voto, por lo tanto volver a hacer la consulta a la DB
  };
  if (error) return <Error404 />;

  if (Object.keys(producto).length === 0 && !error) return "cargando...";

 
  //funciones para crear comentrarios
  const comentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //identifica si el comentario es del creador del porducto
  const esCreador = (id) => {
    if (creador.id == id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    //inform acion extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //tomampos compo de comentarios y agregarlo al arreglo
    const nuevoComentarios = [...comentarios, comentario];

    //actualizar la BD
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevoComentarios,
    });
    //actualizar el state
    setproducto({ ...producto, comentarios: nuevoComentarios });

    setconsultarDB(true) // hay un comenbtario, por lo tanto volver a hacer la consulta a la DB
  };

  //funcion que revisa que el creador del producto sea el mismo que esta auntenticado
  const puedeBorrar = () => {
    if(!usuario) return false

    if(creador.id=== usuario.uid){
      return true
    }
  }

  //elimina un producto de la BD
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    if(creador.id !== usuario.uid){
      return router.push("/");
    }

    try {
      await firebase.db.collection('productos').doc(id).delete()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <>
        {error ? <Error404 /> : ( 

          
          <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado hace:{" "}
                {formatDistanceToNow(new Date(creado), { locale: es })}
              </p>
              <p>
                por: {creador.nombre} de {empresa}
              </p>
              <img src={urlimagen} />
              <p>{descripcion}</p>

              <h2>agrega tu comentario</h2>
              {usuario && (
                <>
                  <form onSubmit={agregarComentario}>
                    <Campo>
                      <input
                        type="text"
                        name="mensaje"
                        onChange={comentarioChange}
                        />
                    </Campo>
                    <InputSubmit type="submit" value="agregar comentario" />
                  </form>
                </>
              )}

              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>

              {comentarios.length === 0 ? (
                "aun no hay comentarios"
                ) : (
                  <ul>
                  {comentarios.map((comentario, i) => (
                    <li
                    key={`${comentario.usuarioId}-${i}`}
                    css={css`
                        border: 1px solid #e1e1e1;
                        padding: 2rem;
                      `}
                    >
                      <p>{comentario.mensaje}</p>

                      <p>
                        Escrito por:
                        <span
                          css={css`
                            font-weight: bold;
                          `}
                        >
                          {" "}
                          {""}
                          {comentario.usuarioNombre}{" "}
                        </span>
                      </p>
                      {esCreador (comentario.usuarioId) && <CreadorProducto>es creador</CreadorProducto>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                visitar URL
              </Boton>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votos} votos
                </p>
                {usuario && <Boton onClick={votarProducto}>votar</Boton>}
              </div>
            </aside>
          </ContenedorProducto>
          {puedeBorrar () &&
            <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
          }

        </div>
      )}
      </>
    </Layout>
  );
};

export default Producto;
