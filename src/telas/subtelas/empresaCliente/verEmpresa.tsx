import { useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import CriarUnidades from "./btnComponentes/criarUnidades";
import ListaUnidadesEmpresasClientes from "../../../componentes/listaUnidadesEmpresasClientes";
import CriarSolicitante from "./btnComponentes/criarSolicitante";
import ListaSolicitantesEmpresasClientes from "../../../componentes/listaSolicitantesEmpresasClientes";
import CriarCentroCusto from "./btnComponentes/criarCentroCusto";
import ListaCentrosCustoEmpresaCliente from "../../../componentes/listaCentrosCustoEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { useSolicitante } from "../../../hooks/useSolicitantes";
import styled from "styled-components";

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
        nome
      }
      statusCliente
    }
  }
`;

function VerEmpresa() {
  const [CxAlertaExcluirCliente, setCxAlertaExcluirCliente] = useState(false);

  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <VerEmpresaConteudo
          setCxAlertaExcluirCliente={setCxAlertaExcluirCliente}
        />
        {CxAlertaExcluirCliente && (
          <AlertasExcluirCliente
            setCxAlertaExcluirCliente={setCxAlertaExcluirCliente}
            cxAlertaExcluirCliente={CxAlertaExcluirCliente}
          />
        )}
      </>
    ),
  });
}

function VerEmpresaConteudo({
  setCxAlertaExcluirCliente,
}: {
  setCxAlertaExcluirCliente: any;
}) {
  const { clienteId } = useParams();
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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Detalhes</h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <Cabecalho />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: "100%",
        }}
      >
        <ListaSolicitantesEmpresasClientes />
        <ListaCentrosCustoEmpresaCliente />
      </div>
      <ListaUnidadesEmpresasClientes empresaClienteId={clienteId} />
      <ExcluirCliente setCxAlertaExcluirCliente={setCxAlertaExcluirCliente} />
    </div>
  );
}

function Cabecalho() {
  const Cor = useTema().Cor;
  const { clienteId } = useParams();
  
  const navigate = useNavigate();

  const { listaUnidades } = useUnidadeCliente(clienteId || "");
  const { solicitantes } = useSolicitante(clienteId || "");

  const undCabecalho = listaUnidades?.find((u: any) => u.matriz === true);

  const solicitantePrincipal = solicitantes?.find(
    (s: any) => s.funcao === "Prin",
  );

  const solicitanteCabecalho = solicitantePrincipal
    ? solicitantePrincipal
    : solicitantes?.[0];

  const {
    data: empresa,
    loading,
    error,
  } = useQuery(GET_EMPRESA_CLIENTE, {
    variables: {
      empresaClienteId: clienteId,
    },
  });

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os dados: {error.message}</p>;

  const empresaCliente = empresa.empresaClienteId;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
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
          src={empresaCliente.fotoLogoCliente}
          alt=""
          style={{
            width: "60%",
            aspectRatio: 1,
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
          <h2 style={{ color: Cor.primaria, fontSize: "20px" }}>
            {empresaCliente.nome}
          </h2>
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
                backgroundColor: empresaCliente.statusCliente
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
                  color: empresaCliente.statusCliente ? Cor.ativo : Cor.inativo,
                }}
              >
                {empresaCliente.statusCliente ? "Ativo" : "Inativo"}
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
          onClick={()=> navigate(`/editarempresa/${empresaCliente.id}`)}
        >
          Editar Informações
        </button>
      </div>
      {/* Fim Resumo perfil */}
      {/* Linha Detalhes Cliente */}
      <div
        style={{
          width: "80%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        {/* Coluna Esqueda Detalhes do Cliente */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "48%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>Nome</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {undCabecalho?.nome}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>CNPJ</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {undCabecalho?.cnpj}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>Endereço</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {undCabecalho?.endRua || "Sem Matriz Cadastrada"},{" "}
              {undCabecalho?.endNumero}, {undCabecalho?.endBairro}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>Complemento</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {undCabecalho?.endComplemento || "Nenhum Complemento"}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cidade</p>
              <p style={{ fontSize: 16, color: Cor.texto1 }}>
                {undCabecalho?.endCidade}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>CEP</p>
              <p style={{ fontSize: 16, color: Cor.texto1 }}>
                {undCabecalho?.endCep}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>UF</p>
              <p style={{ fontSize: 16, color: Cor.texto1 }}>
                {undCabecalho?.endUf}
              </p>
            </div>
          </div>
        </div>
        {/*Fim Coluna Lado Esquerdo detalhes Cliente */}
        {/*Coluna Lado Direito detalhes Cliente*/}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "48%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>Contato Principal</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {solicitanteCabecalho?.nome}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>E-mail</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {solicitanteCabecalho?.email}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid" + Cor.texto2 + 50,
              paddingBottom: 5,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.texto2 }}>Telefone</p>
            <p style={{ fontSize: 16, color: Cor.texto1 }}>
              {solicitanteCabecalho?.telefone}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <CriarUnidades />
            <CriarSolicitante empresaClienteId={clienteId} />
            <CriarCentroCusto />
            <BtnPassageiros />
          </div>
        </div>
        {/*Fim Coluna Lado Direito detalhes Cliente */}
      </div>
    </div>
  );
}

interface BtnProps {
  $base: string;
  $cor: string;
}

const Btn = styled.div<BtnProps>`
  width: 22.5%;
  height: 100px;
  background-color: ${({ $base }) => $base}99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $cor }) => $cor}50;
  user-select: none;
  cursor: pointer;
  border-radius: 22px;
  box-shadow: 2px 2px 4px #00000010;
  transition: ease-in-out all 0.1s;

  &:hover {
    scale: 1.02;
    background-color: ${({ $base }) => $base}BB;
    box-shadow: 3px 3px 6px #00000010;
  }

  &:active {
    scale: 0.98;
    background-color: ${({ $base }) => $base};
    box-shadow: 1px 1px 2px #00000030;
  }
