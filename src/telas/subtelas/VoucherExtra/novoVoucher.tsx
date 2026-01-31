import { jwtDecode } from "jwt-decode";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { useSolicitante } from "../../../hooks/useSolicitantes";
import { useRotaId, useRotasExtas } from "../../../hooks/useRotasExtras";
import { useMotorista } from "../../../hooks/useMotorista";
import { usePassageiros } from "../../../hooks/usePassageiros";
import { validarVoucher } from "../../../hooks/validarVoucher";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useCarros } from "../../../hooks/useCarros";
import { useCreateVoucher } from "../../../hooks/useVouchers";
import { useNavigate } from "react-router-dom";

function NovoVoucher() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <NovoVoucherConteudo />
      </>
    ),
  });
}

export default NovoVoucher;

function NovoVoucherConteudo() {
  // Variáveis de estado
  const [empresaCliente, setEmpresaCliente] = useState<any>();
  const [unidadeEmpresaCliente, setUnidadeEmpresaCliente] = useState<any>();
  const [solicitante, setSolicitante] = useState<any>();
  const [rotaExtra, setRotaExtra] = useState<any>();
  const [rotaValor, setRotaValor] = useState<any>();
  const [tipo, setTipo] = useState<any>("");
  const [motorista, setMotorista] = useState<any>();
  const [motoristaSaida, setMotoristaSaida] = useState<any>();
  const [carregandoEmpresa, setCarregandoEmpresa] = useState<boolean>(false);
  const [carro, setCarro] = useState<any>();
  const [carroSaida, setCarroSaida] = useState<any>();
  const [qntDeslocamento, setQntDeslocamento] = useState<any>();

  const [passageirosVoucher, setPassageirosVoucher] = useState<any[]>([]);

  const passageiros = passageirosVoucher.map((p) => {
    return { passageiroId: p.id };
  });

  const [dataHoraEntrada, setDataHoraEntrada] = useState<any>();
  const [dataHoraSaida, setDataHoraSaida] = useState<any>();

  const [cxConfirmarVoucher, setCxConfirmarVoucher] = useState<boolean>(false);

  const [lancamentos, setLancamentos] = useState<any[]>([]);

  //Chamadas de hooks

  const userId = useAdminLogado();

  const { rota } = useRotaId(rotaExtra || "");

  const valores = rota?.rotaValor || [];

  const tipoCarro = valores.find((v: any) => v.id === rotaValor);

  const { listaCarros: listaCarrosEntrada } = useCarros(motorista || "");
  const { listaCarros: listaCarrosSaida } = useCarros(motoristaSaida || "");

  // Atualizações de estado baseadas em efeitos colaterais

  useEffect(() => {
    if (listaCarrosEntrada && listaCarrosEntrada.length > 0) {
      setCarro(listaCarrosEntrada[0]);
    } else {
      setCarro(undefined);
    }
  }, [listaCarrosEntrada]);

  useEffect(() => {
    if (listaCarrosSaida && listaCarrosSaida.length > 0) {
      setCarroSaida(listaCarrosSaida[0]);
    } else {
      setCarroSaida(undefined);
    }
  }, [listaCarrosSaida]);

  // Funções auxiliares

  async function lancarVoucher() {
    const { ok, erro } = validarVoucher({
      empresaCliente,
      unidadeEmpresaCliente,
      solicitante,
      rotaExtra,
      rotaValor,
      tipo,
    });

    if (!ok) {
      alert(erro);
      return;
    }

    const baseVoucher = {
      adminUsuarioId: userId?.id,
      empresaClienteId: empresaCliente,
      unidadeClienteId: unidadeEmpresaCliente,
      operadoraId: userId?.operadora.id,
      solicitanteId: solicitante,
      rotaId: rotaExtra,
      natureza: "Extra",
      valorViagem: tipoCarro?.valorViagem || 0,
      valorViagemRepasse: tipoCarro?.valorViagemRepasse || 0,
      valorHoraParada: tipoCarro?.valorHoraParada || 0,
      valorHoraParadaRepasse: tipoCarro?.valorHoraParadaRepasse || 0,
      valorDeslocamento: tipoCarro
        ? tipoCarro?.valorDeslocamento * qntDeslocamento
        : 0,
      valorDeslocamentoRepasse: tipoCarro?.valorDeslocamentoRepasse || 0,
      valorPedagio: tipoCarro?.valorPedagio?.valor || 0,
      valorEstacionamento: 0,
      passageiros: passageiros,
    };

    const vouchers = [];

    if (tipo === "Entrada") {
      vouchers.push({
        ...baseVoucher,
        carroId: carro?.id,
        dataHoraProgramado: dataHoraEntrada,
        destino: rota.destino,
        origem: rota.origem,
        motoristaId: motorista,
        tipoCorrida: "Entrada",
      });
    } else if (tipo === "Saída") {
      vouchers.push({
        ...baseVoucher,
        carroId: carroSaida?.id,
        dataHoraProgramado: dataHoraSaida,
        destino: rota.origem,
        origem: rota.destino,
        motoristaId: motoristaSaida,
        tipoCorrida: "Saida",
      });
    } else if (tipo === "Entrada e Saída") {
      vouchers.push({
        ...baseVoucher,
        carroId: carro?.id,
        dataHoraProgramado: dataHoraEntrada,
        destino: rota.destino,
        origem: rota.origem,
        motoristaId: motorista,
        tipoCorrida: "Entrada",
      });
      vouchers.push({
        ...baseVoucher,
        carroId: carroSaida?.id,
        dataHoraProgramado: dataHoraSaida,
        destino: rota.origem,
        origem: rota.destino,
        motoristaId: motoristaSaida,
        tipoCorrida: "Saida",
      });
    } else {
      // Caso o tipo não seja reconhecido (opcional, mas recomendado)
      alert("Tipo de voucher inválido selecionado.");
      return;
    }

    // Continua o processo só se estiver tudo validado
    // console.log(`Vouchers a serem lançados: ${vouchers.length}`);
    // console.log(vouchers);

    setLancamentos(vouchers);
    setCxConfirmarVoucher(true);
  }

  useEffect(() => {
    setUnidadeEmpresaCliente("");
    setSolicitante("");
    setRotaExtra("");
    setRotaValor("");
    setTipo("");
    setMotorista("");
    setMotoristaSaida("");
    setDataHoraEntrada("");
    setDataHoraSaida("");
  }, [empresaCliente?.id]);

  useEffect(() => {
    setPassageirosVoucher([]);
  }, [empresaCliente, rotaValor]);

  useEffect(() => {
    setRotaValor("");
  }, [rotaExtra]);

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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Passageiros</h3>
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
        setUnidadeEmpresaCliente={setUnidadeEmpresaCliente}
        setSolicitante={setSolicitante}
        setCarregandoEmpresa={setCarregandoEmpresa}
      />
      <DetalhesDoVoucher
        tipo={tipo}
        empresaCliente={empresaCliente}
        setTipo={setTipo}
        setRotaExtra={setRotaExtra}
        rotaExtra={rotaExtra}
        setRotaValor={setRotaValor}
        setMotorista={setMotorista}
        setDataHoraEntrada={setDataHoraEntrada}
        setDataHoraSaida={setDataHoraSaida}
        carregandoEmpresa={carregandoEmpresa}
        setMotoristaSaida={setMotoristaSaida}
        setQntDeslocamento={setQntDeslocamento}
      />
      <IncluirPassageiros
        empresaCliente={empresaCliente}
        passageirosVoucher={passageirosVoucher}
        setPassageirosVoucher={setPassageirosVoucher}
      />
      <BtnLançarVoucherStyle
        $cor={Cor.primaria}
        onClick={() => {
          // setCxConfirmarVoucher(true);
          lancarVoucher();
        }}
      >
        <h3 style={{ color: Cor.primariaTxt }}>Lançar Voucher</h3>
      </BtnLançarVoucherStyle>
      <BaseModalConfirmacao
        lancamentos={lancamentos}
        cxConfirmarVoucher={cxConfirmarVoucher}
        setCxConfirmarVoucher={setCxConfirmarVoucher}
      />
    </div>
  );
}

