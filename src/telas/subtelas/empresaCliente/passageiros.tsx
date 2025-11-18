import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import ListaPassageiros from "../../../componentes/listaPassageiros";
import { useTema } from "../../../hooks/temaContext";
import styled from "styled-components";

function Passageiros() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <PassageirosConteudo />
      </>
    ),
  });
}

export default Passageiros;

function PassageirosConteudo() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        padding: "25px 15px 15px 15px",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Passageiros</h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <CadastrarNovoCliente />
      <ListaPassageiros />
    </div>
  );
}

function CadastrarNovoCliente() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        backgroundColor: Cor.base2,
        width: "100%",
        borderRadius: 22,
        padding: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
        }}
      >
        <text style={{ color: Cor.texto2, fontSize: 14 }}>
          Pesquisar por <br /> passageiros:
        </text>
        <CampoBuscasPassageiros />
        <text style={{ color: Cor.texto2, fontSize: 14 }}>
          Pesquisar por <br /> Centro de Custo:
        </text>
        <SelectCentroCusto />
      </div>
      <BtnCadastrarPassageiro />
    </div>
  );
}

interface BtnCadastrarPassageiroStyledProps {
  $color: string;
  $backgroundColor: string;
}

const BtnCadastrarPassageiroStyled = styled.button<BtnCadastrarPassageiroStyledProps>`
  color: ${({ $color }) => $color};
  background-color: ${({ $backgroundColor }) => $backgroundColor + 10};
  border: 1px solid ${({ $backgroundColor }) => $backgroundColor + 70};
  font-weight: bold;
  padding: 10px 35px;
  border-radius: 22px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

function BtnCadastrarPassageiro() {
  const Cor = useTema().Cor;
  return (
    <BtnCadastrarPassageiroStyled
      $color={Cor.primaria}
      $backgroundColor={Cor.primaria}
    >
      <text style={{ fontFamily: "Icone", fontSize: 24 }}>person_add</text>
      <text>Cadastrar</text>
    </BtnCadastrarPassageiroStyled>
  );
}

interface BtnLupaProps {
  $corBG: string;
}

const BtnLupa = styled.div<BtnLupaProps>`
  background-color: ${({ $corBG }) => $corBG};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 22px 22px 0;
  height: 50px;
  width: 50px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  text {
    font-size: 24px;
    font-weight: bold;
    transition: all 0.1s ease-in-out;
  }

  &:hover {
    filter: brightness(1.1);

    text {
      font-size: 28px;
    }
  }
`;

function CampoBuscasPassageiros() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Cor.texto1 + 10,
        borderRadius: 22,
        height: 50,
        marginRight: 50,
      }}
    >
      <input
        style={{
          padding: "15px 0 15px 15px",
          border: "none",
          outline: "none",
          width: 300,
          borderRadius: "22px 0 0 22px",
          color: Cor.texto1,
          backgroundColor: "transparent",
          fontSize: 16,
        }}
      />

      <BtnLupa $corBG={Cor.primaria}>
        <text style={{ fontFamily: "Icone", color: Cor.secundaria }}>
          search
        </text>
      </BtnLupa>
    </div>
  );
}

function SelectCentroCusto() {
  const Cor = useTema().Cor;
  return (
    <select
      style={{
        width: 250,
        borderRadius: 22,
        padding: 10,
        border: "none",
        outline: "none",
        backgroundColor: Cor.texto1 + 10,
        color: Cor.texto1,
        fontSize: 16,
      }}
      defaultValue={""}
    >
      <option value="">Todos</option>
      <option>Centro de Custo 1</option>
      <option>Centro de Custo 2</option>
      <option>Centro de Custo 3</option>
    </select>
  );
}
