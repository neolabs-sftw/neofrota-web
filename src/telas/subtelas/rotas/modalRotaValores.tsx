import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTema } from "../../../hooks/temaContext";

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
  display: flex;
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
function ModalRotaValores({
  rota,
  modalRota,
  setModalRota,
}: {
  rota: any;
  modalRota: boolean;
  setModalRota: any;
}) {
  const [rotaOrigem, setRotaOrigem] = useState<string>("");
  const [rotaDestino, setRotaDestino] = useState<string>("");

  //   const { atualizarRotaComValores, loading } = useUpdateRotaComValores();

  const rotaValor = rota?.rotaValor;

  const [rotaValorSedan, setRotaValorSedan] = useState<any>();
  const [rotaValorMiniVan, setRotaValorMiniVan] = useState<any>();
  const [rotaValorVan, setRotaValorVan] = useState<any>();
  const [rotaValorMicro, setRotaValorMicro] = useState<any>();
  const [rotaValorOnibus, setRotaValorOnibus] = useState<any>();
  const [rotaValorMaterial, setRotaValorMaterial] = useState<any>();

  useEffect(() => {
    setRotaOrigem(rota?.origem ?? "");
    setRotaDestino(rota?.destino ?? "");
    setRotaValorSedan(rotaValor?.find((rV: any) => rV?.categoria === "Sedan"));
    setRotaValorMiniVan(
      rotaValor?.find((rV: any) => rV?.categoria === "MiniVan")
    );
    setRotaValorVan(rotaValor?.find((rV: any) => rV?.categoria === "Van"));
    setRotaValorMicro(rotaValor?.find((rV: any) => rV?.categoria === "Micro"));
    setRotaValorOnibus(
      rotaValor?.find((rV: any) => rV?.categoria === "Onibus")
    );
    setRotaValorMaterial(
      rotaValor?.find((rV: any) => rV?.categoria === "Material")
    );
  }, [
    rota,
    rotaValorSedan,
    rotaValorMiniVan,
    rotaValorVan,
    rotaValorMicro,
    rotaValorOnibus,
    rotaValorMaterial,
  ]);

  const linhasValores = [
    rotaValorSedan,
    rotaValorMiniVan,
    rotaValorVan,
    rotaValorMicro,
    rotaValorOnibus,
    rotaValorMaterial,
  ];

  console.log("linhasValores", linhasValores);

  async function salvarValores() {
    // Aqui eu salvo todas as categorias em "LinhaValores" de uma vez só
    console.log("Salvando valores...", linhasValores);
  }

  const Cor = useTema().Cor;

  return (
    <OverlayModalRota
      $bg={Cor.base2}
      $modal={modalRota}
      onClick={() => setModalRota(false)}
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
            onClick={() => setModalRota(false)}
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
                onChange={(e) => setRotaOrigem(e.target.value)}
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
                onChange={(e) => setRotaDestino(e.target.value)}
              />
            </div>
          </div>
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
        />
        <LinhaValores
          tipoCarro="Minivan/7"
          rotaValor={rotaValorMiniVan}
          setRotaValor={setRotaValorMiniVan}
        />
        <LinhaValores
          tipoCarro="Van"
          rotaValor={rotaValorVan}
          setRotaValor={setRotaValorVan}
        />
        <LinhaValores
          tipoCarro="Micro"
          rotaValor={rotaValorMicro}
          setRotaValor={setRotaValorMicro}
        />
        <LinhaValores
          tipoCarro="Ônibus"
          rotaValor={rotaValorOnibus}
          setRotaValor={setRotaValorOnibus}
        />
        <LinhaValores
          tipoCarro="Material"
          rotaValor={rotaValorMaterial}
          setRotaValor={setRotaValorMaterial}
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
              setModalRota(false);
              salvarValores();
              // Aqui eu salvo todas as categorias em "LinhaValores" de uma vez só
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
  );
}

