import { useMemo, useState } from "react";
import { useTema } from "../hooks/temaContext";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_CENTROS_CUSTO_CLIENTE_ID = gql`
  query CentroCustoEmpresaClienteId($centroCustoEmpresaClienteId: ID!) {
    centroCustoEmpresaClienteId(id: $centroCustoEmpresaClienteId) {
      id
      nome
      codigo
      descricao
      empresaClienteId {
        id
      }
      operadoraId {
        id
      }
    }
  }
`;

function ListaCentrosCustoEmpresaCliente() {
  const Cor = useTema().Cor;

  const { clienteId } = useParams();

  const [busca, setBusca] = useState("");

  const { data } = useQuery(GET_CENTROS_CUSTO_CLIENTE_ID, {
    variables: { centroCustoEmpresaClienteId: clienteId },
  });

  const centrosCusto = data?.centroCustoEmpresaClienteId;

  const centrosCustoFiltrados = useMemo(() => {
    if (!busca) return centrosCusto;
    return centrosCusto.filter((centro_custo: any) =>
      centro_custo.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [centrosCusto, busca]);

  return (
    <div
      style={{
        width: "50%",
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
            Lista de Centros de Custo
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Divisão de faturamento por centros de custo.
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
              //   exportarPlanilha(
              //     lista_unidades,
              //     `Unidades ${empresa?.nome}`,
              //     "csv"
              //   )
              {}
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
              onClick={() => setBusca("")}
            >
              close
            </p>
          </div>
        </div>
      </div>
      <table>
        <style>
          {`table {
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
            <th>Nome</th>
            <th>Código</th>
            <th>Descição</th>
            <th>Açoes</th>
          </tr>
        </thead>
        <tbody
          style={{
            fontSize: 14,
            textAlign: "left",
          }}
        >
          {centrosCustoFiltrados?.map((solicitante: any) => (
            <tr key={solicitante.id}>
              <td>{solicitante.nome}</td>
              <td>{solicitante.codigo}</td>
              <td>{solicitante.descricao}</td>
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
                    edit
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
  );
}

export default ListaCentrosCustoEmpresaCliente;
