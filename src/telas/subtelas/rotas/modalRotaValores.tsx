import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTema } from "../../../hooks/temaContext";
import {
  useRotasExtas,
  useUpdateRotaComValores,
} from "../../../hooks/useRotasExtras";
import CircularProgress from "@mui/material/CircularProgress";

interface OverlayRotaProps {
  $bg: string;
  $modal: boolean;
}
const OverlayModalRota = styled.div<OverlayRotaProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ $bg }) => $bg + 50};
  backdrop-filter: blur(2px);
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  pointer-events: ${({ $modal }) => ($modal ? "auto" : "none")};
  z-index: 10;
  display: ${({ $modal }) => ($modal ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  trasition: all 0.5s ease-in-out;
`;

interface ModalRotaProps {
  $bg: string;
  $modal: boolean;
  $sombra: string;
  $borda: string;
}

const ModalRota = styled.div<ModalRotaProps>`
  width: 70%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ $bg }) => $bg};
  position: absolute;
  border-radius: 22px;
  z-index: 11;
  transform: ${({ $modal }) => ($modal ? "scale(1)" : "scale(0.6)")};
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  border: 1px solid ${({ $borda }) => $borda};
  pointer-events: ${({ $modal }) => ($modal ? "auto" : "none")};
  box-shadow: ${({ $sombra }) => $sombra};
  transition: all 0.2s ease-in-out;
`;

interface DividerHProps {
  $color: string;
}

const DividerH = styled.div<DividerHProps>`
  width: 100%;
  height: 1px;
  background-color: ${({ $color }) => $color};
