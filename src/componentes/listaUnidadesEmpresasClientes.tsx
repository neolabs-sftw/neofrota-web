import { useMemo, useState } from "react";
import { exportarPlanilha } from "../hooks/exportarPlanilha";
import { useTema } from "../hooks/temaContext";
import { gql, useQuery } from "@apollo/client";

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
      cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [listaUnidadesCompleta, busca]);

  console.log(listaUnidadesCompleta);

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
                "csv"
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
              background-color: ${Cor.texto1 + "15"};
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
              <th style={{ width: "20%" }}>Nome</th>
              <th style={{ width: "15%" }}>CNPJ</th>
              <th style={{ width: "20%" }}>Rua</th>
              <th style={{ width: "10%" }}>Bairro</th>
              <th style={{ width: "5%" }}>Número</th>
              <th style={{ width: "10%", textAlign: "center" }}>Matriz</th>
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
            {lista_unidades.map((cliente: any) => (
              <tr key={cliente.id}>
                <td style={{ color: Cor.texto1 }}>{cliente.nome}</td>
                <td style={{ color: Cor.texto1 }}>{cliente.cnpj}</td>
                <td style={{ color: Cor.texto1 }}>{cliente.endRua}</td>
                <td style={{ color: Cor.texto1 }}>{cliente.endBairro}</td>
                <td style={{ color: Cor.texto1 }}>{cliente.endNumero}</td>
                <td
                  style={{
                    color: Cor.texto1,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <style>
                    {`.container {
                        display: block;
                        position: relative;
                        color: ${Cor.secundaria};
                        cursor: pointer;
                        font-size: 22px;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }

                      /* Hide the browser's default checkbox */
                      .container input {
                        position: absolute;
                        opacity: 0;
                        cursor: pointer;
                        height: 0;
                        width: 0;
                      }

                      /* Create a custom checkbox */
                      .checkmark {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 18px;
                        width: 18px;
                        background-color: ${Cor.texto2 + 50};
                        border-radius: 4px;
                      }

                      /* On mouse-over, add a grey background color */
                      .container:hover input ~ .checkmark {
                        background-color: #ccc;
                      }

                      /* When the checkbox is checked, add a blue background */
                      .container input:checked ~ .checkmark {
                        background-color: ${Cor.primaria};
                      }

                      /* Create the checkmark/indicator (hidden when not checked) */
                      .checkmark:after {
                        content: "";
                        position: absolute;
                        display: none;
                      }

                      /* Show the checkmark when checked */
                      .container input:checked ~ .checkmark:after {
                        display: block;
                      }

                      /* Style the checkmark/indicator */
                      .container .checkmark:after {
                        left: 5px;
                        top: 2px;
                        width: 5px;
                        height: 10px;
                        border: solid white;
                        border-width: 0 3px 3px 0;
                        border-radius: 8px;
                        transform: rotate(45deg);
                      }`}
                  </style>
                  <label className="container">
                    <input type="checkbox" defaultChecked={cliente.matriz} />
                    <span className="checkmark"></span>
                  </label>
                </td>
                <td>
                  <p
                    style={{
                      color:
                        cliente.statusUnidadeCliente === true
                          ? Cor.ativo
                          : Cor.inativo,
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "bold",
                      backgroundColor:
                        cliente.statusUnidadeCliente === true
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
                    {cliente.statusUnidadeCliente ? "Ativo" : "Inativo"}
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
                        fontSize: 20,
                      }}
                      // onClick={() => {
                      //   setCxAlterarUnidade(true);
                      //   setUnidade(cliente);
                      // }}
                    >
                      lock_open
                    </p>
                    <p
                      style={{
                        fontFamily: "Icone",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: Cor.texto1,
                        fontSize: 20,
                      }}
                    >
                      delete
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaUnidadesEmpresasClientes;
