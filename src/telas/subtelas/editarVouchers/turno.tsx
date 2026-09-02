import { useNavigate, useParams } from "react-router-dom";
import { useEditarVoucher } from "../../../hooks/useVouchers";
import { useTema } from "../../../hooks/temaContext";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { useEffect, useState } from "react";
import { useMotorista } from "../../../hooks/useMotorista";
import assPadrao from "../../../assets/image/not_sing.png";
import { usePassageiros } from "../../../hooks/usePassageiros";
import { useVoucherFixoId } from "../../../hooks/useVouchers";
import { usePedagios } from "../../../hooks/usePedagios";
import styled from "styled-components";
import { ModalSeletorPassageiro } from "../../../componentes/modalAdicionarPassageiros";
import { useListaModelosTurnoPrev } from "../../../hooks/useModelosTurnos";

export default function EditarVoucherTurno() {
  const { id } = useParams();
  const Cor = useTema().Cor;

  const { voucherFixoId } = useVoucherFixoId(atob(String(id)));

  const adminLogado = useAdminLogado();
  const [empresaCliente, setEmpresaCliente] = useState<any>(0);
  const [unidadeEmpresaCliente, setUnidadeEmpresaCliente] = useState<any>(0);
  const [modeloTurno, setModeloTurno] = useState<any>(0);
  const [motorista, setMotorista] = useState<any>(0);
  const [dataHoraProgramada, setDataHoraProgramada] = useState<any>(0);
  const [dataHoraFinalizcao, setDataHoraFinalizacao] = useState<any>(0);
  const [assinatura, setAssinatura] = useState<string>("");
  const [observacao, setObservacao] = useState<any>("");
  const [observacaoMotorista, setObservacaoMotorista] = useState<any>("");
  const [carregandoEmpresa, setCarregandoEmpresa] = useState<boolean>(false);
  const [passageirosVoucher, setPassageirosVoucher] = useState<any[]>([]);
  const [natureza, setNatureza] = useState("");
  const [tipo, setTipo] = useState("");
  const [origem, setOrigem] = useState<any>("");
  const [destino, setDestino] = useState<any>("");
  const [valorViagem, setValorViagem] = useState(0);
  const [valorViagemRepasse, setValorViagemRepasse] = useState(0);
  const [valorDeslocamento, setValorDeslocamento] = useState(0);
  const [valorDeslocamentoRepasse, setValorDeslocamentoRepasse] = useState(0);
  const [valorHoraParada, setValorHoraParada] = useState(0);
  const [valorHoraParadaRepasse, setValorHoraParadaRepasse] = useState(0);

  const [qntTempoParado, setQntTempoParado] = useState(0);

  const [valorPedagio, setValorPedagio] = useState("");

  const { listaPedagios } = usePedagios(String(adminLogado?.operadora?.id));

  const valorPedagioReal = listaPedagios?.find(
    (p: any) => p.id === valorPedagio,
  );

  useEffect(() => {
    if (!voucherFixoId) return;

    setEmpresaCliente(voucherFixoId?.empresaCliente?.id || 0);
    setUnidadeEmpresaCliente(voucherFixoId?.unidadeCliente?.id || 0);
    setModeloTurno(voucherFixoId?.modeloTurno?.id || 0);
    setMotorista(voucherFixoId?.motorista || null);
    setDataHoraProgramada(voucherFixoId?.dataHoraProgramado || "");
    setDataHoraFinalizacao(voucherFixoId?.dataHoraConclusao || "");
    setObservacao(voucherFixoId?.observacao || "");
    setObservacaoMotorista(voucherFixoId?.observacaoMotorista || "");
    setNatureza(voucherFixoId?.natureza || "");
    setTipo(voucherFixoId?.tipoCorrida || "");
    setAssinatura(voucherFixoId?.assinatura || "");
    setOrigem(voucherFixoId?.origem || "");
    setDestino(voucherFixoId?.destino || "");

    if (voucherFixoId?.status === "Concluido") {
      setPassageirosVoucher(voucherFixoId.passageiros);
    } else if (
      voucherFixoId?.passageiros &&
      Array.isArray(voucherFixoId?.passageiros)
    ) {
      const passageirosFormatados = voucherFixoId?.passageiros.map(
        (item: any) => {
          if (item.passageiroId) {
            return item.passageiroId;
          }
          return item;
        },
      );
      setPassageirosVoucher(passageirosFormatados);
    } else {
      setPassageirosVoucher([]);
    }

    setValorViagem(voucherFixoId?.valorViagem || 0);
    setValorViagemRepasse(voucherFixoId?.valorViagemRepasse || 0);
    setValorDeslocamento(voucherFixoId?.valorDeslocamento || 0);
    setValorDeslocamentoRepasse(voucherFixoId?.valorDeslocamentoRepasse || 0);
    setValorHoraParada(voucherFixoId?.valorHoraParada || 0);
    setValorHoraParadaRepasse(voucherFixoId?.valorHoraParadaRepasse || 0);
    setValorPedagio(voucherFixoId?.valorPedagio || 0);
    setQntTempoParado(voucherFixoId?.qntTempoParado || 0);
  }, [carregandoEmpresa, voucherFixoId]);

  const voucherAtualizado = {
    ...voucherFixoId,
    empresaClienteId: empresaCliente,
    unidadeClienteId: unidadeEmpresaCliente,
    modeloTurnoId: modeloTurno,
    motorista: motorista,
    dataHoraProgramado: dataHoraProgramada,
    dataHoraConclusao: dataHoraFinalizcao,
    dataHoraCriacao: new Date().toISOString(),
    adminUsuarioId: adminLogado?.id,
    assinatura: assinatura,
    observacao: observacao,
    observacaoMotorista: observacaoMotorista,
    natureza: natureza,
    tipoCorrida: tipo,
    origem: origem,
    destino: destino,
    passageiros: passageirosVoucher,
    valorViagem: valorViagem,
    valorViagemRepasse: valorViagemRepasse,
    valorDeslocamento: valorDeslocamento,
    valorDeslocamentoRepasse: valorDeslocamentoRepasse,
    valorHoraParada: valorHoraParada,
    valorHoraParadaRepasse: valorHoraParadaRepasse,
    valorPedagio: valorPedagioReal?.valor || 0,
    qntTempoParado: qntTempoParado,
  };

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
        <h3 style={{ color: Cor.textoTurno, fontSize: "20px" }}>
          Editar o Voucher Turno {atob(String(id))}
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
        unidadeCliente={unidadeEmpresaCliente}
        tipo={tipo}
        natureza={natureza}
        setEmpresaCliente={setEmpresaCliente}
        setUnidadeEmpresaCliente={setUnidadeEmpresaCliente}
        setTipo={setTipo}
        setNatureza={setNatureza}
        setCarregandoEmpresa={setCarregandoEmpresa}
        setOrigem={setOrigem}
        setDestino={setDestino}
        origem={origem}
        destino={destino}
        modeloTurno={modeloTurno}
        setModeloTurno={setModeloTurno}
      />
      <DetalhesDoVoucher
        motorista={motorista}
        setMotorista={setMotorista}
        dataHoraProgramada={dataHoraProgramada}
        setDataHoraProgramada={setDataHoraProgramada}
        dataHoraFinalizacao={dataHoraFinalizcao}
        observacao={observacao}
        setObservacao={setObservacao}
        observacaoMotorista={observacaoMotorista}
        carregandoEmpresa={carregandoEmpresa}
        assinatura={voucherFixoId?.assinatura || ""}
        status={voucherFixoId?.status || false}
        carro={voucherFixoId?.carro || ""}
      />
      <ValoresFixo
        valorViagem={valorViagem}
        setValorViagem={setValorViagem}
        valorViagemRepasse={valorViagemRepasse}
        setValorViagemRepasse={setValorViagemRepasse}
        valorDeslocamento={valorDeslocamento}
        setValorDeslocamento={setValorDeslocamento}
        valorDeslocamentoRepasse={valorDeslocamentoRepasse}
        setValorDeslocamentoRepasse={setValorDeslocamentoRepasse}
        valorHoraParada={valorHoraParada}
        setValorHoraParada={setValorHoraParada}
        valorHoraParadaRepasse={valorHoraParadaRepasse}
        setValorHoraParadaRepasse={setValorHoraParadaRepasse}
        pedagio={valorPedagio}
        setPedagio={setValorPedagio}
        qntTempoParado={qntTempoParado}
        setQntTempoParado={setQntTempoParado}
      />
      <IncluirPassageiros
        empresaCliente={empresaCliente}
        passageirosVoucher={passageirosVoucher}
        setPassageirosVoucher={setPassageirosVoucher}
        statusVoucher={voucherFixoId?.status || false}
      />
      <SalvarInformacoes v={voucherFixoId} vA={voucherAtualizado} />
    </div>
  );
}

