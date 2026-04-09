import { useEffect, useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

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
  const { Cor } = useTema();

  const operadoraId = useAdminLogado()?.operadora.id;

  const [visivel, setVisivel] = useState<boolean>(false);

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

  const { listaRelatorio, loading } = useVouchersFiltrados(filtro);
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          padding: "25px 15px 15px 15px",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 5,
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
          <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
            Relatórios
          </h3>
          <div
            style={{
              width: "75%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        <ResumoValores listaRelatorio={listaRelatorio} filtro={filtro} />
        <BaseFiltros filtroAtivo={filtro} setFiltroAtivo={setFiltro} />
        <TabelaVouchersFiltrados
          listaFiltro={listaRelatorio}
          loading={loading}
          setVisivel={setVisivel}
        />
        {/* <ModalEditarMassa visivel={visivel} setVisivel={setVisivel}/> */}
      </div>
    </>
  );
}

interface BtnNatuzeraProps {
  $cor: string;
  $corTexto: string;
}

const BtnNatuzera = styled.div<BtnNatuzeraProps>`
  width: 80%;
  padding: 1px;
  border-radius: 14px;
  background-color: ${({ $cor }) => $cor + 50};
  border: 1px solid ${({ $cor }) => $cor + 90};
  font-size: 12px;
  color: ${({ $corTexto }) => $corTexto};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  user-select: none;
  transition: ease-in-out all 0.1s;

  &:hover {
    scale: 1.04;
    background-color: ${({ $cor }) => $cor + 70};
  }
`;

interface BtnStatusProps {
  $cor: string;
}

const BtnStatus = styled.div<BtnStatusProps>`
  width: 100%;
  padding: 1px;
  border-radius: 14px;
  background-color: ${({ $cor }) => $cor + 50};
  border: 1px solid ${({ $cor }) => $cor + 90};
  font-size: 12px;
  color: ${({ $cor }) => $cor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  user-select: none;
  transition: ease-in-out all 0.1s;

  &:hover {
    scale: 1.04;
    background-color: ${({ $cor }) => $cor + 70};
  }
`;

interface LinhaTabelaProps {
  $base: string;
  $linha: string;
  $texto: string;
}

const LinhaTabela = styled.div<LinhaTabelaProps>`
  display: flex;
  flex-direction: row;
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
  height: 35px;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $base }) => $base};
  border-bottom: 1px solid ${({ $linha }) => $linha};
  color: ${({ $texto }) => $texto};
  font-size: 14px;
  cursor: pointer;
  transition: ease-in-out all 0.1s;

  &:hover {
    background-color: ${({ $texto }) => $texto + 20};
  }
`;

function TabelaVouchersFiltrados({
  listaFiltro,
  loading,
  setVisivel,
}: {
  listaFiltro: any;
  loading: any;
  setVisivel: any;
}) {
  const { Cor } = useTema();

  const [voucherHoverId, setHoveredVoucherId] = useState<string | null>(null);

  const [obsMotorista, setObsMotorista] = useState<string | null>(null);

  const [selecionados, setSelecionados] = useState<any[]>([]);

  useEffect(() => {
    setSelecionados([]);
    console.log(selecionados);
  }, [listaFiltro]);

  const selecionarLinhaVoucher = (id: any) => {
    setSelecionados((prev) => {
      const isSelecionado = prev.includes(id);

      const novaLista = isSelecionado
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      console.log("Selecionados agora:", novaLista);

      return novaLista;
    });
  };

  const selecionarTodosVouchers = () => {
    if (selecionados.length === listaFiltro.length) {
      setSelecionados([]);
      console.log("Selecionados agora: []");
    } else {
      const todosIds = listaFiltro.map((v: any) => v.id);
      setSelecionados(todosIds);
      console.log("Selecionados agora:", todosIds);
    }
  };

  const Cabecalho = (
    <div
      style={{
        backgroundColor: Cor.texto2 + 90,
        width: "100%",
        height: "6%",
        borderRadius: "16px 16px 0 0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        fontSize: 12,
        fontWeight: "bold",
        color: Cor.texto1,
      }}
    >
      <p
        style={{
          width: "2%",
          textAlign: "center",
          fontFamily: "Icone",
          fontSize: 16,
          fontWeight: 400,
          cursor: "pointer",
        }}
        onClick={selecionarTodosVouchers}
      >
        {selecionados.length > 0 && selecionados.length === listaFiltro.length
          ? "indeterminate_check_box"
          : "square"}
      </p>
      <p style={{ width: "5%", textAlign: "center" }}>Id</p>
      <p style={{ width: "17%" }}>Cliente / Unidade</p>
      <p style={{ width: "8%" }}>Solicitante</p>
      <p style={{ width: "15%" }}>Motorista</p>
      <p style={{ width: "10%" }}>Data / Hora</p>
      <p style={{ width: "15%" }}>Origem - Destino</p>
      <p style={{ width: "10%" }}>Natureza</p>
      <p style={{ width: "10%" }}>Status</p>
      <p style={{ width: "8%" }}>Valor</p>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: Cor.base2,
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 20,
        padding: 5,
      }}
    >
      {Cabecalho}
      <div
        style={{
          backgroundColor: Cor.base,
          width: "100%",
          height: "88%",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          scrollbarWidth: "none",
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
          listaFiltro.map((v: any) => {
            const valorTotal =
              v.valorViagem +
              v.valorDeslocamento +
              v.valorHoraParada * v.qntTempoParado;

            return (
              <LinhaTabela
                $base={Cor.base2}
                $linha={Cor.texto2 + 40}
                $texto={Cor.texto1}
                key={v.id}
              >
                <p
                  style={{
                    width: "2%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Icone",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                  onClick={() => selecionarLinhaVoucher(v.id)}
                >
                  {selecionados.includes(v.id) ? "check_box" : "square"}
                </p>
                <p
                  style={{
                    width: "5%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  {v.id}
                </p>
                <div
                  style={{
                    width: "17%",
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  <img
                    src={v.empresaCliente.fotoLogoCliente}
                    style={{
                      width: 25,
                      height: 25,
                      minWidth: 25,
                      borderRadius: 5,
                    }}
                  />
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.empresaCliente.nome} / {v.unidadeCliente.nome}
                  </p>
                </div>

                <p
                  style={{
                    width: "8%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  {v.solicitante.nome}
                </p>
                <div
                  style={{
                    width: "15%",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  <div
                    style={{
                      display: v.observacaoMotorista ? "flex" : "none",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      position: "relative",
                      width: "10%",
                    }}
                    onMouseEnter={() => setObsMotorista(v.id)}
                    onMouseLeave={() => setObsMotorista(null)}
                  >
                    <p
                      style={{
                        fontFamily: "Icone",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: Cor.atencao,
                      }}
                    >
                      circle_notifications
                    </p>
                    {obsMotorista === v.id && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "120%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: Cor.base2,
                          color: Cor.texto1,
                          border: `1px solid ${Cor.texto2}`,
                          padding: "8px 12px",
                          borderRadius: "6px",
                          whiteSpace: "nowrap",
                          fontSize: "12px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          zIndex: 10,
                        }}
                      >
                        {v.observacaoMotorista}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "10px",
                            height: "10px",
                            backgroundColor: Cor.base2,
                            borderBottom: `1px solid ${Cor.texto2}`,
                            borderRight: `1px solid ${Cor.texto2}`,
                            rotate: "45deg",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      width: v.observacaoMotorista ? "90%" : "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <p>{v.motorista.nome}</p>
                  </div>
                </div>

                <p
                  style={{
                    width: "10%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  {new Date(v.dataHoraProgramado).toLocaleString("pt-BR", {
                    timeZone: "UTC",
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </p>
                <p
                  style={{
                    width: "15%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  {v.origem} - {v.destino}
                </p>
                <div
                  style={{
                    width: "10%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  <BtnNatuzera
                    $cor={
                      v.natureza === "Fixo"
                        ? Cor.fixo
                        : v.natureza === "Extra"
                          ? Cor.extra
                          : Cor.turno
                    }
                    $corTexto={
                      v.natureza === "Fixo"
                        ? Cor.textoFixo
                        : v.natureza === "Extra"
                          ? Cor.textoExtra
                          : Cor.textoTurno
                    }
                  >
                    {v.natureza} -
                    <p
                      style={{
                        // fontFamily: "Icone",
                        fontWeight: "bolder",
                        fontSize: 14,
                      }}
                    >
                      {v.tipoCorrida === "Entrada" ? "En" : "Sa"}
                    </p>
                  </BtnNatuzera>
                </div>
                <div
                  style={{
                    width: "10%",
                    whiteSpace: "nowrap",
                    // overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    borderRight: `1px solid ${Cor.texto2 + 40}`,
                    padding: 5,
                  }}
                >
                  <BtnStatus
                    $cor={
                      v.status === "Aberto"
                        ? Cor.texto2
                        : v.status === "Concluido"
                          ? Cor.ativo
                          : Cor.inativo
                    }
                    style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredVoucherId(v.id)}
                    onMouseLeave={() => setHoveredVoucherId(null)}
                  >
                    {v.status}
                    {v.status === "Concluido" && voucherHoverId === v.id && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "120%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: Cor.base2,
                          color: Cor.texto1,
                          border: `1px solid ${Cor.texto2}`,
                          padding: "8px 12px",
                          borderRadius: "6px",
                          whiteSpace: "nowrap",
                          fontSize: "12px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          zIndex: 10,
                        }}
                      >
                        Assinado em:{" "}
                        {new Date(v.dataHoraConclusao).toLocaleString("pt-BR")}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "10px",
                            height: "10px",
                            backgroundColor: Cor.base2,
                            borderBottom: `1px solid ${Cor.texto2}`,
                            borderRight: `1px solid ${Cor.texto2}`,
                            rotate: "45deg",
                          }}
                        ></div>
                      </div>
                    )}
                    {v.status === "Cancelado" && voucherHoverId === v.id && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "120%",
                          width: 150,
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: Cor.base2,
                          color: Cor.texto1,
                          border: `1px solid ${Cor.texto2}`,
                          padding: "8px 12px",
                          borderRadius: "6px",
                          whiteSpace: "pre-wrap",
                          textAlign: "center",
                          fontSize: "12px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          zIndex: 10,
                        }}
                      >
                        {v.observacao}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "10px",
                            height: "10px",
                            backgroundColor: Cor.base2,
                            borderBottom: `1px solid ${Cor.texto2}`,
                            borderRight: `1px solid ${Cor.texto2}`,
                            rotate: "45deg",
                          }}
                        ></div>
                      </div>
                    )}
                    <p
                      style={{
                        fontFamily: "Icone",
                        fontWeight: 100,
                        fontSize: 18,
                      }}
                    >
                      {v.status === "Cancelado"
                        ? "cancel"
                        : v.status === "Aberto"
                          ? "hourglass"
                          : "check_circle"}
                    </p>
                  </BtnStatus>
                </div>
                <p
                  style={{
                    width: "8%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100%",
                    padding: 5,
                  }}
                >
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(valorTotal))}
                </p>
              </LinhaTabela>
            );
          })
        )}
      </div>
      <div
        style={{
          backgroundColor: Cor.texto2 + 90,
          width: "100%",
          borderRadius: "0 0 16px 16px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          fontSize: 12,
          fontWeight: "bold",
          color: Cor.texto1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "28%",
            gap: 10,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ whiteSpace: "nowrap" }}>
            {selecionados.length} - Vouchers Selecionados
          </p>
          <BtnAcaoEmMassa
            $cor={selecionados.length > 0 ? Cor.primaria : Cor.texto2}
            $cursor={selecionados.length > 0 ? "pointer" : "auto"}
            onClick={setVisivel(true)}
          >
            Ação em Massa
          </BtnAcaoEmMassa>
        </div>
      </div>
    </div>
  );
}

interface BtnAcaoEmMassaProps {
  $cor: string;
  $cursor: string;
}

const BtnAcaoEmMassa = styled.div<BtnAcaoEmMassaProps>`
  width: 150px;
  background-color: ${({ $cor }) => $cor + 90};
  padding: 5px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ease-in-out all 0.1s;
  user-select: none;
  cursor: ${({ $cursor }) => $cursor};

  &:hover {
    scale: 1.02;
    background-color: ${({ $cor }) => $cor + "CC"};
  }

  &:active {
    background-color: ${({ $cor }) => $cor};
    scale: 0.98;
  }
`;

const Overlay = styled.div<{ $visivel: boolean; $bg: string }>`
  width: 100vw;
  height: 100vh;
  background-color: ${({ $bg }) => `${$bg}90`};
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  alin-items: center;
  top: 0;
  left: 0;
  padding: 1%;
  z-index: 10;
  backdrop-filter: blur(3px);
  opacity: ${({ $visivel }) => ($visivel ? 1 : 0)};
  pointer-events: ${({ $visivel }) => ($visivel ? "auto" : "none")};
  transition: all 0.3s ease-in-out;
`;

interface CxModalProps {
  $border: string;
  $visivel: boolean;
  $bg: string;
}

const CxModal = styled.div<CxModalProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 7px;
  padding: 15px;
  width: 70%;
  border-radius: 22px;
  border: 1px solid ${({ $border }) => $border};
  background-color: ${({ $bg }) => $bg};
  position: absolute;
  z-index: 11;
  transform: ${({ $visivel }) => ($visivel ? "scale(1)" : "scale(0.6)")};
  opacity: ${({ $visivel }) => ($visivel ? 1 : 0)};
  pointer-events: ${({ $visivel }) => ($visivel ? "auto" : "none")};
  transition: all 0.3s ease-in-out;
  box-shadow: 4px 4px 8px #00000020;
