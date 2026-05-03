import { useEffect, useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { usePedagios } from "../../../hooks/usePedagios";
import { useMotorista } from "../../../hooks/useMotorista";
import styled from "styled-components";
import { usePassageiros } from "../../../hooks/usePassageiros";
import BtnCriarPassageiro from "../empresaCliente/btnComponentes/criarPassageiro";
import { useCarroAtrelado } from "../../../hooks/useCarros";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import React from "react";
import { ptBR } from "date-fns/locale";
import { useModeloTurno } from "../../../hooks/useModelosTurnos";
import { useGerarVouchersEmMassa } from "../../../hooks/useVouchers";

export function GerarVouchersTurno() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <NovoVoucherTurnoConteudo />
      </>
    ),
  });
}

function NovoVoucherTurnoConteudo() {
  const { TurnoId } = useParams();

  const { mTurno, loading: CarregandoDados } = useModeloTurno(
    atob(`${TurnoId}`),
  );

  const [empresaCliente, setEmpresaCliente] = useState("");
  const [unidadeCliente, setUnidadeCliente] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");

  const [valorViagem, setValorViagem] = useState(0);
  const [valorViagemRepasse, setValorViagemRepasse] = useState(0);
  const [valorDeslocamento, setValorDeslocamento] = useState(0);
  const [valorDeslocamentoRepasse, setValorDeslocamentoRepasse] = useState(0);
  const [valorHoraParada, setValorHoraParada] = useState(0);
  const [valorHoraParadaRepasse, setValorHoraParadaRepasse] = useState(0);

  const [valorPedagio, setValorPedagio] = useState("");

  useEffect(() => {
    if (mTurno) {
      setEmpresaCliente(mTurno.empresaCliente?.id || "");
      setUnidadeCliente(mTurno.unidadeCliente?.id || "");
      setNomeModelo(mTurno.nomeModelo || "");
      setOrigem(mTurno.origem || "");
      setDestino(mTurno.destino || "");
      const rotaOrigem = mTurno.origem || "";
      const rotaDestino = mTurno.destino || "";

      setConfigEntrada((prev) => ({
        ...prev,
        origem: rotaOrigem,
        destino: rotaDestino,
      }));

      // Atualiza a Configuração de Saída (Rota Invertida)
      setConfigSaida((prev) => ({
        ...prev,
        origem: rotaDestino, // O destino vira origem
        destino: rotaOrigem, // A origem vira destino
      }));

      // Valores numéricos
      setValorViagem(mTurno.valorViagem || 0);
      setValorViagemRepasse(mTurno.valorViagemRepasse || 0);
      setValorDeslocamento(mTurno?.valorDeslocamento || 0);
      setValorDeslocamentoRepasse(mTurno?.valorDeslocamentoRepasse || 0);
      setValorHoraParada(mTurno?.valorHoraParada || 0);
      setValorHoraParadaRepasse(mTurno?.valorHoraParadaRepasse || 0);

      // Correção Pedágio (pegando o ID)
      setValorPedagio(mTurno.pedagio?.id || "");

      // Correção Passageiros (extraindo IDs do array de objetos)
      const passageirosAtual =
        mTurno?.passageirosTurno?.map((p: any) => {
          return p.passageiro;
        }) || [];
      setPassageirosVoucher(passageirosAtual);
    }
  }, [mTurno]);

  const [configEntrada, setConfigEntrada] = useState({
    tipo: "Entrada",
    natureza: "Turno",
    origem: "",
    destino: "",
    programacoes: [],
  });

  const [configSaida, setConfigSaida] = useState({
    tipo: "Saida",
    natureza: "Turno",
    origem: "",
    destino: "",
    programacoes: [],
  });

  const [passageirosVoucher, setPassageirosVoucher] = useState<any[]>([]);

  const passageirosMapeados = passageirosVoucher.map((p: any) => ({
    passageiroId: String(p.id), // Envie apenas o ID, não o objeto completo
  }));

  const { Cor } = useTema();

  const operadoraId = useAdminLogado()?.operadora.id;
  const adminId = useAdminLogado()?.id;

  const gerarPayloadMassa = () => {
    const vouchers: any = [];

    // Função auxiliar para montar o objeto individual
    const montarVoucher = (config: any, prog: any) => ({
      adminUsuarioId: String(adminId),
      operadoraId: String(operadoraId),
      empresaClienteId: String(empresaCliente),
      unidadeClienteId: String(unidadeCliente),
      modeloTurnoId: String(mTurno?.id), // ID do modelo original
      solicitanteId: String(adminId), // Adicione esta linha no objeto do voucher
      origem: config.origem || origem, // Usa a da config ou a padrão do modelo
      destino: config.destino || destino,
      natureza: config.natureza,
      tipoCorrida: config.tipo,

      // Dados da Programação específica
      motoristaId: prog.motoristaId?.id,
      carroId: Number(prog.carroId?.id),
      dataHoraProgramado: prog.dataHoraProgramação,

      // Valores financeiros
      valorViagem: Number(valorViagem),
      valorViagemRepasse: Number(valorViagemRepasse),
      valorDeslocamento: Number(valorDeslocamento),
      valorDeslocamentoRepasse: Number(valorDeslocamentoRepasse),
      valorHoraParada: Number(valorHoraParada),
      valorHoraParadaRepasse: Number(valorHoraParadaRepasse),
      valorPedagio: valorPedagio ? Number(valorPedagio) : null,

      // Passageiros
      passageiros: passageirosMapeados, // [{ passageiroId: '4' }, ...]
    });

    // Processa Entrada
    configEntrada.programacoes.forEach((prog) => {
      vouchers.push(montarVoucher(configEntrada, prog));
    });

    // Processa Saída
    configSaida.programacoes.forEach((prog) => {
      vouchers.push(montarVoucher(configSaida, prog));
    });

    return vouchers;
  };

  const { gerar, loading } = useGerarVouchersEmMassa();

  const navigate = useNavigate();

  async function criarVouchersEmMassaFunc() {
    const listaVouchers = gerarPayloadMassa();

    if (listaVouchers.length === 0) {
      alert("Adicione pelo menos uma programação!");
      return;
    }

    await gerar(listaVouchers);

    navigate("/modelosvouchersturnos");
  }

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
      {CarregandoDados ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Cor.base2 + 90,
            position: "absolute",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <CircularProgress
            size={24}
            thickness={8}
            sx={{
              color: Cor.turno,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </div>
      ) : null}
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
          Novo Roteiro Turno
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
        unidadeCliente={unidadeCliente}
        nomeModelo={nomeModelo}
        origem={origem}
        destino={destino}
      />
      <ValoresFixo
        valorDeslocamento={valorDeslocamento}
        valorDeslocamentoRepasse={valorDeslocamentoRepasse}
        valorHoraParada={valorHoraParada}
        valorHoraParadaRepasse={valorHoraParadaRepasse}
        valorPedagio={valorPedagio}
        valorViagem={valorViagem}
        valorViagemRepasse={valorViagemRepasse}
        setValorDeslocamento={setValorDeslocamento}
        setValorDeslocamentoRepasse={setValorDeslocamentoRepasse}
      />
      <IncluirPassageiros
        empresaCliente={empresaCliente}
        setPassageirosVoucher={setPassageirosVoucher}
        passageirosVoucher={passageirosVoucher}
      />
      <DetalhesEntrada
        configEntrada={configEntrada}
        setConfigEntrada={setConfigEntrada}
      />
      <DetalhesSaida
        configSaida={configSaida}
        setConfigSaida={setConfigSaida}
      />
      <BtnSalvar
        $cor={Cor.turno}
        $texto={Cor.textoTurno}
        onClick={() => criarVouchersEmMassaFunc()}
      >
        <p>Gerar</p>
        {loading ? (
          <CircularProgress
            size={24}
            thickness={8}
            sx={{
              color: Cor.turno,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        ) : (
          <p style={{ fontFamily: "Icone", fontSize: 24 }}>resume</p>
        )}
      </BtnSalvar>
    </div>
  );
}

interface BtnSalvarProps {
  $cor: string;
  $texto: string;
}

const BtnSalvar = styled.div<BtnSalvarProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  background-color: ${({ $cor }) => $cor}70;
  padding: 10px 50px;
  border: 1px solid ${({ $cor }) => $cor}CC;
  color: ${({ $texto }) => $texto};
  border-radius: 18px;
  font-weight: bolder;
  cursor: pointer;
  transition: ease-in-out all 0.2s;
  user-select: none;

  &:hover {
    scale: 1.03;
    background-color: ${({ $cor }) => $cor}BB;
    border: 1px solid ${({ $cor }) => $cor}EE;
  }

  &:active {
    scale: 0.97;
    background-color: ${({ $cor }) => $cor};
    border: 1px solid ${({ $cor }) => $cor}EE;
  }
`;

function DadosGerais({
  origem,
  destino,
  empresaCliente,
  unidadeCliente,
  nomeModelo,
}: {
  origem: string;
  destino: string;
  empresaCliente: string;
  unidadeCliente: string;
  nomeModelo: string;
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
            Criar Novo Roteiro Turno
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Preencha a baixo os dados Gerais para criar um novo roteiro turno.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "60%",
            justifyContent: "flex-end",
            gap: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "50%",
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
              Origem:
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
                placeholder="Origem"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: Cor.texto1,
                }}
                value={origem}
                readOnly
              />
            </div>
          </div>
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 35,
              color: Cor.turno,
              userSelect: "none",
            }}
          >
            start
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "50%",
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
              Destino:
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
                placeholder="Destino"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: Cor.texto1,
                }}
                value={destino}
                readOnly
                disabled
              />
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
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={nomeModelo}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ValoresFixo({
  valorViagem,
  valorViagemRepasse,
  valorDeslocamento,
  setValorDeslocamento,
  valorDeslocamentoRepasse,
  setValorDeslocamentoRepasse,
  valorHoraParada,
  valorHoraParadaRepasse,
  valorPedagio,
}: {
  valorViagem: any;
  valorViagemRepasse: any;
  valorDeslocamento: any;
  setValorDeslocamento: any;
  valorDeslocamentoRepasse: any;
  setValorDeslocamentoRepasse: any;
  valorHoraParada: any;
  valorHoraParadaRepasse: any;
  valorPedagio: any;
}) {
  const { Cor } = useTema();

  const operadoraId = useAdminLogado()?.operadora.id;

  const { listaPedagios } = usePedagios(String(operadoraId));
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
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
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
                  readOnly
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
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
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
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
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
                  value={valorHoraParada || ""}
                  readOnly
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
                  value={valorHoraParadaRepasse || ""}
                  readOnly
                  disabled
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
              value={valorPedagio || ""}
              disabled
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

function DetalhesEntrada({
  configEntrada,
  setConfigEntrada,
}: {
  configEntrada: any;
  setConfigEntrada: any;
}) {
  const { Cor } = useTema();
  const operadora = useAdminLogado()?.operadora.id;
  const { listaMotoristas } = useMotorista(operadora);

  const [selected, setSelected] = React.useState<Date[] | undefined>();

  const [motoristaSelecionado, setMotoristaSelecionado] = useState<any>();

  const [hora, setHora] = useState<string>("");

  const { carroAtrelado, loading: carregandoCarro } = useCarroAtrelado(
    String(motoristaSelecionado?.id || ""),
  );

  const atualizarCampo = (campo: string, valor: any) => {
    setConfigEntrada((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const removerDataSelecionada = (dataParaRemover: Date) => {
    setSelected((prev) =>
      prev?.filter((d) => d.getTime() !== dataParaRemover.getTime()),
    );
  };

  const adicionarProgramacoes = () => {
    if (!motoristaSelecionado || !hora || !selected || selected.length === 0) {
      alert(
        "Selecione um motorista, defina o horário e escolha pelo menos uma data.",
      );
      return;
    }

    const [horas, minutos] = hora.split(":");

    const novasProgramacoes = selected.map((data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");

      const dataHoraProgramacaoLocal = `${ano}-${mes}-${dia}T${horas}:${minutos}:00.000Z`;
      return {
        motoristaId: motoristaSelecionado,
        carroId: carroAtrelado?.[0],
        dataHoraProgramação: dataHoraProgramacaoLocal,
      };
    });

    const programacoesAtuais = configEntrada.programacoes || [];
    atualizarCampo("programacoes", [
      ...programacoesAtuais,
      ...novasProgramacoes,
    ]);

    // Opcional: Limpar as datas selecionadas após adicionar
    setSelected([]);
  };

  const removerProgramacao = (index: number) => {
    const novasProgramacoes = [...(configEntrada.programacoes || [])];
    novasProgramacoes.splice(index, 1);
    atualizarCampo("programacoes", novasProgramacoes);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: Cor.base2,
          borderRadius: 22,
          boxShadow: Cor.sombra,
          opacity: carregandoCarro ? 0.1 : 1,
          transition: "ease-in-out all 0.3s",
          zIndex: 2,
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            gap: 10,
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
              Configurações Entrada
            </p>
            <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
              <strong>Esolha o Motorista, defina o horário e as datas</strong>{" "}
              depois clique em{" "}
              <strong style={{ color: Cor.textoTurno + "AA" }}>
                adicionar
              </strong>
              .
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", width: "80%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
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
                  value={
                    motoristaSelecionado
                      ? JSON.stringify(motoristaSelecionado)
                      : ""
                  }
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (valor) {
                      setMotoristaSelecionado(JSON.parse(valor));
                    } else {
                      setMotoristaSelecionado(null);
                    }
                  }}
                >
                  <option
                    value={""}
                    style={{
                      backgroundColor: Cor.base2,
                      color: Cor.texto2 + 70,
                    }}
                  >
                    Selecione um Motorista
                  </option>
                  {listaMotoristas?.map((m: any) => {
                    return (
                      <option
                        value={JSON.stringify(m)}
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
              style={{ display: "flex", flexDirection: "column", width: "20%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Horário:
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
                  type="time"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                    color: Cor.texto1,
                  }}
                  value={hora}
                  onChange={(e) => {
                    setHora(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <DayPicker
              animate={true}
              mode="multiple"
              locale={ptBR}
              selected={selected}
              onSelect={setSelected}
              navLayout="around"
              showOutsideDays
              styles={{
                root: {
                  "--rdp-accent-color": Cor.turno,
                  borderRadius: "14px",
                  border: `1px solid ${Cor.texto2}40`,
                  padding: 10,
                  backgroundColor: Cor.base,
                  width: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                } as React.CSSProperties,
                month_caption: {
                  color: Cor.texto1,
                  textTransform: "capitalize",
                },
                button_previous: {
                  color: Cor.turno,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                },
                month_grid: {
                  borderCollapse: "separate",
                  borderSpacing: "3px",
                },
                button_next: {
                  color: Cor.turno,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                },
                chevron: {
                  fill: Cor.turno,
                  height: "24px",
                  width: "24px",
                },
                day: {
                  color: Cor.texto1,
                },
                weekday: {
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: Cor.textoTurno + 90,
                  textTransform: "capitalize",
                  paddingBottom: "10px",
                },
                day_button: {
                  cursor: "pointer",
                  border: "none",
                },
              }}
              modifiersStyles={{
                selected: {
                  color: Cor.textoTurno,
                  fontWeight: "900",
                  borderRadius: 16,
                  backgroundColor: Cor.textoTurno + "1A",
                },
                today: {
                  color: Cor.turno,
                  fontWeight: "600",
                },
                outside: {
                  color: Cor.textoTurno + "50",
                },
              }}
            />
            <div
              style={{
                height: "100%",
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 300,
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  paddingBottom: 10,
                }}
              >
                {selected?.map((d: any, i: number) => {
                  return (
                    <BtnPrevData
                      key={i}
                      $cor={Cor.texto1}
                      $corHover={Cor.turno}
                      onClick={() => removerDataSelecionada(d)}
                    >
                      <p style={{ fontSize: 14 }}>
                        {/* {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()} */}
                        {Intl.DateTimeFormat("pt-BR", {
                          timeZone: "UTC",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(d))}
                      </p>
                      <p style={{ fontFamily: "Icone", color: Cor.atencao }}>
                        delete
                      </p>
                    </BtnPrevData>
                  );
                })}
              </div>
              <BtnAdicionarDatas
                $cor={Cor.textoTurno}
                onClick={() => adicionarProgramacoes()}
              >
                Adicionar
              </BtnAdicionarDatas>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "50%",
            height: 465,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: Cor.texto1 + 10,
            borderRadius: 12,
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 35,
              padding: 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: "12px 12px 0 0 ",
              gap: 2,
              backgroundColor: Cor.texto2 + 20,
              color: Cor.texto1,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <p style={{ width: "65%" }}>Motorista</p>
            <p style={{ width: "20%" }}>Data</p>
            <p
              style={{
                width: "15%",
                textAlign: "center",
              }}
            >
              Horário
            </p>
            <p
              style={{
                width: "10%",
                textAlign: "center",
              }}
            >
              Ação
            </p>
          </div>
          {/* Conteúdo */}
          <div
            style={{
              width: "100%",
              height: `calc(100% - 35px)`,
              borderRadius: "0 0 12px 12px",
              padding: 10,
              overflowY: "auto",
              scrollbarWidth: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              // paddingRight: 10,
            }}
          >
            {configEntrada?.programacoes?.map((d: any, i: number) => {
              return (
                <BtnConfData
                  key={i}
                  $cor={Cor.texto1}
                  $bg={Cor.base2}
                  $corHover={Cor.turno}
                  onClick={() => removerProgramacao(d)}
                >
                  <p style={{ width: "65%" }}>{d.motoristaId.nome}</p>
                  <p style={{ width: "20%" }}>
                    {Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(d.dataHoraProgramação))}
                  </p>
                  <p
                    style={{
                      width: "15%",
                      textAlign: "center",
                    }}
                  >
                    {Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(d.dataHoraProgramação))}
                  </p>
                  <p
                    style={{
                      width: "10%",
                      textAlign: "center",
                      fontFamily: "Icone",
                      color: Cor.atencao,
                      fontSize: 18,
                    }}
                  >
                    delete
                  </p>
                </BtnConfData>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function DetalhesSaida({
  configSaida,
  setConfigSaida,
}: {
  configSaida: any;
  setConfigSaida: any;
}) {
  const { Cor } = useTema();
  const operadora = useAdminLogado()?.operadora.id;
  const { listaMotoristas } = useMotorista(operadora);

  const [selected, setSelected] = React.useState<Date[] | undefined>();

  const [motoristaSelecionado, setMotoristaSelecionado] = useState<any>();

  const [hora, setHora] = useState<string>("");

  const { carroAtrelado, loading: carregandoCarro } = useCarroAtrelado(
    String(motoristaSelecionado?.id || ""),
  );

  const atualizarCampo = (campo: string, valor: any) => {
    setConfigSaida((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const removerDataSelecionada = (dataParaRemover: Date) => {
    setSelected((prev) =>
      prev?.filter((d) => d.getTime() !== dataParaRemover.getTime()),
    );
  };

  const adicionarProgramacoes = () => {
    if (!motoristaSelecionado || !hora || !selected || selected.length === 0) {
      alert(
        "Selecione um motorista, defina o horário e escolha pelo menos uma data.",
      );
      return;
    }

    const [horas, minutos] = hora.split(":");

    const novasProgramacoes = selected.map((data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");

      const dataHoraProgramacaoLocal = `${ano}-${mes}-${dia}T${horas}:${minutos}:00.000Z`;
      return {
        motoristaId: motoristaSelecionado,
        carroId: carroAtrelado?.[0],
        dataHoraProgramação: dataHoraProgramacaoLocal,
      };
    });

    const programacoesAtuais = configSaida.programacoes || [];
    atualizarCampo("programacoes", [
      ...programacoesAtuais,
      ...novasProgramacoes,
    ]);

    setSelected([]);
  };

  const removerProgramacao = (index: number) => {
    const novasProgramacoes = [...(configSaida.programacoes || [])];
    novasProgramacoes.splice(index, 1);
    atualizarCampo("programacoes", novasProgramacoes);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: Cor.base2,
          borderRadius: 22,
          boxShadow: Cor.sombra,
          opacity: carregandoCarro ? 0.1 : 1,
          transition: "ease-in-out all 0.3s",
          zIndex: 2,
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            gap: 10,
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
              Configurações Saida
            </p>
            <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
              <strong>Esolha o Motorista, defina o horário e as datas</strong>{" "}
              depois clique em{" "}
              <strong style={{ color: Cor.textoTurno + "AA" }}>
                adicionar
              </strong>
              .
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", width: "80%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
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
                  value={
                    motoristaSelecionado
                      ? JSON.stringify(motoristaSelecionado)
                      : ""
                  }
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (valor) {
                      setMotoristaSelecionado(JSON.parse(valor));
                    } else {
                      setMotoristaSelecionado(null);
                    }
                  }}
                >
                  <option
                    value={""}
                    style={{
                      backgroundColor: Cor.base2,
                      color: Cor.texto2 + 70,
                    }}
                  >
                    Selecione um Motorista
                  </option>
                  {listaMotoristas?.map((m: any) => {
                    return (
                      <option
                        value={JSON.stringify(m)}
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
              style={{ display: "flex", flexDirection: "column", width: "20%" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.textoTurno + 90,
                  fontWeight: "bold",
                  margin: 5,
                }}
              >
                Horário:
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
                  type="time"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                    color: Cor.texto1,
                  }}
                  value={hora}
                  onChange={(e) => {
                    setHora(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <DayPicker
              animate={true}
              mode="multiple"
              locale={ptBR}
              selected={selected}
              onSelect={setSelected}
              navLayout="around"
              showOutsideDays
              styles={{
                root: {
                  "--rdp-accent-color": Cor.turno,
                  borderRadius: "14px",
                  border: `1px solid ${Cor.texto2}40`,
                  padding: 10,
                  backgroundColor: Cor.base,
                  width: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                } as React.CSSProperties,
                month_caption: {
                  color: Cor.texto1,
                  textTransform: "capitalize",
                },
                button_previous: {
                  color: Cor.turno,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                },
                month_grid: {
                  borderCollapse: "separate",
                  borderSpacing: "3px",
                },
                button_next: {
                  color: Cor.turno,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                },
                chevron: {
                  fill: Cor.turno,
                  height: "24px",
                  width: "24px",
                },
                day: {
                  color: Cor.texto1,
                },
                weekday: {
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: Cor.textoTurno + 90,
                  textTransform: "capitalize",
                  paddingBottom: "10px",
                },
                day_button: {
                  cursor: "pointer",
                  border: "none",
                },
              }}
              modifiersStyles={{
                selected: {
                  color: Cor.textoTurno,
                  fontWeight: "900",
                  borderRadius: 16,
                  backgroundColor: Cor.textoTurno + "1A",
                },
                today: {
                  color: Cor.turno,
                  fontWeight: "600",
                },
                outside: {
                  color: Cor.textoTurno + "50",
                },
              }}
            />
            <div
              style={{
                height: "100%",
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 300,
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  paddingBottom: 10,
                }}
              >
                {selected?.map((d: any, i: number) => {
                  return (
                    <BtnPrevData
                      key={i}
                      $cor={Cor.texto1}
                      $corHover={Cor.turno}
                      onClick={() => removerDataSelecionada(d)}
                    >
                      <p style={{ fontSize: 14 }}>
                        {/* {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()} */}
                        {Intl.DateTimeFormat("pt-BR", {
                          timeZone: "UTC",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(d))}
                      </p>
                      <p style={{ fontFamily: "Icone", color: Cor.atencao }}>
                        delete
                      </p>
                    </BtnPrevData>
                  );
                })}
              </div>
              <BtnAdicionarDatas
                $cor={Cor.textoTurno}
                onClick={() => adicionarProgramacoes()}
              >
                Adicionar
              </BtnAdicionarDatas>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "50%",
            height: 465,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: Cor.texto1 + 10,
            borderRadius: 12,
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 35,
              padding: 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: "12px 12px 0 0 ",
              gap: 2,
              backgroundColor: Cor.texto2 + 20,
              color: Cor.texto1,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <p style={{ width: "65%" }}>Motorista</p>
            <p style={{ width: "20%" }}>Data</p>
            <p
              style={{
                width: "15%",
                textAlign: "center",
              }}
            >
              Horário
            </p>
            <p
              style={{
                width: "10%",
                textAlign: "center",
              }}
            >
              Ação
            </p>
          </div>
          {/* Conteúdo */}
          <div
            style={{
              width: "100%",
              height: `calc(100% - 35px)`,
              borderRadius: "0 0 12px 12px",
              padding: 10,
              overflowY: "auto",
              scrollbarWidth: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              // paddingRight: 10,
            }}
          >
            {configSaida?.programacoes?.map((d: any, i: number) => {
              return (
                <BtnConfData
                  key={i}
                  $cor={Cor.texto1}
                  $bg={Cor.base2}
                  $corHover={Cor.turno}
                  onClick={() => removerProgramacao(d)}
                >
                  <p style={{ width: "65%" }}>{d.motoristaId.nome}</p>
                  <p style={{ width: "20%" }}>
                    {Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(d.dataHoraProgramação))}
                  </p>
                  <p
                    style={{
                      width: "15%",
                      textAlign: "center",
                    }}
                  >
                    {Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(d.dataHoraProgramação))}
                  </p>
                  <p
                    style={{
                      width: "10%",
                      textAlign: "center",
                      fontFamily: "Icone",
                      color: Cor.atencao,
                      fontSize: 18,
                    }}
                  >
                    delete
                  </p>
                </BtnConfData>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

interface BtnConfDataProps {
  $cor: string;
  $corHover: string;
  $bg: string;
}

const BtnConfData = styled.div<BtnConfDataProps>`
  border: 1px solid ${({ $cor }) => $cor + 30};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $cor }) => $cor};
  width: 100%;
  display: flex;
  padding: 8px;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  transition: ease-in-out all 0.1s;
  cursor: pointer;
  user-select: none;
  font-size: 14px;

  &:hover {
    background-color: ${({ $corHover }) => $corHover + 30};
    scale: 1.01;
  }

  &:active {
    background-color: ${({ $corHover }) => $corHover + 70};
    scale: 0.99;
  }
