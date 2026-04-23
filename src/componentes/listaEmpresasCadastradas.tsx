import { useTema } from "../hooks/temaContext";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { exportarPlanilhaFunc } from "../hooks/exportarPlanilha";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { useEditarEmpresaCliente } from "../hooks/useEmpresaCliente";
import { useAdminLogado } from "../hooks/AdminLogado";
import { useSolicitante } from "../hooks/useSolicitantes";

const GET_EMPRESAS_CLIENTES = gql`
  query EmpresaClienteOper($operadoraId: String) {
    empresaClienteOper(operadoraId: $operadoraId) {
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

function ListaEmpresasCadastradas() {
  const Cor = useTema().Cor;

  const [busca, setBusca] = useState("");

  interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }

  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode<JwtPayload>(token) : null;
  }, []);

  const { loading, error, data } = useQuery(GET_EMPRESAS_CLIENTES, {
    skip: !decoded?.operadoraId,
    variables: { operadoraId: decoded?.operadoraId },
  });

  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    if (data?.empresaClienteOper) {
      setClientes(data.empresaClienteOper);
    }
  }, [data]);

  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes;
    return clientes.filter((cliente: any) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [clientes, busca]);

  if (loading)
    return (
      <CircularProgress
        size={18}
        thickness={8}
        sx={{
          color: Cor.primaria,
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
    );
  if (error) return <p>Erro ao carregar os dados</p>;

  return (
    <div
      style={{
        backgroundColor: Cor.base2,
        width: "100%",
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
            Lista de Clientes
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>Cadastros</p>
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
              exportarPlanilhaFunc(clientesFiltrados, "Clientes", "csv")
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
      <div style={{ width: "100%" }}>
        <table>
          <style>
            {`table {
              border-collapse: collapse;
              width: 100%;
               }

            td {
              text-align: left;
              padding: 5px;
              color: ${Cor.texto1};
              }

            tr:nth-child(even) {
              background-color: ${Cor.base};
              }

            tr:hover {
              background-color: ${Cor.texto1 + "10"};
              }`}
          </style>
          <thead
            style={{
              backgroundColor: Cor.texto2 + 50,
              color: Cor.texto1,
              fontSize: 11,
              textAlign: "left",
            }}
          >
            <tr
              style={{
                borderBottom: "1px solid" + Cor.texto2 + 50,
                height: 30,
              }}
            >
              <th style={{ width: 60, textAlign: "center" }}>Logo</th>
              <th style={{ width: "25%" }}>Nome</th>
              <th style={{ width: "15%" }}>Contato</th>
              <th style={{ width: "20%" }}>E-mail</th>
              <th style={{ width: "10%" }}>Telefone</th>
              <th style={{ width: "15%" }}>CNPJ</th>
              <th style={{ width: "10%", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody
            style={{
              fontSize: 14,
              textAlign: "left",
            }}
          >
            {clientesFiltrados.map((cliente: any) => {
              return <LinhaEmpresa cliente={cliente} key={cliente.id} />;
            })}
          </tbody>
        </table>
        <div
          style={{
            width: "100%",
            height: 25,
            display: "flex",
            flexDirection: "row",
            paddingRight: 20,
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: Cor.texto1 + 30,
            borderRadius: "0 0 10px 10px",
          }}
        />
      </div>
    </div>
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

function LinhaEmpresa({ cliente }: { cliente: any }) {
  const operadora = useAdminLogado()?.operadora.id;

  const {
    editarEmpresa,
    loading: Atualizando,
    error,
  } = useEditarEmpresaCliente(String(operadora));

  const { solicitantes } = useSolicitante(cliente.id || "");

  const solicitantePrincipal = solicitantes?.find(
    (s: any) => s.funcao === "Prin",
  );

  const solicitante = solicitantePrincipal
    ? solicitantePrincipal
    : solicitantes?.[0];

  async function editarStatusEmpresaFunc() {
    try {
      await editarEmpresa(String(cliente.id), {
        operadoraId: Number(operadora),
        statusCliente: !cliente.statusCliente,
      });
      console.log("Status atualizado com sucesso!");
    } catch (err) {
      console.error(error);
    }
  }

  const { Cor } = useTema();
  const navigate = useNavigate();
  return (
    <tr
      key={cliente.id}
      style={{
        borderBottom: "1px solid" + Cor.texto2 + 10,
        cursor: "pointer",
      }}
      onClick={() => navigate("/verempresa/" + cliente.id)}
    >
      <td
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={cliente.fotoLogoCliente}
          alt=""
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            boxShadow: "2px 2px 1px rgba(0, 0, 0, 0.05)",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </td>
      <td style={{ color: Cor.texto1, width: "25%" }}>{cliente.nome}</td>
      <td style={{ color: Cor.texto1, width: "15%" }}>
        {solicitante?.nome || "-"}
      </td>
      <td style={{ color: Cor.texto1, width: "20%" }}>
        {solicitante?.email || "-"}
      </td>
      <td style={{ color: Cor.texto1, width: "15%" }}>
        {solicitante?.telefone || "-"}
      </td>
      <td style={{ color: Cor.texto1, width: "15%" }}>{cliente.cnpj}</td>
      <td style={{ width: "10%" }}>
        <BtnStatus
          $cor={cliente.statusCliente ? Cor.ativo : Cor.atencao}
          onClick={(e: any) => {
            e.stopPropagation();
            editarStatusEmpresaFunc();
          }}
        >
          {Atualizando ? (
            <CircularProgress
              size={18}
              thickness={8}
              sx={{
                color: cliente.statusCliente ? Cor.ativo : Cor.atencao,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {cliente.statusCliente ? "lock_open" : "lock"}
              </p>
              <p style={{ fontSize: 12 }}>
                {cliente.statusCliente ? "Ativo" : "Inativo"}
              </p>
            </>
          )}
        </BtnStatus>
      </td>
    </tr>
  );
}

export default ListaEmpresasCadastradas;
