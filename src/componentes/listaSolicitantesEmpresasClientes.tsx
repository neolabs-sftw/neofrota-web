import { useEffect, useMemo, useState } from "react";
import { useTema } from "../hooks/temaContext";
import { useParams } from "react-router-dom";
import { useEditarSolicitante, useSolicitante } from "../hooks/useSolicitantes";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

function listaSolicitantesEmpresasClientes() {
  const Cor = useTema().Cor;
  const { clienteId } = useParams();

  const [busca, setBusca] = useState("");

  const [cxCriarSolicitante, setCxCriarSolicitante] = useState(false);

  const { solicitantes } = useSolicitante(clienteId);

  const solicitantesFiltrados = useMemo(() => {
    if (!busca) return solicitantes;
    return solicitantes.filter((solicitante: any) =>
      solicitante.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [solicitantes, busca]);

  const [solicitante, setSolicitante] = useState();

  return (
    <div
      style={{
        width: "60%",
        height: 350,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        padding: 15,
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div>
          <p style={{ fontWeight: "500", color: Cor.primaria }}>
            Lista de Solicitantes
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Funcionários com responsabilidades.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "5px 15px",
              backgroundColor: Cor.texto2 + 20,
              borderRadius: 22,
              gap: 5,
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "24px",
                color: Cor.primaria,
              }}
            >
              search
            </p>
            <input
              type="text"
              style={{
                border: "none",
                backgroundColor: "transparent",
                width: "100%",
                outline: "none",
                color: Cor.texto1,
              }}
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "24px",
                color: Cor.primaria,
                cursor: "pointer",
              }}
            >
              close
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: Cor.texto2 + 50,
          color: Cor.texto1,
          fontSize: 11,
          width: "100%",
          height: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          fontWeight: 700,
        }}
      >
        <p style={{ width: "35%" }}>Nome</p>
        <p style={{ width: "30%", textAlign: "center" }}>Telefone</p>
        <p style={{ width: "15%", textAlign: "center" }}>Função</p>
        <p style={{ width: "20%", textAlign: "center" }}>Status</p>
      </div>
      <div
        style={{
          width: "100%",
          height: 230,
          overflow: "scroll",
          scrollbarWidth: "none",
          color: Cor.texto1,
        }}
      >
        {solicitantesFiltrados?.map((s: any, index: any) => {
          const par = index % 2 === 0;
          return (
            <LinhaSolicitante
              solicitante={s}
              setCxCriarSolicitante={setCxCriarSolicitante}
              setSolicitante={setSolicitante}
              key={s.id}
              par={par}
            />
          );
        })}
      </div>
      <ModalEditarSolicitante
        cxCriarSolicitante={cxCriarSolicitante}
        setCxCriarSolicitante={setCxCriarSolicitante}
        solicitante={solicitante}
      />
    </div>
  );
}

interface LinhaSolicitanteProps {
  $cor: string;
  $cor2: string;
}

const LinhaSolicitanteStyle = styled.div<LinhaSolicitanteProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $cor }) => $cor}05;
  width: 100%;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $cor2 }) => $cor2}25;
  }
  &:active {
    background-color: ${({ $cor2 }) => $cor2}45;
  }
`;

function LinhaSolicitante({
  solicitante,
  par,
  setCxCriarSolicitante,
  setSolicitante,
}: {
  solicitante: any;
  par: any;
  setCxCriarSolicitante: any;
  setSolicitante: any;
}) {
  const { clienteId } = useParams();
  const { Cor } = useTema();

  const { editarSolicitante, loading } = useEditarSolicitante(
    String(clienteId),
  );

  async function alterarStatusSolicitante() {
    await editarSolicitante(solicitante.id, {
      statusSolicitante: !solicitante.statusSolicitante,
    });
  }

  return (
    <LinhaSolicitanteStyle
      $cor={par ? Cor.base2 : Cor.texto1}
      $cor2={Cor.texto2}
      onClick={() => {
        (setCxCriarSolicitante(true), setSolicitante(solicitante));
      }}
    >
      <p style={{ width: "35%" }}>{solicitante.nome}</p>
      <p style={{ width: "30%" }}>{solicitante.telefone}</p>
      <p style={{ width: "15%", textAlign: "center" }}>{solicitante.funcao}</p>
      <div
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BtnStatus
          $cor={solicitante.statusSolicitante ? Cor.ativo : Cor.atencao}
          onClick={(e) => {
            e.stopPropagation();
            alterarStatusSolicitante();
          }}
        >
          {loading ? (
            <CircularProgress
              size={18}
              thickness={8}
              sx={{
                color:
                  solicitante.statusSolicitante === true
                    ? Cor.ativo
                    : Cor.atencao,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {solicitante.statusSolicitante ? "lock_open" : "lock"}
              </p>
              <p style={{ fontSize: 12 }}>
                {solicitante.statusSolicitante ? "Ativo" : "Inativo"}
              </p>
            </>
          )}
        </BtnStatus>
      </div>
    </LinhaSolicitanteStyle>
  );
}

interface BtnStatusProps {
  $cor: string;
}

const BtnStatus = styled.div<BtnStatusProps>`
  color: ${({ $cor }) => $cor};
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ $cor }) => $cor}15;
  border: 1px solid ${({ $cor }) => $cor}30;
  width: 80px;
  height: 25px;
  border-radius: 22px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in-out all 0.1s;
  user-select: none;

  &:hover {
    scale: 1.02;
    background-color: ${({ $cor }) => $cor}25;
    border: 1px solid ${({ $cor }) => $cor}40;
  }

  &:active {
    scale: 0.95;
    background-color: ${({ $cor }) => $cor}50;
    border: 1px solid ${({ $cor }) => $cor}90;
  }
`;

function ModalEditarSolicitante({
  cxCriarSolicitante,
  setCxCriarSolicitante,
  solicitante,
}: {
  cxCriarSolicitante: any;
  setCxCriarSolicitante: any;
  solicitante: any;
}) {
  const { Cor } = useTema();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [funcao, setFuncao] = useState("");

  useEffect(() => {
    if (!solicitante) return;
    if (solicitante) {
      setNome(solicitante.nome ?? "");
      setEmail(solicitante.email ?? "");
      setTelefone(solicitante.telefone ?? "");
      setFuncao(solicitante.funcao ?? "");
    }
  }, [solicitante]);

  const { clienteId } = useParams();

  const { editarSolicitante, loading } = useEditarSolicitante(
    String(clienteId),
  );

  async function editarSolicitanteFunc() {
    await editarSolicitante(solicitante.id, { nome, email, telefone, funcao });
  }

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
              value={funcao}
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
              editarSolicitanteFunc();
              setCxCriarSolicitante(false);
              setNome("");
              setEmail("");
              setTelefone("");
              setFuncao("");
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

function formatTelefone(value: any) {
  const numero = value.replace(/\D/g, ""); // Remove tudo que não é número

  // Aplica a máscara
  const formatado = numero
    .replace(/^(\d{2})(\d)/, "($1) $2") // (71) 9
    .replace(/(\d{1})?(\d{4})(\d{4})$/, "$1 $2-$3"); // 9 9999-9999

  return formatado.slice(0, 19); // Limita o tamanho
}

export default listaSolicitantesEmpresasClientes;