function DadosGerais({
  empresaCliente,
  unidadeCliente,
  tipo,
  modeloTurno,
  natureza,
  setModeloTurno,
  setEmpresaCliente,
  setUnidadeEmpresaCliente,
  setTipo,
  setNatureza,
  setCarregandoEmpresa,
  setOrigem,
  setDestino,
  origem,
  destino,
}: {
  empresaCliente: any;
  unidadeCliente: any;
  tipo: any;
  natureza: any;
  modeloTurno: any;
  setModeloTurno: any;
  setEmpresaCliente: any;
  setUnidadeEmpresaCliente: any;
  setTipo: any;
  setNatureza: any;
  setCarregandoEmpresa: any;
  setOrigem: any;
  setDestino: any;
  origem: any;
  destino: any;
}) {
  const Cor = useTema().Cor;

  const operId = useAdminLogado()?.operadora.id;

  const { listaClientes: listaClientesTotal } = useListaClientes(operId || "0");
  const { listaModelosTurno } = useListaModelosTurnoPrev({
    empresaClienteId: empresaCliente,
  });

  const listaClientes = listaClientesTotal?.filter(
    (c: any) => c.statusCliente === true,
  );

  const { listaUnidades: listaUnidadesTotal, loading } = useUnidadeCliente(
    empresaCliente || "0",
  );

  const listaUnidades = listaUnidadesTotal?.filter(
    (u: any) => u.statusUnidadeCliente === true,
  );

  useEffect(() => {
    setCarregandoEmpresa(loading);
  }, [loading]);

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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno,
              fontWeight: "bold",
            }}
          >
            Principais Informações do Voucher
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            A baixo principais dados do voucher turno.
          </p>
        </div>
        <div
          style={{
            width: "78%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.textoTurno + 90,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Origem
            </p>
            <input
              placeholder="Origem"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              type="text"
              style={{
                width: "100%",
                color: Cor.texto1,
                padding: 10,
                borderRadius: 14,
                border: `1px solid ${Cor.texto2 + 50}`,
                outline: "none",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.textoTurno + 90,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Destino
            </p>
            <input
              placeholder="Destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              type="text"
              style={{
                width: "100%",
                color: Cor.texto1,
                padding: 10,
                borderRadius: 14,
                border: `1px solid ${Cor.texto2 + 50}`,
                outline: "none",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div
            style={{
              width: 200,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.textoTurno + 90,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Natureza
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
                onChange={(e) => setNatureza(e.target.value)}
                value={natureza}
              >
                <option
                  value={""}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  -
                </option>
                <option
                  value={"Fixo"}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  Fixo
                </option>
                <option
                  value={"Extra"}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  Extra
                </option>
                <option
                  value={"Turno"}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  Turno
                </option>
              </select>
            </div>
          </div>
          <div
            style={{
              width: 200,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.textoTurno + 90,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Tipo
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
                onChange={(e) => setTipo(e.target.value)}
                value={tipo}
              >
                <option
                  value={""}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  -
                </option>
                <option
                  value={"Entrada"}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  Entrada
                </option>
                <option
                  value={"Saida"}
                  style={{ backgroundColor: Cor.base2, color: Cor.texto2 }}
                >
                  Saída
                </option>
              </select>
            </div>
          </div>
        </div>
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
              color: Cor.textoTurno + 90,
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
              disabled
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
              color: Cor.textoTurno + 90,
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
              onChange={(e) => setUnidadeEmpresaCliente(e.target.value)}
              value={unidadeCliente}
              disabled
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
              color: Cor.textoTurno + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Cod. Turno:
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
              onChange={(e) => setModeloTurno(e.target.value)}
              value={modeloTurno}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione o Turno
              </option>
              {listaModelosTurno?.map((r: any) => {
                return (
                  <option
                    value={r?.id}
                    key={r?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {r?.nomeModelo}
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

function DetalhesDoVoucher({
  motorista,
  setMotorista,
  dataHoraProgramada,
  setDataHoraProgramada,
  dataHoraFinalizacao,
  observacao,
  setObservacao,
  observacaoMotorista,
  carregandoEmpresa,
  assinatura,
  status,
  carro,
}: {
  motorista: any;
  setMotorista: any;
  dataHoraProgramada: any;
  setDataHoraProgramada: any;
  dataHoraFinalizacao: any;
  observacao: any;
  setObservacao: any;
  observacaoMotorista: any;
  carregandoEmpresa: any;
  assinatura: any;
  status: any;
  carro: any;
}) {
  const Cor = useTema().Cor;

  const operId = useAdminLogado()?.operadora.id;

  const { listaMotoristas } = useMotorista(operId);

  const formatarParaInputProg = (dataString: any) => {
    if (!dataString) return "";
    return dataString.substring(0, 16);
  };

  const formatarParaInputFin = (dataString: any) => {
    if (!dataString) return "";

    const data = new Date(dataString);

    if (isNaN(data.getTime())) return "";

    const timezoneOffset = data.getTimezoneOffset() * 60000;

    const dataLocal = new Date(data.getTime() - timezoneOffset);

    return dataLocal.toISOString().substring(0, 16);
  };

  useEffect(() => {}, [motorista, setMotorista]);

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: carregandoEmpresa ? 0.5 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "60%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
              Detalhes da viagem: Rota, Motorista, Data e Hora Programado, Data
              e Hora Finalizado.
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 15,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", width: "40%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Motorista Entrada:
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
                    opacity:
                      status === "Concluido" || status === "Cancelado"
                        ? 0.5
                        : 1,
                  }}
                  disabled={status === "Concluido" || status === "Cancelado"}
                  onChange={(e) => {
                    const idSelecionado = e.target.value;
                    if (!idSelecionado) {
                      setMotorista(null);
                    } else {
                      const motoristaCompleto = listaMotoristas?.find(
                        (m: any) => String(m.id) === String(idSelecionado),
                      );
                      setMotorista(motoristaCompleto);
                    }
                  }}
                  value={motorista?.id || 0}
                >
                  <option
                    value=""
                    style={{
                      backgroundColor: Cor.base2,
                      color: Cor.texto2 + 70,
                    }}
                  >
                    Selecione um Motorista
                  </option>
                  {listaMotoristas?.map((motorista: any) => {
                    return (
                      <option
                        value={motorista?.id}
                        key={motorista?.id}
                        style={{
                          backgroundColor: Cor.base2,
                        }}
                      >
                        {motorista?.nome}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", width: "30%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Data/Hora Programação:
              </p>
              <div
                style={{
                  width: "100%",
                  border: `1px solid ${Cor.texto2 + 50}`,
                  padding: 10,
                  borderRadius: 14,
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <input
                  type="datetime-local"
                  style={{
                    backgroundColor: "transparent",
                    color: Cor.texto1,
                    width: "100%",
                    outline: "none",
                    border: "none",
                    zIndex: 8,
                  }}
                  value={formatarParaInputProg(dataHoraProgramada)}
                  onChange={(e: any) => {
                    setDataHoraProgramada(`${e.target.value}:00.000Z`);
                  }}
                />
                <div
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: "#F4F4F4",
                    borderRadius: 22,
                    position: "absolute",
                    right: 6,
                    alignSelf: "center",
                  }}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", width: "30%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color:
                    status === "Concluido" ? Cor.textoTurno + "CC" : Cor.texto2,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Data/Hora Finalização:
              </p>
              <div
                style={{
                  width: "100%",
                  border: `1px solid ${Cor.texto2 + 50}`,
                  padding: 10,
                  backgroundColor:
                    status === "Concluido" ? Cor.ativo + 30 : "transparent",
                  borderRadius: 14,
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <input
                  type="datetime-local"
                  style={{
                    backgroundColor: "transparent",
                    color: status === "Concluido" ? Cor.ativo : Cor.texto1,
                    fontWeight: status === "Concluido" ? "bold" : "normal",
                    width: "100%",
                    outline: "none",
                    border: "none",
                    zIndex: 8,
                  }}
                  value={formatarParaInputFin(dataHoraFinalizacao)}
                  onChange={() => {
                    // setDataHoraEntrada(`${e.target.value}:00.000Z`);
                  }}
                />
                <div
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: "#F4F4F4",
                    borderRadius: 22,
                    position: "absolute",
                    right: 6,
                    alignSelf: "center",
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Obsercação
              </p>
              <input
                placeholder="Digite aqui sua observação..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                type="text"
                style={{
                  width: "100%",
                  color: Cor.texto1,
                  padding: 10,
                  borderRadius: 14,
                  border: `1px solid ${Cor.texto2 + 50}`,
                  outline: "none",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Obsercação do Motorista
              </p>
              <input
                placeholder="Sem Observação do Motorista"
                value={observacaoMotorista}
                readOnly
                type="text"
                style={{
                  width: "100%",
                  color: Cor.texto1,
                  padding: 10,
                  borderRadius: 14,
                  border: `1px solid ${Cor.secundaria + 50}`,
                  outline: "none",
                  backgroundColor:
                    observacaoMotorista !== ""
                      ? Cor.primaria + 60
                      : "transparent",
                  fontWeight: "bold",
                }}
              />
            </div>
          </div>
        </div>
        <Assinatura v={assinatura} />
        <DetalhesCarro carro={carro} motorista={motorista} />
      </div>
    </div>
  );
}

function DetalhesCarro({ carro, motorista }: { carro: any; motorista: any }) {
  const Cor = useTema().Cor;
  const normalize = (text: string) => {
    if (!text) return "";
    return text
      .normalize("NFD") // separa acento
      .replace(/[\u0300-\u036f]/g, "") // remove acento
      .toLowerCase()
      .replace(/\s+/g, "_"); // troca espaços por _
  };

  const imgCarro = carro
    ? `https://cdn.neofrota.com/storage/v1/object/public/neofrotabkt/carros/${normalize(carro.marca)}/${normalize(carro.modelo)}/${normalize(carro.cor)}.png`
    : "";

  return (
    <div
      style={{
        width: "20%",
        backgroundColor: Cor.texto2 + 20,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 5,
        padding: 10,
        border: `1px solid ${Cor.texto2 + 20}`,
        scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        {imgCarro ? (
          <img
            src={imgCarro}
            alt="Foto do Carro"
            style={{ width: "60%", objectFit: "contain" }}
          />
        ) : null}
        {motorista?.fotoMotorista ? (
          <img
            src={motorista?.fotoMotorista}
            alt="Foto do Motorista"
            style={{ width: "30%", objectFit: "cover", borderRadius: 5 }}
          />
        ) : null}
      </div>
      <div style={{ width: "100%", height: 1, backgroundColor: Cor.texto2 }} />
      <p
        style={{
          fontSize: 14,
          color: Cor.texto1,
          fontWeight: "bold",
          margin: 5,
        }}
      >
        Carro: {carro.marca} {carro.modelo}
      </p>
      <p
        style={{
          fontSize: 14,
          color: Cor.texto1,
          fontWeight: "bold",
          margin: 5,
        }}
      >
        Placa: {carro.placa}
      </p>
      <div
        style={{
          width: "100%",
          backgroundColor:
            motorista?.statusCnh === true ? Cor.ativo + 20 : Cor.inativo + 20,
          padding: 5,
          borderRadius: 8,
          border: `1px solid ${motorista?.statusCnh === true ? Cor.ativo + 30 : Cor.inativo + 80}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: motorista?.statusCnh === true ? Cor.ativo : Cor.inativo,
            fontWeight: "bold",
          }}
        >
          CNH - {motorista?.statusCnh === true ? "Válida" : "Vencida"}
        </p>
      </div>
      <div
        style={{
          width: "100%",
          backgroundColor:
            carro.vCrlv === true ? Cor.ativo + 20 : Cor.inativo + 20,
          padding: 5,
          borderRadius: 8,
          border: `1px solid ${carro.vCrlv === true ? Cor.ativo + 30 : Cor.inativo + 80}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: carro.vCrlv === true ? Cor.ativo : Cor.inativo,
            fontWeight: "bold",
          }}
        >
          CRLV - {carro.vCrlv === true ? "Válida" : "Vencida"}
        </p>
      </div>
    </div>
  );
}

function Assinatura({ v }: { v: any }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "20%",
        backgroundColor: Cor.texto2 + 20,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        padding: 10,
        border: `1px solid ${Cor.texto2 + 20}`,
        scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
      }}
    >
      <p style={{ fontSize: 12, color: Cor.texto1 }}>Assinatura:</p>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 10,
          backgroundColor: Cor.texto2 + 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <img
          src={v || assPadrao}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#f4f4f4",
          }}
        />
      </div>
    </div>
  );
}

function IncluirPassageiros({
  statusVoucher,
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
}: {
  statusVoucher: any;
  empresaCliente: any;
  passageirosVoucher: any;
  setPassageirosVoucher: any;
}) {
  const Cor = useTema().Cor;

  const desabilitado = !passageirosVoucher || passageirosVoucher.length === 0;
  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        gap: 15,
        justifyContent: "space-between",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno,
              fontWeight: "bold",
            }}
          >
            Passageiros:
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Adicione abaixo os Passageiros ao voucher.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            height: 35,
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>
            Total de Passageiros adicionados{" "}
            <strong style={{ fontSize: 14, color: Cor.textoTurno }}>
              {passageirosVoucher.length}
            </strong>
          </p>
          {statusVoucher === "Aberto" ? (
            <>
              <SeletorPassageiro
                empresaCliente={empresaCliente}
                passageirosVoucher={passageirosVoucher}
                setPassageirosVoucher={setPassageirosVoucher}
              />
              <button
                disabled={desabilitado}
                style={{
                  aspectRatio: 1,
                  width: 35,
                  backgroundColor: desabilitado
                    ? Cor.texto2 + 50
                    : Cor.atencao + 50,
                  display: "flex",
                  border: "none",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                  cursor: desabilitado ? "default" : "pointer",
                }}
                onClick={() => setPassageirosVoucher([])}
              >
                <p
                  style={{
                    fontFamily: "Icone",
                    fontWeight: "bold",
                    color: desabilitado ? Cor.texto2 : Cor.atencao,
                  }}
                >
                  delete
                </p>
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 250,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          backgroundColor: Cor.base,
          borderRadius: 22,
          boxShadow: Cor.sombra,
          gap: 5,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {passageirosVoucher.map((passageiro: any) => {
          const selecionado = passageirosVoucher.some(
            (p: any) => p.id === passageiro.id,
          );
          if (statusVoucher === "Concluido" || statusVoucher === "Cancelado") {
            return <CardPassageiroVoucher key={passageiro.id} p={passageiro} />;
          } else {
            return (
              <LinhaPassageiro
                passageiro={passageiro}
                selecionado={false}
                btnAdd={selecionado}
                setPassageirosVoucher={setPassageirosVoucher}
                key={passageiro.id}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

function SeletorPassageiro({
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
}: {
  empresaCliente: any;
  passageirosVoucher: any;
  setPassageirosVoucher: any;
}) {
  const { listaPassageiro } = usePassageiros(empresaCliente ?? "");

  const desabilitado = !listaPassageiro || listaPassageiro.length === 0;

  const [cxPesquisa, setCxPesquisa] = useState<boolean>(false);

  const { Cor } = useTema();

  return (
    <>
      <button
        disabled={desabilitado}
        style={{
          height: 35,
          backgroundColor: desabilitado ? Cor.texto2 + 50 : Cor.fixo + 50,
          color: desabilitado ? Cor.texto2 : Cor.textoTurno,
          border: "none",
          padding: "8px 25px",
          borderRadius: 12,
          cursor: desabilitado ? "default" : "pointer",
          fontWeight: 700,
        }}
        onClick={() => {
          setCxPesquisa(true);
        }}
      >
        Pesquisar
      </button>
      <ModalSeletorPassageiro
        empresaCliente={empresaCliente}
        passageirosVoucher={passageirosVoucher}
        setPassageirosVoucher={setPassageirosVoucher}
        setCxPesquisa={setCxPesquisa}
        cxPesquisa={cxPesquisa}
      />
    </>
  );
}

function LinhaPassageiro({
  passageiro,
  selecionado,
  setPassageirosVoucher,
  btnAdd,
}: {
  passageiro: any;
  selecionado: boolean;
  setPassageirosVoucher: any;
  btnAdd: any;
}) {
  const Cor = useTema().Cor;

  const adicionarPassageiro = (passageiro: any) => {
    setPassageirosVoucher((prev: any) => {
      const existe = prev.some((p: any) => p.id === passageiro.id);

      if (existe) {
        return prev.filter((p: any) => p.id !== passageiro.id);
      }

      return [...prev, passageiro];
    });
  };

  return (
    <>
      <div
        key={passageiro.id}
        style={{
          width: "100%",
          height: 40,
          border: `1px solid ${Cor.texto2 + 30}`,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          borderRadius: 8,
          backgroundColor: selecionado ? Cor.primaria + 50 : Cor.base2,
          boxShadow: btnAdd ? Cor.sombra : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
            marginRight: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Nome
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.nome}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
            marginRight: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Endereço
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.endRua}, {passageiro.endBairro}, {passageiro.endCidade}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
            marginRight: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Centro de Custo
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro?.centroCustoClienteId?.nome || ""}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "8%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Horário
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.horarioEmbarque}
          </p>
        </div>
        <div
          style={{
            width: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
            borderRadius: 8,
            backgroundColor: btnAdd ? Cor.primaria + 90 : Cor.primaria + 50,
            cursor: "pointer",
          }}
          onClick={() => adicionarPassageiro(passageiro)}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              fontSize: 20,
              color: Cor.primariaTxt,
            }}
          >
            {btnAdd ? "close" : "add"}
          </p>
        </div>
      </div>
    </>
  );
}

function CardPassageiroVoucher({ p }: { p: any }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        height: 45,
        width: "100%",
        backgroundColor:
          p.statusPresenca === "Ausente" ? Cor.atencao + 50 : Cor.base,
        borderRadius: 10,
        border: `1px solid ${Cor.texto2 + 40}`,
        padding: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "28%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Tipo</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "95%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {p?.passageiroId?.nome}
        </p>
      </div>
      <div style={{ width: 1, height: "100%", backgroundColor: Cor.texto2 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "14%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Telefone</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "95%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {p?.passageiroId?.telefone}
        </p>
      </div>
      <div style={{ width: 1, height: "100%", backgroundColor: Cor.texto2 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "8%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Horário</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "95%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {p?.passageiroId?.horarioEmbarque}
        </p>
      </div>
      <div style={{ width: 1, height: "100%", backgroundColor: Cor.texto2 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "45%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Endereço</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {p?.passageiroId?.endRua}, {p?.passageiroId?.endNumero} -{" "}
          {p?.passageiroId?.endBairro} - {p?.passageiroId?.endCidade}
        </p>
      </div>
    </div>
  );
}

function ValoresFixo({
  valorViagem,
  setValorViagem,
  valorViagemRepasse,
  setValorViagemRepasse,
  valorDeslocamento,
  setValorDeslocamento,
  valorDeslocamentoRepasse,
  setValorDeslocamentoRepasse,
  valorHoraParada,
  setValorHoraParada,
  valorHoraParadaRepasse,
  setValorHoraParadaRepasse,
  pedagio,
  setPedagio,
  qntTempoParado,
  setQntTempoParado,
}: {
  valorViagem: any;
  setValorViagem: any;
  valorViagemRepasse: any;
  setValorViagemRepasse: any;
  valorDeslocamento: any;
  setValorDeslocamento: any;
  valorDeslocamentoRepasse: any;
  setValorDeslocamentoRepasse: any;
  valorHoraParada: any;
  setValorHoraParada: any;
  valorHoraParadaRepasse: any;
  setValorHoraParadaRepasse: any;
  pedagio: any;
  setPedagio: any;
  qntTempoParado: any;
  setQntTempoParado: any;
}) {
  const { Cor } = useTema();

  const operadoraId = useAdminLogado()?.operadora.id;

  const { listaPedagios } = usePedagios(String(operadoraId));

  const valorPedagio = listaPedagios.filter((p: any) => p.id === pedagio);

  const pedagioReal = valorPedagio[0]?.valor || 0;

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.textoTurno,
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
        <div style={{ display: "flex", flexDirection: "column", width: "22%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor Total:
          </p>
          <div
            style={{
              width: "100%",
              border: `2px solid ${Cor.textoTurno + 99}`,
              padding: 10,
              borderRadius: 14,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  readOnly
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    color: Cor.textoTurno,
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                  value={
                    Number(valorViagem || 0) +
                    Number(pedagioReal || 0) +
                    Number(valorDeslocamento || 0) +
                    Number(valorHoraParada || 0) * Number(qntTempoParado || 0)
                  }
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoTurno }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  readOnly
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: 20,
                    color: Cor.textoTurno,
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                  }}
                  value={
                    Number(valorViagemRepasse || 0) +
                    Number(pedagioReal || 0) +
                    Number(valorDeslocamentoRepasse || 0) +
                    Number(valorHoraParadaRepasse || 0) *
                      Number(qntTempoParado || 0)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor da Viagem:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    backgroundColor: "transparent",
                    color: Cor.texto1,
                    fontSize: 14,
                  }}
                  value={valorViagem || ""}
                  onChange={(e) => setValorViagem(e.target.value)}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoTurno }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                  value={valorViagemRepasse || ""}
                  onChange={(e) => setValorViagemRepasse(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + 90,
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
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "transparent",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                  value={valorDeslocamento || ""}
                  onChange={(e) => setValorDeslocamento(e.target.value)}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoTurno }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                  value={valorDeslocamentoRepasse || ""}
                  onChange={(e) => setValorDeslocamentoRepasse(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + 90,
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
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Tempo</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <input
                  placeholder="0"
                  style={{
                    width: "30%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                  value={qntTempoParado || ""}
                  onChange={(e) => setQntTempoParado(e.target.value)}
                />
                <span style={{ fontSize: 14, color: Cor.texto1 }}>
                  {qntTempoParado > 1 ? "horas" : "hora"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                  value={valorHoraParada * qntTempoParado || ""}
                  onChange={(e) => setValorHoraParada(e.target.value)}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoTurno }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                  value={valorHoraParadaRepasse * qntTempoParado || ""}
                  onChange={(e) => setValorHoraParadaRepasse(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoTurno + 90,
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
            <select
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={pedagio || ""}
              onChange={(e) => setPedagio(e.target.value)}
            >
              <option value="">Selecione</option>
              {listaPedagios.map((p: any) => {
                return (
                  <option
                    style={{ backgroundColor: Cor.base }}
                    value={p.id}
                    key={p.id}
                  >
                    {p.nome}
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

function SalvarInformacoes({ v, vA }: { v: any; vA: any }) {
  const { editar, loading } = useEditarVoucher();

  const Cor = useTema().Cor;
  const navigate = useNavigate();

  const adminLogado = useAdminLogado();

  const editarVoucherCompleto = async () => {
    try {
      // 1. Funções de segurança para limpar dados inválidos
      // Transforma 0 em undefined para que o filtro final o remova (evita erro em DateTime)
      const checkZero = (val: any) =>
        val === 0 || val === "" ? undefined : val;
      // Força IDs a serem Strings (Apollo lida melhor) e remove se for 0
      const formatId = (val: any) =>
        val && val !== 0 && val !== "" ? String(val) : undefined;

      // 2. Montagem segura do Payload
      const inputBruto = {
        id: String(vA.id), // ID principal obrigatório
        origem: vA.origem,
        destino: vA.destino,

        // Datas protegidas contra o '0' do useState
        dataHoraProgramado: checkZero(vA.dataHoraProgramado),
        dataHoraConclusao: checkZero(vA.dataHoraConclusao),
        dataHoraCriacao: new Date().toISOString(),
        qntTempoParado:
          vA.qntTempoParado === null ? null : Number(vA.qntTempoParado),

        // Valores numéricos
        valorViagem: vA.valorViagem ? parseFloat(vA.valorViagem) : undefined,
        valorViagemRepasse: vA.valorViagemRepasse
          ? parseFloat(vA.valorViagemRepasse)
          : undefined,
        valorDeslocamento: vA.valorDeslocamento
          ? parseFloat(vA.valorDeslocamento)
          : undefined,
        valorDeslocamentoRepasse: vA.valorDeslocamentoRepasse
          ? parseFloat(vA.valorDeslocamentoRepasse)
          : undefined,
        valorHoraParada: vA.valorHoraParada
          ? parseFloat(vA.valorHoraParada)
          : undefined,
        valorHoraParadaRepasse: vA.valorHoraParadaRepasse
          ? parseFloat(vA.valorHoraParadaRepasse)
          : undefined,
        valorPedagio: vA.valorPedagio ? parseFloat(vA.valorPedagio) : undefined,
        valorEstacionamento: vA.valorEstacionamento
          ? parseFloat(vA.valorEstacionamento)
          : undefined,

        assinatura: vA.assinatura,
        observacaoMotorista: vA.observacaoMotorista,
        observacao: vA.observacao,
        natureza: vA.natureza,
        tipoCorrida: vA.tipoCorrida,
        status: vA.status,

        // 3. Relações protegidas pelo formatId
        empresaClienteId: formatId(
          vA.empresaClienteId || vA.empresaCliente?.id,
        ),
        unidadeClienteId: formatId(
          vA.unidadeClienteId || vA.unidadeCliente?.id,
        ),
        modeloFixoId: null,
        rotaId: formatId(vA.rota || vA.rotaId || vA.rota?.id),
        solicitanteId: formatId(
          vA.solicitante || vA.solicitanteId || vA.solicitante?.id,
        ),
        adminUsuarioId: adminLogado?.id || 0,
        carroId: formatId(vA.carroId || vA.carro?.id),
        operadoraId: formatId(vA.operadoraId || vA.operadora?.id),
        modeloTurnoId: null,

        motoristaId: formatId(
          typeof vA.motorista === "object"
            ? vA.motorista?.id
            : vA.motorista || vA.motoristaId,
        ),

        passageiros:
          vA.passageiros !== undefined
            ? vA.passageiros.map((p: any) => {
                const isExistente = !!p.passageiroId;

                return {
                  id: isExistente ? String(p.id) : undefined,

                  passageiroId: isExistente
                    ? String(p.passageiroId?.id || p.passageiroId)
                    : String(p.id),

                  horarioEmbarqueReal: checkZero(p.horarioEmbarqueReal),
                  rateio: p.rateio ? parseFloat(p.rateio) : undefined,
                  statusPresenca: p.statusPresenca || "Agendado",
                };
              })
            : undefined,
      };

      const cleanInput = Object.fromEntries(
        Object.entries(inputBruto).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );

      console.log("Payload enviado para API:", cleanInput); // Útil para debugar

      // 6. Executa a mutation
      const resultado = await editar(cleanInput);
      console.log("Voucher editado com sucesso!", resultado);
      navigate(-1);
    } catch (error) {
      console.error("Erro ao editar voucher:", error);
      alert("Erro ao editar voucher");
    }
  };

  const cancelarVoucher = async () => {
    try {
      const resultado = await editar({
        id: String(vA.id),
        status: "Cancelado",
      });
      console.log("Voucher editado com sucesso!", resultado);
      navigate(-1);
    } catch (error) {
      console.error("Erro ao editar voucher:", error);
      alert("Erro ao editar voucher");
    }
  };

  const redefinirVoucher = async () => {
    try {
      const resultado = await editar({
        id: String(vA.id),
        status: "Aberto",
        assinatura: null,
        dataHoraConclusao: null,
        passageiros:
          vA.passageiros?.length > 0
            ? vA.passageiros.map((p: any) => {
                if (typeof p !== "object") {
                  return { id: String(p) };
                }
                return {
                  id: String(p.id || p.passageiroId),
                  horarioEmbarqueReal: null,
                  rateio: null,
                  statusPresenca: "Agendado",
                };
              })
            : undefined,
      });
      console.log("Voucher editado com sucesso!", resultado);
      navigate(-1);
    } catch (error) {
      console.error("Erro ao editar voucher:", error);
      alert("Erro ao editar voucher");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <p
        style={{
          fontSize: 14,
          color: Cor.texto1,
          margin: 5,
        }}
      >
        Lançado Por: <strong>{v?.adminUsuario.nome || ""}</strong> | Criado em:{" "}
        {new Date(v?.dataHoraCriacao).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}{" "}
        às{" "}
        {new Date(v?.dataHoraCriacao).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
        })}
        h
      </p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <BtnVouchers $bg={Cor.atencao} onClick={cancelarVoucher}>
          <p>Cancelar</p>
        </BtnVouchers>
        <BtnVouchers $bg={Cor.ativo} onClick={redefinirVoucher}>
          <p>Redefinir</p>
        </BtnVouchers>
        <BtnVouchers $bg={Cor.secundaria}>Fechar</BtnVouchers>
        <div style={{ width: "50%" }} />
        <BtnSalvarStyle $cor={Cor.primaria} onClick={editarVoucherCompleto}>
          <p style={{ color: Cor.primariaTxt }}>
            {loading ? "Salvando..." : "Salvar"}
          </p>
        </BtnSalvarStyle>
        <BtnSairStyle
          $cor={Cor.atencao}
          onClick={() => {
            navigate(-1);
          }}
        >
          Sair
        </BtnSairStyle>
      </div>
    </div>
  );
}

interface BtnVouchers {
  $bg: string;
}

const BtnVouchers = styled.div<BtnVouchers>`
  width: 15%;
  padding: 15px;
  background-color: ${({ $bg }) => $bg + 50};
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: ${({ $bg }) => $bg};
  border: 1px solid ${({ $bg }) => $bg + 50};
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${({ $bg }) => $bg + 90};
    scale: 1.02;
  }

  &:active {
    background-color: ${({ $bg }) => $bg + 70};
    scale: 0.98;
  }
`;

interface BtnSairProps {
  $cor: string;
}

const BtnSairStyle = styled.button<BtnSairProps>`
  padding: 15px 50px;
  border-radius: 18px;
  outline: none;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $cor }) => $cor};
  border: 1px solid ${({ $cor }) => $cor};
  background-color: ${({ $cor }) => $cor + 50};
  position: absolute;
  bottom: 30px;
  right: 35px;
  backdrop-filter: blur(3px);
  cursor: pointer;
  transition: all ease-in-out 0.2s;
  user-select: none;

  &:hover {
    background-color: ${({ $cor }) => $cor + 90};
  }
`;

interface BtnSalvarProps {
  $cor: string;
}

const BtnSalvarStyle = styled.button<BtnSalvarProps>`
  padding: 15px 50px;
  border-radius: 18px;
  outline: none;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid ${({ $cor }) => $cor};
  background-color: ${({ $cor }) => $cor + 50};
  position: absolute;
  bottom: 30px;
  right: 170px;
  backdrop-filter: blur(3px);
  cursor: pointer;
  transition: all ease-in-out 0.2s;
  user-select: none;

  &:hover {
    background-color: ${({ $cor }) => $cor + 90};
  }
`;
