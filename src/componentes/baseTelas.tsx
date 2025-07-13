import { useState, useEffect } from "react";
import { useTema } from "../hooks/temaContext";
import NavMenu from "./navMenu";
import AdminLogadoProvider from "../hooks/AdminLogado";
import { gql, useQuery } from "@apollo/client";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/novologo.json";
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

function BaseTelas({ conteudo }: { conteudo: any }) {
  const { Cor } = useTema();
  const [aberto, setAberto] = useState(() => {
    const salvo = localStorage.getItem("menuAberto");
    return salvo === "true";
  });

  const token = localStorage.getItem("token");

  function getAdminId() {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.admin_usuarioId;
    } else {
      console.log("Nenhum token encontrado");
    }
  } 

  useEffect(() => {
    localStorage.setItem("menuAberto", String(aberto));
  }, [aberto]);

  const { loading, error, data } = useQuery(GET_USUARIO, {
    variables: { adminUsuarioId: getAdminId() },
  });

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          width: "100hw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Cor.base,
        }}
      >
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoPlay
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  if (error) return <p>Erro ao buscar usuários: {error.message}</p>;

  const logado = data.admin_usuario_id;

  return (
    <>
      <AdminLogadoProvider value={logado}>
        <div
          style={{
            backgroundColor: Cor.base,
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <nav
            style={{
              backgroundColor: Cor.base2,
              width: aberto ? 200 : 60,
              height: "100vh",
              flexDirection: "column",
              position: "fixed",
              left: 0,
              transition: "width 0.3s ease-in-out",
              boxShadow: "1px 0px 5px rgba(0, 0, 0, 0.1)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                backgroundColor: Cor.base,
                height: "10vh",
                borderBottom: "1px solid" + Cor.texto1 + 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingLeft: "10px",
                gap: "15px",
                transition: "width 0.3s ease-in-out",
              }}
            >
              <img
                src={logado.operadora_id.logo_operadora}
                alt="Logo"
                style={{
                  width: "45px",
                  height: "45px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  transition: "width 0.3s ease-in-out",
                  border: "2px solid" + Cor.base2,
                  boxShadow: "1px 0px 5px rgba(0, 0, 0, 0.1)",
                }}
              />
              {aberto ? (
                <div style={{ flexDirection: "column", display: "flex" }}>
                  <p
                    style={{
                      color: Cor.primaria,
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {logado.operadora_id.nome}
                  </p>
                </div>
              ) : null}
            </div>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Cor.texto1 + 10,
                border: "2px solid" + Cor.texto1 + 30,
                cursor: "pointer",
                position: "absolute",
                top: "calc(10vh - 15px)",
                transition: "left 0.4s ease-in-out",
                backdropFilter: "blur(3px)",
                left: aberto ? "calc(200px - 15px)" : "calc(60px - 15px)",
              }}
              onClick={() => setAberto(!aberto)}
            >
              <p
                style={{
                  fontFamily: "Icone",
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: Cor.primaria,
                  transform: `rotate(${aberto ? "180deg" : "0deg"})`,
                  transition: "transform 0.6s ease-in-out",
                }}
              >
                chevron_right
              </p>
            </div>
            {<NavMenu sidebar={aberto} />}
          </nav>
          <main
            className="scrollbox"
            style={{
              backgroundColor: Cor.base,
              width: aberto ? "calc(100vw - 200px)" : "calc(100vw - 60px)",
              height: "100vh",
              transition: "width 0.3s ease-in-out",
              overflowY: "auto",
            }}
          >
            <style>{`
        .scrollbox::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbox::-webkit-scrollbar-track {
          background: ${Cor.texto2 + 30};
        }
        .scrollbox::-webkit-scrollbar-thumb {
          background-color: ${Cor.primaria};
          border-radius: 100px;
        }
      `}</style>
            {conteudo}
          </main>
        </div>
      </AdminLogadoProvider>
    </>
  );
}

export default BaseTelas;
