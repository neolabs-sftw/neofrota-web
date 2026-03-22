import { useState } from "react";
import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import { useAdminLogado } from "../hooks/AdminLogado";
import { useMotorista } from "../hooks/useMotorista";
import { useListaClientes } from "../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../hooks/useUnidadesClientes";
import { useListaAdminFuncionario } from "../hooks/useAdminFuncionario";
import { useSolicitante } from "../hooks/useSolicitantes";
import { useVouchersFiltrados } from "../hooks/useVouchers";
import styled from "styled-components";

function Relatorios() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <RelatorioConteudo />
      </>
    ),
  });
}

export default Relatorios;

function RelatorioConteudo() {
  const { Cor } = useTema()

  const operadoraId = useAdminLogado()?.operadora.id

  const [filtro, setFiltro] = useState<any>({
    operadoraId: String(operadoraId),
    adminUsuarioId: null,
    dataFim: null,
    dataInicio: null,
    empresaClienteId: null,
    motoristaId: null,
    natureza: null,
    solicitanteId: null,
    status: null,
    tipoCorrida: null,
    unidadeClienteId: null
  })

  const { listaRelatorio, loading } = useVouchersFiltrados(filtro)
  return <>
    <div style={{
      width: "100%",
      display: "flex",
      padding: "25px 15px 15px 15px",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 20,
    }}> <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
      }}
    >
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Relatórios</h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <BaseFiltros filtroAtivo={filtro} setFiltroAtivo={setFiltro} />
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
      }}>
        {listaRelatorio.length}
        {loading ? <p>Carregando...</p> : null}
        {listaRelatorio.map((v: any) => {
        return <div style={{ display: "flex", flexDirection: "row", gap: 10, width: "100%", justifyContent:"space-between" }}>
          <p>{v?.motorista.nome}</p>
          <p>{v?.dataHoraProgramado}</p>
          <p>{v?.status}</p>
          <p>{v?.origem}</p>
          <p>{v?.destino}</p>
        </div>
      })}
      </div>
    </div>
  </>
}


