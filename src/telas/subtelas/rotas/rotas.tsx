import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import styled from "styled-components";

function Rotas() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <ConteudoRotas />
      </>
    ),
  });
}

export default Rotas;

const SelectEmpresa = styled.div`
  width: 200px;
  height: 50px;
  background-color: red;
  border-radius: 22px
`;

function ConteudoRotas() {
  return (
    <div style={{ width: "100%", padding: 30 }}>
      <SelectEmpresa />
    </div>
  );
}
