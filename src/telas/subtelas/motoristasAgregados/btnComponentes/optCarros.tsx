import styled from "styled-components";
import { useTema } from "../../../../hooks/temaContext";
import { useEffect, useState } from "react";
import {
  useCarroAtrelado,
  useCreateCarro,
  useDefinirMotorista,
  useListaCarrosAgregado,
  useMarcaModelos,
} from "../../../../hooks/useCarros";
import { useParams } from "react-router-dom";
import { useAdminLogado } from "../../../../hooks/AdminLogado";
import CircularProgress from "@mui/material/CircularProgress";
import { useListaRelacao } from "../../../../hooks/useRelacaoMotoristas";

interface BtnOptCarrosProps {
  $cor: string;
}

const BtnOptCarros = styled.button<BtnOptCarrosProps>`
  padding: 5px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5;
  background-color: ${({ $cor }) => $cor};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #181818;
`;

export function OptCarros() {
  const Cor = useTema().Cor;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        style={{
          padding: "5px 20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          backgroundColor: Cor.primaria,
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          color: "#181818",
        }}
        onClick={() => setOpen(!open)}
      >
        <p style={{ fontFamily: "Icone", fontSize: 18 }}>settings</p>
        <p style={{ fontSize: 14, fontWeight: 500 }}>Opções</p>
      </button>
      <ModalCarros open={open} setOpen={setOpen} />
    </div>
  );
}

interface modalInterface {
  $corBase: string;
  $corTexto1: string;
  $sombra: string;
  $corPrimaria: string;
  $modal: boolean;
}

const ModalNovoCarroStyled = styled.div<modalInterface>`
  width: 50%;
  background-color: ${({ $corBase }) => $corBase};
  border-radius: 22px;
  display: flex;
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 10px;
  border: 1px solid ${({ $corTexto1 }) => $corTexto1 + 50};
  box-shadow: ${({ $sombra }) => $sombra};
  transform: ${({ $modal }) => ($modal ? "scale(1)" : "scale(0.6)")};
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  pointer-events: ${({ $modal }) => ($modal ? "auto" : "none")};
  transition: all 0.5s ease-in-out;
  z-index: 10;
`;

function ModalCarros({ open, setOpen }: { open: boolean; setOpen: any }) {
  const { motoristaId } = useParams();
  const [placaBusca, setPlacaBusca] = useState<string>("");
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const Cor = useTema().Cor;
  console.log(placaBusca);
  const [proprietario, setProprietario] = useState<String>("");

  const { listaRelacao, loading } = useListaRelacao(String(motoristaId));

  const { listaCarrosAgregado, refetch } = useListaCarrosAgregado(
    String(proprietario),
  );

  const { refetch: refetchCarroAtrelado } = useCarroAtrelado(
    String(motoristaId),
  );

  useEffect(() => {
    if (!loading) {
      if (listaRelacao === undefined) {
        setProprietario(String(motoristaId));
      } else {
        setProprietario(listaRelacao?.motoristaComoAgregado?.id);
      }
    }
    refetchCarroAtrelado();
    refetch();
  }, [listaRelacao, loading, motoristaId, addOpen, open, proprietario]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: Cor.base + 99,
        backdropFilter: "blur(2.5px)",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        top: 0,
        left: 0,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "all 0.3s ease-in-out",
      }}
      onClick={() => {
        setOpen(!open);
        setAddOpen(false);
      }}
    >
      <ModalAddNovoCarro
        open={open}
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        proprietario={proprietario}
      />
      <ModalNovoCarroStyled
        $corBase={Cor.base2}
        $sombra={Cor.sombra}
        $corTexto1={Cor.texto1}
        onClick={(e) => e.stopPropagation()}
        $corPrimaria={Cor.primaria}
        $modal={open}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextoEntrada
            largura="80%"
            placeholder="Buscar por Placa"
            type="Text"
            value=""
            onChange={(e) => setPlacaBusca(e.target.value)}
          />

          <BtnOptCarros
            $cor={Cor.primaria}
            onClick={() => {
              setAddOpen(!addOpen);
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontSize: 22,
                rotate: addOpen ? "45deg" : "0deg",
                transition: "ease-in-out all 0.6s",
              }}
            >
              add
            </p>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Adicionar</p>
          </BtnOptCarros>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: 290,
            padding: 10,
            backgroundColor: Cor.base,
            borderRadius: 12,
            overflowY: "auto",
            scrollbarWidth: "none",
            gap: 10,
          }}
        >
          {listaCarrosAgregado?.map((c: any) => {
            return <LinhaCarro key={c.id} c={c} setOpen={setOpen} />;
          })}
        </div>
      </ModalNovoCarroStyled>
    </div>
  );
}