function LinhaValores({
  tipoCarro,
  rotaValor,
  setRotaValor,
}: // setRotaValor,
{
  tipoCarro: string;
  rotaValor: any;
  setRotaValor: any;
}) {
  //   const logado = useAdminLogado();

  const [valorViagem, setValorViagem] = useState(rotaValor?.valorViagem || "");

  const [valorDeslocamento, setValorDeslocamento] = useState(
    rotaValor?.valorDeslocamento || ""
  );
  const [valorHoraParada, setValorHoraParada] = useState(
    rotaValor?.valorHoraParada || ""
  );

  const [valorViagemRepasse, setValorViagemRepasse] = useState(
    rotaValor?.valorViagemRepasse || ""
  );
  const [valorDeslocamentoRepasse, setValorDeslocamentoRepasse] = useState(
    rotaValor?.valorDeslocamentoRepasse || ""
  );
  const [valorHoraParadaRepasse, setValorHoraParadaRepasse] = useState(
    rotaValor?.valorHoraParadaRepasse || ""
  );

  // const [pedagio, setPedagio] = useState(rotaValor?.valorPedagio || "0");

  //   const pegadioSelecionado = listaPedagios?.find(
  //     (pedagio: any) => pedagio.id === rotaValor?.pedagioId
  //   );

  useEffect(() => {
    setValorViagem(rotaValor?.valorViagem || "");
    setValorDeslocamento(rotaValor?.valorDeslocamento || "");
    setValorHoraParada(rotaValor?.valorHoraParada || "");
    setValorViagemRepasse(rotaValor?.valorViagemRepasse || "");
    setValorDeslocamentoRepasse(rotaValor?.valorDeslocamentoRepasse || "");
    setValorHoraParadaRepasse(rotaValor?.valorHoraParadaRepasse || "");
  }, [rotaValor]);

  setRotaValor({
    valorViagem: Number(valorViagem),
    valorViagemRepasse: Number(valorViagemRepasse),
    valorDeslocamento: Number(valorDeslocamento),
    valorDeslocamentoRepasse: Number(valorDeslocamentoRepasse),
    valorHoraParada: Number(valorHoraParada),
    valorHoraParadaRepasse: Number(valorHoraParadaRepasse),
  });

  const Cor = useTema().Cor;

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
          cobrança={valorViagem}
          setCobrança={setValorViagem}
          repasse={valorViagemRepasse}
          setRepasse={setValorViagemRepasse}
        />
        <PilulaValores
          cobrança={valorDeslocamento}
          setCobrança={setValorDeslocamento}
          repasse={valorDeslocamentoRepasse}
          setRepasse={setValorDeslocamentoRepasse}
        />
        <PilulaValores
          cobrança={valorHoraParada}
          setCobrança={setValorHoraParada}
          repasse={valorHoraParadaRepasse}
          setRepasse={setValorHoraParadaRepasse}
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
            padding: 5,
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
            // value={pegadioSelecionado?.id || "0"}
            value={"0"}
            onChange={(e) => {
              // setPedagio(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option
              value="0"
              style={{
                color: Cor.texto1,
                appearance: "none",
                backgroundColor: Cor.secundaria + 50,
                padding: 8,
              }}
            >
              Sem Pedágio
            </option>
            {/* {listaPedagios?.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))} */}
          </select>
          <p
            style={{
              fontSize: 20,
              color: Cor.primariaTxt,
              fontFamily: "Icone",
              fontWeight: "bold",
            }}
          >
            arrow_drop_down
          </p>
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
  cobrança,
  setCobrança,
  repasse,
  setRepasse,
}: {
  cobrança: any;
  setCobrança: any;
  repasse: any;
  setRepasse: any;
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
          value={cobrança}
          onChange={(e) => {
            setCobrança(e.target.value);
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
          }}
        />
      </div>
    </div>
  );
}

export default ModalRotaValores;
