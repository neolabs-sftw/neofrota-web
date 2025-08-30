import { gql, useMutation, useQuery } from "@apollo/client";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import icativo from "../../../assets/animations/icativo.json";
import icinativo from "../../../assets/animations/icinativo.json";
import CardDetalhesVeiculo from "./btnComponentes/cardDetalhesVeículo";
import { useState } from "react";

function VerMotorista() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <VerMotoristaConteudo />
      </>
    ),
  });
}

export default VerMotorista;

const GET_MOTORISTA_ID = gql`
  query Motorista($motoristaId: ID!) {
    motorista(id: $motoristaId) {
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
      statusCnh
      operadoraId {
        id
        nome
      }
    }
  }
`;

const CREATE_RELACAO = gql`
  mutation CreateRelacaoAgrdFunc($input: RelacaoAgrdFuncInput!) {
    createRelacaoAgrdFunc(input: $input) {
      id
    }
  }
`;

const GET_LISTA_FUNCIONARIOS = gql`
  query ListaFuncionariosAgregadoId($listaFuncionariosAgregadoId: ID!) {
    listaFuncionariosAgregadoId(id: $listaFuncionariosAgregadoId) {
      id
      motoristaComoFuncionario {
        id
        nome
        statusCnh
        email
      }
    }
  }
`;

function VerMotoristaConteudo() {
  const navigate = useNavigate();

  const Cor = useTema().Cor;

  const { motoristaId } = useParams();

  const { data } = useQuery(GET_MOTORISTA_ID, {
    variables: { motoristaId: motoristaId },
  });

  const motorista = data?.motorista;

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          padding: "25px 15px 15px 15px",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px 10px",
              gap: 10,
              borderRadius: 15,
              backgroundColor: Cor.primaria + 30,
              cursor: "pointer",
            }}
            onClick={() => navigate("/agregados")}
          >
            <p
              style={{
                color: Cor.primaria,
                fontFamily: "Icone",
                fontWeight: "bold",
              }}
            >
              arrow_back
            </p>
            <p style={{ color: Cor.primaria, fontSize: 12 }}>Voltar</p>
          </div>

          <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
            Detalhes Motorista
          </h3>
          <div
            style={{
              width: "70%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        <Cabecalho />
        {motorista?.tipoMotorista === "Agregado" ? (
          <ListaMotoristasFuncionarios motorista={motorista} />
        ) : null}
        <ExcluirMotorista />
      </div>
    </>
  );
}

function Cabecalho() {
  const Cor = useTema().Cor;
  const { motoristaId } = useParams();

  const { data } = useQuery(GET_MOTORISTA_ID, {
    variables: { motoristaId: motoristaId },
  });

  const motorista = data?.motorista;

  const FALLBACK_IMAGE_URL =
    "https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/foto_perfil_motorista/default.png";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}
    >
      <div
        style={{
          width: "20%",
          height: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img
          src={motorista?.fotoMotorista || FALLBACK_IMAGE_URL}
          alt="Foto do motorista"
          style={{
            width: "60%",
            height: "70%",
            borderRadius: 22,
            objectFit: "cover",
            boxShadow: Cor.sombra,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto1 }}>Status: </p>
            <div
              style={{
                backgroundColor: motorista?.statusMotorista
                  ? Cor.ativo + 20
                  : Cor.inativo + 20,
                borderRadius: 12,
                padding: "5px 15px",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: motorista?.statusMotorista ? Cor.ativo : Cor.inativo,
                }}
              >
                {motorista?.statusMotorista ? "Ativo" : "Inativo"}
              </p>
            </div>
          </div>
        </div>
        <button
          style={{
            border: "none",
            backgroundColor: Cor.primaria,
            padding: "5px 25px",
            borderRadius: 12,
            color: Cor.base,
            cursor: "pointer",
          }}
        >
          Editar Informações
        </button>
      </div>
      {/* Fim Resumo perfil */}
      {/* Linha Detalhes Motorista */}
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <DetalhesMotorista motorista={motorista} />
        <CardDetalhesVeiculo motorista={motorista} />
      </div>
    </div>
  );
}

