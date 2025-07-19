import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import ListaEmpresasCadastradas from "../componentes/listaEmpresasCadastradas";
import CardInfosMenor from "../componentes/cardInfosMenor";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {gql, useQuery} from "@apollo/client";
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

function Empresas() {

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

  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <EmpresasConteudo />
      </>
    ),
  });
}

export default Empresas;

function EmpresasConteudo() {
  const Cor = useTema().Cor;
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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Empresas</h3>
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
      <CadastrarNovoCliente />
      <ListaEmpresasCadastradas />
    </div>
  );
}

function CadastrarNovoCliente() {
  const navigate = useNavigate();
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        backgroundColor: Cor.base2,
        width: "100%",
        borderRadius: 22,
        padding: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: Cor.sombra,
      }}
    >
      <p style={{ color: Cor.secundaria, fontSize: "20px" }}>
        Cadastrar Novo Cliente
      </p>
      <div
        style={{
          width: "60%",
          height: 1,
          backgroundColor: Cor.primaria,
        }}
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
        onClick={() => navigate("/criarEmpresa")}
      >
        Cadastrar
      </button>
    </div>
  );
}