function BaseFiltros({ filtroAtivo, setFiltroAtivo }: { filtroAtivo: any, setFiltroAtivo: any }) {


  const [filtro, setFiltro] = useState(filtroAtivo)

  

  const operId = useAdminLogado()?.operadora.id

  const { listaMotoristas } = useMotorista(operId);
  const { listaClientes } = useListaClientes(operId || "0");
  const { listaUnidades, loading } = useUnidadeCliente(filtro.empresaClienteId || "0");
  const { solicitantes } = useSolicitante(filtro.empresaClienteId || "0")
  const { listAdminFuncionario } = useListaAdminFuncionario(String(operId))

  const handleChange = (campo: string, valor: string) => {
    setFiltro((prevFiltro: any) => ({
      ...prevFiltro,
      [campo]: valor === "" ? null : valor,
    }));
  };

  const handleFiltrar = () => {
    // Pegamos tudo que está no rascunho e jogamos pro pai
    setFiltroAtivo(filtro);
  };

  const { Cor } = useTema()
  return <div style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 15,
    marginTop: 10,
    backgroundColor: Cor.base2,
    borderRadius: 22,
    boxShadow: Cor.sombra,
    opacity: loading ? 0.5 : 1,
  }}>
    <p style={{ fontSize: 12, color: Cor.texto1 }}>Filtro de Pesquisa</p>
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundColor: Cor.secundaria,
      }}
    />
    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 5 }}>
      <div style={{ width: "15%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: 12, color: Cor.texto1 }}>De: </p> <TextoEntrada type="date" largura="80%" value={filtro.dataInicio || ""}
          onChange={(e) => handleChange("dataInicio", e.target.value)} placeholder="-" />
      </div>
      <div style={{ width: "15%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: 12, color: Cor.texto1 }}>Até: </p> <TextoEntrada type="date" largura="80%" value={filtro.dataFim || ""}
          onChange={(e) => handleChange("dataFim", e.target.value)} placeholder="-" />
      </div>
      <div style={{ width: "35%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
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
            onChange={(e) => handleChange("empresaClienteId", e.target.value)}
            value={filtro.empresaCliente}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
            >
              Todos
            </option>
            {listaClientes?.map((c: any) => {
              return (
                <option
                  value={c.id}
                  key={c?.id}
                  style={{
                    backgroundColor: Cor.base2,
                    padding: 15,
                    margin: 10,
                  }}
                >
                  {c?.nome}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div style={{ width: "35%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
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
            onChange={(e) => handleChange("unidadeClienteId", e.target.value)}
            value={filtro.unidadeClienteId}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
            >
              Todas
            </option>
            {listaUnidades?.map((u: any) => {
              return (
                <option
                  value={u.id}
                  key={u?.id}
                  style={{
                    backgroundColor: Cor.base2,
                    padding: 15,
                    margin: 10,
                  }}
                >
                  {u?.nome}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundColor: Cor.secundaria + 25,
      }}
    />
    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "space-between" }}>
      <div style={{ width: "32%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
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
            onChange={(e) => handleChange("motoristaId", e.target.value)}
            value={filtro.motoristaId}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
            >
              Todos
            </option>
            {listaMotoristas?.map((m: any) => {
              return (
                <option
                  value={m.id}
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
      <div style={{ width: "32%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
            margin: 5,
          }}
        >
          Solicitante:
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
            onChange={(e) => handleChange("solicitanteId", e.target.value)}
            value={filtro.solicitanteId}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
            >
              Todos
            </option>
            {solicitantes?.map((m: any) => {
              return (
                <option
                  value={m.id}
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
      <div style={{ width: "32%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
            margin: 5,
          }}
        >
          Operador:
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
            onChange={(e) => handleChange("operadorId", e.target.value)}
            value={filtro.operadorId}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
            >
              Todos
            </option>
            {listAdminFuncionario?.map((m: any) => {
              return (
                <option
                  value={m.id}
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
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundColor: Cor.secundaria + 25,
      }}
    />
    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "space-between" }}>
      <div style={{ width: "25%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
            margin: 5,
          }}
        >
          Tipo da Corrida:
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
            onChange={(e) => handleChange("tipoCorrida", e.target.value)}
            value={filtro.tipoCorrida}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
            >
              Todos
            </option>
            <option value="Entrada" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Entrada</option>
            <option value="Saida" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Saída</option>
          </select>
        </div>
      </div>
      <div style={{ width: "25%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
            margin: 5,
          }}
        >
          Natureza Voucher:
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
            onChange={(e) => handleChange("natureza", e.target.value)}
            value={filtro.natureza}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
            >
              Todos
            </option>
            <option value="Extra" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Extra</option>
            <option value="Fixo" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Fixo</option>
            <option value="Turno" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Turno</option>
          </select>
        </div>
      </div>
      <div style={{ width: "25%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: Cor.texto1,
            margin: 5,
          }}
        >
          Status Voucher:
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
            onChange={(e) => handleChange("status", e.target.value)}
            value={filtro.status}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
            >
              Todos
            </option>
            <option value="Aberto" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Aberto</option>
            <option value="Concluido" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Concluido</option>
            <option value="Cancelado" style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}>Cancelado</option>
          </select>
        </div>
      </div>
      <div style={{ width: "10%", display: "flex", flexDirection: "row", gap: 5, justifyContent: "flex-end", alignItems: "center" }}>
        <BtnFiltrar $cor={Cor.primaria} onClick={()=> handleFiltrar()}>Filtrar</BtnFiltrar>
      </div>
    </div>

  </div>
}

interface BtnFiltrarProps {
  $cor: string
}

const BtnFiltrar = styled.div<BtnFiltrarProps>`
  width: 100%;
  background-color: ${({ $cor }) => $cor};
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ease-in-out all 0.1s;
  user-select: none;
  cursor: pointer;

  &:hover{
  scale: 1.02}

  &:active{
  scale: 0.98}
`


function TextoEntrada({
  placeholder,
  onChange,
  value,
  type,
  largura,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
  largura: string;
}) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: largura,
        height: 40,
        backgroundColor: Cor.texto2 + 20,
        padding: 10,
        borderRadius: 22,
      }}
    >
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        style={{
          backgroundColor: "transparent",
          color: Cor.texto1,
          border: "none",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}
