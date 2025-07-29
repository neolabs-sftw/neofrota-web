import { useMemo, useState } from "react";
import { useTema } from "../hooks/temaContext";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_SOLICITANTES_EMPRESA_CLIENTE = gql`
  query Solicitantes_empresa_cliente_id($solicitantesEmpresaClienteId: ID!) {
    solicitantes_empresa_cliente_id(id: $solicitantesEmpresaClienteId) {
      id
      nome
      email
      senha
      funcao
      telefone
      operadora_id {
        id
        nome
      }
      status_solicitante
      empresa_cliente_id {
        id
        nome
      }
      foto_url_solicitante
    }
  }
`;

function listaSolicitantesEmpresasClientes() {
  const Cor = useTema().Cor;
  const { cliente_id } = useParams();

  const [busca, setBusca] = useState("");

  const { data } = useQuery(GET_SOLICITANTES_EMPRESA_CLIENTE, {
    variables: { solicitantesEmpresaClienteId: cliente_id },
  });

  const solicitantes = data?.solicitantes_empresa_cliente_id;

  const solicitantesFiltrados = useMemo(() => {
    if (!busca) return solicitantes;
    return solicitantes.filter((solicitante: any) =>
      solicitante.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [solicitantes, busca]);

  return (
    <div
      style={{
        width: "50%",
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
            >
              close
            </p>
          </div>
        </div>
      </div>
      <div style={{ width: "100%" }}></div>
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
      <table>
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
            <th>Telefone</th>
            <th>Função</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody
          style={{
            fontSize: 14,
            textAlign: "left",
          }}
        >
          {solicitantesFiltrados?.map((solicitante: any) => (
            <tr key={solicitante.id}>
              <td>{solicitante.nome}</td>
              <td>{solicitante.telefone}</td>
              <td>{solicitante.funcao}</td>
              <td>
                <p
                  style={{
                    color:
                      solicitante.status_solicitante === true
                        ? Cor.ativo
                        : Cor.inativo,
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "bold",
                    backgroundColor:
                      solicitante.status_solicitante === true
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
                  {solicitante.status_solicitante ? "Ativo" : "Inativo"}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default listaSolicitantesEmpresasClientes;
