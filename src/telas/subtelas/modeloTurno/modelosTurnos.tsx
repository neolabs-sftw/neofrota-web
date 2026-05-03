import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { useState } from "react";
import { useMotorista } from "../../../hooks/useMotorista";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useListaModelosTurnoPrev } from "../../../hooks/useModelosTurnos";

export function ModelosTurnos() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <ModeloTurnosConteudo />
      </>
    ),
  });
}

function ModeloTurnosConteudo() {
  const { Cor } = useTema();

  const operadoraId = useAdminLogado()?.operadora.id;

  const [empresaCliente, setEmpresaCliente] = useState<any>();
  const [unidadeEmpresaCliente, setUnidadeEmpresaCliente] = useState<any>();
  const [motorista, setMotorista] = useState<any>();

  const { listaModelosTurno } = useListaModelosTurnoPrev({
    operadoraId,
  });

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          padding: "25px 15px 0 15px",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
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
          <h3 style={{ color: Cor.textoTurno, fontSize: "20px" }}>
            Roteiros Turnos
          </h3>
          <div
            style={{
              width: "75%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        <Filtros
          empresaCliente={empresaCliente}
          setEmpresaCliente={setEmpresaCliente}
          unidadeEmpresaCliente={unidadeEmpresaCliente}
          setUnidadeEmpresaCliente={setUnidadeEmpresaCliente}
          motorista={motorista}
          setMotorista={setMotorista}
        />

        <Cabecalho />
        <div
          style={{
            width: "100%",
            height: "100%",
            paddingTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            paddingBottom: 15,
            overflowY: "auto",
            borderTop: `1px solid ${Cor.turno}`,
            overflow: "auto",
            scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
          }}
        >
          {listaModelosTurno.map((mv: any) => {
            return <LinhaModeloTurno key={mv.id} mv={mv} />;
          })}
        </div>
      </div>
    </>
  );
}

interface BtnNovoRoteiroTurnoProps {
  $cor: string;
  $texto: string;
}

const BtnNovoRoteiroTurno = styled.div<BtnNovoRoteiroTurnoProps>`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background-color: ${({ $cor }) => $cor}30;
  color: ${({ $texto }) => $texto}DD;
  cursor: pointer;
  border: 1px solid ${({ $cor }) => $cor};
  transition: ease-in-out all 0.1s;
  user-select: none;

  &:hover {
    background-color: ${({ $cor }) => $cor}15;
    color: ${({ $texto }) => $texto};
    scale: 1.03;
  }

  &:active {
    background-color: ${({ $cor }) => $cor}35;
    color: ${({ $texto }) => $texto}90;
  }
`;

function Filtros({
  empresaCliente,
  setEmpresaCliente,
  unidadeEmpresaCliente,
  setUnidadeEmpresaCliente,
  motorista,
  setMotorista,
}: {
  empresaCliente: any;
  setEmpresaCliente: any;
  unidadeEmpresaCliente: any;
  setUnidadeEmpresaCliente: any;
  motorista: any;
  setMotorista: any;
}) {
  const { Cor } = useTema();

  const operId = useAdminLogado()?.operadora.id;

  const { listaMotoristas } = useMotorista(operId);
  const { listaClientes } = useListaClientes(operId || "0");
  const { listaUnidades, loading } = useUnidadeCliente(empresaCliente || "0");

  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        marginTop: 10,
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.primariaTxt,
              fontWeight: "bold",
            }}
          >
            Consulta Roteiros Turnos
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Gerencie e acompanhe os modelos cadastrados filtrando por dados
            específicos.
          </p>
        </div>
        <BtnNovoRoteiroTurno
          $cor={Cor.turno}
          $texto={Cor.textoTurno}
          onClick={() => navigate("/novomodeloturno")}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 20,
            }}
          >
            history
          </p>
          <p style={{ fontWeight: 500 }}>Novo Roteiro Turno</p>
        </BtnNovoRoteiroTurno>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + "BB",
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Cód. Roteiro:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <input
              placeholder="Digite aqui..."
              style={{
                width: "100%",
                outline: "none",
                border: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + "BB",
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Cliente:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              onChange={(e) => setEmpresaCliente(e.target.value)}
              value={empresaCliente}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione uma Empresa
              </option>
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value={cliente.id}
                    key={cliente?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + "BB",
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Unidade:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              onChange={(e) => setMotorista(e.target.value)}
              value={motorista}
              disabled={loading}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione um motorista
              </option>
              {listaUnidades?.map((Unidade: any) => {
                return (
                  <option
                    value={Unidade?.id}
                    key={Unidade?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {Unidade?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + "BB",
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Motorista:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              onChange={(e) => setUnidadeEmpresaCliente(e.target.value)}
              value={unidadeEmpresaCliente}
              disabled={loading}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione uma Unidade
              </option>
              {listaMotoristas?.map((m: any) => {
                return (
                  <option
                    value={m?.id}
                    key={m?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {m?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cabecalho() {
  const { Cor } = useTema();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 5,
        paddingRight: 20,
        backgroundColor: Cor.turno,
        marginBottom: -8,
      }}
    >
      <p
        style={{
          width: "20%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      >
        Código do Roteiro
      </p>
      <p
        style={{
          width: "20%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          textAlign: "center",
          height: 15,
          borderLeft: `1px solid ${Cor.base2}`,
        }}
      >
        Rota
      </p>
      <p
        style={{
          width: "5%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          height: 15,
          borderLeft: `1px solid ${Cor.base2}`,
        }}
      >
        Tipo
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          height: 15,
          borderLeft: `1px solid ${Cor.base2}`,
        }}
      >
        Cliente
      </p>
      <p
        style={{
          width: "15%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          height: 15,
          borderLeft: `1px solid ${Cor.base2}`,
        }}
      >
        Unidade
      </p>
      <p
        style={{
          width: "25%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          height: 15,
          borderLeft: `1px solid ${Cor.base2}`,
        }}
      >
        Motoristas
      </p>
      <p
        style={{
          width: "5%",
          color: Cor.base2,
          fontSize: 14,
          fontWeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          height: 15,
          borderLeft: `1px solid ${Cor.base2}`,
        }}
      >
        Ação
      </p>
    </div>
  );
}

interface LinhaModeloFixoProps {
  $cor: string;
}

const LinhaModeloFixoStyled = styled.div<LinhaModeloFixoProps>`
  width: 100%;
  background-color: ${({ $cor }) => $cor}10;
  border-radius: 14px;
  padding: 5px;
  border: 1px solid ${({ $cor }) => $cor}30;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  transition: ease-in-out all 0.1s;
  cursor: pointer;

  &:hover {
    background-color: ${({ $cor }) => $cor}35;
  }

  &:active {
    scale: 0.99;
  }
`;

function LinhaModeloTurno({ mv }: { mv: any }) {
  const navigate = useNavigate();

  const { Cor } = useTema();

  return (
    <LinhaModeloFixoStyled
      $cor={Cor.texto2}
      onClick={() => navigate(`/editarturno/${btoa(mv.id)}`)}
    >
      <div
        style={{
          width: "20%",
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `1px solid ${Cor.turno}AA`,
          backgroundColor: Cor.turno + 10,
          borderRadius: 8,
          padding: 5,
          overflow: "hidden",
        }}
      >
        <h5
          style={{
            color: Cor.textoTurno,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {mv?.nomeModelo || "..."}
        </h5>
      </div>
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          gap: 10,
        }}
      >
        <p style={{ color: Cor.textoTurno }}>
          Origem: <strong>{mv?.origem}</strong>
        </p>
        <div
          style={{
            width: 1,
            height: "80%",
            backgroundColor: Cor.textoTurno,
          }}
        />
        <p style={{ color: Cor.textoTurno }}>
          Destino: <strong>{mv?.destino}</strong>
        </p>
      </div>
      <div
        style={{
          width: "15%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: 5,
        }}
      >
        <p
          style={{
            color: Cor.textoTurno,
            textAlign: "center",
          }}
        >
          {mv.empresaCliente.nome}
        </p>
      </div>
      <div
        style={{
          width: "15%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: 5,
        }}
      >
        <p
          style={{
            color: Cor.textoTurno,
            textAlign: "center",
          }}
        >
          {mv.unidadeCliente.nome}
        </p>
      </div>

      <div
        style={{
          width: "20%",
          display: "flex",
          gap: 5,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <BtnEditarModelo
          $cor={Cor.primaria}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/editarturno/${btoa(mv.id)}`);
          }}
        >
          <p style={{ fontFamily: "Icone", userSelect: "none" }}>edit</p>
        </BtnEditarModelo>
        <BtnEditarModelo
          $cor={Cor.textoTurno}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/gerarcouchersturno/${btoa(mv.id)}`);
          }}
        >
          <p style={{ fontFamily: "Icone", userSelect: "none" }}>
            arrow_upload_ready
          </p>
        </BtnEditarModelo>
      </div>
    </LinhaModeloFixoStyled>
  );
}

interface BtnDesativerModeloProps {
  $cor: string;
}

const BtnEditarModelo = styled.div<BtnDesativerModeloProps>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $cor }) => $cor}30;
  border: 1px solid ${({ $cor }) => $cor}50;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ $cor }) => $cor}99;
  font-size: 28px;
  transition: ease-in-out all 0.1s;

  &:hover {
    color: ${({ $cor }) => $cor}CC;
    background-color: ${({ $cor }) => $cor}40;
    font-size: 32px;
    scale: 1.05;
  }

  &:active {
    color: ${({ $cor }) => $cor};
    background-color: ${({ $cor }) => $cor}25;
    font-size: 30px;
    scale: 1.02;
  }
`;
