import styled from "styled-components";
import { useTema } from "../hooks/temaContext";
import ModalPreviewVoucher from "./modalPreviewVoucher";
import { useEffect, useState } from "react";

interface BtnProximaViagemProps {
  $bg: string;
  $hover: string;
  $active: string;
}

const BtnProximaViagemStyled = styled.div<BtnProximaViagemProps>`
  width: 24.5%;
  height: 49.4%;
  border-radius: 18px;
  background-color: ${({ $bg }) => $bg};
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  cursor: pointer;
  transition: all 0.2s ease-in;
  box-shadow: 2px 2px 3px #00000030;

  &:hover {
    background-color: ${({ $hover }) => $hover};
  }

  &:active {
    background-color: ${({ $active }) => $active};
  }
`;

function BtnProximaViagem({
  natureza,
  tipo,
  id,
  cliente,
  motorista,
  origem,
  destino,
  data,
  hora,
}: {
  natureza: string;
  tipo: string;
  id: string;
  cliente: string;
  motorista: string;
  origem: string;
  destino: string;
  data: string;
  hora: string;
}) {
  const Cor = useTema().Cor;
  const bg = Cor.base;
  const hover = natureza === "fixo" ? Cor.fixo + 10 : Cor.extra + 10;
  const active = natureza === "fixo" ? Cor.fixo + 90 : Cor.extra + 90;

  const [modalView, setModalView] = useState(false);

  return (
    <>
      <BtnProximaViagemStyled
        $bg={bg}
        $active={active}
        $hover={hover}
        onClick={() => setModalView(true)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            ID: <strong>{id.toString().slice(0, 5)}</strong>...
          </p>
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: natureza === "fixo" ? Cor.fixo : Cor.extra,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: Cor.base,
              }}
            >
              {tipo === "entrada" ? "login" : "logout"}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Cliente: </p>
          <p
            style={{
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
              maxLines: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 15,
            }}
          >
            {cliente}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Motorista: </p>
          <p
            style={{
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
              maxLines: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 15,
            }}
          >
            {motorista}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
              maxLines: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: 12,
              width: "40%",
            }}
          >
            {origem}
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>x</p>
          <p
            style={{
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
              maxLines: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: 12,
              width: "40%",
            }}
          >
            {destino}
          </p>
        </div>
        <p
          style={{
            textAlign: "center",
            fontWeight: "400",
            fontSize: 18,
            color: Cor.texto1,
          }}
        >
          {data}
        </p>
        <div
          style={{ width: "100%", height: 1, backgroundColor: Cor.texto2 + 90 }}
        >
          <p style={{ color: "transparent" }}>s</p>
        </div>
        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 32,
            color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
          }}
        >
          {hora}
        </p>
      </BtnProximaViagemStyled>
      <ModalPreviewVoucher
        visivel={modalView}
        setVisivel={setModalView}
        natureza={natureza}
        id={id}
      />
    </>
  );
}

export default BtnProximaViagem;
