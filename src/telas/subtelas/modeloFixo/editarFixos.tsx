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
import {
  useEditarModeloVoucherFixo,
  useModeloFixoId,
} from "../../../hooks/useModelosFixosTemp";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export function EditarFixo() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <EditarVoucherFixoConteudo />
      </>
    ),
  });
}

function EditarVoucherFixoConteudo() {
  const { FixoId } = useParams();

  const { modeloFixo, loading } = useModeloFixoId(atob(`${FixoId}`));

  const [empresaCliente, setEmpresaCliente] = useState("");
  const [unidadeCliente, setUnidadeCliente] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");

  const [valorViagem, setValorViagem] = useState("");
  const [valorViagemRepasse, setValorViagemRepasse] = useState("");
  const [valorDeslocamento, setValorDeslocamento] = useState("");
  const [valorDeslocamentoRepasse, setValorDeslocamentoRepasse] = useState("");
  const [valorHoraParada, setValorHoraParada] = useState("");
  const [valorHoraParadaRepasse, setValorHoraParadaRepasse] = useState("");

  const [valorPedagio, setValorPedagio] = useState("");

  const [configEntrada, setConfigEntrada] = useState({
    habilitado: false,
    motoristaId: "",
    carroId: "",
    tipo: "Entrada",
    origem: "",
    destino: "",
    horario: "",
    domingo: false,
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
  });
  const [configSaida, setConfigSaida] = useState({
    habilitado: false,
    motoristaId: "",
    carroId: "",
    tipo: "Saida",
    origem: "",
    destino: "",
    horario: "",
    domingo: false,
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
  });

  const [passageirosVoucher, setPassageirosVoucher] = useState<any[]>([]);

  const { Cor } = useTema();

  useEffect(() => {
    setEmpresaCliente(modeloFixo.empresaCliente?.id || "");
    setUnidadeCliente(modeloFixo.unidadeCliente?.id || "");
    setNomeModelo(modeloFixo.nomeModelo || "");
    setValorViagem(modeloFixo.valorViagem || "");
    setValorViagemRepasse(modeloFixo.valorViagemRepasse || "");
    setValorDeslocamento(modeloFixo.valorDeslocamento || "");
    setValorDeslocamentoRepasse(modeloFixo.valorDeslocamentoRepasse || "");
    setValorHoraParada(modeloFixo.valorHoraParada || "");
    setValorHoraParadaRepasse(modeloFixo.valorHoraParadaRepasse || "");
    setValorPedagio(modeloFixo.pedagio?.id || "");

    const confEntrada = modeloFixo.configuracoes?.find(
      (c: any) => c.tipo === "Entrada",
    );

    const confSaida = modeloFixo.configuracoes?.find(
      (c: any) => c.tipo === "Saida",
    );

    if (confEntrada) {
      setOrigem(confEntrada?.origem || "");
      setDestino(confEntrada?.destino || "");
    } else {
      setOrigem(confSaida?.destino || "");
      setDestino(confSaida?.origem || "");
    }

    if (confEntrada) {
      setConfigEntrada({
        habilitado: true,
        motoristaId: confEntrada?.motorista.id || "",
        carroId: confEntrada?.carro?.id || "",
        tipo: "Entrada",
        origem: confEntrada?.origem || "",
        destino: confEntrada?.destino || "",
        horario: confEntrada?.horario || "",
        domingo: confEntrada?.domingo || false,
        segunda: confEntrada?.segunda || false,
        terca: confEntrada?.terca || false,
        quarta: confEntrada?.quarta || false,
        quinta: confEntrada?.quinta || false,
        sexta: confEntrada?.sexta || false,
        sabado: confEntrada?.sabado || false,
      });
    } else {
      setConfigEntrada({
        habilitado: false,
        motoristaId: "",
        carroId: "",
        tipo: "Entrada",
        origem: "",
        destino: "",
        horario: "",
        domingo: false,
        segunda: false,
        terca: false,
        quarta: false,
        quinta: false,
        sexta: false,
        sabado: false,
      });
    }

    if (confSaida) {
      setConfigSaida({
        habilitado: true,
        motoristaId: confSaida?.motorista.id || "",
        carroId: confSaida?.carro?.id || "",
        tipo: "Saida",
        origem: confSaida?.origem || "",
        destino: confSaida?.destino || "",
        horario: confSaida?.horario || "",
        domingo: confSaida?.domingo || false,
        segunda: confSaida?.segunda || false,
        terca: confSaida?.terca || false,
        quarta: confSaida?.quarta || false,
        quinta: confSaida?.quinta || false,
        sexta: confSaida?.sexta || false,
        sabado: confSaida?.sabado || false,
      });
    } else {
      setConfigSaida({
        habilitado: false,
        motoristaId: "",
        carroId: "",
        tipo: "Saida",
        origem: "",
        destino: "",
        horario: "",
        domingo: false,
        segunda: false,
        terca: false,
        quarta: false,
        quinta: false,
        sexta: false,
        sabado: false,
      });
    }
    if (
      modeloFixo.passageirosFixos &&
      Array.isArray(modeloFixo.passageirosFixos)
    ) {
      const passageirosFormatados = modeloFixo.passageirosFixos.map(
        (item: any) => {
          if (item.passageiro) {
            return item.passageiro;
          }
          return item;
        },
      );

      setPassageirosVoucher(passageirosFormatados);
    } else {
      setPassageirosVoucher([]);
    }
  }, [modeloFixo?.id, loading]);

  const operadoraId = useAdminLogado()?.operadora.id;
  const adminId = useAdminLogado()?.id;

  const gerarPayload = () => {
    const configuracoesPayload = [];

    const passageirosMapeados = passageirosVoucher.map((passageiro) => {
      return {
        passageiroId: String(passageiro.id),
      };
    });

    if (configEntrada.habilitado) {
      configuracoesPayload.push({
        carroId: configEntrada.carroId,
        motoristaId: configEntrada.motoristaId,
        tipo: "Entrada",
        horario: configEntrada.horario,
        destino: destino,
        origem: origem,
        domingo: configEntrada.domingo,
        segunda: configEntrada.segunda,
        terca: configEntrada.terca,
        quarta: configEntrada.quarta,
        quinta: configEntrada.quinta,
        sexta: configEntrada.sexta,
        sabado: configEntrada.sabado,
      });
    }

    if (configSaida.habilitado) {
      configuracoesPayload.push({
        carroId: configSaida.carroId,
        motoristaId: configSaida.motoristaId,
        tipo: "Saida",
        horario: configSaida.horario,
        destino: origem,
        origem: destino,
        domingo: configSaida.domingo,
        segunda: configSaida.segunda,
        terca: configSaida.terca,
        quarta: configSaida.quarta,
        quinta: configSaida.quinta,
        sexta: configSaida.sexta,
        sabado: configSaida.sabado,
      });
    }

    return {
      adminUsuarioId: adminId,
      empresaClienteId: empresaCliente,
      nomeModelo: nomeModelo,
      operadoraId: operadoraId,
      unidadeClienteId: unidadeCliente,
      valorViagem: Number(valorViagem),
      valorDeslocamento: Number(valorDeslocamento),
      valorHoraParada: Number(valorHoraParada),
      valorPedagio: valorPedagio ? Number(valorPedagio) : null,
      valorViagemRepasse: Number(valorViagemRepasse),
      valorDeslocamentoRepasse: Number(valorDeslocamentoRepasse),
      valorHoraParadaRepasse: Number(valorHoraParadaRepasse),
      configuracoes: configuracoesPayload,
      passageirosFixos: passageirosMapeados,
    };
  };

  const { editarModeloVoucherFixo, loading: atualizarModelo } =
    useEditarModeloVoucherFixo();

  const navigate = useNavigate();

  async function criarModeloFixoFunc() {
    const payload = gerarPayload();
    if (payload.configuracoes.length === 0) {
      alert("Habilite pelo menos uma configuração (Entrada ou Saída)!");
      return;
    }
    await editarModeloVoucherFixo(atob(`${FixoId}`), payload);

    navigate("/modelosvouchersfixos");
  }

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={24}
          thickness={8}
          sx={{
            color: Cor.fixo,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <p style={{ color: Cor.textoFixo }}> Aguarde </p>
      </div>
    );
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
          Editar Roteiro Fixo
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
        origem={origem}
        setOrigem={setOrigem}
        destino={destino}
        setDestino={setDestino}
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
        setValorHoraParada={setValorHoraParada}
        setValorHoraParadaRepasse={setValorHoraParadaRepasse}
        setValorViagem={setValorViagem}
        setValorViagemRepasse={setValorViagemRepasse}
        setValorPedagio={setValorPedagio}
      />
      <DetalhesEntrada
        configEntrada={configEntrada}
        setConfigEntrada={setConfigEntrada}
      />
      <DetalhesSaida
        configSaida={configSaida}
        setConfigSaida={setConfigSaida}
      />
      <IncluirPassageiros
        empresaCliente={empresaCliente}
        setPassageirosVoucher={setPassageirosVoucher}
        passageirosVoucher={passageirosVoucher}
      />
      <BtnSalvar
        $cor={Cor.fixo}
        $texto={Cor.textoFixo}
        onClick={() => criarModeloFixoFunc()}
      >
        <p>Atualizar</p>
        {atualizarModelo ? (
          <CircularProgress
            size={24}
            thickness={8}
            sx={{
              color: Cor.fixo,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        ) : (
          <p style={{ fontFamily: "Icone", fontSize: 24 }}>save</p>
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
  setOrigem,
  destino,
  setDestino,
  empresaCliente,
  setEmpresaCliente,
  unidadeCliente,
  setUnidadeCliente,
  nomeModelo,
  setNomeModelo,
}: {
  origem: string;
  setOrigem: any;
  destino: string;
  setDestino: any;
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
                color: Cor.textoFixo + 90,
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
                onChange={(e) => setOrigem(e.target.value)}
              />
            </div>
          </div>
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 35,
              color: Cor.fixo,
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
                color: Cor.textoFixo + 90,
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
                onChange={(e) => setDestino(e.target.value)}
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
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={nomeModelo}
              onChange={(e) => setNomeModelo(e.target.value)}
            />
          </div>
        </div>
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
  valorPedagio,
  setValorPedagio,
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
  valorPedagio: any;
  setValorPedagio: any;
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
              style={{ width: 1, height: 30, backgroundColor: Cor.textoFixo }}
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
              style={{ width: 1, height: 30, backgroundColor: Cor.textoFixo }}
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
                  onChange={(e) => setValorHoraParada(e.target.value)}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoFixo }}
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
            <select
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={valorPedagio || ""}
              onChange={(e) => setValorPedagio(e.target.value)}
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

  const { carroAtrelado, loading: carregandoCarro } = useCarroAtrelado(
    String(configEntrada.motoristaId),
  );

  const atualizarCampo = (campo: string, valor: any) => {
    setConfigEntrada((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const idDoCarro = Number(carroAtrelado?.[0]?.id) || 0;

  useEffect(() => {
    if (String(configEntrada.carroId) !== String(idDoCarro)) {
      atualizarCampo("carroId", idDoCarro);
    }
  }, [idDoCarro, configEntrada.carroId, configEntrada.motoristaId]);

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: carregandoCarro ? 0.1 : !configEntrada.habilitado ? 0.8 : 1,
        transition: "ease-in-out all 0.3s",
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
          Configurações Entrada
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          <strong>Habilite</strong> e selecione o motorista, horários e dias da
          semana o motorista deve chegar no destino.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !configEntrada.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Ativo:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
            }}
          >
            <BtnAtivarStyled
              $cor={configEntrada.habilitado ? Cor.textoFixo : Cor.texto1}
              $bg={configEntrada.habilitado ? Cor.fixo : Cor.texto2}
              onClick={() => {
                atualizarCampo("habilitado", !configEntrada.habilitado);
              }}
              style={{ width: 100, justifyContent: "space-between" }}
            >
              <p>{configEntrada.habilitado ? "Habilitado" : "Habilitar"}</p>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {configEntrada.habilitado
                  ? "check_box"
                  : "check_box_outline_blank"}
              </p>
            </BtnAtivarStyled>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p
            style={{
              fontSize: 14,
              color: !configEntrada.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
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
              opacity: !configEntrada.habilitado ? 0.5 : 1,
            }}
          >
            <select
              disabled={!configEntrada.habilitado}
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={configEntrada.motoristaId}
              onChange={(e) => {
                atualizarCampo("motoristaId", String(e.target.value));
              }}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione um Motorista
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
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: !configEntrada.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
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
              opacity: !configEntrada.habilitado ? 0.5 : 1,
            }}
          >
            <input
              disabled={!configEntrada.habilitado}
              type="time"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={configEntrada.horario}
              onChange={(e) => {
                atualizarCampo("horario", e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !configEntrada.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Dias da Semana:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
              opacity: !configEntrada.habilitado ? 0.3 : 1,
              pointerEvents: !configEntrada.habilitado ? "none" : "auto",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <BtnAtivarStyled
                $cor={configEntrada.domingo ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.domingo ? Cor.fixo : Cor.texto2}
                onClick={() =>
                  atualizarCampo("domingo", !configEntrada.domingo)
                }
              >
                <p>Dom</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.domingo
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configEntrada.segunda ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.segunda ? Cor.fixo : Cor.texto2}
                onClick={() =>
                  atualizarCampo("segunda", !configEntrada.segunda)
                }
              >
                <p>Seg</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.segunda
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configEntrada.terca ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.terca ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("terca", !configEntrada.terca)}
              >
                <p>Ter</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.terca
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configEntrada.quarta ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.quarta ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("quarta", !configEntrada.quarta)}
              >
                <p>Qua</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.quarta
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configEntrada.quinta ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.quinta ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("quinta", !configEntrada.quinta)}
              >
                <p>Qui</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.quinta
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configEntrada.sexta ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.sexta ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("sexta", !configEntrada.sexta)}
              >
                <p>Sex</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.sexta
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configEntrada.sabado ? Cor.textoFixo : Cor.texto1}
                $bg={configEntrada.sabado ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("sabado", !configEntrada.sabado)}
              >
                <p>Sab</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configEntrada.sabado
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
            </div>
          </div>
        </div>
      </div>
    </div>
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

  const { carroAtrelado, loading: carregandoCarro } = useCarroAtrelado(
    String(configSaida.motoristaId),
  );

  const atualizarCampo = (campo: string, valor: any) => {
    setConfigSaida((prev: any) => ({ ...prev, [campo]: valor }));
  };
  const idDoCarro = Number(carroAtrelado?.[0]?.id) || 0;

  useEffect(() => {
    if (String(configSaida.carroId) !== String(idDoCarro)) {
      atualizarCampo("carroId", idDoCarro);
    }
  }, [idDoCarro, configSaida.carroId, configSaida.motoristaId]);

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: carregandoCarro ? 0.1 : !configSaida.habilitado ? 0.8 : 1,
        transition: "ease-in-out all 0.3s",
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
          Configurações Saída
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          <strong>Habilite</strong> e selecione o motorista, horários e dias da
          semana o motorista deve sair do destino.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !configSaida.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Ativo:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
            }}
          >
            <BtnAtivarStyled
              $cor={configSaida.habilitado ? Cor.textoFixo : Cor.texto1}
              $bg={configSaida.habilitado ? Cor.fixo : Cor.texto2}
              onClick={() =>
                atualizarCampo("habilitado", !configSaida.habilitado)
              }
              style={{ width: 100, justifyContent: "space-between" }}
            >
              <p>{configSaida.habilitado ? "Habilitado" : "Habilitar"}</p>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {configSaida.habilitado
                  ? "check_box"
                  : "check_box_outline_blank"}
              </p>
            </BtnAtivarStyled>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p
            style={{
              fontSize: 14,
              color: !configSaida.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
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
              opacity: !configSaida.habilitado ? 0.5 : 1,
            }}
          >
            <select
              disabled={!configSaida.habilitado}
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={configSaida.motoristaId}
              onChange={(e) => {
                atualizarCampo("motoristaId", String(e.target.value));
              }}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione um Motorista
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
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: !configSaida.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
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
              opacity: !configSaida.habilitado ? 0.5 : 1,
            }}
          >
            <input
              disabled={!configSaida.habilitado}
              type="time"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={configSaida.horario}
              onChange={(e) => {
                atualizarCampo("horario", e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !configSaida.habilitado
                ? Cor.texto1 + 50
                : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Dias da Semana:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
              pointerEvents: !configSaida.habilitado ? "none" : "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                opacity: !configSaida.habilitado ? 0.3 : 1,
              }}
            >
              <BtnAtivarStyled
                $cor={configSaida.domingo ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.domingo ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("domingo", !configSaida.domingo)}
              >
                <p>Dom</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.domingo
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configSaida.segunda ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.segunda ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("segunda", !configSaida.segunda)}
              >
                <p>Seg</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.segunda
                    ? "check_box"
                    : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configSaida.terca ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.terca ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("terca", !configSaida.ter)}
              >
                <p>Ter</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.terca ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configSaida.quarta ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.quarta ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("quarta", !configSaida.quarta)}
              >
                <p>Qua</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.quarta ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configSaida.quinta ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.quinta ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("quinta", !configSaida.quinta)}
              >
                <p>Qui</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.quinta ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configSaida.sexta ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.sexta ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("sexta", !configSaida.sexta)}
              >
                <p>Sex</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.sexta ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={configSaida.sabado ? Cor.textoFixo : Cor.texto1}
                $bg={configSaida.sabado ? Cor.fixo : Cor.texto2}
                onClick={() => atualizarCampo("sabado", !configSaida.sabado)}
              >
                <p>Sab</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {configSaida.sabado ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BtnAtivarProps {
  $cor: string;
  $bg: string;
}

const BtnAtivarStyled = styled.div<BtnAtivarProps>`
  font-size: 14px;
  color: ${({ $cor }) => $cor};
  padding: 5px 10px;
  border-radius: 8px;
  background-color: ${({ $bg }) => $bg}50;
  cursor: pointer;
  transition: ease-in-out all 0.1s;
  user-select: none;
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  font-weight: 500;

  &:hover {
    scale: 1.04;
    background-color: ${({ $bg }) => $bg}AA;
  }

  &:active {
    scale: 0.98;
    background-color: ${({ $bg }) => $bg}FF;
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
              color: Cor.textoFixo,
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
            <strong style={{ fontSize: 14, color: Cor.textoFixo }}>
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
          backgroundColor: desabilitado ? Cor.texto2 + 50 : Cor.fixo + 50,
          color: desabilitado ? Cor.texto2 : Cor.textoFixo,
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
