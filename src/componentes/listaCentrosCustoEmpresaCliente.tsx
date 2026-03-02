import { useEffect, useMemo, useState } from "react";
import { useTema } from "../hooks/temaContext";
import { useParams } from "react-router-dom";
import {
  useCentroCustoByEmpresa,
  useEditarCentrosCusto,
} from "../hooks/useCentrosDeCusto";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

function ListaCentrosCustoEmpresaCliente() {
  const Cor = useTema().Cor;

  const { clienteId } = useParams();

  const [busca, setBusca] = useState("");

  const { listaCentrosCustos: centrosCusto } = useCentroCustoByEmpresa(
    String(clienteId),
  );

  const centrosCustoFiltrados = useMemo(() => {
    if (!busca) return centrosCusto;
    return centrosCusto.filter((centro_custo: any) =>
      centro_custo.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [centrosCusto, busca]);

  return (
    <div
      style={{
        width: "40%",
        height: 350,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        padding: 15,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <p style={{ fontWeight: "500", color: Cor.primaria }}>
            Lista de Centros de Custo
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Divisão por centros de custo.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "5px 15px",
              backgroundColor: Cor.texto2 + 20,
              borderRadius: 22,
              gap: 5,
            }}
          >
            <input
              type="text"
              style={{
                border: "none",
                backgroundColor: "transparent",
                width: "100%",
                outline: "none",
                color: Cor.texto1,
              }}
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: Cor.texto2 + 50,
          color: Cor.texto1,
          fontSize: 11,
          width: "100%",
          height: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          fontWeight: 700,
        }}
      >
        <p style={{ width: "40%" }}>Nome</p>
        <p style={{ width: "40%" }}>Código</p>
        <p style={{ width: "20%", textAlign: "center" }}>Editar</p>
      </div>
      <div
        style={{
          width: "100%",
          height: 230,
          overflow: "scroll",
          scrollbarWidth: "none",
          color: Cor.texto1,
        }}
      >
        {centrosCustoFiltrados.map((cc: any, index: any) => {
          const par = index % 2 === 0;
          return <LinhaCentroCusto centroCusto={cc} par={par} key={cc.id} />;
        })}
      </div>
    </div>
  );
}

interface LinhaSolicitanteProps {
  $cor: string;
  $cor2: string;
}

const LinhaSolicitanteStyle = styled.div<LinhaSolicitanteProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $cor }) => $cor}05;
  width: 100%;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $cor2 }) => $cor2}25;
  }
  &:active {
    background-color: ${({ $cor2 }) => $cor2}45;
  }
`;

interface BtnEditProps {
  $cor: string;
}

const BtnEdit = styled.div<BtnEditProps>`
  color: ${({ $cor }) => $cor};
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ $cor }) => $cor}15;
  border: 1px solid ${({ $cor }) => $cor}30;
  width: 80px;
  height: 25px;
  border-radius: 22px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in-out all 0.1s;
  user-select: none;

  &:hover {
    scale: 1.02;
    background-color: ${({ $cor }) => $cor}25;
    border: 1px solid ${({ $cor }) => $cor}40;
  }

  &:active {
    scale: 0.95;
    background-color: ${({ $cor }) => $cor}50;
    border: 1px solid ${({ $cor }) => $cor}90;
  }
`;

function LinhaCentroCusto({
  centroCusto,
  par,
}: {
  centroCusto: any;
  par: any;
}) {
  const { clienteId } = useParams();
  const { Cor } = useTema();

  const { editarCentroCusto, loading } = useEditarCentrosCusto(
    String(clienteId),
  );

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    if (!centroCusto) return;
    if (centroCusto) {
      setNome(centroCusto.nome ?? "");
      setCodigo(centroCusto.codigo ?? "");
    }
  }, [centroCusto]);

  async function alterarCentroCusto() {
    await editarCentroCusto(String(centroCusto.id), {
      nome,
      codigo,
    });
  }

  return (
    <LinhaSolicitanteStyle
      $cor={par ? Cor.base2 : Cor.texto1}
      $cor2={Cor.texto2}
    >
      <input
        style={{
          width: "37%",
          padding: 5,
          borderRadius: 12,
          outline: "none",
          border: "none",
          backgroundColor: Cor.texto2 + 30,
          color: Cor.texto1,
        }}
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        style={{
          width: "37%",
          padding: 5,
          borderRadius: 12,
          outline: "none",
          border: "none",
          backgroundColor: Cor.texto2 + 30,
          color: Cor.texto1,
        }}
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <div
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BtnEdit
          $cor={
            nome !== centroCusto.nome || codigo !== centroCusto.codigo
              ? Cor.primaria
              : Cor.texto1
          }
          onClick={(e) => {
            e.stopPropagation();
            alterarCentroCusto();
          }}
        >
          {loading ? (
            <CircularProgress
              size={18}
              thickness={8}
              sx={{
                color: Cor.primaria,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>edit</p>
              <p style={{ fontSize: 12 }}>Editar</p>
            </>
          )}
        </BtnEdit>
      </div>
    </LinhaSolicitanteStyle>
  );
}

export default ListaCentrosCustoEmpresaCliente;
