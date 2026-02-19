import { jwtDecode } from "jwt-decode";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { useState } from "react";
import { useMotorista } from "../../../hooks/useMotorista";

export function ModelosFixos() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <ModeloFixosConteudo />
      </>
    ),
  });
}

interface JwtPayload {
  adminUsuarioId?: string;
  operadoraId?: string;
}

function ModeloFixosConteudo() {
  const { Cor } = useTema();

  const [empresaCliente, setEmpresaCliente] = useState<any>();
  const [unidadeEmpresaCliente, setUnidadeEmpresaCliente] = useState<any>();
  const [motorista, setMotorista] = useState<any>();

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
          <h3 style={{ color: Cor.textoFixo, fontSize: "20px" }}>
            Modelos Fixos
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <p style={{ color: Cor.textoFixo, fontSize: 14, fontWeight: 600 }}>
            Lista de Modelos Fixos
          </p>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            paddingTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            // backgroundColor: Cor.atencao + 50,
            borderTop: `1px solid ${Cor.fixo}`,
            overflow: "auto",
            scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
          }}
        >
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
          <LinhaModeloFixo />
        </div>
      </div>
    </>
  );
}

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

  const token = localStorage.getItem("token");

  function getOperadoraId() {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.operadoraId;
    } else {
      console.log("Nenhum token encontrado");
    }
  }

  const operId = getOperadoraId();

  const { listaMotoristas } = useMotorista(operId);
  const { listaClientes } = useListaClientes(operId || "0");
  const { listaUnidades, loading } = useUnidadeCliente(empresaCliente || "0");

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
            Consulta de Modelos Fixos
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Gerencie e acompanhe os modelos cadastrados filtrando por dados
            específicos.
          </p>
        </div>
        <div style={{}}>Novo Modelo Fixo</div>
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
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + "BB",
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
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + "BB",
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
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + "BB",
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

function LinhaModeloFixo() {
  const { Cor } = useTema();
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 14,
        padding: 5,
        boxShadow: Cor.sombra
      }}
    >
      <div
        style={{
          width: 250,
          height: 40,
          border: `1px solid ${Cor.fixo}BB`,
          backgroundColor: Cor.fixo + 10,
          borderRadius: 8,
        }}
      >
        s
      </div>
    </div>
  );
}
