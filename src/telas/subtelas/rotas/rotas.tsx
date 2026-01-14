import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import styled from "styled-components";
import { useTema } from "../../../hooks/temaContext";
import { useState } from "react";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import BtnRota from "./btnRota";
import CriarRota from "./criarRota";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import ModalRotaValores from "./modalRotaValores";
import { useRotasExtas } from "../../../hooks/useRotasExtras";

function Rotas() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <ConteudoRotas />
      </>
    ),
  });
}

export default Rotas;

interface SelectEmpresaStyled {
  $bg: string;
  $sombra: string;
  $borda: string;
  $corPrimaria: string;
  $corTexto2: string;
}

interface ModalStyled {
  $bg: string;
  $sombra: string;
  $borda: string;
  $corPrimaria: string;
  $corTexto2: string;
  $modal: boolean;
}

const SelectEmpresa = styled.div<SelectEmpresaStyled>`
  width: 450px;
  height: 75px;
  border: 1px solid ${({ $borda }) => $borda};
  background-color: ${({ $bg }) => $bg};
  position: absolute;
  z-index: 9;
  top: 10px;
  border-radius: 22px;
  box-shadow: ${({ $sombra }) => $sombra};
  transition: all 0.2s ease-in-out;

  &:hover {
    border: 1px solid ${({ $corPrimaria }) => $corPrimaria + 50};
  }

  .btnModalSelect {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px 16px 16px 8px;
    gap: 5px;
    height: 100%;
    background-color: ${({ $corTexto2 }) => $corTexto2 + 25};
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    p {
      font-family: "Icone";
      font-weight: bold;
      font-size: 24px;
      color: ${({ $corTexto2 }) => $corTexto2};
      transition: all 0.1s ease-in-out;
    }

    &:hover {
      background-color: ${({ $corTexto2 }) => $corTexto2 + 40};

      p {
        font-size: 28px;
        color: ${({ $corPrimaria }) => $corPrimaria};
      }
    }
  }
`;

const ModalSelect = styled.div<ModalStyled>`
  width: 380px;
  height: 300px;
  overflow-y: scroll;
  position: absolute;
  border: 1px solid ${({ $borda }) => $borda};
  padding: 85px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transform: ${({ $modal }) => ($modal ? "scaleY(1)" : "scaleY(0.5)")};
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  gap: 10px;
  top: ${({ $modal }) => ($modal ? "10px" : "-50px")};
  background-color: ${({ $bg }) => $bg};
  border-radius: 22px 0 22px 22px;
  box-shadow: ${({ $sombra }) => $sombra};
  transition: all 0.2s ease-in-out;
  scrollbar-width: none;
`;

const OptSelect = styled.div<SelectEmpresaStyled>`
  width: 100%;
  background-color: ${({ $bg }) => $bg};
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 5px;
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: ${({ $corPrimaria }) => $corPrimaria + 50};
  }
`;

interface DividerHProps {
  $color: string;
}

const DividerH = styled.div<DividerHProps>`
  width: 80%;
  height: 1px;
  background-color: ${({ $color }) => $color};
`;