`;

function ModalEditarMassa({
  visivel,
  setVisivel,
}: {
  visivel: any;
  setVisivel: any;
}) {
  const { Cor } = useTema();
  return (
    <Overlay
      $visivel={visivel}
      $bg={Cor.base}
      onClick={() => setVisivel(false)}
    >
      <CxModal
        $visivel={visivel}
        $bg={Cor.base}
        $border={Cor.texto2 + "50"}
        onClick={(e) => e.stopPropagation()}
      ></CxModal>
    </Overlay>
  );
}

interface CardProps {
  $cor: string;
  $direction: string;
  $padding: string;
}

const Card = styled.div<CardProps>`
  width: 25%;
  height: 100px;
  border-radius: 14px;
  background-color: ${({ $cor }) => $cor + 50};
  padding: ${({ $padding }) => $padding};
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  justify-content: space-between;
  transition: ease-in-out all 0.1s;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ $cor }) => $cor + 70};
    scale: 1.02;
  }

  &:active {
    background-color: ${({ $cor }) => $cor + 90};
    scale: 0.98;
  }
`;

const CardT = styled.div<CardProps>`
  width: 25%;
  height: 100px;
  border-radius: 14px;
  background-color: ${({ $cor }) => $cor};
  padding: ${({ $padding }) => $padding};
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  justify-content: space-between;
  transition: ease-in-out all 0.1s;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ $cor }) => $cor + "BB"};
    scale: 1.02;
  }

  &:active {
    background-color: ${({ $cor }) => $cor + "CC"};
    scale: 0.98;
  }
