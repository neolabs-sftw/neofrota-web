import { useState } from "react";
import { useTema } from "../../../hooks/temaContext";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";

interface OverlayProps {
  $bg: string;
  $modal: boolean;
}

const Overlay = styled.div<OverlayProps>`
  width: 100vw;
  height: 100vh;
  background-color: ${({ $bg }) => `${$bg}50`};
  position: absolute;
  display: ${({ $modal }) => ($modal ? "flex" : "none")};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 10;
  backdrop-filter: blur(2px);
  opacity: 1;
  pointer-events: auto;
  transition: all 0.3s ease-in-out;
`;

interface ModalStyledProps {
  $bg: string;
  $sombra: string;
  $borda: string;
  $corPrimaria: string;
  $corTexto2: string;
  $modal: boolean;
}

const ModalCriarRota = styled.div<ModalStyledProps>`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background-color: ${({ $bg }) => $bg};
  border: 1px solid ${({ $borda }) => $borda};
  border-radius: 22px;
  box-shadow: ${({ $sombra }) => $sombra};
  z-index: 11;
  transform: ${({ $modal }) => ($modal ? "scale(1)" : "scale(0.6)")};
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  pointer-events: ${({ $modal }) => ($modal ? "auto" : "none")};
  transition: all 0.3s ease-in-out;
`;

const CRIAR_ROTA = gql`
  mutation Mutation($data: RotaInput!) {
    createRota(input: $data) {
      origem
      destino
      operadoraId {
        id
        nome
      }
      empresaClienteId {
        id
        rSocial
      }
    }
  }
`;


const GET_ROTAS = gql`
  query RotaEmpresaClienteId($rotaEmpresaClienteId: ID!) {
    rotaEmpresaClienteId(id: $rotaEmpresaClienteId) {
      id
      origem
      destino
      operadoraId {
        id
        nome
      }
      empresaClienteId {
        id
        nome
      }
      rotaValor {
        id
      }
    }
  }
`;

function CriarRota(empresaSelecionada: { empresaSelecionada: any }) {
  const Cor = useTema().Cor;

  const cliente = empresaSelecionada?.empresaSelecionada;

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [modalCriarRotaView, setModalCriarRotaView] = useState(false);

  const [criarRota] = useMutation(CRIAR_ROTA, {
    refetchQueries: [
      {
        query: GET_ROTAS,
        variables: { rotaEmpresaClienteId: cliente?.id },
      },
    ],

    onCompleted: () => {
      setOrigem("");
      setDestino("");
      setModalCriarRotaView(false);
    },
  });

  function CriarRotaFunc() {
    criarRota({
      variables: {
        data: {
          origem: origem,
          destino: destino,
          operadoraId: cliente.operadoraId.id,
          empresaClienteId: cliente.id,
        },
      },
    });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 45,
          height: 45,
          cursor: "pointer",
          borderRadius: 16,
          backgroundColor: Cor.primaria,
        }}
        onClick={() => setModalCriarRotaView(true)}
      >
        <p
          style={{
            color: Cor.primariaTxt,
            fontFamily: "Icone",
            fontWeight: "bold",
            fontSize: 32,
          }}
        >
          add
        </p>
      </div>
      <Overlay
        $bg={Cor.base2}
        $modal={modalCriarRotaView}
        onClick={() => setModalCriarRotaView(false)}
      >
        <ModalCriarRota
          $bg={Cor.base2}
          $sombra={Cor.sombra}
          $borda={Cor.texto2 + 50}
          $corPrimaria={Cor.primaria}
          $corTexto2={Cor.base2}
          $modal={modalCriarRotaView}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "15px 15px 0px 15px",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <p
                style={{
                  fontSize: 14,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                }}
              >
                Criar Rota
              </p>
              <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
                Adicione Origem e Destino e siga para o passo dois, adicinando
                valores.
              </p>
            </div>

            <p
              style={{
                cursor: "pointer",
                fontFamily: "Icone",
                fontSize: 24,
                color: Cor.primaria,
              }}
              onClick={() => setModalCriarRotaView(false)}
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
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 15px",
            }}
          >
            <TextoEntrada
              placeholder="Origem"
              onChange={(e) => {
                setOrigem(e.target.value);
              }}
              value={origem}
              type="text"
              largura="50%"
            />
            <p
              style={{
                fontSize: 24,
                color: Cor.primaria,
                fontFamily: "Icone",
                fontWeight: "bold",
              }}
            >
              start
            </p>
            <TextoEntrada
              placeholder="Destino"
              onChange={(e) => {
                setDestino(e.target.value);
              }}
              value={destino}
              type="text"
              largura="50%"
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
              padding: "0 15px 10px 0",
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
                if (origem == "" && destino == "") {
                  alert("Preencha os campos obrigatórios");
                }
                console.log(
                  origem,
                  destino,
                  cliente.id,
                  cliente.operadoraId.id
                );
                CriarRotaFunc();
                setModalCriarRotaView(false);
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                }}
              >
                Salvar
              </p>
            </div>
          </div>
        </ModalCriarRota>
      </Overlay>
    </>
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

export default CriarRota;