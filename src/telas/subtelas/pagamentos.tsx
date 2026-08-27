import styled from "styled-components";
import BaseTelas from "../../componentes/baseTelas";
import EditPerfil from "../../componentes/editPerfil";
import { useTema } from "../../hooks/temaContext";
import { useMemo, useState } from "react";
import { useAdminLogado } from "../../hooks/AdminLogado";
import { useListaAdminFuncionario } from "../../hooks/useAdminFuncionario";
import { useListaClientes } from "../../hooks/useEmpresaCliente";
import { useMotorista } from "../../hooks/useMotorista";
import { useSolicitante } from "../../hooks/useSolicitantes";
import { useUnidadeCliente } from "../../hooks/useUnidadesClientes";
import { useVouchersFiltrados } from "../../hooks/useVouchers";
import { useLancamentosOperadora } from "../../hooks/useLancamentos";
import CircularProgress from "@mui/material/CircularProgress";
import { gerarExtratoPDF } from "../../hooks/exportarExtrato";

export function Pagamentos() {
  return BaseTelas({
    conteudo: (
      <>
        <PagamentosConteudo />
        <EditPerfil />
      </>
    ),
  });
}

function PagamentosConteudo() {
  const operadoraId = useAdminLogado()?.operadora.id;

  const formatarParaYMD = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const hoje = new Date();
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const [filtro, setFiltro] = useState<any>({
    operadoraId: String(operadoraId),
    adminUsuarioId: "",
    dataFim: formatarParaYMD(ultimoDia),
    dataInicio: formatarParaYMD(primeiroDia),
    empresaClienteId: "",
    motoristaId: "",
    natureza: "",
    solicitanteId: "",
    status: "Concluido",
    tipoCorrida: "",
    unidadeClienteId: "",
  });

  const { Cor } = useTema();

  const { listaRelatorio: listaPrincipal, loading } =
    useVouchersFiltrados(filtro);

  const resultadoAgrupado = listaPrincipal.reduce(
    (acc: Record<string, any>, voucher: any) => {
      const motoristaId = voucher.motorista?.id;

      if (!motoristaId) return acc;

      // 1. Inicia o objeto do motorista se for a primeira vez
      if (!acc[motoristaId]) {
        acc[motoristaId] = {
          motoristaId: Number(motoristaId),
          nomeMotorista: voucher.motorista?.nome || "Sem Nome",
          vouchers: [],
          valoresRepasseSomadosTotal: 0,
          valoresRepasseSomadosExtras: 0,
          valoresRepasseSomadosFixos: 0,
          valoresRepasseSomadosTurnos: 0,
          _empresasMap: {},
        };
      }

      const mot = acc[motoristaId];

      // 2. Extrai e converte os valores
      const viagemRepasse = Number(voucher.valorViagemRepasse) || 0;
      const deslocamentoRepasse = Number(voucher.valorDeslocamentoRepasse) || 0;
      const horaParadaRepasse = Number(voucher.valorHoraParadaRepasse) || 0;
      const tempoParado = Number(voucher.qntTempoParado) || 0;
      const pedagio = Number(voucher.valorPedagio) || 0;
      const estacionamento = Number(voucher.valorEstacionamento) || 0;

      const totalRepasseVoucher =
        viagemRepasse +
        deslocamentoRepasse +
        horaParadaRepasse * tempoParado +
        pedagio +
        estacionamento;
      const natureza = voucher.natureza;

      // 3. Monta o objeto do voucher solicitado
      const voucherFormatado = {
        id: String(voucher.id),
        dataHoraProgramado: String(voucher.dataHoraProgramado || ""),
        dataHoraCriacao: String(voucher.dataHoraCriacao || ""),
        dataHoraConclusao: String(voucher.dataHoraConclusao || ""),
        valorViagem: Number(voucher.valorViagem || 0),
        valorViagemRepasse: viagemRepasse,
        valorDeslocamento: Number(voucher.valorDeslocamento || 0),
        valorDeslocamentoRepasse: deslocamentoRepasse,
        valorHoraParada: Number(voucher.valorHoraParada || 0),
        valorHoraParadaRepasse: horaParadaRepasse,
        valorPedagio: pedagio,
        valorEstacionamento: estacionamento,
        qntTempoParado: tempoParado,
        natureza: String(natureza || ""),
        origem: String(voucher.origem || ""),
        destino: String(voucher.destino || ""),
        tipoCorrida: String(voucher.tipoCorrida || ""),
        status: String(voucher.status || ""),
        empresaCliente: {
          id: String(voucher.empresaCliente?.id || ""),
          nome: String(voucher.empresaCliente?.nome || ""),
          statusCliente: String(voucher.empresaCliente?.statusCliente || ""),
        },
        motorista: {
          id: String(voucher.motorista?.id || ""),
          nome: String(voucher.motorista?.nome || ""),
          tipoMotorista: String(voucher.motorista?.tipoMotorista || ""),
          statusCnh: String(voucher.motorista?.statusCnh || ""),
        },
      };

      mot.vouchers.push(voucherFormatado);

      // 4. Acumula totais do motorista
      mot.valoresRepasseSomadosTotal += totalRepasseVoucher;
      if (natureza === "Extra")
        mot.valoresRepasseSomadosExtras += totalRepasseVoucher;
      else if (natureza === "Fixo")
        mot.valoresRepasseSomadosFixos += totalRepasseVoucher;
      else if (natureza === "Turno")
        mot.valoresRepasseSomadosTurnos += totalRepasseVoucher;

      // 5. Acumula totais por empresa dentro do motorista
      const empresaId = voucher.empresaCliente?.id;
      if (empresaId) {
        if (!mot._empresasMap[empresaId]) {
          mot._empresasMap[empresaId] = {
            nomeEmpresa: voucher.empresaCliente.nome,
            valoresRepasseSomadosTotalPorEmpresa: 0,
            valoresRepasseSomadosExtrasPorEmpresa: 0,
            valoresRepasseSomadosFixosPorEmpresa: 0,
            valoresRepasseSomadosTurnosPorEmpresa: 0,
          };
        }

        const emp = mot._empresasMap[empresaId];
        emp.valoresRepasseSomadosTotalPorEmpresa += totalRepasseVoucher;

        if (natureza === "Extra")
          emp.valoresRepasseSomadosExtrasPorEmpresa += totalRepasseVoucher;
        else if (natureza === "Fixo")
          emp.valoresRepasseSomadosFixosPorEmpresa += totalRepasseVoucher;
        else if (natureza === "Turno")
          emp.valoresRepasseSomadosTurnosPorEmpresa += totalRepasseVoucher;
      }

      return acc;
    },
    {},
  );

  // 6. Transforma o dicionário final em array formatando as casas decimais
  const listaFinal = Object.values(resultadoAgrupado).map((motorista: any) => {
    const { _empresasMap, ...dadosMotorista } = motorista;

    const empresasFormatadas = Object.values(_empresasMap).map((emp: any) => ({
      nomeEmpresa: emp.nomeEmpresa,
      valoresRepasseSomadosTotalPorEmpresa: Number(
        emp.valoresRepasseSomadosTotalPorEmpresa.toFixed(2),
      ),
      valoresRepasseSomadosExtrasPorEmpresa: Number(
        emp.valoresRepasseSomadosExtrasPorEmpresa.toFixed(2),
      ),
      valoresRepasseSomadosFixosPorEmpresa: Number(
        emp.valoresRepasseSomadosFixosPorEmpresa.toFixed(2),
      ),
      valoresRepasseSomadosTurnosPorEmpresa: Number(
        emp.valoresRepasseSomadosTurnosPorEmpresa.toFixed(2),
      ),
    }));

    return {
      ...dadosMotorista,
      valoresRepasseSomadosTotal: Number(
        dadosMotorista.valoresRepasseSomadosTotal.toFixed(2),
      ),
      valoresRepasseSomadosExtras: Number(
        dadosMotorista.valoresRepasseSomadosExtras.toFixed(2),
      ),
      valoresRepasseSomadosFixos: Number(
        dadosMotorista.valoresRepasseSomadosFixos.toFixed(2),
      ),
      valoresRepasseSomadosTurnos: Number(
        dadosMotorista.valoresRepasseSomadosTurnos.toFixed(2),
      ),
      empresas: empresasFormatadas,
    };
  });

  const totaisRepassePorNatureza = listaPrincipal.reduce(
    (acc: any, voucher: any) => {
      // 1. Identifica a natureza da corrida (Fixo, Extra, Turno).
      // Usamos "Outros" como fallback caso algum venha vazio no banco.
      const nat = voucher.natureza || "Outros";

      // 2. Se a natureza ainda não existir no acumulador, cria a estrutura inicial
      if (!acc[nat]) {
        acc[nat] = {
          viagemRepasse: 0,
          deslocamentoRepasse: 0,
          horaParadaRepasse: 0,
          pedagio: 0,
          estacionamento: 0,
          totalRepasse: 0,
        };
      }

      // 3. Extrai e converte os valores em segurança
      const viagem = Number(voucher.valorViagemRepasse) || 0;
      const deslocamento = Number(voucher.valorDeslocamentoRepasse) || 0;
      const pedagio = Number(voucher.valorPedagio) || 0;
      const estacionamento = Number(voucher.valorEstacionamento) || 0;

      // Cálculo da hora parada (valor * quantidade de tempo)
      const horaParada =
        (Number(voucher.valorHoraParadaRepasse) || 0) *
        (Number(voucher.qntTempoParado) || 0);

      // Soma total do repasse para este voucher
      const subtotalVoucher =
        viagem + deslocamento + horaParada + pedagio + estacionamento;

      // 4. Acumula os valores dentro da natureza correspondente (Fixo, Extra ou Turno)
      acc[nat].viagemRepasse += viagem;
      acc[nat].deslocamentoRepasse += deslocamento;
      acc[nat].horaParadaRepasse += horaParada;
      acc[nat].pedagio += pedagio;
      acc[nat].estacionamento += estacionamento;

      // Total consolidado daquela natureza
      acc[nat].totalRepasse += subtotalVoucher;

      return acc;
    },
    {
      // Estrutura inicial opcional, mas boa para garantir que as chaves sempre existam na UI
      Fixo: {
        viagemRepasse: 0,
        deslocamentoRepasse: 0,
        horaParadaRepasse: 0,
        pedagio: 0,
        estacionamento: 0,
        totalRepasse: 0,
      },
      Extra: {
        viagemRepasse: 0,
        deslocamentoRepasse: 0,
        horaParadaRepasse: 0,
        pedagio: 0,
        estacionamento: 0,
        totalRepasse: 0,
      },
      Turno: {
        viagemRepasse: 0,
        deslocamentoRepasse: 0,
        horaParadaRepasse: 0,
        pedagio: 0,
        estacionamento: 0,
        totalRepasse: 0,
      },
    },
  );

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            color: Cor.texto2,
            fontSize: 12,
          }}
        >
          <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
            Resumo de Pagamentos / Repasses
          </h3>
          <p>Visão geral financeira de repasse para motoristas.</p>
        </div>
        <div
          style={{
            width: "58%",
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
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.fixo}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.textoFixo }}>Total Repasses Fixos</p>
          <p style={{ fontSize: 22, color: Cor.fixo, fontWeight: "bold" }}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totaisRepassePorNatureza.Fixo.totalRepasse)}
          </p>
        </div>
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.turno}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.texto1 }}>Total Repasses Turnos</p>
          <p style={{ fontSize: 22, color: Cor.turno, fontWeight: "bold" }}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totaisRepassePorNatureza.Turno.totalRepasse)}
          </p>
        </div>
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.extra}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.texto1 }}>Total Repasses Extra</p>
          <p style={{ fontSize: 22, color: Cor.extra, fontWeight: "bold" }}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totaisRepassePorNatureza.Extra.totalRepasse)}
          </p>
        </div>
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.primaria}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.texto1 }}>Total Geral</p>
          <p style={{ fontSize: 22, color: Cor.primaria, fontWeight: "bold" }}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              totaisRepassePorNatureza.Extra.totalRepasse +
                totaisRepassePorNatureza.Fixo.totalRepasse +
                totaisRepassePorNatureza.Turno.totalRepasse,
            )}
          </p>
        </div>
      </div>
      <BaseFiltros filtroAtivo={filtro} setFiltroAtivo={setFiltro} />
      <ListaMotoristaPagamentos f={listaFinal} loading={loading} />
    </div>
  );
}

