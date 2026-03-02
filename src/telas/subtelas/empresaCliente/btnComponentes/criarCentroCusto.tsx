import { useState } from "react";
import { useTema } from "../../../../hooks/temaContext";
import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";

const CRIAR_CENTRO_CUSTO = gql`
  mutation CreateCentroCusto($input: CentroCustoInput!) {
    createCentroCusto(input: $input) {
      id
      nome
    }
  }
`;

const GET_CENTROS_CUSTO_CLIENTE_ID = gql`
  query CentroCustoEmpresaClienteId($centroCustoEmpresaClienteId: ID!) {
    centroCustoEmpresaClienteId(id: $centroCustoEmpresaClienteId) {
      id
      nome
      codigo
      empresaClienteId {
        id
      }
      operadoraId {
        id
      }
    }
  }
`;

interface BtnProps {
  $base: string;
  $cor: string;
}

const Btn = styled.div<BtnProps>`
  width: 27.5%;
  height: 100px;
  background-color: ${({ $base }) => $base}99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $cor }) => $cor}50;
  user-select: none;
  cursor: pointer;
  border-radius: 22px;
  box-shadow: 2px 2px 4px #00000010;
  transition: ease-in-out all 0.1s;

  &:hover {
    scale: 1.02;
    background-color: ${({ $base }) => $base}BB;
    box-shadow: 3px 3px 6px #00000010;
  }

  &:active {
    scale: 0.98;
    background-color: ${({ $base }) => $base};
    box-shadow: 1px 1px 2px #00000030;
  }
`;

function CriarCentroCusto() {
  const Cor = useTema().Cor;
  const [cxCriarCentroCusto, setCxCriarCentroCusto] = useState(false);

  return (
    <>
      <Btn
        $base={Cor.base2}
        $cor={Cor.primaria}
        onClick={() => setCxCriarCentroCusto(true)}
      >
        <p
          style={{
            fontFamily: "Icone",
            fontSize: 30,
            color: Cor.primaria,
            fontWeight: "bold",
          }}
        >
          arrows_input
        </p>
        <p style={{ textAlign: "center", fontSize: 12, color: Cor.texto1 }}>
          Centro de Custo
        </p>
      </Btn>
      <ModalCriarSolicitante
        cxCriarCentroCusto={cxCriarCentroCusto}
        setCxCriarCentroCusto={setCxCriarCentroCusto}
      />
    </>
  );
}

export default CriarCentroCusto;

function ModalCriarSolicitante({
  cxCriarCentroCusto,
  setCxCriarCentroCusto,
}: {
  cxCriarCentroCusto: any;
  setCxCriarCentroCusto: any;
}) {
  const Cor = useTema().Cor;
  const { clienteId } = useParams();

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");

  const token = localStorage.getItem("token");

  interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const operadoraId = decoded ? decoded.operadoraId : null;

  const [criarCentroCusto] = useMutation(CRIAR_CENTRO_CUSTO, {
    refetchQueries: [
      {
        query: GET_CENTROS_CUSTO_CLIENTE_ID,
        variables: {
          centroCustoEmpresaClienteId: clienteId,
        },
      },
    ],
  });

  const criarCentroCustoFunc = async () => {
    await criarCentroCusto({
      variables: {
        input: {
          nome: nome,
          codigo: codigo,
          empresaClienteId: parseInt(clienteId as string),
          operadoraId: Number(operadoraId),
        },
      },
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        zIndex: 10,
        top: 0,
        left: 0,
        backgroundColor: Cor.texto1 + 50,
        backdropFilter: "blur(2.5px)",
        justifyContent: "center",
        alignItems: "center",
        opacity: cxCriarCentroCusto ? 1 : 0,
        transition: `ease-in-out all 0.2s`,
        pointerEvents: cxCriarCentroCusto ? "auto" : "none",
      }}
      onClick={() => setCxCriarCentroCusto(false)}
    >
      <div
        style={{
          width: "30%",
          backgroundColor: Cor.base,
          borderRadius: 22,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          border: "1px solid" + Cor.texto2 + 50,
          boxShadow: Cor.sombra,
          transition: `ease-in-out all 0.2s`,
          scale: cxCriarCentroCusto ? 1 : 0.6,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div style={{ width: "100%", padding: "15px 15px 0px 15px" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <p
                style={{ fontSize: 14, color: Cor.texto1, fontWeight: "bold" }}
              >
                Criar Novo Centro de Custo
              </p>
              <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
                Melhores o controle de faturamento, criando centros de custo
              </p>
            </div>

            <p
              style={{
                cursor: "pointer",
                fontFamily: "Icone",
                fontSize: 24,
                color: Cor.primaria,
              }}
              onClick={() => setCxCriarCentroCusto(false)}
            >
              close
            </p>
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "0px 15px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <TextoEntrada
            placeholder="Nome"
            onChange={(e) => {
              setNome(e.target.value);
            }}
            value={nome}
            type="text"
            largura="100%"
          />
          <TextoEntrada
            placeholder="Código"
            onChange={(e) => {
              setCodigo(e.target.value);
            }}
            value={codigo}
            type="text"
            largura="100%"
          />
        </div>

        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Cor.texto2 + 50,
          }}
        />
        <div
          style={{
            width: "100%",
            padding: "10px 15px 15px 15px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <div
            style={{
              cursor: "pointer",
              backgroundColor: Cor.primaria,
              padding: "10px 50px",
              borderRadius: 22,
            }}
            onClick={() => {
              criarCentroCustoFunc();
              setCxCriarCentroCusto(false);
              setNome("");
              setCodigo("");
            }}
          >
            <p style={{ fontSize: 14, color: Cor.texto1, fontWeight: "bold" }}>
              Salvar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextoEntrada({
  placeholder,
  onChange,
  value,
  type,
  largura,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
  largura: string;
}) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: largura,
        backgroundColor: Cor.texto2 + 20,
        padding: 10,
        borderRadius: 22,
      }}
    >
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        style={{
          backgroundColor: "transparent",
          color: Cor.texto1,
          border: "none",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}