function DetalhesMotorista({ motorista }: { motorista: any }) {
  const Cor = useTema().Cor;

  const [tipoMotorista, setTipoMotorista] = useState(motorista?.tipoMotorista);

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 11 }}>Nome</p>
        <p style={{ color: Cor.texto1, fontSize: 14, fontWeight: "700" }}>
          {motorista?.nome}
        </p>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Cor.texto1 + 50,
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 11 }}>E-mail</p>
        <p style={{ color: Cor.texto1, fontSize: 14 }}>{motorista?.email}</p>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Cor.texto1 + 50,
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 11 }}>CPF</p>
        <p style={{ color: Cor.texto1, fontSize: 14 }}>{motorista?.cpf}</p>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Cor.texto1 + 50,
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 11 }}>Nº Registro CNH</p>
        <p style={{ color: Cor.texto1, fontSize: 14 }}>{motorista?.cnh}</p>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Cor.texto1 + 50,
          }}
        />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <p style={{ color: Cor.secundaria, fontSize: 11 }}>Validade CNH</p>
          <p style={{ color: Cor.texto1, fontSize: 14 }}>{motorista?.vCnh}</p>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: Cor.texto1 + 50,
            }}
          />
        </div>
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            gap: 10,
            backgroundColor: motorista?.statusCnh
              ? Cor.ativo + 20
              : Cor.inativo + 20,
          }}
        >
          <Lottie
            animationData={motorista?.statusCnh ? icativo : icinativo}
            loop={true}
            style={{ width: 20, height: 20 }}
            autoPlay
          />
          <p
            style={{
              fontSize: 14,
              color: motorista?.statusCnh ? Cor.ativo : Cor.inativo,
              fontWeight: "bold",
            }}
          >
            {motorista?.statusCnh ? "CNH VÁLIDA" : "CNH VENCIDA"}
          </p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 11 }}>Tipo de Motorista</p>
        <select
          style={{
            width: "75%",
            appearance: "none",
            outline: "none",
            border: "none",
            padding: 10,
            backgroundColor:
              tipoMotorista !== "Funcionario"
                ? Cor.primaria + 20
                : Cor.secundaria + 20,
            borderRadius: 22,
            color:
              tipoMotorista !== "Funcionario" ? Cor.primaria : Cor.secundaria,
            fontWeight: "bold",
            fontSize: 16,
          }}
          onChange={(e) => setTipoMotorista(e.target.value)}
          value={tipoMotorista}
        >
          <option value="Agregado">Agregado</option>
          <option value="Funcionario">Funcionário</option>
        </select>
      </div>
    </div>
  );
}