`;

function ResumoValores({
  listaRelatorio,
}: {
  listaRelatorio: any;
  filtro: any;
}) {
  const totais = listaRelatorio.reduce(
    (soma: any, voucher: any) => {
      const totalHoraParadaVoucher =
        (voucher.valorHoraParada || 0) * (voucher.qntTempoParado || 0);
      const totalHoraParadaRepasseVoucher =
        (voucher.valorHoraParadaRepasse || 0) * (voucher.qntTempoParado || 0);

      return {
        viagem: soma.viagem + (voucher.valorViagem || 0),
        viagemRepasse: soma.viagemRepasse + (voucher.valorViagemRepasse || 0),
        deslocamento: soma.deslocamento + (voucher.valorDeslocamento || 0),
        deslocamentoRepasse:
          soma.deslocamentoRepasse + (voucher.valorDeslocamentoRepasse || 0),
        pedagio: soma.pedagio + (voucher.valorPedagio || 0),
        // Aqui somamos os valores já calculados com o tempo parado
        horaParada: soma.horaParada + totalHoraParadaVoucher,
        horaParadaRepasse:
          soma.horaParadaRepasse + totalHoraParadaRepasseVoucher,
      };
    },
    {
      // Inicialização do acumulador
      viagem: 0,
      viagemRepasse: 0,
      deslocamento: 0,
      deslocamentoRepasse: 0,
      pedagio: 0,
      horaParada: 0,
      horaParadaRepasse: 0,
    },
  );

  console.log(totais);
  const totalViagem =
    totais.viagem + totais.deslocamento + totais.pedagio + totais.horaParada;

  const totalRepasse =
    totais.viagemRepasse +
    totais.deslocamentoRepasse +
    totais.pedagio +
    totais.horaParadaRepasse;

  function motoristasUnicos() {
    const totalMotoristas = new Set(
      listaRelatorio.map((v: any) => v.motorista.id),
    );

    return totalMotoristas.size || 0;
  }

  const lucro = totalViagem - totalRepasse;

  const porcentLucro = (lucro / totalViagem) * 100;

  const qntHP = listaRelatorio.reduce((soma: any, voucher: any) => {
    return soma + (voucher.qntTempoParado || 0);
  }, 0);

  const valorCobrancaHp = listaRelatorio.reduce((soma: any, voucher: any) => {
    return soma + (voucher.valorHoraParada * voucher.qntTempoParado || 0);
  }, 0);

  const valorRepasseHp = listaRelatorio.reduce((soma: any, voucher: any) => {
    return (
      soma + (voucher.valorHoraParadaRepasse * voucher.qntTempoParado || 0)
    );
  }, 0);

  const totalFixos = listaRelatorio.filter((v: any) => v.natureza === "Fixo");
  const totalExtras = listaRelatorio.filter((v: any) => v.natureza === "Extra");
  const totalTurnos = listaRelatorio.filter((v: any) => v.natureza === "Turno");

  function formatarValor(valor: any) {
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
    return valorFormatado;
  }

  function formatPorcentagem(valor: any) {
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(valor);

    return valorFormatado;
  }

  const { Cor } = useTema();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: 15,
        marginTop: 10,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      {/* Card Faturamento Bruto */}
      <CardT $cor={Cor.primaria} $direction="column" $padding="10px">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ fontWeight: "bolder", color: "#FFF", fontSize: 14 }}>
            Faturamento Bruto
          </p>
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bolder",
              fontSize: 24,
              color: "#FFFF",
            }}
          >
            local_activity
          </p>
        </div>
        <p style={{ fontWeight: "bolder", color: "#FFFF", fontSize: 30 }}>
          {formatarValor(totalViagem)}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <p style={{ color: "#FFFF", fontSize: 12 }}>Fat. líquido:</p>
          <p style={{ fontWeight: "bolder", color: "#FFFF", fontSize: 16 }}>
            {formatarValor(totalViagem - totalRepasse)} |{" "}
            <strong style={{ color: Cor.ativo }}>
              {formatPorcentagem(porcentLucro / 100)}
            </strong>
          </p>
        </div>
      </CardT>
      {/* Card Repasse Motoristas */}
      <Card $cor={Cor.texto2} $direction="column" $padding="10px">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ fontWeight: "bolder", color: Cor.texto1, fontSize: 14 }}>
            Total Repasses
          </p>
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bolder",
              fontSize: 24,
              color: Cor.texto1,
            }}
          >
            car_tag
          </p>
        </div>
        <p style={{ fontWeight: "bolder", color: Cor.atencao, fontSize: 28 }}>
          {formatarValor(totalRepasse)}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto1, fontSize: 12 }}>Total de: </p>
          <p
            style={{
              color: Cor.texto1,
              fontSize: 16,
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <strong style={{ color: Cor.secundaria, fontSize: 20 }}>
              {motoristasUnicos()}
            </strong>{" "}
            motoristas
          </p>
        </div>
      </Card>
      {/* Card Horas Paradas */}
      <Card $cor={Cor.texto2} $direction="row" $padding="8px">
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: Cor.texto1,
              fontSize: 14,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Total de Horas Paradas:
          </p>
          <p
            style={{
              fontSize: 34,
              textAlign: "center",
              fontWeight: "bold",
              color: Cor.secundaria,
            }}
          >
            {qntHP}h
          </p>
        </div>
        <div
          style={{
            width: 1,
            height: "100%",
            backgroundColor: Cor.texto2,
            margin: "0 5px",
          }}
        />
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "Flex-start",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Flex-start",
            }}
          >
            <p style={{ fontSize: 12, textAlign: "center", color: Cor.texto1 }}>
              Cobrança:{" "}
            </p>
            <strong
              style={{
                fontSize: 16,
                textAlign: "center",
                color: Cor.secundaria,
              }}
            >
              {formatarValor(valorCobrancaHp)}
            </strong>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Flex-start",
            }}
          >
            <p style={{ fontSize: 12, textAlign: "center", color: Cor.texto1 }}>
              Repasse:
            </p>
            <strong
              style={{
                fontSize: 16,
                textAlign: "center",
                color: Cor.secundaria,
              }}
            >
              {formatarValor(valorRepasseHp)}
            </strong>
          </div>
        </div>
      </Card>
      {/* Card Naturezas Voucher   */}
      <Card $cor={Cor.texto2} $direction="row" $padding="5px">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "33%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              borderRadius: "10px 0 0 10px",
              background:
                totalFixos.length === 0
                  ? `linear-gradient(to top, ${Cor.texto2 + 60},${Cor.texto2 + 15})`
                  : `linear-gradient(to top, ${Cor.fixo + 40},${Cor.fixo + 10})`,
            }}
          >
            <p
              style={{
                fontWeight: "bolder",
                color: totalFixos.length === 0 ? Cor.texto2 : Cor.textoFixo,
                fontSize: 32,
                borderBottom:
                  totalFixos.length === 0
                    ? `1px solid ${Cor.texto2}`
                    : `1px solid ${Cor.fixo}`,
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalFixos.length}
            </p>
            <p
              style={{
                color: totalFixos.length === 0 ? Cor.texto2 : Cor.textoFixo,
                fontWeight: 500,
              }}
            >
              Fixos
            </p>
          </div>
          <div
            style={{
              width: 1,
              height: "100%",
              backgroundColor: Cor.texto2,
            }}
          />
          <div
            style={{
              width: "33%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              background:
                totalExtras.length === 0
                  ? `linear-gradient(to top, ${Cor.texto2 + 60},${Cor.texto2 + 15})`
                  : `linear-gradient(to top, ${Cor.extra + 40},${Cor.extra + 10})`,
            }}
          >
            <p
              style={{
                fontWeight: "bolder",
                color: totalExtras.length === 0 ? Cor.texto2 : Cor.textoExtra,
                fontSize: 32,
                borderBottom:
                  totalExtras.length === 0
                    ? `1px solid ${Cor.texto2}`
                    : `1px solid ${Cor.extra}`,
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalExtras.length}
            </p>
            <p
              style={{
                color: totalExtras.length === 0 ? Cor.texto2 : Cor.textoExtra,
                fontWeight: 500,
              }}
            >
              Extras
            </p>
          </div>
          <div
            style={{
              width: 1,
              height: "100%",
              backgroundColor: Cor.texto2,
            }}
          />
          <div
            style={{
              width: "33%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              borderRadius: "0 10px 10px 0",
              background:
                totalTurnos.length === 0
                  ? `linear-gradient(to top, ${Cor.texto2 + 60},${Cor.texto2 + 15})`
                  : `linear-gradient(to top, ${Cor.turno + 40},${Cor.turno + 10})`,
            }}
          >
            <p
              style={{
                fontWeight: "bolder",
                color: totalTurnos.length === 0 ? Cor.texto2 : Cor.textoTurno,
                fontSize: 32,
                borderBottom:
                  totalTurnos.length === 0
                    ? `1px solid ${Cor.texto2}`
                    : `1px solid ${Cor.turno}`,
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalTurnos.length}
            </p>
            <p
              style={{
                color: totalTurnos.length === 0 ? Cor.texto2 : Cor.textoTurno,
                fontWeight: 500,
              }}
            >
              Turnos
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

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
            width: "10%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <BtnFiltrar $cor={Cor.primaria} onClick={() => handleFiltrar()}>
            Filtrar
          </BtnFiltrar>
        </div>
      </div>
    </div>
  );
}

interface BtnFiltrarProps {
  $cor: string;
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

  &:hover {
    scale: 1.02;
  }

  &:active {
    scale: 0.98;
  }
`;

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
