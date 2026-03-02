import { useEffect, useMemo, useState } from "react";
import { exportarPlanilha } from "../hooks/exportarPlanilha";
import { useTema } from "../hooks/temaContext";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  useDefinirMatriz,
  useUpdateUnidade,
} from "../hooks/useUnidadesClientes";

const GET_UNIDADES_EMPRESA_CLIENTE = gql`
  query ListaUnidadesEmpresaClienteId($empresaClienteId: ID!) {
    listaUnidadesEmpresaClienteId(id: $empresaClienteId) {
      id
      nome
      cnpj
      endRua
      endNumero
      endBairro
      endCep
      endCidade
      endComplemento
      endUf
      statusUnidadeCliente
      matriz
    }
  }
`;

const GET_EMPRESA_CLIENTE = gql`
  query EmpresaClienteId($empresaClienteId: ID!) {
    empresaClienteId(id: $empresaClienteId) {
      id
      nome
      rSocial
      cnpj
      fotoLogoCliente
      operadoraId {
        id
      }
      statusCliente
    }
  }
`;

function ListaUnidadesEmpresasClientes({
  empresaClienteId,
}: {
  empresaClienteId: any;
}) {
  const Cor = useTema().Cor;

  const [busca, setBusca] = useState("");

  const { data: unidades } = useQuery(GET_UNIDADES_EMPRESA_CLIENTE, {
    variables: {
      empresaClienteId: empresaClienteId,
    },
  });

  const { data: empresa } = useQuery(GET_EMPRESA_CLIENTE, {
    variables: {
      empresaClienteId: empresaClienteId,
    },
  });

  const empresaCliente = empresa?.empresaClienteId || {};

  const listaUnidadesCompleta = unidades?.listaUnidadesEmpresaClienteId || [];

  const lista_unidades = useMemo(() => {
    if (!busca) return listaUnidadesCompleta;
    return listaUnidadesCompleta.filter((cliente: any) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [listaUnidadesCompleta, busca]);

  const [cxModalEdit, setCxModalEdit] = useState<boolean>(false);

  const [unidadeSelecionada, setUnidadeSelecionada] = useState();

  return (
    <div
      style={{
        width: "100%",
        height: 350,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        padding: 15,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 50,
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
            Lista de Unidades
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Unidades cadastradas na empresa {empresaCliente?.nome}
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
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              fontSize: "24px",
              color: Cor.primaria,
              cursor: "pointer",
            }}
            onClick={() =>
              exportarPlanilha(
                lista_unidades,
                `Unidades ${empresa?.nome}`,
                "csv",
              )
            }
          >
            download
          </p>
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
        <p style={{ width: "20%" }}>Nome</p>
        <p style={{ width: "15%" }}>CNPJ</p>
        <p style={{ width: "25%" }}>Rua</p>
        <p style={{ width: "15%" }}>Bairro</p>
        <p style={{ width: "5%" }}>Número</p>
        <p style={{ width: "10%", textAlign: "center" }}>Matriz</p>
        <p style={{ width: "10%", textAlign: "center" }}>Status</p>
      </div>
      <div
        style={{
          width: "100%",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          height: 230,
          scrollbarWidth: "none",
        }}
      >
        {lista_unidades.map((unidade: any, index: any) => {
          const par = index % 2 === 0;
          return (
            <LinhaUnidade
              unidade={unidade}
              key={unidade.id}
              par={par}
              onClick={() => {
                setUnidadeSelecionada(unidade);
                setCxModalEdit(true);
              }}
            />
          );
        })}
      </div>
      <ModalEditarUnidade
        cxModalEdit={cxModalEdit}
        setCxModalEdit={setCxModalEdit}
        unidade={unidadeSelecionada}
      />
    </div>
  );
}

function LinhaUnidade({
  unidade,
  par,
  onClick,
}: {
  unidade: any;
  par: any;
  onClick: any;
}) {
  const { Cor } = useTema();

  const { clienteId } = useParams();

  const { editarUnidade, loading } = useUpdateUnidade(String(clienteId));

  const { definirMatriz, loading: loadgingMatriz } = useDefinirMatriz(
    String(clienteId),
  );

  async function definirMatrizFunc() {
    await definirMatriz(String(unidade.id));
  }

  async function alterarStatusFunc() {
    await editarUnidade(unidade.id, {
      statusUnidadeCliente: !unidade.statusUnidadeCliente,
    });
  }

  const [iconeCheckMatriz, setIconeCheckMatriz] = useState<string>();

  useEffect(() => {
    if (unidade.matriz === false) {
      setIconeCheckMatriz("check_box_outline_blank");
    }
    if (unidade.matriz === true) {
      setIconeCheckMatriz("check_box");
    }
  }, [unidade, loadgingMatriz]);

  return (
    <LinhaUnidadeStyle
      $cor={par ? Cor.base2 : Cor.texto1}
      $cor2={Cor.texto2}
      onClick={onClick}
    >
      <p style={{ width: "20%", color: Cor.texto1 }}>{unidade.nome}</p>
      <p style={{ width: "15%", color: Cor.texto1 }}>{unidade.cnpj}</p>
      <p style={{ width: "25%", color: Cor.texto1 }}>{unidade.endRua}</p>
      <p style={{ width: "15%", color: Cor.texto1 }}>{unidade.endBairro}</p>
      <p style={{ width: "5%", color: Cor.texto1 }}>{unidade.endNumero}</p>
      <div
        style={{
          color: Cor.texto1,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "10%",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              color: Cor.primaria,
              fontSize: 20,
              fontWeight: unidade.matriz ? "bolder" : 300,
              userSelect: "none",
              transition: "ease-in-out all 0.2s",
              transform:
                iconeCheckMatriz === "dialogs" ? "scale(1.2)" : "scale(1)",
            }}
            onMouseOver={() => {
              if (!unidade.matriz) {
                setIconeCheckMatriz("dialogs");
              }
            }}
            onMouseLeave={() => {
              if (!unidade.matriz) {
                setIconeCheckMatriz("check_box_outline_blank");
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!unidade.matriz) {
                definirMatrizFunc();
              }
            }}
          >
            {unidade.matriz ? "check_box" : iconeCheckMatriz}
          </p>
        </div>
      </div>
      <div
        style={{
          width: "10%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BtnStatus
          $cor={unidade.statusUnidadeCliente ? Cor.ativo : Cor.atencao}
          onClick={(e) => {
            e.stopPropagation();
            alterarStatusFunc();
          }}
        >
          {loading ? (
            <CircularProgress
              size={18}
              thickness={8}
              sx={{
                color: unidade.statusUnidadeCliente ? Cor.ativo : Cor.atencao,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {unidade.statusUnidadeCliente ? "lock_open" : "lock"}
              </p>
              <p style={{ fontSize: 12 }}>
                {unidade.statusUnidadeCliente ? "Ativo" : "Inativo"}
              </p>
            </>
          )}
        </BtnStatus>
      </div>
    </LinhaUnidadeStyle>
  );
}

interface LinhaUnidadeProps {
  $cor: string;
  $cor2: string;
}

const LinhaUnidadeStyle = styled.div<LinhaUnidadeProps>`
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

function ModalEditarUnidade({
  cxModalEdit,
  setCxModalEdit,
  unidade,
}: {
  setCxModalEdit: any;
  cxModalEdit: any;
  unidade: any;
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

  useEffect(() => {
    if (!cxModalEdit) return;
    if (unidade) {
      setNome(unidade.nome ?? "");
      setCnpj(unidade.cnpj ?? "");
      setEndRua(unidade.endRua ?? "");
      setEndNumero(unidade.endNumero ?? "");
      setEndBairro(unidade.endBairro ?? "");
      setEndCidade(unidade.endCidade ?? "");
      setEndCep(unidade.endCep ?? "");
      setEndComplemento(unidade.endComplemento ?? "");
      setEndUf(unidade.endUf ?? "");
    }
  }, [unidade]);

  const empresaClienteId = clienteId ? parseInt(clienteId) : null;

  const token = localStorage.getItem("token");

  interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const operadoraIdBigInt = decoded ? decoded.operadoraId : null;
  const operadoraId = operadoraIdBigInt ? parseInt(operadoraIdBigInt) : null;

  const { editarUnidade, loading } = useUpdateUnidade(String(clienteId));

  const editarUnidadeFunc = async () => {
    if (!nome || !cnpj || !endRua) {
      alert("Os Campos Nome da Unidade e CNPJ são obrigatórios");
      return;
    }
    if (endUf && endUf.length !== 2) {
      alert("O campo UF deve conter exatamente 2 letras (Ex: SP, BA, RJ).");
      return; // O return para a execução da função aqui!
    }
    try {
      await editarUnidade(unidade.id, {
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
        opacity: cxModalEdit ? 1 : 0,
        transition: `ease-in-out all 0.2s`,
        pointerEvents: cxModalEdit ? "auto" : "none",
      }}
      onClick={() => setCxModalEdit(false)}
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
          scale: cxModalEdit ? 1 : 0.6,
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
                Editar Informações da Unidade
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
              onClick={() => setCxModalEdit(false)}
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
            lPlace="18%"
            type="text"
            largura="100%"
            onChange={(e) => setNome(e.target.value)}
            value={nome}
          />
          <TextoEntrada
            placeholder="CNPJ da Unidade"
            lPlace="17%"
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
              lPlace="5%"
              type="text"
              largura="75%"
              onChange={(e) => setEndRua(e.target.value)}
              value={endRua}
            />
            <TextoEntrada
              placeholder="Número"
              lPlace="50%"
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
              lPlace="22%"
              type="text"
              largura="33%"
              onChange={(e) => setEndBairro(e.target.value)}
              value={endBairro}
            />
            <TextoEntrada
              placeholder="CEP"
              lPlace="15%"
              type="text"
              largura="33%"
              onChange={(e) => setEndCep(e.target.value)}
              value={endCep}
            />
            <TextoEntrada
              placeholder="Cidade"
              lPlace="25%"
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
              lPlace="16%"
              type="text"
              largura="85%"
              onChange={(e) => setEndComplemento(e.target.value)}
              value={endComplemento}
            />
            <TextoEntrada
              placeholder="UF"
              lPlace="30%"
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
              editarUnidadeFunc();
              setCxModalEdit(false);
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

function formatCNPJ(value: any) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é número
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18); // Limita o tamanho
}

function TextoEntrada({
  placeholder,
  lPlace,
  onChange,
  value,
  type,
  largura,
}: {
  placeholder: string;
  lPlace: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
  largura: string;
}) {
  const { Cor } = useTema();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: largura,
        backgroundColor: Cor.texto2 + 20,
        padding: 10,
        gap: 5,
        borderRadius: 22,
      }}
    >
      <span
        style={{
          width: lPlace,
          maxLines: 1,
          overflow: "hidden",
          textWrap: "nowrap",
          fontSize: 11,
          color: Cor.texto2,
        }}
      >
        {placeholder}:
      </span>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        style={{
          backgroundColor: "transparent",
          color: Cor.texto1,
          fontWeight: 500,
          border: "none",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}

export default ListaUnidadesEmpresasClientes;
