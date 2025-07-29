import Lottie from "lottie-react";
import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import icativo from "../assets/animations/icativo.json";
import icinativo from "../assets/animations/icinativo.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { gql, useQuery } from "@apollo/client";

function Agregados() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <AgregadosConteudo />
      </>
    ),
  });
}

export default Agregados;

function AgregadosConteudo() {
  const Cor = useTema().Cor;

  const navigate = useNavigate();
  return (
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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Motoristas</h3>
        <div
          style={{
            width: "75%",
            height: 1,

            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          backgroundColor: Cor.base2,
          padding: 15,
          borderRadius: 22,
          boxShadow: Cor.sombra,
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 20 }}>
          Cadastrar Novo Motorista
        </p>
        <div
          style={{ width: "65%", height: 1, backgroundColor: Cor.primaria }}
        />
        <button
          style={{
            color: Cor.base,
            backgroundColor: Cor.primaria,
            padding: "10px 35px",
            borderRadius: 22,
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/criarMotorista")}
        >
          Cadastrar
        </button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <CardRankingMotoristas />
        <CardStatusMotoristasGeral />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <CardResFatRepasse />
        <CardResFatRepasseFixo />
        <CardResFatRepasseExtra />
        <CardCNHVencidas />
      </div>
      <ListaAgregados />
    </div>
  );
}

function CardRankingMotoristas() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "70%",
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: Cor.primaria,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <p
                  style={{
                    color: Cor.base,
                    fontWeight: "bold",
                    fontFamily: "Icone",
                  }}
                >
                  social_leaderboard
                </p>
              </div>
              <p
                style={{
                  color: Cor.primaria,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Ranking Motoristas
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 5,
            backgroundColor: Cor.primaria + 10,
          }}
        >
          <div
            style={{
              width: 250,
              aspectRatio: 1,
              backgroundColor: Cor.primaria,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

function CardStatusMotoristasGeral() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "30%",
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: Cor.primaria,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <p
                  style={{
                    color: Cor.base,
                    fontWeight: "bold",
                    fontFamily: "Icone",
                  }}
                >
                  toggle_on
                </p>
              </div>
              <p
                style={{
                  color: Cor.primaria,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Status
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <div
            style={{
              width: "50%",
              backgroundColor: Cor.texto1 + 30,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              borderRadius: 14,
            }}
          >
            <p style={{ color: Cor.texto1, fontSize: 14 }}>Gráfico aqui</p>
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <CardStatusMotoristas tipo={true} qnt={150} />
            <CardStatusMotoristas tipo={false} qnt={5} />
          </div>
        </div>
      </div>
    </>
  );
}

function CardStatusMotoristas({ tipo, qnt }: { tipo: boolean; qnt: number }) {
  const Cor = useTema().Cor;
  console.log(tipo);
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "20%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: tipo ? Cor.ativo + 30 : Cor.inativo + 30,
          overflow: "hidden",
          borderRadius: 32,
          padding: "10px 15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Lottie
            animationData={tipo ? icativo : icinativo}
            loop={true}
            autoplay={true}
            style={{ width: 25, height: 25 }}
          />
          <p style={{ color: Cor.texto1, fontWeight: 400 }}>
            {tipo ? "Ativos" : "Inativos"}
          </p>
        </div>
        <p style={{ color: tipo ? Cor.ativo : Cor.inativo, fontWeight: 900 }}>
          {qnt}
        </p>
      </div>
    </>
  );
}

function CardResFatRepasse() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "25%",
          height: "22vh",
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: Cor.secundaria }}>Repasse</p>
            <p style={{ color: Cor.texto2, fontSize: 11 }}>
              Total de Fixos e Extras
            </p>
          </div>
          <div
            style={{
              width: "50%",
              height: 1,
              backgroundColor: Cor.texto2 + 50,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>R$</p>
          <p style={{ color: Cor.texto1, fontSize: 32, fontWeight: "bold" }}>
            305.000,00
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              padding: 2,
              paddingLeft: 5,
              paddingRight: 5,
              backgroundColor: Cor.ativo + 30,
              borderRadius: 5,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                color: Cor.ativo,
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              25
            </p>
            <p
              style={{
                color: Cor.ativo,
                fontSize: "12px",
              }}
            >
              %
            </p>
          </div>
          <p
            style={{
              textAlign: "end",
              fontSize: "12px",
              color: Cor.texto2,
            }}
          >
            mês anterior
          </p>
        </div>
      </div>
    </>
  );
}

function CardResFatRepasseFixo() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "25%",
          height: "22vh",
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: Cor.secundaria }}>Repasse Fixos</p>
            <p style={{ color: Cor.texto2, fontSize: 11 }}>Total de Fixos</p>
          </div>
          <div
            style={{
              width: "50%",
              height: 1,
              backgroundColor: Cor.texto2 + 50,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>R$</p>
          <p style={{ color: Cor.texto1, fontSize: 32, fontWeight: "bold" }}>
            200.000,00
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              padding: 2,
              paddingLeft: 5,
              paddingRight: 5,
              backgroundColor: Cor.ativo + 30,
              borderRadius: 5,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                color: Cor.ativo,
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              25
            </p>
            <p
              style={{
                color: Cor.ativo,
                fontSize: "12px",
              }}
            >
              %
            </p>
          </div>
          <p
            style={{
              textAlign: "end",
              fontSize: "12px",
              color: Cor.texto2,
            }}
          >
            mês anterior
          </p>
        </div>
      </div>
    </>
  );
}

