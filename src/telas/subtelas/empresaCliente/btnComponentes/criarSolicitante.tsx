import { useState } from "react";
import { useTema } from "../../../../hooks/temaContext";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";

const CRIAR_SOLICITANTE = gql`
  mutation CreateSolicitante($input: SolicitanteInput!) {
    createSolicitante(input: $input) {
      id
      nome
      email
      senha
      funcao
      telefone
      operadoraId {
        id
      }
      statusSolicitante
      empresaClienteId {
        id
      }
      fotoUrlSolicitante
    }
  }
`;

const GET_SOLICITANTES_EMPRESA_CLIENTE = gql`
  query SolicitantesEmpresaClienteId($solicitantesEmpresaClienteId: ID!) {
    solicitantesEmpresaClienteId(id: $solicitantesEmpresaClienteId) {
      id
      nome
      email
      senha
      funcao
      telefone
      operadoraId {
        id
      }
      statusSolicitante
      empresaClienteId {
        id
      }
      fotoUrlSolicitante
    }
  }
`;

interface BtnProps {
  $base: string;
  $cor: string;
}

const Btn = styled.div<BtnProps>`
  width: 22.5%;
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

function criarSolicitante({ empresaClienteId }: { empresaClienteId: any }) {
  const Cor = useTema().Cor;
  const [cxCriarSolicitante, setCxCriarSolicitante] = useState(false);

  return (
    <>
      <Btn
        $base={Cor.base2}
        $cor={Cor.primaria}
        onClick={() => setCxCriarSolicitante(true)}
      >
        <p
          style={{
            fontFamily: "Icone",
            fontSize: 30,
            color: Cor.primaria,
            fontWeight: "bold",
          }}
        >
          person_add
        </p>
        <p style={{ textAlign: "center", fontSize: 12, color: Cor.texto1 }}>
          Solicitante
        </p>
      </Btn>
      <ModalCriarSolicitante
        cxCriarSolicitante={cxCriarSolicitante}
        setCxCriarSolicitante={setCxCriarSolicitante}
        empresaClienteId={empresaClienteId}
      />
    </>
  );
}

export default criarSolicitante;

function ModalCriarSolicitante({
  cxCriarSolicitante,
  setCxCriarSolicitante,
  empresaClienteId,
}: {
  cxCriarSolicitante: any;
  setCxCriarSolicitante: any;
  empresaClienteId: any;
}) {
  const Cor = useTema().Cor;

  const token = localStorage.getItem("token");

  interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const operadoraId = decoded ? decoded.operadoraId : null;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [funcao, setFuncao] = useState("");

  const [criarSolicitanteMutation] = useMutation(CRIAR_SOLICITANTE, {
    refetchQueries: [
      {
        query: GET_SOLICITANTES_EMPRESA_CLIENTE,
        variables: {
          solicitantesEmpresaClienteId: empresaClienteId,
        },
      },
    ],
  });

  const criarSolicitanteFunc = async () => {
    await criarSolicitanteMutation({
      variables: {
        input: {
          nome,
          email,
          funcao,
          telefone,
          empresaClienteId: parseInt(empresaClienteId),
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
        opacity: cxCriarSolicitante ? 1 : 0,
        transition: `ease-in-out all 0.2s`,
        pointerEvents: cxCriarSolicitante ? "auto" : "none",
      }}
      onClick={() => setCxCriarSolicitante(false)}
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
          scale: cxCriarSolicitante ? 1 : 0.6,
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
                Criar Novo Solicitante
              </p>
              <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
                Gestores responsáveis por solicitações de corridas.
              </p>
            </div>

            <p
              style={{
                cursor: "pointer",
                fontFamily: "Icone",
                fontSize: 24,
                color: Cor.primaria,
              }}
              onClick={() => setCxCriarSolicitante(false)}
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
            padding: 15,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "space-between",
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
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="text"
            largura="100%"
          />
          <TextoEntrada
            placeholder="Telefone"
            onChange={(e) => {
              setTelefone(formatTelefone(e.target.value));
            }}
            value={telefone}
            type="text"
            largura="100%"
          />
          <label
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <p style={{ fontSize: 12, color: Cor.texto2 }}>Função</p>
            <select
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 22,
                backgroundColor: Cor.texto2 + 20,
                border: "none",
                color: Cor.texto1,
                appearance: "none",
              }}
              onChange={(e) => {
                setFuncao(e.target.value);
              }}
            >
              <option value="" style={{ color: "#555555" }}>
                Selecione uma Função
              </option>
              <option value="Prin" style={{ color: "#555555" }}>
                Principal
              </option>
              <option value="Finc" style={{ color: "#555555" }}>
                Administrador
              </option>
              <option value="Oper" style={{ color: "#555555" }}>
                Operacional
              </option>
            </select>
          </label>

          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: -10 }}>
              Obs.: Por padrão, a senha do solicitante é{" "}
              <strong style={{ color: Cor.primaria }}> "0000"</strong>. O
              solicitante pode alterar a senha no menu{" "}
              <strong style={{ color: Cor.primaria }}>"Minha Conta"</strong>.
            </p>
          </div>
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
              criarSolicitanteFunc();
              setCxCriarSolicitante(false);
              setNome("");
              setEmail("");
              setTelefone("");
              setFuncao("");
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

function formatTelefone(value: any) {
  const numero = value.replace(/\D/g, ""); // Remove tudo que não é número

  // Aplica a máscara
  const formatado = numero
    .replace(/^(\d{2})(\d)/, "($1) $2") // (71) 9
    .replace(/(\d{1})?(\d{4})(\d{4})$/, "$1 $2-$3"); // 9 9999-9999

  return formatado.slice(0, 19); // Limita o tamanho
}
