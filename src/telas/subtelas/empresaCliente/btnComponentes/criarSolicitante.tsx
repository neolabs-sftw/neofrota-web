import { useState } from "react";
import { useTema } from "../../../../hooks/temaContext";
import { gql, useMutation } from "@apollo/client";

function criarSolicitante({operadoraId, empresaClienteId}: {operadoraId: any, empresaClienteId: any}) {
  const Cor = useTema().Cor;
  const [cxCriarSolicitante, setCxCriarSolicitante] = useState(false);

  return (
    <>
      <div
        style={{
          width: "30%",
          height: 100,
          backgroundColor: Cor.base2,
          borderRadius: 22,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid" + Cor.primaria + 50,
          boxShadow: Cor.sombra,
          cursor: "pointer",
        }}
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
      </div>
      <ModalCriarSolicitante
        cxCriarSolicitante={cxCriarSolicitante}
        setCxCriarSolicitante={setCxCriarSolicitante}
        empresaClienteId={empresaClienteId}
        operadoraId={operadoraId}
      />
    </>
  );
}

export default criarSolicitante;

function ModalCriarSolicitante({
  cxCriarSolicitante,
  setCxCriarSolicitante,
  empresaClienteId,
  operadoraId
}: {
  cxCriarSolicitante: any;
  setCxCriarSolicitante: any;
  empresaClienteId: any;
  operadoraId: any;
}) {
  const Cor = useTema().Cor;

  const CRIAR_SOLICITANTE = gql`
    mutation Criar_solicitante($input: SolicitanteInput!) {
      criar_solicitante(input: $input) {
        id
        nome
        email
        senha
        funcao
        empresa_cliente_id {
          id
          nome
        }
        foto_url_solicitante
        status_solicitante
        operadora_id {
          id
          nome
        }
      }
    }
  `;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [funcao, setFuncao] = useState("");

  const [criarSolicitanteMutation] = useMutation(CRIAR_SOLICITANTE);

  const criarSolicitanteFunc = async () =>{
    await criarSolicitanteMutation({
      variables: {
        input: {
          nome: nome,
          email: email,
          telefone: telefone,
          funcao: funcao,
          operadora_id: operadoraId,
          empresa_cliente_id: empresaClienteId
        },
      },
    });
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: cxCriarSolicitante ? "flex" : "none",
        position: "absolute",
        zIndex: 10,
        top: 0,
        left: 0,
        backgroundColor: Cor.base2 + "80",
        backdropFilter: "blur(2.5px)",
        justifyContent: "center",
        alignItems: "center",
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
              }}
              onChange={(e) => {
                setFuncao(e.target.value);
              }}
            >
              <option value="">Selecione uma Função</option>
              <option value="Finc">Administrador</option>
              <option value="Oper">Operacional</option>
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
