import { useState } from "react";
import { useTema } from "../../../../hooks/temaContext";
import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode, type JwtPayload } from "jwt-decode";

function CriarCentroCusto() {
  const Cor = useTema().Cor;
  const [cxCriarCentroCusto, setCxCriarCentroCusto] = useState(false);

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
      </div>
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
  const { cliente_id } = useParams();

  const CRIAR_CENTRO_CUSTO = gql`
    mutation Criar_centro_custo($input: Centro_CustoInput!) {
      criar_centro_custo(input: $input) {
        id
        nome
        codigo
        descricao
        empresa_cliente_id {
          id
          nome
        }
        operadora_id {
          id
          nome
        }
      }
    }
  `;

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");

  const token = localStorage.getItem("token");

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const operadoraId = decoded ? decoded.operadora_id : null;

  const [criar_centro_custo] = useMutation(CRIAR_CENTRO_CUSTO);

  const criar_centro_custoFunc = async () => {
    await criar_centro_custo({
      variables: {
        input: {
          nome: nome,
          codigo: codigo,
          descricao: descricao,
          empresa_cliente_id: parseInt(cliente_id || "0"),
          operadora_id: Number(operadoraId),
        },
      },
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: cxCriarCentroCusto ? "flex" : "none",
        position: "absolute",
        zIndex: 10,
        top: 0,
        left: 0,
        backgroundColor: Cor.base2 + "80",
        backdropFilter: "blur(2.5px)",
        justifyContent: "center",
        alignItems: "center",
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
          <TextoEntrada
            placeholder="Descrição"
            onChange={(e) => {
              setDescricao(e.target.value);
            }}
            value={descricao}
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
              criar_centro_custoFunc();
              setCxCriarCentroCusto(false);
              window.location.reload();
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