interface AddNovoProps {
  $corBase: string;
  $corTexto1: string;
  $sombra: string;
  $corPrimaria: string;
  $modal: boolean;
  $addOpen: boolean;
}

const AddNovoCarroStyled = styled.div<AddNovoProps>`
  width: 45%;
  height: 190px;
  background-color: ${({ $corBase }) => $corBase};
  border-radius: 22px 22px 0 0;
  margin-bottom: ${({ $addOpen }) => ($addOpen ? "-1px" : "-200px")};
  positon: absolute;
  display: flex;
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 10px;
  border: 1px solid ${({ $corTexto1 }) => $corTexto1 + 50};
  box-shadow: ${({ $sombra }) => $sombra};
  transform: ${({ $modal }) => ($modal ? "scale(1)" : "scale(0.6)")};
  opacity: ${({ $modal }) => ($modal ? 1 : 0)};
  pointer-events: ${({ $modal }) => ($modal ? "auto" : "none")};
  transition: all 0.5s ease-in-out;
  z-index: 9;
`;

function ModalAddNovoCarro({
  open,
  addOpen,
  setAddOpen,
  proprietario,
}: {
  open: boolean;
  addOpen: boolean;
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  proprietario: any;
}) {
  const Cor = useTema().Cor;

  const { motoristaId } = useParams<{ motoristaId?: string }>();
  const admin = useAdminLogado();

  const operadoraId = admin?.operadora.id;
  const { carros } = useMarcaModelos();

  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState({ id: 0, nome: "" });
  const [modelo, setModelo] = useState({
    id: 0,
    nome: "",
    marcaId: { id: 0, nome: "" },
  });
  const [cor, setCor] = useState("");
  const [crlv, setCrlv] = useState("");
  const [chassi, setChassi] = useState("");
  const [ano, setAno] = useState("");

  const modelos = carros?.modelos.filter(
    (modelo: any) => modelo.marcaId.id == marca.id,
  );

  useEffect(() => {
    setPlaca("");
    setMarca({ id: 0, nome: "" });
    setModelo({
      id: 0,
      nome: "",
      marcaId: { id: 0, nome: "" },
    });
    setCor("");
    setCrlv("");
    setChassi("");
    setAno("");
  }, [addOpen]);

  const { criar, loading } = useCreateCarro();

  const NovoCarro = {
    placa,
    cor,
    crlv,
    chassi,
    ano,
    marca: marca.nome,
    modelo: modelo.nome,
    agregadoId: motoristaId ? Number(motoristaId) : 0,
    operadoraId: operadoraId ? Number(operadoraId) : null,
  };

  const { refetch: RefreshLista } = useListaRelacao(String(proprietario));

  async function CriarNovoCarro() {
    await criar(NovoCarro as any);
    setAddOpen(false);
    RefreshLista();
  }
  return (
    <AddNovoCarroStyled
      $corBase={Cor.base2}
      $sombra={Cor.sombra}
      $corTexto1={Cor.texto1}
      onClick={(e) => e.stopPropagation()}
      $corPrimaria={Cor.primaria}
      $modal={open}
      $addOpen={addOpen}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <select
          style={{
            width: "50%",
            appearance: "none",
            outline: "none",
            border: "none",
            padding: 10,
            backgroundColor: Cor.texto2 + 20,
            borderRadius: 22,
            color: Cor.texto1,
          }}
          onChange={(e) => setMarca(JSON.parse(e.target.value))}
          defaultValue=""
        >
          <option style={{ backgroundColor: Cor.base }} value="" disabled>
            Marca
          </option>
          {carros?.marcas?.map((marca: any) => {
            return (
              <option
                key={marca.id}
                value={JSON.stringify(marca)}
                style={{ backgroundColor: Cor.base }}
              >
                {marca.nome}
              </option>
            );
          })}
        </select>
        <select
          style={{
            width: "50%",
            appearance: "none",
            outline: "none",
            border: "none",
            padding: 10,
            backgroundColor: Cor.texto2 + 20,
            borderRadius: 22,
            color: Cor.texto1,
          }}
          defaultValue=""
          onChange={(e) => setModelo(JSON.parse(e.target.value))}
        >
          <option style={{ backgroundColor: Cor.base }} value="" disabled>
            Modelo
          </option>
          {modelos?.map((modelo: any) => {
            return (
              <option
                key={modelo.id}
                value={JSON.stringify(modelo)}
                style={{ backgroundColor: Cor.base, borderRadius: 22 }}
              >
                {modelo.nome}
              </option>
            );
          })}
        </select>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TextoEntrada
          placeholder="Placa do Carro"
          type="text"
          largura="32%"
          onChange={(e) => setPlaca(formatPlaca(e.target.value))}
          value={placa}
        />
        <select
          style={{
            width: "32%",
            appearance: "none",
            outline: "none",
            border: "none",
            padding: 10,
            backgroundColor: Cor.texto2 + 20,
            borderRadius: 22,
            color: Cor.texto1,
          }}
          defaultValue=""
          onChange={(e) => setCor(e.target.value)}
        >
          <option value="" disabled>
            Cor
          </option>
          <option value={"preto"} style={{ backgroundColor: Cor.base }}>
            Preto
          </option>
          <option value={"branco"} style={{ backgroundColor: Cor.base }}>
            Branco
          </option>
          <option value={"cinza"} style={{ backgroundColor: Cor.base }}>
            Cinza
          </option>
          <option value={"vermelho"} style={{ backgroundColor: Cor.base }}>
            Vermelho
          </option>
          <option value={"azul"} style={{ backgroundColor: Cor.base }}>
            Azul
          </option>
          <option value={"outro"} style={{ backgroundColor: Cor.base }}>
            Outro
          </option>
        </select>
        <TextoEntrada
          placeholder="Ano Fabricacao"
          type="number"
          largura="32%"
          onChange={(e) => setAno(e.target.value)}
          value={ano}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TextoEntrada
          placeholder="Chassi"
          type="text"
          largura="60%"
          onChange={(e) => setChassi(e.target.value)}
          value={chassi}
        />
        <TextoEntrada
          placeholder="Renavan"
          type="text"
          largura="40%"
          onChange={(e) => setCrlv(e.target.value)}
          value={crlv}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
        }}
      >
        <strong
          style={{ fontFamily: "Icone", fontSize: 24, color: Cor.texto2 }}
        >
          save
        </strong>
        <p style={{ color: Cor.texto1 }}>Adicionar Novo Carro</p>
        <BtnOptCarros
          $cor={Cor.primaria}
          onClick={() => {
            CriarNovoCarro();
          }}
        >
          {loading ? (
            <CircularProgress
              size={15}
              thickness={8}
              color="inherit"
              sx={{ color: "#181818" }}
            />
          ) : (
            <p style={{ fontSize: 14, color: "#181818" }}>Salvar</p>
          )}
        </BtnOptCarros>
      </div>
    </AddNovoCarroStyled>
  );
}

