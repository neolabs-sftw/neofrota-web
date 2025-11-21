// import styled from "styled-components";
import { useTema } from "../hooks/temaContext";
import { usePassageiros } from "../hooks/usePassageiros";
import { useParams } from "react-router-dom";

function ListaPassageiros() {
  const Cor = useTema().Cor;

  const clienteId = useParams().clienteId;

  const { listaPassageiro } = usePassageiros("1");

  console.log(clienteId)

  console.log(listaPassageiro)
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        padding: 15,
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: Cor.primaria,
              borderRadius: 14,
            }}
          />
          <div>
            <p style={{ fontWeight: "500", color: Cor.primaria }}>
              Lista de Passageiros
            </p>
            <p style={{ fontSize: 12, color: Cor.secundaria }}>
              Lista de passageiros cadastrados na empresa " ".
            </p>
          </div>
        </div>
      </div>
       <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: Cor.primaria,
              borderRadius: 14,
            }}
          />
    </div>
  );
}

export default ListaPassageiros;

// const TabelaPassageirosStyled = styled.table``;


// function TabelaPassageiros() {
//   return <div></div>;
// }