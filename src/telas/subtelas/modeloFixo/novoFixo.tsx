import { useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";

export function NovoFixo() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <NovoVoucherFixoConteudo />
      </>
    ),
  });
}

function NovoVoucherFixoConteudo() {
  const [empresaCliente, setEmpresaCliente] = useState("");
  const [unidadeCliente, setUnidadeCliente] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const { Cor } = useTema();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        padding: "25px 15px 15px 15px",
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
          Novo Roteiro Fixo
        </h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <DadosGerais
        empresaCliente={empresaCliente}
        setEmpresaCliente={setEmpresaCliente}
        unidadeCliente={unidadeCliente}
        setUnidadeCliente={setUnidadeCliente}
        nomeModelo={nomeModelo}
        setNomeModelo={setNomeModelo}
      />
      <ValoresFixo />
    </div>
  );
}

function DadosGerais({
  empresaCliente,
  setEmpresaCliente,
  unidadeCliente,
  setUnidadeCliente,
  nomeModelo,
  setNomeModelo,
}: {
  empresaCliente: string;
  setEmpresaCliente: any;
  unidadeCliente: string;
  setUnidadeCliente: any;
  nomeModelo: string;
  setNomeModelo: any;
}) {
  const { Cor } = useTema();

  const operId = useAdminLogado()?.operadora.id;

  const { listaClientes: listaClientesTotal } = useListaClientes(operId || "0");

  const listaClientes = listaClientesTotal?.filter(
    (c: any) => c.statusCliente === true,
  );

  const { listaUnidades: listaUnidadesTotal, loading } = useUnidadeCliente(
    empresaCliente || "0",
  );

  const listaUnidades = listaUnidadesTotal?.filter(
    (u: any) => u.statusUnidadeCliente === true,
  );

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        marginTop: 10,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: loading ? 0.5 : 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.textoFixo,
            fontWeight: "bold",
          }}
        >
          Criar Novo Roteiro Fixo
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Preencha a baixo os dados Gerais para criar um novo roteiro fixo.
        </p>
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
              color: Cor.textoFixo + 90,
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
              color: Cor.textoFixo + 90,
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
              onChange={(e) => setUnidadeCliente(e.target.value)}
              value={unidadeCliente}
              disabled={loading}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione uma Unidade
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
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Código do Roteiro:
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
              type="text"
              placeholder="Código do Roteiro"
              style={{ width: "100%", border: "none", outline: "none" }}
              value={nomeModelo}
              onChange={(e) => setNomeModelo(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ValoresFixo() {
  const { Cor } = useTema();
  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        marginTop: 10,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.textoFixo,
            fontWeight: "bold",
          }}
        >
          Valores
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Informe abaixo os valores que serão cobrados da empresa e repassados
          aos motoristas.
        </p>
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
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor Viagem:
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
              type="text"
              placeholder="Código do Roteiro"
              style={{
                width: "50%",
                border: "none",
                outline: "none",
                backgroundColor: Cor.fixo + 50,
                padding: 5,
              }}
            />
            <input
              type="text"
              placeholder="Código do Roteiro"
              style={{ width: "50%", border: "none", outline: "none" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor Adicional:
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
              type="text"
              placeholder="Código do Roteiro"
              style={{ width: "100%", border: "none", outline: "none" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor Hora Parada:
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
              type="text"
              placeholder="Código do Roteiro"
              style={{ width: "100%", border: "none", outline: "none" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Pedágio:
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
              type="text"
              placeholder="Código do Roteiro"
              style={{ width: "100%", border: "none", outline: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
