import { useEffect } from "react";
import BaseTelas from "../componentes/baseTelas";
import CardHistFaturamento from "../componentes/cardHistFaturamento";
import CardInfosMenor from "../componentes/cardInfosMenor";
import CardRankingMotoristas from "../componentes/cardRankingMotoristas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import { gql, useQuery } from "@apollo/client";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const GET_USUARIO = gql`
  query Admin_usuario_id($adminUsuarioId: ID!) {
    admin_usuario_id(id: $adminUsuarioId) {
      id
      nome
      email
      senha
      foto_admin_operadora
      funcao
      status_admin_operadora
      data_criacao
      operadora_id {
        id
        nome
        slug
        logo_operadora
        cnpj
        r_social
        end_rua
        end_numero
        end_bairro
        end_cep
        end_cidade
        end_uf
        status_operadora
        data_criacao
      }
    }
  }
`;

function Home() {

  const token = localStorage.getItem("token");
   function getAdminId() {
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.admin_usuarioId;
      } else {
        console.log("Nenhum token encontrado");
      }
    } 

  const { loading, data } = useQuery(GET_USUARIO, {
    variables: { adminUsuarioId: getAdminId() || null },
  });

  const adminLogado = data?.admin_usuario_id;

  useEffect(() => {
    document.title = `NeoFrota | ${adminLogado?.operadora_id.nome}`;
  }, [loading, adminLogado]);

  return (
    <BaseTelas
      conteudo={
        <>
          <HomeConteudo />
          <EditPerfil />
        </>
      }
    />
  );
}

export default Home;

function HomeConteudo() {
  const Cor = useTema().Cor;

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
          gap: 30,
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
          <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Dashboard</h3>
          <div
            style={{
              width: "75%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        {/* Área total do resumo dos indicadores */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          {/* Coluna da esqueda do resumo dos indicadores */}
          <div
            style={{
              width: "75%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Primeira linha do Main */}
            <div
              style={{
                width: "100%",
                borderRadius: "22px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <CardInfosMenor
                tipo={false}
                tipoVoucher="Fixo"
                valor={10500}
                valorAnterior={25}
              />
              <CardInfosMenor
                tipo={false}
                tipoVoucher="Extra"
                valor={850}
                valorAnterior={-14}
              />
              <CardInfosMenor
                tipo={true}
                tipoVoucher="Bruto"
                valor={1324765}
                valorAnterior={2.5}
              />
              <CardInfosMenor
                tipo={true}
                tipoVoucher="Líquido"
                valor={386715}
                valorAnterior={-1.25}
              />
            </div>
            {/* Fim da Primeira linha Lado Esquedo do Main */}
            {/* Segunda linha Lado Esquedo do Main */}
            <div
              style={{
                width: "100%",
                height: 350,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <CardHistFaturamento />

              <div
                style={{
                  width: "40%",
                  height: "100%",
                  borderRadius: "22px",
                  backgroundColor: Cor.base2,
                  boxShadow: Cor.sombra,
                }}
              ></div>
            </div>
            <div
              style={{
                width: "100%",
                height: 350,
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: "33%",
                  height: "100%",
                  borderRadius: "22px",
                  backgroundColor: Cor.base2,
                  boxShadow: Cor.sombra,
                }}
              ></div>
              <div
                style={{
                  width: "33%",
                  height: "100%",
                  borderRadius: "22px",
                  backgroundColor: Cor.base2,
                  boxShadow: Cor.sombra,
                }}
              ></div>
              <div
                style={{
                  width: "33%",
                  height: "100%",
                  borderRadius: "22px",
                  backgroundColor: Cor.base2,
                  boxShadow: Cor.sombra,
                }}
              ></div>
            </div>
          </div>
          {/* Fim da Segunda linha Lado Esquedo do Main */}
          <div></div>
          {/* Fim da coluna da esqueda do resumo dos indicadores */}
          {/* Coluna da direita do resumo dos indicadores */}
          <div
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <CardRankingMotoristas />
            <CardRankingMotoristas />
          </div>
        </div>
        {/* Fim da coluna da direita do resumo dos indicadores */}
        {/* Fim Área total do resumo dos indicadores */}
      </div>
    </>
  );
}
