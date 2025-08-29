import { useParams } from "react-router-dom";
import { useTema } from "../../../../hooks/temaContext";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

function CriarUnidades() {
  const Cor = useTema().Cor;

  const [CxAlertaCriarUnidade, setCxAlertaCriarUnidade] = useState(false);

  return (
    <>
      <div
        style={{
          width: "25%",
          height: 100,
          backgroundColor: Cor.base2,
          borderRadius: 22,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid" + Cor.primaria + 50,
          cursor: "pointer",
          boxShadow: Cor.sombra,
        }}
        onClick={() => setCxAlertaCriarUnidade(true)}
      >
        <p
          style={{
            fontFamily: "Icone",
            fontSize: 30,
            color: Cor.primaria,
            fontWeight: "bold",
          }}
        >
          add_home_work
        </p>
        <p style={{ textAlign: "center", fontSize: 12, color: Cor.texto1 }}>
          Unidade
        </p>
      </div>
      <ModalCriarUnidade
        CxAlertaCriarUnidade={CxAlertaCriarUnidade}
        setCxAlertaCriarUnidade={setCxAlertaCriarUnidade}
      />
    </>
  );
}

function ModalCriarUnidade({
  CxAlertaCriarUnidade,
  setCxAlertaCriarUnidade,
}: {
  setCxAlertaCriarUnidade: any;
  CxAlertaCriarUnidade: any;
}) {
  const Cor = useTema().Cor;

  const [nome, setNome] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [endRua, setEndRua] = useState<string>("");
  const [endNumero, setEndNumero] = useState<string>("");
  const [endBairro, setEndBairro] = useState<string>("");
  const [endCidade, setEndCidade] = useState<string>("");
  const [endCep, setEndCep] = useState<string>("");
  const [endComplemento, setEndComplemento] = useState<string>("");
  const [endUf, setEndUf] = useState<string>("");

  const CRIAR_UNIDADE_CLIENTE = gql`
    mutation CreateUnidadeEmpresaCliente($input: UnidadeEmpresaClienteInput!) {
      createUnidadeEmpresaCliente(input: $input) {
        id
      }
    }
  `;

  const { clienteId } = useParams();

  const empresaClienteId = clienteId ? parseInt(clienteId) : null;

  const token = localStorage.getItem("token");

    interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const operadoraIdBigInt = decoded ? decoded.operadoraId : null;
  const operadoraId = operadoraIdBigInt ? parseInt(operadoraIdBigInt) : null;

  const [criarUnidadeMutation] = useMutation(CRIAR_UNIDADE_CLIENTE);

  const [carregando, setCarregando] = useState(false);

  const criarUnidadeFunc = async () => {
    setCarregando(true);

    if (!nome || !cnpj || !endRua) {
      alert("Preencha os campos obrigatórios");
      return;
    }
    try {
      await criarUnidadeMutation({
        variables: {
          input: {
            nome,
            cnpj,
            endRua,
            endNumero,
            endBairro,
            endCep,
            endCidade,
            endComplemento,
            endUf,
            empresaClienteId,
            operadoraId,
          },
        },
      });
      console.log("Unidade criada com sucesso!");
      window.location.reload(); // Recarrega a página
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: CxAlertaCriarUnidade ? "flex" : "none",
        position: "absolute",
        zIndex: 10,
        top: 0,
        left: 0,
        backgroundColor: Cor.base2 + "80",
        backdropFilter: "blur(2.5px)",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => setCxAlertaCriarUnidade(false)}
    >
      <div
        style={{
          width: "50%",
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
                Criar Unidade
              </p>
              <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
                Unidades são os locais físicos onde os motoristas devem se
                dirigir, ao realizar as corridas.
              </p>
            </div>

            <p
              style={{
                cursor: "pointer",
                fontFamily: "Icone",
                fontSize: 24,
                color: Cor.primaria,
              }}
              onClick={() => setCxAlertaCriarUnidade(false)}
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
            placeholder="Nome da Unidade"
            type="text"
            largura="100%"
            onChange={(e) => setNome(e.target.value)}
            value={nome}
          />
          <TextoEntrada
            placeholder="CNPJ da Unidade"
            type="text"
            largura="100%"
            onChange={(e: { target: { value: any } }) => {
              setCnpj(formatCNPJ(e.target.value));
            }}
            value={cnpj}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <TextoEntrada
              placeholder="Rua"
              type="text"
              largura="75%"
              onChange={(e) => setEndRua(e.target.value)}
              value={endRua}
            />
            <TextoEntrada
              placeholder="Número"
              type="text"
              largura="25%"
              onChange={(e) => setEndNumero(e.target.value)}
              value={endNumero}
            />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <TextoEntrada
              placeholder="Bairro"
              type="text"
              largura="33%"
              onChange={(e) => setEndBairro(e.target.value)}
              value={endBairro}
            />
            <TextoEntrada
              placeholder="CEP"
              type="text"
              largura="33%"
              onChange={(e) => setEndCep(e.target.value)}
              value={endCep}
            />
            <TextoEntrada
              placeholder="Cidade"
              type="text"
              largura="34%"
              onChange={(e) => setEndCidade(e.target.value)}
              value={endCidade}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <TextoEntrada
              placeholder="Complemento"
              type="text"
              largura="85%"
              onChange={(e) => setEndComplemento(e.target.value)}
              value={endComplemento}
            />
            <TextoEntrada
              placeholder="UF"
              type="text"
              largura="15%"
              onChange={(e) => setEndUf(e.target.value)}
              value={endUf}
            />
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
              criarUnidadeFunc();
              setCxAlertaCriarUnidade(false);
            }}
          >
            <p style={{ fontSize: 14, color: Cor.texto1, fontWeight: "bold" }}>
              Salvar
            </p>
          </div>
          <p>{carregando ? "Carregando..." : "Aguardando"}</p>
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

function formatCNPJ(value: any) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é número
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18); // Limita o tamanho
}

export default CriarUnidades;
