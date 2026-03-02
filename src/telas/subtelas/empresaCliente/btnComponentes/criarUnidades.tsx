import { useParams } from "react-router-dom";
import { useTema } from "../../../../hooks/temaContext";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import { useCriarUnidadeCliente } from "../../../../hooks/useUnidadesClientes";

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

function CriarUnidades() {
  const Cor = useTema().Cor;

  const [CxAlertaCriarUnidade, setCxAlertaCriarUnidade] = useState(false);

  return (
    <>
      <Btn
        $base={Cor.base2}
        $cor={Cor.primaria}
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
      </Btn>
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

  const { criarUnidade, loading } = useCriarUnidadeCliente(String(clienteId));
  const criarUnidadeFunc = async () => {
    if (!nome || !cnpj || !endRua) {
      alert("Os Campos Nome da Unidade e CNPJ são obrigatórios");
      return;
    }
    if (endUf && endUf.length !== 2) {
      alert("O campo UF deve conter exatamente 2 letras (Ex: SP, BA, RJ).");
      return; // O return para a execução da função aqui!
    }
    try {
      await criarUnidade({
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
      });
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
      alert("Erro ao criar unidade");
    }
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
        opacity: CxAlertaCriarUnidade ? 1 : 0,
        transition: `ease-in-out all 0.2s`,
        pointerEvents: CxAlertaCriarUnidade ? "auto" : "none",
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
          transition: `ease-in-out all 0.2s`,
          scale: CxAlertaCriarUnidade ? 1 : 0.6,
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
                style={{
                  fontSize: 14,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                }}
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
              width: "20%",
              height: 35,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: loading ? Cor.texto1 + 50 : Cor.primaria,
              borderRadius: 22,
            }}
            onClick={() => {
              criarUnidadeFunc();
              setCxAlertaCriarUnidade(false);
              setNome("");
              setCnpj("");
              setEndRua("");
              setEndNumero("");
              setEndBairro("");
              setEndCidade("");
              setEndCep("");
              setEndComplemento("");
              setEndUf("");
            }}
          >
            {loading ? (
              <CircularProgress
                size={18}
                thickness={8}
                sx={{
                  color: Cor.primariaTxt,
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
            ) : (
              <p
                style={{
                  fontSize: 14,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                }}
              >
                Salvar
              </p>
            )}
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