`;

interface BtnPrevDataProps {
  $corHover: string;
  $cor: string;
}

const BtnPrevData = styled.div<BtnPrevDataProps>`
  border: 1px solid ${({ $cor }) => $cor + 30};
  background-color: ${({ $cor }) => $cor + 20};
  color: ${({ $cor }) => $cor};
  width: 90%;
  display: flex;
  padding: 8px;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  transition: ease-in-out all 0.1s;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${({ $corHover }) => $corHover + 10};
    scale: 1.02;
  }

  &:active {
    background-color: ${({ $corHover }) => $corHover + 30};
    scale: 0.98;
  }
`;

interface BtnAdicionarDatasProps {
  $cor: string;
}

const BtnAdicionarDatas = styled.div<BtnAdicionarDatasProps>`
  border: 1px solid ${({ $cor }) => $cor + 99};
  background-color: ${({ $cor }) => $cor + 20};
  color: ${({ $cor }) => $cor};
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  transition: ease-in-out all 0.1s;
  cursor: pointer;

  &:hover {
    background-color: ${({ $cor }) => $cor + 70};
    scale: 1.02;
  }

  &:active {
    background-color: ${({ $cor }) => $cor + "BB"};
    scale: 0.98;
  }
`;

function IncluirPassageiros({
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
}: {
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
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>
            Total de Passageiros adicionados{" "}
            <strong style={{ fontSize: 14, color: Cor.textoTurno }}>
              {passageirosVoucher.length}
            </strong>
          </p>
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
          return (
            <LinhaPassageiro
              passageiro={passageiro}
              selecionado={false}
              btnAdd={selecionado}
              setPassageirosVoucher={setPassageirosVoucher}
              key={passageiro.id}
            />
          );
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
          backgroundColor: desabilitado ? Cor.texto2 + 50 : Cor.turno + 50,
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

function ModalSeletorPassageiro({
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
  cxPesquisa,
  setCxPesquisa,
}: {
  empresaCliente: any;
  passageirosVoucher: any;
  setPassageirosVoucher: any;
  cxPesquisa: any;
  setCxPesquisa: any;
}) {
  const [nomeBusca, setNomeBusca] = useState<string>("");
  const [bairroBusca, setBairroBusca] = useState<string>("");

  const { listaPassageiro: listaTotal } = usePassageiros(empresaCliente || "0");

  const listaPassageiro = listaTotal?.filter((p: any) => p.ativo === true);

  const Cor = useTema().Cor;

  function normalizarTexto(texto: string) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: cxPesquisa ? 1 : 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: Cor.base2 + 50,
          backdropFilter: "blur(2px)",
          pointerEvents: cxPesquisa ? "auto" : "none",
          transition: "all ease-in-out 0.3s",
          zIndex: 10,
        }}
        onClick={() => {
          setCxPesquisa(false);
          setBairroBusca("");
          setNomeBusca("");
        }}
      >
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            border: `1px solid ${Cor.texto2 + 50}`,
            backgroundColor: Cor.base,
            boxShadow: Cor.sombra,
            borderRadius: 22,
            padding: 15,
            scale: cxPesquisa ? 1 : 0.6,
            transition: "all ease-in-out 0.3s",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextoEntrada
              placeholder="Digite aqui o nome do Passageiro"
              type="text"
              largura="50%"
              onChange={(e) => {
                setNomeBusca(e.target.value);
              }}
              value={nomeBusca}
            />
            <TextoEntrada
              placeholder="Digite aqui o nome do Bairro"
              type="text"
              largura="50%"
              onChange={(e) => {
                setBairroBusca(e.target.value);
              }}
              value={bairroBusca}
            />
            <BtnCriarPassageiro clienteId={String(empresaCliente)} />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: 400,
              padding: 10,
              backgroundColor: Cor.base2,
              boxShadow: Cor.sombra,
              borderRadius: 12,
              overflowY: "auto",
              scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
              gap: 5,
            }}
          >
            {(
              listaPassageiro?.filter((p) => {
                const nome = normalizarTexto(p.nome);
                const bairro = normalizarTexto(p.endBairro);

                const buscaNome = normalizarTexto(nomeBusca);
                const buscaBairro = normalizarTexto(bairroBusca);

                const porNome = nome.includes(buscaNome);
                const porBairro = bairro.includes(buscaBairro);

                return porNome && porBairro;
              }) || []
            ).map((passageiro) => {
              const selecionado = passageirosVoucher.some(
                (p: any) => p.id === passageiro.id,
              );
              return (
                <LinhaPassageiro
                  key={passageiro.id}
                  passageiro={passageiro}
                  selecionado={selecionado}
                  btnAdd={selecionado}
                  setPassageirosVoucher={setPassageirosVoucher}
                />
              );
            })}
          </div>
        </div>
      </div>
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
            {passageiro.centroCustoClienteId.nome}
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
      <p style={{ fontFamily: "icone", fontWeight: "bold", fontSize: 18 }}>
        search
      </p>
    </div>
  );
}