interface BtnFiltrarProps {
  $bg: string;
  $texto: string;
}

const BtnFiltrar = styled.div<BtnFiltrarProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $texto }) => $texto};
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background-color: ${({ $bg }) => $bg + "BA"};
    scale: 1.02;
  }

  &:active {
    scale: 0.98;
    background-color: ${({ $bg }) => $bg + 90};
  }
`;

function BaseFiltros({
  filtroAtivo,
  setFiltroAtivo,
}: {
  filtroAtivo: any;
  setFiltroAtivo: any;
}) {
  const [filtro, setFiltro] = useState(filtroAtivo);

  const operId = useAdminLogado()?.operadora.id;

  const { listaMotoristas } = useMotorista(operId);
  const { listaClientes } = useListaClientes(operId || "0");
  const { listaUnidades, loading } = useUnidadeCliente(
    filtro.empresaClienteId || "0",
  );
  const { solicitantes } = useSolicitante(filtro.empresaClienteId || "0");
  const { listAdminFuncionario } = useListaAdminFuncionario(String(operId));

  const handleChange = (campo: string, valor: string) => {
    setFiltro((prevFiltro: any) => ({
      ...prevFiltro,
      [campo]: valor === "" ? null : valor,
    }));
  };

  const handleFiltrar = () => {
    setFiltroAtivo(filtro);
  };

  const { Cor } = useTema();
  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto1 }}>Filtro de Pesquisa</p>
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          backgroundColor: Cor.secundaria,
        }}
      />
      <div
        style={{ width: "100%", display: "flex", flexDirection: "row", gap: 5 }}
      >
        <div
          style={{
            width: "15%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 12, color: Cor.texto1 }}>De: </p>{" "}
          <TextoEntrada
            type="date"
            largura="80%"
            value={filtro.dataInicio || ""}
            onChange={(e) => handleChange("dataInicio", e.target.value)}
            placeholder="-"
          />
        </div>
        <div
          style={{
            width: "15%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 12, color: Cor.texto1 }}>Até: </p>{" "}
          <TextoEntrada
            type="date"
            largura="80%"
            value={filtro.dataFim || ""}
            onChange={(e) => handleChange("dataFim", e.target.value)}
            placeholder="-"
          />
        </div>
        <div
          style={{
            width: "35%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
        <div
          style={{
            width: "35%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              value={filtro.unidadeClienteId || ""}
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "32%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
        <div
          style={{
            width: "32%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
        <div
          style={{
            width: "32%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              onChange={(e) => handleChange("adminUsuarioId", e.target.value)}
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              <option
                value="Entrada"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Entrada
              </option>
              <option
                value="Saida"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Saída
              </option>
            </select>
          </div>
        </div>
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              <option
                value="Extra"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Extra
              </option>
              <option
                value="Fixo"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Fixo
              </option>
              <option
                value="Turno"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Turno
              </option>
            </select>
          </div>
        </div>
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              <option
                value="Aberto"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Aberto
              </option>
              <option
                value="Concluido"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Concluido
              </option>
              <option
                value="Cancelado"
                style={{ backgroundColor: Cor.base2, color: Cor.texto1 }}
              >
                Cancelado
              </option>
            </select>
          </div>
        </div>
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <BtnFiltrar
            $bg={Cor.primaria}
            $texto={Cor.base}
            onClick={() => handleFiltrar()}
          >
            Filtrar
          </BtnFiltrar>
          <BtnFiltrar
            $bg={Cor.texto2}
            $texto={Cor.base}
            onClick={() => {}}
            // onClick={() => exportarPlanilha()}
          >
            {/* {carregandoExportacao ? "Exportando..." : "Exportar"} */}
            Exportar
          </BtnFiltrar>
        </div>
      </div>
    </div>
  );
}

type ColunaOrdenacao =
  | "nomeMotorista"
  | "valoresRepasseSomadosExtras"
  | "valoresRepasseSomadosFixos"
  | "valoresRepasseSomadosTurnos"
  | "valoresRepasseSomadosTotal"
  | "totalLiquido";

function ListaMotoristaPagamentos({
  f,
  loading,
}: {
  f: any;
  loading: boolean;
}) {
  const { Cor } = useTema();

  const [ordenacao, setOrdenacao] = useState<{
    coluna: ColunaOrdenacao | null;
    direcao: "asc" | "desc";
  }>({ coluna: null, direcao: "desc" });

  const handleOrdenar = (coluna: ColunaOrdenacao) => {
    setOrdenacao((prev) => {
      // Se clicou na mesma coluna, inverte a direção
      if (prev.coluna === coluna) {
        return { coluna, direcao: prev.direcao === "desc" ? "asc" : "desc" };
      }
      // Se clicou em uma nova coluna, o padrão é decrescente (maior pro menor)
      return { coluna, direcao: "desc" };
    });
  };

  const listaOrdenada = useMemo(() => {
    if (!ordenacao.coluna) return f;

    return [...f].sort((a, b) => {
      // Pega os valores e faz fallback para 0 ou string vazia caso seja undefined
      const valorA =
        a[ordenacao.coluna!] ??
        (typeof a[ordenacao.coluna!] === "string" ? "" : 0);
      const valorB =
        b[ordenacao.coluna!] ??
        (typeof b[ordenacao.coluna!] === "string" ? "" : 0);

      // Tratamento para ordenação alfabética (String: nomeMotorista)
      if (typeof valorA === "string" && typeof valorB === "string") {
        return ordenacao.direcao === "asc"
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      }

      // Tratamento para ordenação numérica (Dinheiro)
      if (ordenacao.direcao === "asc") {
        return (valorA as number) - (valorB as number);
      } else {
        return (valorB as number) - (valorA as number);
      }
    });
  }, [f, ordenacao]);

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
            Lista de Motoristas Pagamentos
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Visão geral financeira de repasse para motoristas.
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
              //   value={busca}
              //   onChange={(e) => setBusca(e.target.value)}
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: Cor.texto2 + 40,
          borderRadius: "8px 8px 0 0",
          padding: 5,
        }}
      >
        <div
          style={{
            width: "28%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => handleOrdenar("nomeMotorista")}
        >
          <p>Motorista</p>{" "}
          <p style={{ fontFamily: "Icone", color: Cor.secundaria }}>
            {ordenacao.coluna === "nomeMotorista" &&
              (ordenacao.direcao === "asc"
                ? "arrow_drop_down"
                : "arrow_drop_up")}
          </p>
        </div>
        <div
          style={{
            width: "10%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => handleOrdenar("valoresRepasseSomadosExtras")}
        >
          <p>Extra</p>{" "}
          <p style={{ fontFamily: "Icone", color: Cor.secundaria }}>
            {" "}
            {ordenacao.coluna === "valoresRepasseSomadosExtras" &&
              (ordenacao.direcao === "asc"
                ? "arrow_drop_down"
                : "arrow_drop_up")}
          </p>
        </div>
        <div
          style={{
            width: "10%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => handleOrdenar("valoresRepasseSomadosFixos")}
        >
          <p>Fixos</p>{" "}
          <p style={{ fontFamily: "Icone", color: Cor.secundaria }}>
            {ordenacao.coluna === "valoresRepasseSomadosFixos" &&
              (ordenacao.direcao === "asc"
                ? "arrow_drop_down"
                : "arrow_drop_up")}
          </p>
        </div>
        <div
          style={{
            width: "10%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => handleOrdenar("valoresRepasseSomadosTurnos")}
        >
          <p>Turnos</p>{" "}
          <p style={{ fontFamily: "Icone", color: Cor.secundaria }}>
            {ordenacao.coluna === "valoresRepasseSomadosTurnos" &&
              (ordenacao.direcao === "asc"
                ? "arrow_drop_down"
                : "arrow_drop_up")}
          </p>
        </div>
        <div
          style={{
            width: "10%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => handleOrdenar("valoresRepasseSomadosTotal")}
        >
          <p>Total Bruto</p>{" "}
          <p style={{ fontFamily: "Icone", color: Cor.secundaria }}>
            {ordenacao.coluna === "valoresRepasseSomadosTotal" &&
              (ordenacao.direcao === "asc"
                ? "arrow_drop_down"
                : "arrow_drop_up")}
          </p>
        </div>
        <p
          style={{
            width: "10%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            userSelect: "none",
          }}
        >
          Acres.
        </p>
        <p
          style={{
            width: "10%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            userSelect: "none",
          }}
        >
          Desc.
        </p>
        <p
          style={{
            width: "12%",
            fontSize: 14,
            fontWeight: "bold",
            color: Cor.texto1,
            userSelect: "none",
          }}
        >
          Total Liq.
        </p>
      </div>
      <style>{`
          .scrollbox::-webkit-scrollbar {
            width: 5px;
          }
          .scrollbox::-webkit-scrollbar-track {
            background: ${Cor.texto2 + 30};
          }
          .scrollbox::-webkit-scrollbar-thumb {
            background-color: ${Cor.primaria};
            border-radius: 10px;
          }
        `}</style>
      <div
        className="scrollbox"
        style={{
          width: "100%",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: Cor.base,
          padding: 8,
          overflow: "auto",
          scrollbarColor: Cor.primaria,
        }}
      >
        {loading ? (
          <div
            style={{
              width: "100%",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              size={24}
              thickness={5}
              sx={{
                color: Cor.primaria,
                "& .MuiCircularProgress-linear": {
                  strokeLinecap: "round",
                },
              }}
            />
          </div>
        ) : (
          listaOrdenada.map((f: any) => {
            return <LinhaFaturamentoMotorista key={f.motoristaId} m={f} />;
          })
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: Cor.texto2 + 40,
          borderRadius: "0 0 8px 8px",
          height: 15,
        }}
      />
    </div>
  );
}

interface LinhaFaturamentoProps {
  $bg: string;
  $border: string;
}

const LinhaFaturamentoStyled = styled.div<LinhaFaturamentoProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $bg }) => $bg + "01"};

  &:hover {
    background-color: ${({ $bg }) => $bg + 20};
  }
`;

