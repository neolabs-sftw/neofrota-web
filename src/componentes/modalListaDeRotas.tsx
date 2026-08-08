import styled from "styled-components";
import { useTema } from "../hooks/temaContext";
import { useState } from "react";

interface BtnBuscarRotaProps {
  $cor: string;
}

const BtnBuscarRota = styled.div<BtnBuscarRotaProps>`
  width: 100%;
  border: 1px solid ${({ $cor }) => $cor + 50};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  background-color: transparent;
  transition: all ease-in-out 0.2s;

  &:hover {
    background-color: ${({ $cor }) => $cor + 10};
  }

  &:active {
    background-color: ${({ $cor }) => $cor + 55};
    box-shadow: 1px 1px 2px #00000030;
  }
`;

function ModalRota({
  CxModal,
  setCxModal,
  listaRotas,
  setRotaExtra,
}: {
  CxModal: any;
  setCxModal: any;
  listaRotas: any;
  setRotaExtra: any;
  rotaExtra: any;
}) {
  const [buscarRota, setBuscarRota] = useState<string>("");

  const { Cor } = useTema();

  function normalizarTexto(texto: string | null | undefined) {
    return (texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const listaFiltrada =
    listaRotas?.filter((rota: any) => {
      const origemN = normalizarTexto(rota.origem);
      const destinoN = normalizarTexto(rota.destino);

      const porOrigem = origemN.includes(normalizarTexto(buscarRota));
      const porDestino = destinoN.includes(normalizarTexto(buscarRota));
      return porOrigem || porDestino;
    }) || [];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        zIndex: 10,
        top: 0,
        left: 0,
        backgroundColor: Cor.base2 + 50,
        backdropFilter: "blur(2.5px)",
        justifyContent: "center",
        alignItems: "center",
        opacity: CxModal ? 1 : 0,
        transition: `ease-in-out all 0.2s`,
        pointerEvents: CxModal ? "auto" : "none",
      }}
      onClick={() => setCxModal(false)}
    >
      <div
        style={{
          width: "50%",
          backgroundColor: Cor.base,
          borderRadius: 22,
          display: "flex",
          padding: 10,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          transition: `ease-in-out all 0.2s`,
          scale: CxModal ? 1 : 0.6,
          gap: 10,
          border: "1px solid" + Cor.texto2 + 50,
          boxShadow: Cor.sombra,
        }}
        onClick={(e) => {
          e.stopPropagation();
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
          <p style={{ color: Cor.texto2, fontSize: 12 }}>Busque aqui a rota:</p>
          <TextoEntrada
            placeholder="pesquise aqui..."
            type="text"
            largura="80%"
            onChange={(e) => setBuscarRota(e.target.value)}
            value={buscarRota}
          />
        </div>
        <div
          style={{ width: "100%", backgroundColor: Cor.texto2, height: 1 }}
        />
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
            height: 250,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            backgroundColor: Cor.base2,
            padding: 8,
            overflow: "auto",
            scrollbarColor: Cor.primaria,
          }}
        >
          {listaFiltrada.map((r: any) => {
            const valorSedan = r?.rotaValor.find(
              (r: any) => r.categoria === "Sedan",
            );
            const valorMiniVan = r?.rotaValor.find(
              (r: any) => r.categoria === "MiniVan",
            );
            const valorVan = r?.rotaValor.find(
              (r: any) => r.categoria === "Van",
            );
            const valorMicro = r?.rotaValor.find(
              (r: any) => r.categoria === "Micro",
            );
            const valorOnibus = r?.rotaValor.find(
              (r: any) => r.categoria === "Onibus",
            );
            const valorMaterial = r?.rotaValor.find(
              (r: any) => r.categoria === "Material",
            );
            return (
              <div
                key={r.id}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: Cor.base,
                  padding: 5,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: `1px solid ${Cor.texto2 + 20}`,
                }}
                onClick={() => {
                  (setRotaExtra(r), setCxModal(false));
                }}
              >
                <div
                  style={{
                    width: "65%",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      color: Cor.texto1,
                    }}
                  >
                    {r.origem} X {r.destino}
                  </p>
                </div>
                <div
                  style={{
                    width: "35%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <IconeCategoria rotaValor={valorSedan} />
                  <IconeCategoria rotaValor={valorMiniVan} />
                  <IconeCategoria rotaValor={valorVan} />
                  <IconeCategoria rotaValor={valorMicro} />
                  <IconeCategoria rotaValor={valorOnibus} />
                  <IconeCategoria rotaValor={valorMaterial} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IconeCategoria({ rotaValor }: { rotaValor: any }) {
  const { Cor } = useTema();
  const icone =
    rotaValor.categoria === "Sedan"
      ? "local_taxi"
      : rotaValor.categoria === "MiniVan"
        ? "filter_7"
        : rotaValor.categoria === "Van"
          ? "airport_shuttle"
          : rotaValor.categoria === "Micro"
            ? "airport_shuttle"
            : rotaValor.categoria === "Onibus"
              ? "directions_bus"
              : rotaValor.categoria === "Material"
                ? "package_2"
                : null;

  const [tooltip, setTooltip] = useState(false);

  return (
    <div
      title={rotaValor.categoria}
      style={{
        position: "relative",
        backgroundColor:
          rotaValor.valorViagem > 0 || rotaValor.valorViagemRepasse > 0
            ? Cor.ativo + 50
            : Cor.texto2 + 10,
        color:
          rotaValor.valorViagem > 0 || rotaValor.valorViagemRepasse > 0
            ? Cor.ativo
            : Cor.texto2 + 90,
        borderRadius: 8,
        width: 30,
        aspectRatio: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${
          rotaValor.valorViagem > 0 || rotaValor.valorViagemRepasse > 0
            ? Cor.ativo + 80
            : Cor.texto2 + 30
        }`,
      }}
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      <p style={{ fontFamily: "Icone" }}>{icone}</p>
      <div
        style={{
          display: tooltip ? "flex" : "none",
          top: -25,
          right: -10,
          position: "absolute",
          backgroundColor: Cor.base2,
          padding: 3,
          borderRadius: 4,
          color: Cor.texto1,
          border: `1px solid ${Cor.texto2 + 50}`,
          zIndex: 100,
        }}
      >
        {rotaValor.categoria}
      </div>
    </div>
  );
}

export default function ModalListaDeRotas({
  listaRotas,
  setRotaExtra,
  rotaExtra,
}: {
  listaRotas: any;
  setRotaExtra: any;
  rotaExtra: any;
}) {
  const [CxModal, setCxModal] = useState<boolean>();
  const { Cor } = useTema();

  console.log(rotaExtra)

  return (
    <>
      <BtnBuscarRota
        $cor={listaRotas?.length === 0 ? Cor.texto2 : Cor.texto1}
        onClick={listaRotas?.length === 0 ? undefined : () => setCxModal(true)}
      >
        <p
          style={{
            color: listaRotas?.length === 0 ? Cor.texto2 + 70 : Cor.texto1,
            fontSize: 14,
          }}
        >
          {rotaExtra
            ? `${rotaExtra.origem} X ${rotaExtra.destino}`
            : "Selecione sua Rota"}
        </p>
        <p
          style={{
            fontFamily: "Icone",
            color: Cor.texto2,
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          keyboard_arrow_down
        </p>
      </BtnBuscarRota>
      <ModalRota
        CxModal={CxModal}
        setCxModal={setCxModal}
        listaRotas={listaRotas}
        rotaExtra={rotaExtra}
        setRotaExtra={setRotaExtra}
      />
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