function formatPlaca(value: string) {
  return value
    .toUpperCase() // sempre maiúsculo
    .replace(/[^A-Z0-9]/g, "") // remove tudo que não for letra/número
    .replace(/^([A-Z]{3})(\d)/, "$1-$2") // coloca o hífen depois das 3 letras
    .slice(0, 8); // garante no máximo 8 caracteres (AAA-0A00)
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

interface LinhaCarroProps {
  $cor: string;
  $linha: string;
}

const LinhaCarroStyled = styled.div<LinhaCarroProps>`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ $cor }) => $cor}10;
  border: 1px solid ${({ $linha }) => $linha};
  border-radius: 28px;
  padding: 10px;
  over-flow: hidden;
  cursor: pointer;
  transition: ease-in-out all 0.2s;

  &:hover {
    scale: 1.015;
    background-color: ${({ $cor }) => $cor}30;
  }
`;

interface BtnProps {
  $cor: string;
}

const BtnSave = styled.div<BtnProps>`
  height: 50%;
  width: 100%;
  background-color: ${({ $cor }) => $cor}30;
  border-radius: 5px 18px 0 0;
  border-top: 1px solid ${({ $cor }) => $cor}50;
  border-left: 1px solid ${({ $cor }) => $cor}50;
  border-right: 1px solid ${({ $cor }) => $cor}50;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ease-in-out all 0.2s;

  &:hover {
    background-color: ${({ $cor }) => $cor}90;
  }
`;
const BtnDelete = styled.div<BtnProps>`
  height: 50%;
  width: 100%;
  background-color: ${({ $cor }) => $cor}30;
  color: ${({ $cor }) => $cor};
  border-bottom: 1px solid ${({ $cor }) => $cor}50;
  border-left: 1px solid ${({ $cor }) => $cor}50;
  border-right: 1px solid ${({ $cor }) => $cor}50;
  border-radius: 0 0 18px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ease-in-out all 0.2s;

  &:hover {
    background-color: ${({ $cor }) => $cor}90;
  }
`;

function LinhaCarro({ c, setOpen }: { c: any; setOpen: any }) {
  const { motoristaId } = useParams();
  const Cor = useTema().Cor;

  const linkImg = `https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/carros/${c.marca.toLowerCase()}/${c.modelo.toLowerCase()}/${c.cor.toLowerCase()}.png`;

  const { vincularMotorista } = useDefinirMotorista();

   const { refetch: refetchCarroAtrelado } = useCarroAtrelado(
    String(motoristaId),
  );


  async function vincularMotoristafunc() {
    await vincularMotorista(c.id, Number(motoristaId));
    console.log(c.id, Number(motoristaId));
    refetchCarroAtrelado()
    setOpen(false);
  }

  return (
    <LinhaCarroStyled $cor={Cor.texto2} $linha={Cor.texto2}>
      <img
        src={linkImg}
        alt=""
        style={{ objectFit: "contain", width: "20%" }}
      />

      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: 10,
          borderLeft: `1px solid ${Cor.texto2}`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>Marca / Modelo</p>
          <p style={{ color: Cor.texto1 }}>
            {c.marca} - {c.modelo}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>Placa</p>
          <p style={{ color: Cor.texto1, fontWeight: 700 }}>{c.placa}</p>
        </div>
      </div>
      {c?.motoristaId?.nome ? (
        <div
          style={{
            width: "35%",
            height: 80,
            backgroundColor: Cor.texto2 + 10,
            border: `1px solid ${Cor.primaria + 90}`,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 12 }}>Motorista Atrelado:</p>
          <p style={{ color: Cor.texto1 }}>{c?.motoristaId?.nome}</p>
        </div>
      ) : (
        <div
          style={{
            width: "35%",
            height: 80,
            backgroundColor: Cor.texto2 + 10,
            border: `1px solid ${Cor.texto2 + 50}`,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto2 + 90, fontSize: 12 }}>
            Motorista Atrelado:{" "}
          </p>
          <p style={{ color: Cor.texto2 + 99 }}>Sem Motorista Atrelado</p>
        </div>
      )}

      <div
        style={{
          width: "8%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BtnSave $cor={Cor.primaria} onClick={() => vincularMotoristafunc()}>
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 22,
              color: Cor.primaria,
            }}
          >
            check
          </p>
        </BtnSave>
        <BtnDelete $cor={Cor.atencao}>
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 22,
            }}
          >
            delete
          </p>
        </BtnDelete>
      </div>
    </LinhaCarroStyled>
  );
}