function ListaMotoristasFuncionarios({ motorista }: { motorista: any }) {
  const Cor = useTema().Cor;
  const [busca, setBusca] = useState("");

  const operadoraID = motorista?.operadoraId.id;
  const agregadoID = motorista?.id;
  const [funcionarioID, setFuncionarioID] = useState("");

  const navigate = useNavigate();

  const { data } = useQuery(GET_LISTA_FUNCIONARIOS, {
    variables: { listaFuncionariosAgregadoId: motorista?.id },
    skip: !motorista?.id,
  });

  const funcionarios = data?.listaFuncionariosAgregadoId;

  console.log(funcionarios);

  const [createRelacaoAgrdFunc] = useMutation(CREATE_RELACAO);

  async function adicionarFuncionario() {
    if (!funcionarioID) {
      console.log("funcionarioID não informado");
      return;
    }

    try {
      const { data } = await createRelacaoAgrdFunc({
        variables: {
          input: {
            agregadoId: parseInt(agregadoID),
            funcionarioId: parseInt(funcionarioID),
            operadoraId: parseInt(operadoraID),
          },
        },
      });

      console.log("Relação criada:", data);
      setFuncionarioID("");
      window.location.reload();
    } catch (err) {
      console.error("Erro ao criar relação:", err);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        boxShadow: Cor.sombra,
        borderRadius: 22,
        padding: 15,
        display: "flex",
        flexDirection: "column",
        gap: 5,
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
            Lista de Motoristas Funcionários
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Lista de motoristas Funcionários associados ao motorista.
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
      <table
        style={{
          color: Cor.texto1,
        }}
      >
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
            <th>Nome</th>
            <th>Email</th>
            <th style={{ width: 150, textAlign: "center" }}>Validade CNH</th>
            <th style={{ width: 150, textAlign: "center" }}>Placa</th>
            <th style={{ width: 150, textAlign: "center" }}>Modelo Carro</th>
            <th style={{ width: 80, textAlign: "center" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios == undefined ? null : funcionarios.map((funcionario: any) => {
            return (
              <tr key={funcionario.motoristaComoFuncionario.id}>
                <td>{funcionario.motoristaComoFuncionario.nome}</td>
                <td>{funcionario.motoristaComoFuncionario.email}</td>
                <td style={{ width: 150, textAlign: "center" }}>
                  <p>ssad</p>
                </td>
                <td style={{ width: 150, textAlign: "center" }}>Placa</td>
                <td style={{ width: 150, textAlign: "center" }}>Modelo Carro</td>
                <td style={{ width: 80, textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "Icone",
                      fontSize: "24px",
                      color: Cor.texto2,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                     onClick={() => navigate(`/motorista/${funcionario.motoristaComoFuncionario.id}`)}
                  >
                    visibility
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <p style={{ fontSize: 12, color: Cor.secundaria }}>
          Para adicionar um motorista, adicione o ID clique no botão ao lado.
        </p>
        <div
          style={{
            display: "flex",
            width: 120,
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
              color: Cor.secundaria,
            }}
          >
            badge
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
            placeholder="Id Func..."
            value={funcionarioID}
            onChange={(e) => setFuncionarioID(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 250,
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 15px",
            backgroundColor: Cor.primaria,
            borderRadius: 22,
            cursor: "pointer",
          }}
          onClick={() => adicionarFuncionario()}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              fontSize: "24px",
              color: Cor.base,
            }}
          >
            add
          </p>
          <p
            style={{
              fontWeight: "500",
              color: Cor.base,
            }}
          >
            Adicionar Funcionário
          </p>
        </div>
      </div>
    </div>
  );
}

function ExcluirMotorista() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        height: 100,
        border: "2px solid" + Cor.atencao + 60,
        borderRadius: 22,
        backgroundColor: Cor.base2,
        boxShadow: Cor.sombra,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div
          style={{
            height: "100%",
            aspectRatio: 1,
            backgroundColor: Cor.atencao + 50,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              color: Cor.atencao,
              fontSize: 40,
              fontWeight: "bold",
            }}
          >
            warning
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 20,
              color: Cor.atencao,
              fontWeight: "bold",
            }}
          >
            Zona Perigosa
          </p>
          <p style={{ fontSize: 12, color: Cor.texto1 }}>
            O Motorista será <strong>excluído permanentemente</strong>,
            incluindo vinculos com veículos, motoristas Agregados ou
            <br />
            Funcionários, histórico de vouchers e outras informações serão
            mantidas, porém, sem dados e detalhes do
            <br />
            motorista. Esta ação é irreversível e não pode ser desfeita.
          </p>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", gap: 10, width: "30%" }}
      >
        <button
          style={{
            backgroundColor: Cor.primaria + 30,
            color: Cor.primaria,
            width: "50%",
            border: "none",
            borderRadius: 14,
            padding: "10px 0px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              color: Cor.primaria,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            block
          </p>
          <p style={{ fontWeight: "bold" }}>Bloquear</p>
        </button>
        <button
          style={{
            backgroundColor: Cor.atencao + 30,
            width: "50%",
            color: Cor.atencao,
            border: "none",
            borderRadius: 14,
            padding: "10px 0px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => {}}
        >
          <p
            style={{
              fontFamily: "Icone",
              color: Cor.atencao,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            delete
          </p>
          <p style={{ fontWeight: "bold" }}>Excluir</p>
        </button>
      </div>
    </div>
  );
}
