import { useState } from "react";
import { useTema } from "../hooks/temaContext";
import { gql, useQuery } from "@apollo/client";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import icinativo from "../assets/animations/icinativo.json";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { exportarPlanilha } from "../hooks/exportarPlanilha";
import Lottie from "lottie-react";

function ListaMotoristasAgregados() {
  const [busca, setBusca] = useState("");
  const Cor = useTema().Cor;
  const navigate = useNavigate();

  const GET_MOTORISTAS_OPERADORA_ID = gql`
    query MotoristasOperadora($motoristasOperadoraId: ID!) {
      motoristasOperadora(id: $motoristasOperadoraId) {
        id
        nome
        email
        senha
        fotoMotorista
        cpf
        cnh
        vCnh
        statusMotorista
        tipoMotorista
        dataCriacao
        operadoraId {
          id
        }
        statusCnh
      }
    }
  `;

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const operadoraId = decoded ? decoded.operadoraId : null;

  const { data } = useQuery(GET_MOTORISTAS_OPERADORA_ID, {
    variables: { motoristasOperadoraId: operadoraId },
  });

  const listaMotoristas = data?.motoristasOperadora;

  const listaMotoristasFiltrada = listaMotoristas?.filter((motorista: any) => {
    if (!busca) return listaMotoristas;
    return motorista.nome.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <div
      style={{
        width: "100%",
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
            Lista de Motoristas
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Lista de motoristas Agregados e Funcionários cadastrados.
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
            // onClick={() =>
            //   exportarPlanilha(
            //     lista_unidades,
            //     `Unidades ${empresa?.nome}`,
            //     "csv"
            //   )
            // }
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
      <table>
        <style>
          {`table {
              width: 100%;
              border-collapse: collapse;
              }         
            th {
              text-align: left;
              padding: 5px;
              color: ${Cor.texto1};
              font-size: 12px;
              background-color: ${Cor.texto2 + 80};
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
              
              }
           `}
        </style>
        <thead>
          <tr>
            <th style={{ width: "60px", textAlign: "center" }}>Foto</th>
            <th style={{ width: 30, textAlign: "center" }}>id</th>
            <th>Nome</th>
            <th>Email</th>
            <th style={{ width: 120, textAlign: "center" }}>CPF</th>
            <th style={{ width: 120, textAlign: "center" }}>Tipo</th>
            <th style={{ width: 100, textAlign: "center" }}>Validade CNH</th>
            <th style={{ width: 100, textAlign: "center" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {listaMotoristasFiltrada?.map((motorista: any) => (
            <tr key={motorista.id} style={{ fontSize: 14 }}>
              <td>
                <img
                  src={
                    motorista.fotoMotorista ||
                    "https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/foto_perfil_motorista/default.png"
                  }
                  alt="Foto do motorista"
                  style={{
                    width: 50,
                    aspectRatio: 1,
                    borderRadius: 14,
                    objectFit: "cover",
                    boxShadow: Cor.sombra,
                  }}
                />
              </td>
              <td
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: Cor.texto2,
                }}
              >
                {motorista.id}
              </td>
              <td>{motorista.nome}</td>
              <td>{motorista.email}</td>
              <td>{motorista.cpf}</td>
              <td>
                <TipoMotorista tipo={motorista.tipoMotorista} />
              </td>
              <td>
                <AlertaCNH status={motorista.statusCnh} />
              </td>
              <td
                style={{
                  width: 100,
                  height: 60,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 15,
                  padding: "5px 10px",
                  borderRadius: 22,
                }}
              >
                <style>{`.btn-acao {
              cursor: pointer;
              color: ${Cor.texto2};
              font-family: "Icone";
              font-weight: bold;
              font-size: 24px;
              transition: color 0.3s ease-in-out; /* BÓNUS: Adiciona uma transição suave */
              }

            .btn-acao:hover {
              color: ${Cor.primaria};
              }`}</style>
                <p
                  className="btn-acao"
                  onClick={() => navigate(`/motorista/${motorista.id}`)}
                >
                  visibility
                </p>
                <p className="btn-acao">edit</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TipoMotorista({ tipo }: { tipo: string }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: 120,
        height: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 5,
        padding: 10,
        borderRadius: 14,
        backgroundColor:
          tipo === "Agregado" ? Cor.primaria + 20 : Cor.secundaria + 20,
        objectFit: "cover",
      }}
    >
      <p
        style={{
          fontFamily: "Icone",
          color: tipo === "Agregado" ? Cor.primaria : Cor.secundaria,
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {tipo === "Agregado" ? "supervisor_account" : "badge"}
      </p>
      <p style={{ color: Cor.texto1, fontWeight: "bold", fontSize: 12 }}>
        {tipo}
      </p>
    </div>
  );
}

function AlertaCNH({ status }: { status: boolean }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: 90,
        height: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: status ? "center" : "center",
        padding: "5px 10px",
        borderRadius: 14,
        gap: 5,
        backgroundColor: status ? Cor.ativo + 30 : Cor.inativo + 30,
        objectFit: "cover",
      }}
    >
      {status ? null : (
        <Lottie
          animationData={icinativo}
          loop={true}
          style={{ width: 20, height: 20 }}
        />
      )}

      <p
        style={{
          color: status ? Cor.ativo : Cor.atencao,
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        {status ? "Válida" : "Vencida"}
      </p>
    </div>
  );
}

export default ListaMotoristasAgregados;
