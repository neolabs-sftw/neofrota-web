import styled from "styled-components";
import { useTema } from "../../../hooks/temaContext";

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
  transition: all 0.1s ease-in-out;

  &:hover {
    border: 1px solid ${({ $primaira }) => $primaira + 30};
  }

  .abrirModal {
    width: 50px;
    height: 50px;
    background-color: ${({ $texto }) => $texto + 20};
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    p {
      font-size: 18px;
      transition: all 0.05s ease-in-out;
    }

    &:hover {
      background-color: ${({ $texto }) => $texto + 40};

      p {
        font-size: 24px;
      }
    }

    &:active {
      background-color: ${({ $texto }) => $texto + 60};
    }
  }
`;

function BtnRota({
  rota,
  modalRota,
  setModalRota,
  setRotaSelecionada,
}: {
  rota: any;
  modalRota: boolean;
  setModalRota: (modal: boolean) => void;
  setRotaSelecionada?: (rota: any) => void;
}) {
  const Cor = useTema().Cor;
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
          <p style={{ fontSize: 14, color: Cor.secundaria }}>
            Rota ID: {rota?.id}
          </p>

          <div
            style={{ width: "20%", height: 1, backgroundColor: Cor.secundaria }}
          />
          <p style={{ fontSize: 14, color: Cor.secundaria }}>Tributação: {rota?.tributacao}</p>
          <div
            className="abrirModal"
            onClick={() => {
              setModalRota(!modalRota);
              setRotaSelecionada?.(rota);
            }}
          >
            <p
              style={{
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
    </>
  );
}

export default BtnRota;