`;

function JanelaSalvando() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: Cor.base2 + 50,
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 12,
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          width: "10%",
          height: "25%",
          padding: 22,
          backgroundColor: Cor.base,
          borderRadius: 22,
          boxShadow: Cor.sombra,
          border: "1px solid" + Cor.texto1 + 50,
        }}
      >
        <CircularProgress sx={{ color: Cor.primaria }} thickness={5} />
        <p style={{ color: Cor.texto1 }}>Salvando...</p>
      </div>
    </div>
  );
}

function ModalRotaValores({
  rota,
  modalRota,
  setModalRota,
  listaPedagios,
}: {
  rota: any;
  modalRota: boolean;
  setModalRota: any;
  listaPedagios: any;
}) {
  const [rotaOrigem, setRotaOrigem] = useState<string>("");
  const [rotaDestino, setRotaDestino] = useState<string>("");
  const [rotaTributacao, setRotaTributacao] = useState<string>("");

  const [rotaValorSedan, setRotaValorSedan] = useState<any>();
  const [rotaValorMiniVan, setRotaValorMiniVan] = useState<any>();
  const [rotaValorVan, setRotaValorVan] = useState<any>();
  const [rotaValorMicro, setRotaValorMicro] = useState<any>();
  const [rotaValorOnibus, setRotaValorOnibus] = useState<any>();
  const [rotaValorMaterial, setRotaValorMaterial] = useState<any>();

  const { refetch: refetchRotas } = useRotasExtas(
    rota?.empresaClienteId.id || "",
  );
  const { atualizarRotaComValores, loading } = useUpdateRotaComValores();

  // Quando o modal abre ou a rota muda, preenchemos os estados com os dados reais
  useEffect(() => {
    if (modalRota && rota) {
      setRotaOrigem(rota.origem ?? "");
      setRotaDestino(rota.destino ?? "");
      setRotaTributacao(rota.tributacao ?? "");

      const rValor = rota.rotaValor || [];
      setRotaValorSedan(rValor.find((rV: any) => rV?.categoria === "Sedan"));
      setRotaValorMiniVan(
        rValor.find((rV: any) => rV?.categoria === "MiniVan"),
      );
      setRotaValorVan(rValor.find((rV: any) => rV?.categoria === "Van"));
      setRotaValorMicro(rValor.find((rV: any) => rV?.categoria === "Micro"));
      setRotaValorOnibus(rValor.find((rV: any) => rV?.categoria === "Onibus"));
      setRotaValorMaterial(
        rValor.find((rV: any) => rV?.categoria === "Material"),
      );

    }
  }, [modalRota, rota]);

  async function salvarValores() {
    const valoresBrutos = [
      rotaValorMaterial,
      rotaValorMicro,
      rotaValorMiniVan,
      rotaValorOnibus,
      rotaValorSedan,
      rotaValorVan,
    ].filter(Boolean);

    // Mapeia para o exato formato do 'RotaValorUpsertInput' do Backend
    // Removendo __typename, id e rotaId, e forçando os números
    const valoresLimpos = valoresBrutos.map((rv: any) => ({
      categoria: rv.categoria,
      valorViagem: Number(rv.valorViagem || 0),
      valorViagemRepasse: Number(rv.valorViagemRepasse || 0),
      valorHoraParada: Number(rv.valorHoraParada || 0),
      valorHoraParadaRepasse: Number(rv.valorHoraParadaRepasse || 0),
      valorDeslocamento: Number(rv.valorDeslocamento || 0),
      valorDeslocamentoRepasse: Number(rv.valorDeslocamentoRepasse || 0),
      // Transforma string vazia em null para satisfazer o Float do GraphQL
      valorPedagio:
        rv.valorPedagio && rv.valorPedagio !== ""
          ? Number(rv.valorPedagio)
          : null,
    }));

    await atualizarRotaComValores({
      destino: rotaDestino,
      origem: rotaOrigem,
      empresaClienteId: rota?.empresaClienteId?.id,
      id: rota?.id,
      operadoraId: rota?.operadoraId?.id,
      rotaValores: valoresLimpos,
      tributacao: rotaTributacao,
    });

    refetchRotas();
    setModalRota(false);
    window.location.reload();
  }

  const Cor = useTema().Cor;

  return (
    <>
      {loading ? <JanelaSalvando /> : null}
      <OverlayModalRota
        $bg={Cor.base2}
        $modal={modalRota}
        onClick={() => {
          setModalRota(false);
        }}
      >
        <ModalRota
          $bg={Cor.base2}
          $modal={modalRota}
          $sombra={Cor.sombra}
          $borda={Cor.texto2 + 50}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: 10,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: Cor.texto2 + 10,
              borderRadius: "22px 22px 0px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <p style={{ fontSize: 14, color: Cor.primariaTxt }}>Rota: </p>
              <p
                style={{
                  fontSize: 16,
                  color: Cor.secundaria,
                  fontWeight: "bold",
                }}
              >
                ID: {rota?.id}
              </p>
            </div>
            <p
              style={{
                fontSize: 24,
                color: Cor.primaria,
                fontWeight: "bold",
                fontFamily: "Icone",
                cursor: "pointer",
              }}
              onClick={() => {
                setModalRota(false);
              }}
            >
              close
            </p>
          </div>
          <DividerH $color={Cor.secundaria + 50} />
          <div
            style={{
              padding: 10,
              width: "100%",
              height: "80px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Cor.base + 80,
              gap: 10,
            }}
          >
            <div
              style={{
                width: "35%",
                height: "100%",
                backgroundColor: Cor.texto2 + 25,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "30%",
                }}
              >
                <p style={{ fontSize: 11, color: Cor.primariaTxt }}>Origem:</p>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "70%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  style={{
                    appearance: "none",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: Cor.base,
                    border: "1px solid " + Cor.texto2 + 50,
                    borderRadius: 8,
                    fontSize: 18,
                    color: Cor.secundaria,
                    fontWeight: "400",
                  }}
                  value={rotaOrigem}
                  onChange={(e) => {
                    setRotaOrigem(e.target.value);
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: 32,
                color: Cor.secundaria,
                fontWeight: "bold",
                fontFamily: "Icone",
              }}
            >
              start
            </p>
            <div
              style={{
                width: "35%",
                height: "100%",
                backgroundColor: Cor.texto2 + 25,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "30%",
                }}
              >
                <p style={{ fontSize: 11, color: Cor.primariaTxt }}>Destino:</p>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "70%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  style={{
                    appearance: "none",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: Cor.base,
                    border: "1px solid " + Cor.texto2 + 50,
                    borderRadius: 8,
                    fontSize: 18,
                    color: Cor.secundaria,
                    fontWeight: "400",
                  }}
                  value={rotaDestino}
                  onChange={(e) => {
                    setRotaDestino(e.target.value);
                  }}
                />
              </div>
            </div>
            <select
              style={{
                padding: 10,
                borderRadius: 22,
                border: "none",
                outline: "none",
                backgroundColor: Cor.texto2 + 20,
                color: Cor.texto1,
              }}
              value={rotaTributacao}
              onChange={(e) => {
                setRotaTributacao(e.target.value);
              }}
            >
              <option
                value=""
                disabled
                style={{ backgroundColor: Cor.base, color: Cor.texto1 }}
              >
                Tributação
              </option>
              <option
                value="ISS"
                style={{ backgroundColor: Cor.base, color: Cor.texto1 }}
              >
                ISS
              </option>
              <option
                value="ISCM"
                style={{ backgroundColor: Cor.base, color: Cor.texto1 }}
              >
                ISCM
              </option>
            </select>
          </div>
          <DividerH $color={Cor.secundaria + 50} />
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div
              style={{
                padding: 10,
                width: "100%",
                marginLeft: "10%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: Cor.texto2 + 10,
              }}
            >
              <div
                style={{
                  width: "25%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: Cor.secundaria,
                    textAlign: "center",
                  }}
                >
                  Valor Principal
                </p>
              </div>

              <div
                style={{
                  width: "25%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: Cor.secundaria,
                    textAlign: "center",
                  }}
                >
                  Valor Desloc.
                </p>
              </div>
              <div
                style={{
                  width: "25%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: Cor.secundaria,
                    textAlign: "center",
                  }}
                >
                  Valor H. Parada
                </p>
              </div>
              <p
                style={{
                  width: "20%",
                  fontSize: 12,
                  color: Cor.secundaria,
                  textAlign: "center",
                }}
              >
                Pedágio
              </p>
            </div>
          </div>
          <LinhaValores
            tipoCarro="Hatch/Sedan"
            rotaValor={rotaValorSedan}
            setRotaValor={setRotaValorSedan}
            listaPedagios={listaPedagios}
          />
          <LinhaValores
            tipoCarro="Minivan/7"
            rotaValor={rotaValorMiniVan}
            setRotaValor={setRotaValorMiniVan}
            listaPedagios={listaPedagios}
          />
          <LinhaValores
            tipoCarro="Van"
            rotaValor={rotaValorVan}
            setRotaValor={setRotaValorVan}
            listaPedagios={listaPedagios}
          />
          <LinhaValores
            tipoCarro="Micro"
            rotaValor={rotaValorMicro}
            setRotaValor={setRotaValorMicro}
            listaPedagios={listaPedagios}
          />
          <LinhaValores
            tipoCarro="Ônibus"
            rotaValor={rotaValorOnibus}
            setRotaValor={setRotaValorOnibus}
            listaPedagios={listaPedagios}
          />
          <LinhaValores
            tipoCarro="Material"
            rotaValor={rotaValorMaterial}
            setRotaValor={setRotaValorMaterial}
            listaPedagios={listaPedagios}
          />
          <DividerH $color={Cor.secundaria + 50} />
          <div
            style={{
              width: "100%",
              padding: "10px 15px 15px 15px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <div
              style={{
                cursor: "pointer",
                backgroundColor: Cor.primaria,
                padding: "10px 50px",
                borderRadius: 22,
              }}
              onClick={() => {
                salvarValores();
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                }}
              >
                Salvar
              </p>
            </div>
          </div>
        </ModalRota>
      </OverlayModalRota>
    </>
  );
}
function LinhaValores({
  tipoCarro,
  rotaValor,
  setRotaValor,
  listaPedagios,
}: {
  tipoCarro: string;
  rotaValor: any;
  setRotaValor: any;
  listaPedagios: any[];
}) {
  const Cor = useTema().Cor;

  // Estados principais
  const [valorViagem, setValorViagem] = useState<string>("");
  const [valorDeslocamento, setValorDeslocamento] = useState<string>("");
  const [valorHoraParada, setValorHoraParada] = useState<string>("");
  const [valorViagemRepasse, setValorViagemRepasse] = useState<string>("");
  const [valorDeslocamentoRepasse, setValorDeslocamentoRepasse] =
    useState<string>("");
  const [valorHoraParadaRepasse, setValorHoraParadaRepasse] =
    useState<string>("");
  const [valorPedagio, setValorPedagio] = useState<string>("");

  // CORREÇÃO 1: Começamos com "null" para saber que o usuário ainda não digitou.
  // Assim, se ele digitar e depois apagar (ficando ""), o sistema aceita o "" (que vira 0) e não puxa o número antigo!
  const [valorTempViagem, setValorTempViagem] = useState<string | null>(null);
  const [valorTempDeslocamento, setValorTempDeslocamento] = useState<
    string | null
  >(null);
  const [valorTempHoraParada, setValorTempHoraParada] = useState<string | null>(
    null,
  );
  const [valorTempViagemRepasse, setValorTempViagemRepasse] = useState<
    string | null
  >(null);
  const [valorTempDeslocamentoRepasse, setValorTempDeslocamentoRepasse] =
    useState<string | null>(null);
  const [valorTempHoraParadaRepasse, setValorTempHoraParadaRepasse] = useState<
    string | null
  >(null);
  const [valorTempPedagio, setValorTempPedagio] = useState<string | null>(null);

  // Trava para evitar que envie zeros para o pai na hora que o modal abre
  const isFirstRender = useRef(true);

  // 1) Apenas preenche com os dados do banco.
  // CORREÇÃO 2: Removemos os setValorTemp...("") daqui para quebrar o loop infinito!
  useEffect(() => {
    setValorViagem(rotaValor?.valorViagem ?? "");
    setValorDeslocamento(rotaValor?.valorDeslocamento ?? "");
    setValorHoraParada(rotaValor?.valorHoraParada ?? "");
    setValorViagemRepasse(rotaValor?.valorViagemRepasse ?? "");
    setValorDeslocamentoRepasse(rotaValor?.valorDeslocamentoRepasse ?? "");
    setValorHoraParadaRepasse(rotaValor?.valorHoraParadaRepasse ?? "");
    setValorPedagio(rotaValor?.valorPedagio?.id ?? "");;
  }, [rotaValor?.id]);

  // 2) Dispara o update para o pai conforme você digita
  useEffect(() => {
    // Se for a primeira vez que a tela carrega, não faz nada para não apagar os dados do banco.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Se valorTemp não for null (ou seja, o usuário interagiu), usa ele. Se não, usa o original do banco.
    setRotaValor((prev: any) => ({
      ...prev,
      categoria: prev?.categoria || rotaValor?.categoria || tipoCarro,
      valorPedagio: valorTempPedagio !== null ? valorTempPedagio : valorPedagio,
      valorDeslocamento: Number(
        valorTempDeslocamento !== null
          ? valorTempDeslocamento
          : valorDeslocamento,
      ),
      valorDeslocamentoRepasse: Number(
        valorTempDeslocamentoRepasse !== null
          ? valorTempDeslocamentoRepasse
          : valorDeslocamentoRepasse,
      ),
      valorHoraParada: Number(
        valorTempHoraParada !== null ? valorTempHoraParada : valorHoraParada,
      ),
      valorHoraParadaRepasse: Number(
        valorTempHoraParadaRepasse !== null
          ? valorTempHoraParadaRepasse
          : valorHoraParadaRepasse,
      ),
      valorViagem: Number(
        valorTempViagem !== null ? valorTempViagem : valorViagem,
      ),
      valorViagemRepasse: Number(
        valorTempViagemRepasse !== null
          ? valorTempViagemRepasse
          : valorViagemRepasse,
      ),
    }));
  }, [
    valorPedagio,
    valorDeslocamento,
    valorDeslocamentoRepasse,
    valorHoraParada,
    valorHoraParadaRepasse,
    valorViagem,
    valorViagemRepasse,
    valorTempPedagio,
    valorTempDeslocamento,
    valorTempDeslocamentoRepasse,
    valorTempHoraParada,
    valorTempHoraParadaRepasse,
    valorTempViagem,
    valorTempViagemRepasse,
  ]);

  return (
    <div
      style={{
        padding: "0 15px",
        width: "100%",
        margin: "10px 0px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ fontSize: 14, color: Cor.primariaTxt, width: "10%" }}>
        {tipoCarro} :
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          gap: 5,
          width: "90%",
        }}
      >
        <PilulaValores
          cobranca={valorViagem}
          setCobranca={setValorViagem}
          setTempCobranca={setValorTempViagem}
          repasse={valorViagemRepasse}
          setRepasse={setValorViagemRepasse}
          setTempRepasse={setValorTempViagemRepasse}
        />
        <PilulaValores
          cobranca={valorDeslocamento}
          setCobranca={setValorDeslocamento}
          setTempCobranca={setValorTempDeslocamento}
          repasse={valorDeslocamentoRepasse}
          setRepasse={setValorDeslocamentoRepasse}
          setTempRepasse={setValorTempDeslocamentoRepasse}
        />
        <PilulaValores
          cobranca={valorHoraParada}
          setCobranca={setValorHoraParada}
          setTempCobranca={setValorTempHoraParada}
          repasse={valorHoraParadaRepasse}
          setRepasse={setValorHoraParadaRepasse}
          setTempRepasse={setValorTempHoraParadaRepasse}
        />

        <div
          style={{
            width: "15%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Cor.secundaria + 50,
            borderRadius: 22,
            padding: 10,
          }}
        >
          <select
            style={{
              appearance: "none",
              outline: "none",
              border: "none",
              width: "100%",
              height: "100%",
              color: Cor.texto1,
              backgroundColor: "transparent",
            }}
            value={valorPedagio}
            onChange={(e) => {
              setValorPedagio(e.target.value);
              setValorTempPedagio(e.target.value);
            }}
          >
            <option
              value=""
              style={{
                color: Cor.texto1,
                backgroundColor: Cor.secundaria + 50,
                padding: 8,
              }}
            >
              Sem Pedágio
            </option>

            {listaPedagios?.map((p: any) => (
              <option
                key={p.id}
                value={p.id}
                style={{
                  color: Cor.texto1,
                  backgroundColor: Cor.base2,
                  padding: 8,
                }}
              >
                {p.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

interface InputValoresProps {
  $corTexto: string;
}

const InputValores = styled.input.attrs<InputValoresProps>({ type: "number" })`
  -moz-appearance: textfield;
  appearance: textfield;
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $corTexto }) => $corTexto};

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: #777;
    font-size: 12px;
  }
