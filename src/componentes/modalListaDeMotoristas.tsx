import { useEffect, useRef, useState } from "react";
import { useTema } from "../hooks/temaContext";
import styled from "styled-components";
import { useCarros } from "../hooks/useCarros";

interface BtnBuscarMotoristaProps {
  $cor: string;
}

const BtnBuscarMotorista = styled.div<BtnBuscarMotoristaProps>`
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

export default function ModalListaDeMotoristas({
  listaMotoristas,
  motoristaSelecionado,
  setMotorista,
  habilitar,
}: {
  listaMotoristas: any;
  motoristaSelecionado: any;
  setMotorista: any;
  habilitar: any;
}) {
  const [CxModal, setCxModal] = useState<boolean>();
  const { Cor } = useTema();
  return (
    <>
      <BtnBuscarMotorista
        $cor={habilitar ? Cor.texto1 : Cor.texto2}
        onClick={habilitar ? () => setCxModal(true) : undefined}
      >
        <p
          style={{
            color: habilitar ? Cor.texto1 : Cor.texto2 + 70,
            fontSize: 14,
          }}
        >
          {motoristaSelecionado
            ? `${motoristaSelecionado?.nome || ""}`
            : "Selecione um Motorista"}
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
      </BtnBuscarMotorista>
      <ModalMotoristas
        CxModal={CxModal}
        setCxModal={setCxModal}
        listaMotoristas={listaMotoristas}
        setMotorista={setMotorista}
      />
    </>
  );
}

function ModalMotoristas({
  CxModal,
  setCxModal,
  listaMotoristas,
  setMotorista,
}: {
  CxModal: any;
  setCxModal: any;
  listaMotoristas: any;
  setMotorista: any;
}) {
  const [buscar, setBuscar] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { Cor } = useTema();

  function normalizarTexto(texto: string | null | undefined) {
    return (texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const listaFiltrada =
    listaMotoristas?.filter((motoristas: any) => {
      const nome = normalizarTexto(motoristas.nome);
      const porNome = nome.includes(normalizarTexto(buscar));
      return porNome;
    }) || [];

  useEffect(() => {
    if (CxModal && inputRef.current) {
      // Usamos um pequeno timeout (opcional) apenas para garantir que a transição do CSS
      // não atrapalhe o foco imediato do navegador.
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [CxModal]);
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
          backgroundColor: Cor.base2,
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
            onChange={(e) => setBuscar(e.target.value)}
            value={buscar}
            inputRef={inputRef}
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
            backgroundColor: Cor.base,
            padding: 8,
            overflow: "auto",
            scrollbarColor: Cor.primaria,
          }}
        >
          {listaFiltrada?.map((m: any) => {
            return (
              <LinhaMotorista
                m={m}
                setMotorista={setMotorista}
                setCxModal={setCxModal}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LinhaMotorista({
  m,
  setMotorista,
  setCxModal,
}: {
  m: any;
  setMotorista: any;
  setCxModal: any;
}) {
  const { listaCarros } = useCarros(m?.id);

  const carro = listaCarros?.[0];
  const { Cor } = useTema();
  return (
    <LinhaMotoristaStyle
      key={m.id}
      $bg={Cor.base2}
      $border={Cor.texto2}
      onClick={() => {
        (setMotorista(m), setCxModal(false));
      }}
    >
      <p style={{ color: Cor.texto1 }}>{m.nome}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: Cor.texto1, fontSize: 12 }}>Carro: </p>
        {carro ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              fontWeight: 500,
              color: Cor.texto1,
            }}
          >
            <p>{carro.marca}</p>
            <p>-</p>
            <p>{carro.modelo}</p>
            <p>-</p>
            <p style={{ color: Cor.secundaria }}>{carro.placa}</p>
          </div>
        ) : (
          <p
            style={{
              color: Cor.inativo,
              fontWeight: 500,
              fontStyle: "italic",
            }}
          >
            Motorista sem carro
          </p>
        )}
      </div>
    </LinhaMotoristaStyle>
  );
}

interface LinhaMotoristaProps {
  $bg: string;
  $border: string;
}

const LinhaMotoristaStyle = styled.div<LinhaMotoristaProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 300;
  font-size: 14px;
  justify-content: space-between;
  background-color: ${({ $bg }) => $bg};
  padding: 5px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${({ $border }) => $border + 15};
  transition: all ease-in-out 0.1s;

  &:hover {
    background-color: ${({ $border }) => $border + 30};
    border: 1px solid ${({ $border }) => $border + 30};
    font-weight: 900;
  }

  &:active {
    background-color: ${({ $border }) => $border + 40};
    border: 1px solid ${({ $border }) => $border + 40};
    font-weight: 900;
    scale: 1.01;
  }
`;

function TextoEntrada({
  placeholder,
  onChange,
  value,
  type,
  largura,
  inputRef,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
  largura: string;
  inputRef?: any;
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
        ref={inputRef}
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