function CardResFatRepasseExtra() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "25%",
          height: "22vh",
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: Cor.secundaria }}>Repasse Extras</p>
            <p style={{ color: Cor.texto2, fontSize: 11 }}>Total de Extras</p>
          </div>
          <div
            style={{
              width: "50%",
              height: 1,
              backgroundColor: Cor.texto2 + 50,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>R$</p>
          <p style={{ color: Cor.texto1, fontSize: 32, fontWeight: "bold" }}>
            105.000,00
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              padding: 2,
              paddingLeft: 5,
              paddingRight: 5,
              backgroundColor: Cor.ativo + 30,
              borderRadius: 5,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                color: Cor.ativo,
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              25
            </p>
            <p
              style={{
                color: Cor.ativo,
                fontSize: "12px",
              }}
            >
              %
            </p>
          </div>
          <p
            style={{
              textAlign: "end",
              fontSize: "12px",
              color: Cor.texto2,
            }}
          >
            mês anterior
          </p>
        </div>
      </div>
    </>
  );
}

function CardCNHVencidas() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "25%",
          height: "22vh",
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          boxShadow: Cor.sombra,
          gap: 10,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: Cor.secundaria }}>CNH</p>
            <p style={{ color: Cor.texto2, fontSize: 11 }}>Vencidas</p>
          </div>
          <div
            style={{
              width: "70%",
              height: 1,
              backgroundColor: Cor.texto2 + 50,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto1, fontSize: 32, fontWeight: "bold" }}>
            0
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <p
            style={{
              textAlign: "end",
              fontSize: "12px",
              color: Cor.texto2,
            }}
          >
            Ver mais...
          </p>
        </div>
      </div>
    </>
  );
}

function ListaAgregados() {
  const [busca, setBusca] = useState("");
  const Cor = useTema().Cor;

  const GET_MOTORISTAS_OPERADORA_ID = gql`
    query Motoristas($motoristasOperadoraId: ID!) {
      motoristas_operadora_id(id: $motoristasOperadoraId) {
        id
        nome
        email
        senha
        foto_motorista
        cpf
        cnh
        v_cnh
        status_motorista
        tipo_motorista
        data_criacao
        operadora_id {
          id
          nome
        }
      }
    }
  `;

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const operadoraId = decoded ? decoded.operadora_id : null;

  const { loading, error, data } = useQuery(GET_MOTORISTAS_OPERADORA_ID, {
    variables: { motoristasOperadoraId: operadoraId },
  });

  const listaMotoristas = data?.motoristas_operadora_id;

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
              font-size: 14px;
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
              }`}
        </style>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {listaMotoristasFiltrada?.map((motorista: any) => (
            <tr key={motorista.id}>
              <td>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    overflow: "hidden",
                    borderRadius: 14,
                    backgroundImage: `url(${motorista.foto_motorista})`,
                    backgroundSize: "cover",
                  }}
                />
              </td>
              <td>{motorista.nome}</td>
              <td>{motorista.cpf}</td>
              <td>{motorista.email}</td>
              <td>{motorista.senha}</td>
              <td>{motorista.cnh}</td>
              <td>{motorista.tipo_motorista}</td>
              <td>{motorista.status_motorista}</td>
              <td>{motorista.data_criacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
