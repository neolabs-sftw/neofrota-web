import { useTema } from "../hooks/temaContext";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { exportarPlanilha } from "../hooks/exportarPlanilha";

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
  const navigate = useNavigate();

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
      cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [clientes, busca]);

  if (loading) return <p>Carregando...</p>;
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
              exportarPlanilha(clientesFiltrados, "Clientes", "csv")
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
              background-color: ${Cor.texto1 + "05"};
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
              <th style={{ width: "20%" }}>Nome</th>
              <th style={{ width: "10%" }}>Contato</th>
              <th style={{ width: "20%" }}>E-mail</th>
              <th style={{ width: "10%" }}>Telefone</th>
              <th style={{ width: "15%" }}>CNPJ</th>
              <th style={{ width: "10%", textAlign: "center" }}>Status</th>
              <th style={{ width: "10%", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody
            style={{
              fontSize: 14,
              textAlign: "left",
            }}
          >
            {clientesFiltrados.map((cliente: any) => (
              <tr
                key={cliente.id}
                style={{ borderBottom: "1px solid" + Cor.texto2 + 10 }}
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
                <td style={{ color: Cor.texto1 }}>{cliente.nome}</td>
                <td style={{ color: Cor.texto1 }}>Pessoa Responsável</td>
                <td style={{ color: Cor.texto1 }}>Email Responsável</td>
                <td style={{ color: Cor.texto1 }}>Contato Responsável </td>
                <td style={{ color: Cor.texto1 }}>{cliente.cnpj}</td>
                <td>
                  <p
                    style={{
                      color:
                        cliente.statusCliente === true
                          ? Cor.ativo
                          : Cor.inativo,
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "bold",
                      backgroundColor:
                        cliente.statusCliente === true
                          ? Cor.ativo + 30
                          : Cor.inativo + 30,
                      width: 80,
                      height: 25,
                      borderRadius: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cliente.statusCliente ? "Ativo" : "Inativo"}
                  </p>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 25,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Icone",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: Cor.texto1,
                        fontSize: 22,
                      }}
                      onClick={() => navigate("/verempresa/" + cliente.id)}
                    >
                      visibility
                    </p>
                    <p
                      style={{
                        fontFamily: "Icone",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: Cor.texto1,
                        fontSize: 22,
                      }}
                    >
                      edit
                    </p>
                  </div>
                </td>
              </tr>
            ))}
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

export default ListaEmpresasCadastradas;