`;

function PilulaValores({
  cobranca,
  setCobranca,
  setTempCobranca,
  repasse,
  setRepasse,
  setTempRepasse,
}: {
  cobranca: any;
  setCobranca: any;
  setTempCobranca: any;
  repasse: any;
  setRepasse: any;
  setTempRepasse: any;
}) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "25%",
        height: 35,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          backgroundColor: Cor.secundaria + 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          borderTop: `1px solid ${Cor.secundaria + 99}`,
          borderBottom: `1px solid ${Cor.secundaria + 99}`,
          borderLeft: `1px solid ${Cor.secundaria + 99}`,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: Cor.primariaTxt,
            fontWeight: "400",
            marginLeft: 5,
          }}
        >
          R$
        </p>
        <InputValores
          $corTexto={Cor.secundaria}
          placeholder="Cobrança"
          value={cobranca}
          onChange={(e) => {
            setCobranca(e.target.value);
            setTempCobranca(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: Cor.primaria + 10,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: `3px solid ${Cor.texto1}`,
          borderTop: `1px solid ${Cor.primaria + 99}`,
          borderBottom: `1px solid ${Cor.primaria + 99}`,
          borderRight: `1px solid ${Cor.primaria + 99}`,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: Cor.primariaTxt,
            fontWeight: "400",
            marginLeft: 5,
          }}
        >
          R$
        </p>
        <InputValores
          $corTexto={Cor.primaria}
          placeholder="Repasse"
          value={repasse}
          onChange={(e) => {
            setRepasse(e.target.value);
            setTempRepasse(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default ModalRotaValores;