`;

function BtnPassageiros() {
  const Cor = useTema().Cor;

  const clienteId = useParams().clienteId;

  const navigate = useNavigate();
  return (
    <Btn
      $base={Cor.base2}
      $cor={Cor.primaria}
      onClick={() => navigate(`/passageiros/${clienteId}`)}
    >
      <p
        style={{
          fontFamily: "Icone",
          fontSize: 30,
          color: Cor.primaria,
          fontWeight: "bold",
        }}
      >
        diversity_3
      </p>
      <p style={{ textAlign: "center", fontSize: 12, color: Cor.texto1 }}>
        Passageiros
      </p>
    </Btn>
  );
}

function ExcluirCliente({
  setCxAlertaExcluirCliente,
}: {
  setCxAlertaExcluirCliente: any;
}) {
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
            O cliente será <strong>excluído permanentemente</strong>, incluindo
            histórico de vouchers, modelos de roteiros fixos,
            <br /> solicitantes, centro de custo e unidades. Esta ação é
            irreversível e não pode ser desfeita.
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
          onClick={() => {
            setCxAlertaExcluirCliente(true);
          }}
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

function AlertasExcluirCliente({
  setCxAlertaExcluirCliente,
}: {
  setCxAlertaExcluirCliente: any;
  cxAlertaExcluirCliente: any;
}) {
  const Cor = useTema().Cor;
  const navigate = useNavigate();
  const [verSenha, setVerSenha] = useState(false);
  return (
    <div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: Cor.base2 + "80", // transparência
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 11,
          top: 0,
          left: 0,
          backdropFilter: "blur(2.5px)",
        }}
        onClick={() => {
          setCxAlertaExcluirCliente(false);
        }}
      />
      <div
        style={{
          width: 300,
          backgroundColor: Cor.base,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          zIndex: 12,
          left: "calc(50% - 150px)",
          top: "calc(50% - 200px)",
          boxShadow: Cor.sombra,
          borderRadius: 22,
          border: "1px solid" + Cor.texto1 + 30,
        }}
      >
        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 80,
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
          <p style={{ fontSize: 12, color: Cor.texto1, textAlign: "justify" }}>
            O cliente será <strong>excluído permanentemente</strong>, incluindo
            histórico de vouchers, modelos de roteiros fixos, solicitantes,
            centro de custo e unidades. Esta ação é irreversível e não pode ser
            desfeita.
          </p>
        </div>
        <div
          style={{ width: "100%", height: 1, backgroundColor: Cor.texto1 + 30 }}
        />
        <div
          style={{
            width: "100%",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <p style={{ fontSize: 12, color: Cor.texto1, textAlign: "center" }}>
            Para confirmar a exclusão, digite sua senha:
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              backgroundColor: Cor.texto1 + 10,
              borderRadius: 22,
              alignItems: "center",
              padding: "5px 20px",
            }}
          >
            <input
              type={verSenha ? "text" : "password"}
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              placeholder="Digite sua senha"
              color="white"
            />
            <p
              style={{
                fontFamily: "Icone",
                color: Cor.texto2,
                fontSize: 24,
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                setVerSenha(!verSenha);
              }}
            >
              {verSenha ? "visibility_off" : "visibility"}
            </p>
          </div>
        </div>
        <div
          style={{ width: "100%", height: 1, backgroundColor: Cor.texto1 + 30 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: 20,
          }}
        >
          <button
            style={{
              backgroundColor: Cor.texto1 + 10,
              color: Cor.texto1,
              border: "1px solid" + Cor.texto2,
              borderRadius: 14,
              padding: "5px 20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => {
              setCxAlertaExcluirCliente(false);
            }}
          >
            <p style={{ fontWeight: "bold" }}>Cancelar</p>
          </button>
          <button
            style={{
              backgroundColor: Cor.atencao + 30,
              color: Cor.texto1,
              border: "none",
              borderRadius: 14,
              padding: "5px 20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => navigate("/empresas")}
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
    </div>
  );
}

export default VerEmpresa;
