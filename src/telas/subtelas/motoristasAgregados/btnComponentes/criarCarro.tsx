import styled from "styled-components";
import { useTema } from "../../../../hooks/temaContext";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAdminLogado } from "../../../../hooks/AdminLogado";

function BtnCriarNovoCarro() {
  const Cor = useTema().Cor;
  const [modalNovoCarro, setModalNovoCarro] = useState(false);
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "10%",
          aspectRatio: 1,
          backgroundColor: Cor.primaria,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Icone",
            fontSize: 32,
            color: Cor.base2,
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setModalNovoCarro(true)}
        >
          add
        </p>
      </div>
      <ModalNovoCarro
        modalNovoCarro={modalNovoCarro}
        setModalNovoCarro={setModalNovoCarro}
      />
    </>
  );
}

export default BtnCriarNovoCarro;

interface modalInterface {
  $corBase: string;
  $corTexto1: string;
  $sombra: string;
  $corPrimaria: string;
  $modal: boolean;
}

const ModalNovoCarroStyled = styled.div<modalInterface>`
  width: 40%;
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
  transition: all 0.3s ease-in-out;
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

function ModalNovoCarro({
  modalNovoCarro,
  setModalNovoCarro,
}: {
  modalNovoCarro: any;
  setModalNovoCarro: any;
}) {
  const { motoristaId } = useParams();

  const adminLogado = useAdminLogado();

  const operadoraId = adminLogado?.operadora.id;

  const Cor = useTema().Cor;
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

  const GET_MARCAS_MODELOS = gql`
    query Marcas {
      marcas {
        id
        nome
      }
      modelos {
        id
        nome
        marcaId {
          id
          nome
        }
      }
    }
  `;

  const CRIAR_NOVO_CARRO = gql`
    mutation CreateCarro($carroNovo: CarroInput!) {
      createCarro(data: $carroNovo) {
        id
      }
    }
  `;

  const { data: marcas_modelos } = useQuery(GET_MARCAS_MODELOS);

  const marcas = marcas_modelos?.marcas.map((marca: any) => marca);
  const modelos = marcas_modelos?.modelos.filter(
    (modelo: any) => modelo.marcaId.id == marca.id
  );

  const [criarCarro] = useMutation(CRIAR_NOVO_CARRO, {
    onCompleted: () => {
      setModalNovoCarro(false);
    },
  });

  const criarNovoCarro = () => {
    criarCarro({
      variables: {
        carroNovo: {
          placa,
          cor,
          crlv,
          chassi,
          ano,
          marca: marca.nome,
          modelo: modelo.nome,
          agregadoId: motoristaId ? parseInt(motoristaId) : null,
          operadoraId: operadoraId ? parseInt(operadoraId) : null,
        },
      },
    });
    console.log({
      placa,
      cor,
      crlv,
      chassi,
      ano,
      marca: marca.nome,
      modelo: modelo.nome,
      agregadoId: motoristaId ? parseInt(motoristaId) : null,
      operadoraId: operadoraId ? parseInt(operadoraId) : null,
    });
    setPlaca("");
    setMarca({ id: 0, nome: "" });
    setModelo({ id: 0, nome: "", marcaId: { id: 0, nome: "" } });
    setCor("");
    setCrlv("");
    setChassi("");
    setAno("");
    window.location.reload();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: Cor.base + 99,
        backdropFilter: "blur(2.5px)",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        top: 0,
        left: 0,
        opacity: modalNovoCarro ? 1 : 0,
        pointerEvents: modalNovoCarro ? "auto" : "none",
      }}
      onClick={() => {
        setModalNovoCarro(false);
      }}
    >
      <ModalNovoCarroStyled
        $corBase={Cor.base2}
        $sombra={Cor.sombra}
        $corTexto1={Cor.texto1}
        onClick={(e) => e.stopPropagation()}
        $corPrimaria={Cor.primaria}
        $modal={modalNovoCarro}
      >
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontSize: 32,
                color: Cor.secundaria,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              add
            </p>
            <p style={{ color: Cor.secundaria, fontSize: 12 }}>
              Adicionar Novo Carro
            </p>
          </div>
        </div>
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
            {marcas?.map((marca: any) => {
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
            <option value={"outros"} style={{ backgroundColor: Cor.base }}>
              Outros
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
        <BtnSalvar
          $corBase={Cor.base2}
          $sombra={Cor.sombra}
          $corTexto1={Cor.texto1}
          $corPrimaria={Cor.primaria}
          onClick={criarNovoCarro}
          $modal={modalNovoCarro}
        >
          <p style={{ color: Cor.texto1, fontWeight: "bold" }}>Salvar</p>
        </BtnSalvar>
      </ModalNovoCarroStyled>
    </div>
  );
}

const BtnSalvar = styled.div<modalInterface>`
  width: 40%;
  background-color: ${({ $corPrimaria }) => $corPrimaria + "BB"};
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 10px;
  border: 1px solid ${({ $corTexto1 }) => $corTexto1 + 50};
  box-shadow: ${({ $sombra }) => $sombra};
  cursor: pointer;

  &:hover {
    background-color: ${({ $corPrimaria }) => $corPrimaria};
  }
`;

function formatPlaca(value: string) {
  return value
    .toUpperCase() // sempre maiúsculo
    .replace(/[^A-Z0-9]/g, "") // remove tudo que não for letra/número
    .replace(/^([A-Z]{3})(\d)/, "$1-$2") // coloca o hífen depois das 3 letras
    .slice(0, 8); // garante no máximo 8 caracteres (AAA-0A00)
}
