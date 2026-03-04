import { useState } from "react";
import { useTema } from "../hooks/temaContext";
import styled from "styled-components";
import {
  useEditarAdminUsuario,
  useListaAdminFuncionario,
} from "../hooks/useAdminFuncionario";
import CircularProgress from "@mui/material/CircularProgress";
import { useAdminLogado } from "../hooks/AdminLogado";
import { useNavigate } from "react-router-dom";

interface BtnProps {
  $cor: string;
}

const Btn = styled.div<BtnProps>`
  color: ${({ $cor }) => $cor};
  text-align: center;
  padding: 15px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ $cor }) => $cor}15;
  border: 1px solid ${({ $cor }) => $cor}30;
  width: 35%;
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

function ListaFuncionariosOperadora() {
  const [busca, setBusca] = useState("");
  const Cor = useTema().Cor;

  const operadora = useAdminLogado()?.operadora.id;

  const { listAdminFuncionario: listaTotal } = useListaAdminFuncionario(
    String(operadora),
  );

  const listAdminFuncionario =
    listaTotal?.filter((a: any) => a.funcao !== null) || [];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        padding: 15,
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div>
          <p style={{ fontWeight: "500", color: Cor.primaria }}>
            Lista de Funcionários
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Funcionários com responsabilidades.
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
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              fontSize: "24px",
              color: Cor.primaria,
              cursor: "pointer",
            }}
            onClick={() =>
              //   exportarPlanilha(
              //     lista_unidades,
              //     `Unidades ${empresa?.nome}`,
              //     "csv"
              //   )
              {}
            }
          >
            download
          </p>
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
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "24px",
                color: Cor.primaria,
              }}
            >
              search
            </p>
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
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "24px",
                color: Cor.primaria,
                cursor: "pointer",
              }}
            >
              close
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          backgroundColor: Cor.texto2 + 50,
          padding: 5,
          color: Cor.texto1,
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        <p style={{ width: "5%" }}>Foto</p>
        <p style={{ width: "30%" }}>Nome</p>
        <p style={{ width: "25%" }}>E-mail</p>
        <p style={{ width: "10%" }}>Função</p>
        <p style={{ width: "30%", textAlign: "center" }}>Status</p>
      </div>
      {listAdminFuncionario?.map((f: any, index: any) => {
        const par = index % 2 === 0;
        return <LinhaFuncionario par={par} f={f} key={f.id} />;
      })}
    </div>
  );
}

interface LinhaFuncionaroProps {
  $cor: string;
  $cor2: string;
}

const LinhaFuncionarioStyle = styled.div<LinhaFuncionaroProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  padding: 5px;
  background-color: ${({ $cor }) => $cor};
  transition: ease-in-out all 0.1s;
  color:  ${({ $cor2 }) => $cor2};

  &:hover{
  background-color: ${({ $cor2 }) => $cor2}10
`;

function LinhaFuncionario({ f, par }: { f: any; par: boolean }) {
  const { Cor } = useTema();

  const operadora = useAdminLogado()?.operadora.id;

  const [lStatus, setLStatus] = useState(false);
  const [lDelete, setLDelete] = useState(false);

  console.log(f);

  const { editarAdmin } = useEditarAdminUsuario(String(operadora));

  async function alterarStatus() {
    setLStatus(true);
    await editarAdmin(f.id, {
      operadoraId: operadora,
      statusAdminOperadora: !f.statusAdminOperadora,
    });
    setLStatus(false);
  }
  async function deletarFuncionario() {
    setLDelete(true);
    await editarAdmin(f.id, {
      operadoraId: operadora,
      statusAdminOperadora: false,
      email: `(deletado)${f?.email || f.nome}`,
      funcao: null,
    });
    setLDelete(false);
  }

  const navigate = useNavigate();

  return (
    <LinhaFuncionarioStyle
      $cor={par ? Cor.texto1 + "00" : Cor.texto1 + "05"}
      $cor2={Cor.texto1}
      onClick={() => navigate(`/editarfuncionario/${f.id}`)}
    >
      <div style={{ width: "5%" }}>
        <img
          src={
            f.fotoAdminOperadora
              ? f.fotoAdminOperadora
              : "https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/img_perfis/default.png"
          }
          alt=""
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 14,
            objectFit: "cover",
            boxShadow: Cor.sombra,
          }}
        />
      </div>

      <p style={{ width: "30%" }}>{f.nome}</p>
      <p style={{ width: "25%" }}>{f.email}</p>
      <p style={{ width: "10%" }}>{f.funcao}</p>
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Btn
          $cor={f.statusAdminOperadora ? Cor.ativo : Cor.atencao}
          onClick={(e) => {
            alterarStatus();
            e.stopPropagation();
          }}
        >
          {lStatus ? (
            <CircularProgress
              size={18}
              thickness={8}
              sx={{
                color: f.statusAdminOperadora ? Cor.ativo : Cor.atencao,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {f.statusAdminOperadora ? "lock_open" : "lock"}
              </p>
              <p style={{ fontSize: 12 }}>
                {f.statusAdminOperadora ? "Ativo" : "Inativo"}
              </p>
            </>
          )}
        </Btn>
        <Btn
          $cor={Cor.atencao}
          onClick={(e) => {
            deletarFuncionario();
            e.stopPropagation();
          }}
        >
          {lDelete ? (
            <CircularProgress
              size={18}
              thickness={8}
              sx={{
                color: f.statusAdminOperadora ? Cor.ativo : Cor.atencao,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          ) : (
            <>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>delete</p>
              <p style={{ fontSize: 12 }}>Remover</p>
            </>
          )}
        </Btn>
      </div>
    </LinhaFuncionarioStyle>
  );
}

export default ListaFuncionariosOperadora;