function LinhaFaturamentoMotorista({ m }: { m: any }) {
  const { Cor } = useTema();

  const formatarParaYMD = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const hoje = new Date();
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const { lancamentos: acc } = useLancamentosOperadora({
    operadoraId: useAdminLogado()?.operadora.id,
    motoristaId: String(m.motoristaId),
    dataInicial: formatarParaYMD(primeiroDia),
    dataFinal: formatarParaYMD(ultimoDia),
  });

  const resumoLancamentos = acc.reduce(
    (acumulador: any, lancamento: any) => {
      // Garante que o valor será tratado como número para evitar concatenação de strings
      const valor = Number(lancamento.valor) || 0;

      if (lancamento.tipo === "Credito") {
        acumulador.totalCreditos += valor;
      } else if (lancamento.tipo === "Desconto") {
        acumulador.totalDescontos += valor;
      }

      return acumulador;
    },
    {
      motoristaId: String(m.motoristaId), // Usa o ID que já veio da prop do componente
      totalCreditos: 0,
      totalDescontos: 0,
    },
  );

  // Formatação opcional caso queira travar em 2 casas decimais no final:
  resumoLancamentos.totalCreditos = Number(
    resumoLancamentos.totalCreditos.toFixed(2),
  );
  resumoLancamentos.totalDescontos = Number(
    resumoLancamentos.totalDescontos.toFixed(2),
  );

  const admin = useAdminLogado();

  return (
    <LinhaFaturamentoStyled $bg={Cor.secundaria} $border={Cor.texto2}>
      <p
        style={{
          width: "28%",
          color: Cor.texto1,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          borderBottom: `1px solid ${Cor.texto2 + 50}`,
        }}
      >
        {m.nomeMotorista}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.texto1,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          borderBottom: `1px solid ${Cor.texto2 + 50}`,
        }}
      >
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(m.valoresRepasseSomadosExtras || 0))}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.texto1,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          borderBottom: `1px solid ${Cor.texto2 + 50}`,
        }}
      >
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(m.valoresRepasseSomadosFixos || 0))}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.texto1,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          borderBottom: `1px solid ${Cor.texto2 + 50}`,
        }}
      >
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(m.valoresRepasseSomadosTurnos || 0))}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.texto1 + "CC",
          fontSize: 14,
          backgroundColor: Cor.secundaria + 10,
          borderBottom: `1px solid ${Cor.secundaria + 30}`,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 5,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          fontWeight: "500",
        }}
      >
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(m.valoresRepasseSomadosTotal || 0))}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.ativo + 90,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 5,
          borderBottom: `1px solid ${Cor.texto2 + 50}`,
        }}
      >
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(resumoLancamentos.totalCreditos))}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.atencao + 90,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          borderBottom: `1px solid ${Cor.texto2 + 50}`,
        }}
      >
        -{" "}
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(resumoLancamentos.totalDescontos))}
      </p>
      <p
        style={{
          width: "10%",
          color: Cor.secundaria,
          fontSize: 14,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 5,
          backgroundColor: Cor.secundaria + 15,
          borderBottom: `1px solid ${Cor.secundaria + 80}`,
          fontWeight: "700",
        }}
      >
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(
          Number(
            m.valoresRepasseSomadosTotal -
              resumoLancamentos.totalDescontos +
              resumoLancamentos.totalCreditos,
          ),
        )}
      </p>
      <div
        style={{
          width: "2%",
          aspectRatio: 1,
          backgroundColor: Cor.primaria,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() =>
          gerarExtratoPDF(
            m,
            acc,
            admin?.operadora.nome || "",
            String(formatarParaYMD(primeiroDia)),
            String(formatarParaYMD(ultimoDia)),
          )
        }
      >
        <p style={{ fontFamily: "Icone", color: Cor.base, fontWeight: "bold" }}>
          download
        </p>
      </div>
    </LinhaFaturamentoStyled>
  );
}

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
