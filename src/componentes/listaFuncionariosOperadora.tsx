import { useState } from "react";
import { useTema } from "../hooks/temaContext";
import styled from "styled-components";
// import { gql } from "@apollo/client";

// const GET_ADMIN_USER_BY_OPERADORA = gql`
//   query AdminUserOperadora($operadoraId: String) {
//     adminUserOperadora(operadoraId: $operadoraId) {
//       id
//       nome
//       email
//       status
//     }
//   }
// `;

interface TabelaFuncionariosProps {
  $texto1: string;
  $texto2: string;
  $base: string;
}

interface LinhaFuncionarioProps {
  $texto1: string;
  $base: string;
}

const TabelaFuncionarios = styled.table<TabelaFuncionariosProps>`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 5px;
    color: ${({ $texto1 }) => $texto1};
    font-size: 12px;
    background-color: ${({ $texto2 }) => $texto2 + 80};
  }
  td {
    text-align: left;
    padding: 5px;
    color: ${({ $texto1 }) => $texto1};
  }
`;

const LinhaUsuario = styled.tr<LinhaFuncionarioProps>`
  &:nth-child(even) {
    background-color: ${({ $base }) => $base};
  }
  &:hover {
    background-color: ${({ $texto1 }) => $texto1 + "15"};
  }
`;

function ListaFuncionariosOperadora() {
  const [busca, setBusca] = useState("");
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
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
            Lista de Funcionários
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
      <TabelaFuncionarios
        $base={Cor.base}
        $texto1={Cor.texto1}
        $texto2={Cor.texto2}
      >
        <thead>
          <tr>
            <th style={{ width: "5%" }}>Id</th>
            <th style={{ width: "30%" }}>Nome</th>
            <th style={{ width: "20%" }}>E-mail</th>
            <th style={{ width: "15%" }}>Telefone</th>
            <th style={{ width: "10%" }}>Função</th>
            <th style={{ width: "15%" }}>Status</th>
            <th style={{ width: "5%" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          <LinhaUsuario $base={Cor.base} $texto1={Cor.texto1}>
            <td>
              <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <img
                  src="https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/img_perfis/lorena.png"
                  alt=""
                  style={{ width: 50, height: 50, borderRadius: "20%" }}
                />
              </div>
            </td>
            <td>Cristiane Assis Gonçalves</td>
            <td>lorena_cs25@gmail.com</td>
            <td>71 98485-4578</td>
            <td>Ativo</td>
            <td>Master</td>
            <td>
              <p
                style={{
                  fontFamily: "Icone",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: Cor.primaria,
                  cursor: "pointer",
                }}
              >
                edit
              </p>
            </td>
          </LinhaUsuario>
          <LinhaUsuario $base={Cor.base} $texto1={Cor.texto1}>
            <td>
              <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <img
                  src="https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/img_perfis/lorena.png"
                  alt=""
                  style={{ width: 50, height: 50, borderRadius: "20%" }}
                />
              </div>
            </td>
            <td>Lorena Caises dos Santos</td>
            <td>lorena_cs25@gmail.com</td>
            <td>71 98485-4578</td>
            <td>Ativo</td>
            <td>Master</td>
            <td>
              <p
                style={{
                  fontFamily: "Icone",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: Cor.primaria,
                  cursor: "pointer",
                }}
              >
                edit
              </p>
            </td>
          </LinhaUsuario>
          <LinhaUsuario $base={Cor.base} $texto1={Cor.texto1}>
            <td>
              <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <img
                  src="https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/img_perfis/lorena.png"
                  alt=""
                  style={{ width: 50, height: 50, borderRadius: "20%" }}
                />
              </div>
            </td>
            <td>Lorena Caises dos Santos</td>
            <td>lorena_cs25@gmail.com</td>
            <td>71 98485-4578</td>
            <td>Ativo</td>
            <td>Master</td>
            <td>
              <p
                style={{
                  fontFamily: "Icone",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: Cor.primaria,
                  cursor: "pointer",
                }}
              >
                edit
              </p>
            </td>
          </LinhaUsuario>
        </tbody>
      </TabelaFuncionarios>
    </div>
  );
}

export default ListaFuncionariosOperadora;