interface BtnLançarVoucherProps {
  $cor: string;
}

const BtnLançarVoucherStyle = styled.button<BtnLançarVoucherProps>`
  padding: 15px 50px;
  border-radius: 18px;
  outline: none;
  border: 1px solid ${({ $cor }) => $cor};
  background-color: ${({ $cor }) => $cor + "BB"};
  position: absolute;
  bottom: 15px;
  right: 15px;
  backdrop-filter: blur(3px);
  cursor: pointer;
  transition: all ease-in-out 0.2s;

  &:hover {
    background-color: ${({ $cor }) => $cor + 90};
  }
`;

interface JwtPayload {
  adminUsuarioId?: string;
  operadoraId?: string;
}

function DadosGerais({
  empresaCliente,
  setEmpresaCliente,
  setUnidadeEmpresaCliente,
  setSolicitante,
  setCarregandoEmpresa,
}: {
  empresaCliente: any;
  setEmpresaCliente: any;
  setUnidadeEmpresaCliente: any;
  setSolicitante: any;
  setCarregandoEmpresa: any;
}) {
  const Cor = useTema().Cor;

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

  const { listaClientes } = useListaClientes(operId || "0");

  const { listaUnidades, loading } = useUnidadeCliente(empresaCliente || "0");

  useEffect(() => {
    setCarregandoEmpresa(loading);
  }, [loading]);

  const { solicitantes } = useSolicitante(empresaCliente || "0");

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
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
            color: Cor.primariaTxt,
            fontWeight: "bold",
          }}
        >
          Criar Novo Voucher Extra
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Preencha a baixo os dados Gerais para criar um novo voucher extra.
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
              color: Cor.primariaTxt + 90,
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
              defaultValue={""}
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
              color: Cor.primariaTxt + 90,
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
              defaultValue={""}
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
              color: Cor.primariaTxt + 90,
              fontWeight: "bold",
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
              onChange={(e) => setSolicitante(e.target.value)}
              defaultValue={""}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione o Solicitante
              </option>
              {solicitantes?.map((solicitante: any) => {
                return (
                  <option
                    value={solicitante?.id}
                    key={solicitante?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {solicitante?.nome}
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
  tipo,
  empresaCliente,
  carregandoEmpresa,
  rotaExtra,
  setTipo,
  setRotaExtra,
  setRotaValor,
  setMotorista,
  setDataHoraEntrada,
  setMotoristaSaida,
  setDataHoraSaida,
  setQntDeslocamento,
}: {
  tipo: any;
  empresaCliente: any;
  carregandoEmpresa: any;
  rotaExtra: any;
  setTipo: any;
  setRotaExtra: any;
  setRotaValor: any;
  setMotorista: any;
  setDataHoraEntrada: any;
  setMotoristaSaida: any;
  setDataHoraSaida: any;
  setQntDeslocamento: any;
}) {
  const Cor = useTema().Cor;

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

  const { listaRotasExtras } = useRotasExtas(empresaCliente || "0");

  const { listaMotoristas, loading: carregandoMotoristas } =
    useMotorista(operId);

  const { rota, loading: carregandoRota } = useRotaId(rotaExtra || "");
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
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Detalhes da viagem: informe rota, motorista, data e hora, tipo de rota
          e tipo de veículo.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.primariaTxt + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Rota:
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
              onChange={(e) => setRotaExtra(e.target.value)}
              defaultValue={""}
              disabled={carregandoEmpresa}
            >
              <option
                value=""
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione uma Rota
              </option>
              {listaRotasExtras?.map((rota: any) => {
                return (
                  <option
                    value={rota?.id}
                    key={rota?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {rota?.origem} X {rota?.destino}
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
              color: Cor.primariaTxt + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Tipo do Carro:
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
              onChange={(e) => setRotaValor(e.target.value)}
              defaultValue={""}
              disabled={carregandoRota}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Defina tipo de Carro
              </option>
              {rota?.rotaValor.map((tipo: any) => {
                return (
                  <option
                    value={tipo?.id}
                    key={tipo?.id}
                    style={{ backgroundColor: Cor.base2 }}
                  >
                    {tipo?.categoria}
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
              color: Cor.primariaTxt + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Tipo da Rota:
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
              defaultValue={""}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Defina tipo de Rota
              </option>
              <option value="Entrada" style={{ backgroundColor: Cor.base2 }}>
                Entrada
              </option>
              <option value="Saída" style={{ backgroundColor: Cor.base2 }}>
                Saída
              </option>
              <option
                value="Entrada e Saída"
                style={{ backgroundColor: Cor.base2 }}
              >
                Entrada e Saída
              </option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "15%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.primariaTxt + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Deslocamento/Via:
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
              type="number"
              defaultValue={0}
              style={{
                outline: "none",
                border: "none",
                color: Cor.texto1,
                backgroundColor: "transparent",
              }}
              onChange={(e) => setQntDeslocamento(e.target.value)}
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
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p
            style={{
              fontSize: 14,
              color:
                tipo === "Entrada" || tipo === "Entrada e Saída"
                  ? Cor.primariaTxt + 90
                  : Cor.texto2 + 90,
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
                  tipo === "Entrada" || tipo === "Entrada e Saída" ? 1 : 0.5,
              }}
              onChange={(e) => setMotorista(e.target.value)}
              defaultValue={""}
              disabled={carregandoMotoristas || tipo === "" || tipo === "Saída"}
            >
              <option
                value=""
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
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
        <div style={{ display: "flex", flexDirection: "column", width: "15%" }}>
          <p
            style={{
              fontSize: 14,
              color:
                tipo === "Entrada" || tipo === "Entrada e Saída"
                  ? Cor.primariaTxt + 90
                  : Cor.texto2 + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Data e Hora Entrada:
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
            {tipo === "Entrada" || tipo === "Entrada e Saída" ? (
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
                onChange={(e) =>
                  setDataHoraEntrada(`${e.target.value}:00.000Z`)
                }
              />
            ) : (
              <div
                style={{
                  width: "50%",
                  height: 18,
                  backgroundColor: Cor.texto2 + 50,
                }}
              ></div>
            )}
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
        <p
          style={{
            fontFamily: "Icone",
            fontWeight: "bold",
            fontSize: 48,
            color: Cor.primaria,
            marginTop: 20,
          }}
        >
          call_split
        </p>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p
            style={{
              fontSize: 14,
              color:
                tipo === "Saída" || tipo === "Entrada e Saída"
                  ? Cor.primariaTxt + 90
                  : Cor.texto2 + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Motorista Saída:
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
              onChange={(e) => setMotoristaSaida(e.target.value)}
              defaultValue={""}
              disabled={
                carregandoMotoristas || tipo === "" || tipo === "Entrada"
              }
            >
              <option
                value=""
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
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
        <div style={{ display: "flex", flexDirection: "column", width: "15%" }}>
          <p
            style={{
              fontSize: 14,
              color:
                tipo === "Saída" || tipo === "Entrada e Saída"
                  ? Cor.primariaTxt + 90
                  : Cor.texto2 + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Data e Hora Saída:
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
            {tipo === "Saída" || tipo === "Entrada e Saída" ? (
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
                onChange={(e) => setDataHoraSaida(`${e.target.value}:00.000Z`)}
              />
            ) : (
              <div
                style={{
                  width: "50%",
                  height: 18,
                  backgroundColor: Cor.texto2 + 50,
                }}
              ></div>
            )}
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
    </div>
  );
}

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
        marginBottom: 65,
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
              color: Cor.primariaTxt,
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
            <strong style={{ fontSize: 14, color: Cor.primariaTxt }}>
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
              backgroundColor: desabilitado ? Cor.texto2 + 50 : Cor.primaria,
              display: "flex",
              border: "none",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              cursor: desabilitado ? "default" : "pointer",
            }}
            onClick={() => setPassageirosVoucher([])}
          >
            <p style={{ fontFamily: "Icone", fontWeight: "bold" }}>delete</p>
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
  const { listaPassageiro } = usePassageiros(empresaCliente || "0");

  const desabilitado = !listaPassageiro || listaPassageiro.length === 0;

  const [cxPesquisa, setCxPesquisa] = useState<boolean>(false);

  const Cor = useTema().Cor;

  return (
    <>
      <button
        disabled={desabilitado}
        style={{
          height: 35,
          backgroundColor: desabilitado ? Cor.texto2 + 50 : Cor.primaria,
          border: "none",
          padding: "8px 25px",
          borderRadius: 12,
          cursor: desabilitado ? "default" : "pointer",
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

  const { listaPassageiro } = usePassageiros(empresaCliente || "0");

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

function BaseModalConfirmacao({
  lancamentos,
  cxConfirmarVoucher,
  setCxConfirmarVoucher,
}: {
  lancamentos: any;
  cxConfirmarVoucher: any;
  setCxConfirmarVoucher: any;
}) {
  const Cor = useTema().Cor;

  const { lancar } = useCreateVoucher();

  const navigate = useNavigate();

  async function confirmado() {
    try {
      const resultados = await Promise.all(      
        lancamentos.map(async (v: any) => {

          if(v.carroId === undefined || null){
            alert("Esse motorista não tem um carro atrelado a conta dele.")
            return null
          }
          console.log("Enviando:", v);

          const lancado = await lancar(v);

          console.log("Retorno:", lancado);
          return { ok: true, v, lancado };
        }),
      );

      navigate("/operacao");
      return resultados;
    } catch (e) {
      console.log("Erro ao lançar voucher:", e);
      throw e;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        opacity: cxConfirmarVoucher ? 1 : 0,
        gap: 15,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: Cor.base2 + 50,
        backdropFilter: "blur(2px)",
        pointerEvents: cxConfirmarVoucher ? "auto" : "none",
        transition: "all ease-in-out 0.3s",
        zIndex: 10,
      }}
      onClick={() => setCxConfirmarVoucher(false)}
    >
      {lancamentos.map((v: any) => {
        return (
          <ModalConfirmacao
            v={v}
            key={v.dataHoraProgramado}
            cxModal={cxConfirmarVoucher}
          />
        );
      })}
      <div>
        <BtnLançarVoucherStyle
          $cor={Cor.primariaTxt}
          onClick={() => {
            confirmado();
          }}
        >
          <h3 style={{ color: Cor.base2 }}>Confirmar</h3>
        </BtnLançarVoucherStyle>
      </div>
    </div>
  );
}

function ModalConfirmacao({ v, cxModal }: { v: any; cxModal: boolean }) {
  const Cor = useTema().Cor;

  return (
    <div
      style={{
        width: "40%",
        height: "75%",
        scale: cxModal ? 1 : 0.6,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        border: `1px solid ${Cor.texto2 + 30}`,
        display: "flex",
        flexDirection: "column",
        transition: "all ease-in-out 0.3s",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: "100%",
          borderBottom: `1px solid ${Cor.primaria}`,
          borderRadius: "22px 22px 0 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 15,
          paddingBottom: 5,
          gap: 50,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{ fontSize: 14, fontWeight: "bold", color: Cor.primariaTxt }}
          >
            {v.tipoCorrida} - {v.dataHoraProgramado}
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>
            Confirme todas as informações antes de lançar.
          </p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "92%",
          display: "flex",
          flexDirection: "column",
          padding: 5,
          gap: 5,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "20%",
            backgroundColor: "#FF9000",
            display: "flex",
            flexDirection: "column",
            padding: 10,
            borderRadius: 12,
          }}
        >
          <p>{v.adminUsuarioId}</p>
          <p>{v.carroId || "Sem Carro"}</p>
          <p>{v.dataHoraProgramado}</p>
          <p>{v.motoristaId}</p>
        </div>
      </div>
    </div>
  );
}
