import styled from "styled-components";
import { useTema } from "../../../hooks/temaContext";
import { useEffect, useRef, useState } from "react";

interface BtnRotaProps {
  $bg: string;
  $sombra: string;
  $texto: string;
  $primaira: string;
}

const BtnRotaStyled = styled.div<BtnRotaProps>`
  width: calc(50% - 5px);
  background-color: ${({ $bg }) => $bg};
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 10px;
  box-shadow: ${({ $sombra }) => $sombra};
  border: 1px solid ${({ $texto }) => $texto + 20};
  transition: all 0.2s ease-in-out;

  &:hover {
    border: 1px solid ${({ $primaira }) => $primaira + 30};
  }
`;

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
  transition: all 0.3s ease-in-out;
`;

interface DividerHProps {
  $color: string;
}

const DividerH = styled.div<DividerHProps>`
  width: 100%;
  height: 1px;
  background-color: ${({ $color }) => $color};
`;

function BtnRota({ rota }: { rota: any }) {
  const [modalRota, setModalRota] = useState(false);

  const Cor = useTema().Cor;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRota && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalRota]);

  return (
    <>
      <BtnRotaStyled
        $bg={Cor.base2}
        $sombra={Cor.sombra}
        $texto={Cor.texto1}
        $primaira={Cor.primaria}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 5,
          }}
        >
          <p style={{ fontSize: 14, color: Cor.secundaria }}>Rota</p>
          <div
            style={{ width: "80%", height: 1, backgroundColor: Cor.secundaria }}
          />
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: Cor.texto2 + 40,
              borderRadius: 14,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setModalRota(!modalRota)}
          >
            <p
              style={{
                fontSize: 18,
                color: Cor.primaria,
                fontWeight: "bold",
                fontFamily: "Icone",
              }}
            >
              open_in_full
            </p>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "45%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 40,
              backgroundColor: Cor.texto2 + 15,
              borderRadius: 14,
              padding: 10,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.secundaria }}>Origem: </p>
            <div
              style={{
                width: "75%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {rota?.origem}
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: 24,
              color: Cor.primaria,
              fontFamily: "Icone",
              fontWeight: "bold",
            }}
          >
            start
          </p>
          <div
            style={{
              width: "45%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 40,
              backgroundColor: Cor.texto2 + 15,
              borderRadius: 14,
              padding: 10,
            }}
          >
            <p style={{ fontSize: 11, color: Cor.secundaria }}>Destino: </p>
            <div
              style={{
                width: "75%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
               {rota?.destino}
              </p>
            </div>
          </div>
        </div>
      </BtnRotaStyled>
      <OverlayModalRota
        ref={modalRef}
        $bg={Cor.base2}
        $modal={modalRota}
        tabIndex={0}
        onClick={() => setModalRota(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setModalRota(false);
          }
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
                <p
                  style={{
                    fontSize: 22,
                    color: Cor.secundaria,
                    fontWeight: "bold",
                  }}
                >
                 {rota?.origem}
                </p>
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
                <p
                  style={{
                    fontSize: 22,
                    color: Cor.secundaria,
                    fontWeight: "bold",
                  }}
                >
                  {rota?.destino}
                </p>
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
              }}
            >
              <p
                style={{
                  width: "32%",
                  fontSize: 12,
                  color: Cor.secundaria,
                  textAlign: "center",
                }}
              >
                Valor Principal
              </p>
              <p
                style={{
                  width: "32%",
                  fontSize: 12,
                  color: Cor.secundaria,
                  textAlign: "center",
                }}
              >
                Valor Desloc.
              </p>
              <p
                style={{
                  width: "32%",
                  fontSize: 12,
                  color: Cor.secundaria,
                  textAlign: "center",
                }}
              >
                Valor H. Parada
              </p>
            </div>
          </div>
          <LinhaValores tipoCarro="Hatch/Sedan" />
          <LinhaValores tipoCarro="Minivan/7" />
          <LinhaValores tipoCarro="Van" />
          <LinhaValores tipoCarro="Micro" />
          <LinhaValores tipoCarro="Ônibus" />
          <LinhaValores tipoCarro="Material" />
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
              // Aqui eu saldo todas as categorias em "LinhaValores" de uma vez só
            }}
          >
            <p style={{ fontSize: 14, color: Cor.primariaTxt, fontWeight: "bold" }}>
              Salvar
            </p>
          </div>
        </div>
        </ModalRota>
      </OverlayModalRota>
    </>
  );
}

function LinhaValores({ tipoCarro }: { tipoCarro: string }) {
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
        <PilulaValores />
        <PilulaValores />
        <PilulaValores />
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

function PilulaValores() {
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
          justifyContent: "center",
          borderTop: `1px solid ${Cor.secundaria + 99}`,
          borderBottom: `1px solid ${Cor.secundaria + 99}`,
          borderLeft: `1px solid ${Cor.secundaria + 99}`,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      >
        <InputValores $corTexto={Cor.secundaria} placeholder="Cobrança" />
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: Cor.primaria + 10,
          height: "100%",
          borderLeft: `3px solid ${Cor.texto1}`,
          borderTop: `1px solid ${Cor.primaria + 99}`,
          borderBottom: `1px solid ${Cor.primaria + 99}`,
          borderRight: `1px solid ${Cor.primaria + 99}`,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <InputValores $corTexto={Cor.primaria} placeholder="Repasse" />
      </div>
    </div>
  );
}

export default BtnRota;