function ConteudoRotas() {
  const adminLogado = useAdminLogado();

  const Cor = useTema().Cor;

  const [modalSelect, setModalSelect] = useState(false);

  const [empresaSelecionada, setEmpresaSelecionada] = useState<{
    id: number;
    nome: string;
    rSocial: string;
    cnpj: string;
    fotoLogoCliente: string;
    operadoraId: { id: number };
    statusCliente: string;
  } | null>(null);

  const { listaClientes } = useListaClientes(
    String(adminLogado?.operadora.id) || "0"
  );

  const { listaRotasExtras } = useRotasExtas(empresaSelecionada?.id || 0);

  const [modalRota, setModalRota] = useState(false);

  const [rotaSelecionada, setRotaSelecionada] = useState<any>(null);
  return (
    <div
      style={{
        width: "100%",
        padding: "100px 20px 20px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MenuSelectEmpresas
        empresas={listaClientes}
        empresaSelecionada={empresaSelecionada}
        setEmpresaSelecionada={setEmpresaSelecionada}
        setModalSelect={setModalSelect}
        modalSelect={modalSelect}
      />
      {empresaSelecionada == null ? (
        <div
          style={{
            width: "100%",
            height: "75vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: Cor.primariaTxt + 99,
            }}
          >
            Selecione uma Empresa
          </p>
        </div>
      ) : (
        <BarraUtilirios empresaSelecionada={empresaSelecionada} />
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {listaRotasExtras?.map((rota: any) => (
          <BtnRota
            key={rota.id}
            rota={rota}
            modalRota={modalRota}
            setModalRota={setModalRota}
            setRotaSelecionada={setRotaSelecionada}
          />
        ))}
      </div>
      <ModalRotaValores
        rota={rotaSelecionada}
        modalRota={modalRota}
        setModalRota={setModalRota}
      />
    </div>
  );
}

function BarraUtilirios({ empresaSelecionada }: { empresaSelecionada: any }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 70,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        marginBottom: 10,
        padding: 10,
      }}
    >
      <DividerH $color={Cor.texto2 + 50} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
        }}
      >
        <p style={{ color: Cor.primariaTxt, fontWeight: "400" }}>
          Criar Nova Rota
        </p>
        <CriarRota empresaSelecionada={empresaSelecionada} />
      </div>
    </div>
  );
}

function MenuSelectEmpresas({
  empresaSelecionada,
  setEmpresaSelecionada,
  setModalSelect,
  modalSelect,
  empresas,
}: {
  empresas: any[];
  empresaSelecionada: any;
  setEmpresaSelecionada: any;
  setModalSelect: any;
  modalSelect: any;
}) {
  const fallbackImg =
    "https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/foto_logo_cliente/icon.png";

  const Cor = useTema().Cor;
  return (
    <>
      <SelectEmpresa
        $bg={Cor.base2}
        $sombra={Cor.sombra}
        $borda={Cor.texto2 + 30}
        $corPrimaria={Cor.primaria}
        $corTexto2={Cor.texto2}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
            padding: 5,
          }}
        >
          <img
            src={empresaSelecionada?.fotoLogoCliente || fallbackImg}
            alt=""
            style={{ width: 60, height: 60, borderRadius: 16 }}
          />
          <div
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <p
              style={{
                color: Cor.primariaTxt,
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              {empresaSelecionada?.nome || "Selecione uma empresa"}
            </p>
            <p style={{ color: Cor.texto2, fontSize: 12 }}>
              {empresaSelecionada?.rSocial || ""}
            </p>
          </div>
          <div
            className="btnModalSelect"
            onClick={() => {
              setModalSelect(!modalSelect);
            }}
          >
            <p
              style={{
                transform: modalSelect ? "rotate(180deg)" : "rotate(0deg)",
                transition: "all 0.35s ease-in-out",
              }}
            >
              arrow_drop_down
            </p>
          </div>
        </div>
      </SelectEmpresa>
      <ModalSelect
        $bg={Cor.base2}
        $sombra={Cor.sombra}
        $borda={Cor.texto2 + 30}
        $corPrimaria={Cor.primaria}
        $corTexto2={Cor.texto2}
        $modal={modalSelect}
      >
        {empresas?.map((empresa: any) => (
          <OptSelect
            $bg={Cor.base}
            $sombra={Cor.sombra}
            $borda={Cor.texto2 + 30}
            $corPrimaria={Cor.primaria}
            $corTexto2={Cor.texto2}
            key={empresa.id}
            onClick={() => {
              setEmpresaSelecionada(empresa);
              setModalSelect(false);
            }}
          >
            <img
              src={
                empresa.fotoLogoCliente ? empresa.fotoLogoCliente : fallbackImg
              }
              alt=""
              style={{ width: 40, height: 40, borderRadius: 10 }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  color: Cor.primariaTxt,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {empresa.nome}
              </p>
              <p style={{ color: Cor.texto2, fontSize: 12 }}>
                {empresa.rSocial}
              </p>
            </div>
          </OptSelect>
        ))}
      </ModalSelect>
    </>
  );
}
