import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { FirebaseContext } from "../../firebase/index";

const Nav = styled.nav`
  padding-left: 2rem;

  a {
    font-size: 1.8rem;
    margin-left: 2rem;
    color: var(--gris2);
    font-family: "PT Sans", Sans-serif;

    &::last-of-type {
      margin-right: 0;
    }
  }
`;
const Navegacion = () => {
  const { usuario } = useContext(FirebaseContext);
  return (
    <Nav>
      <Link href="/"><a>Incio</a></Link>
      <Link href="/populares"><a>Populares</a></Link>
      {usuario && <Link href="/nuevo-producto"><a>nuevo producto</a></Link>}
    </Nav>
  );
};

export default Navegacion;
