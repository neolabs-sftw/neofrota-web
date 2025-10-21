import { useNavigate } from "react-router-dom";
import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import ListaFuncionariosOperadora from "../componentes/listaFuncionariosOperadora";

function Funcionarios() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <FuncionáriosConteudo />
      </>
    ),
  });
}

export default Funcionarios;

function FuncionáriosConteudo() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        padding: "25px 15px 15px 15px",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
          Funcionários
        </h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <CadastrarFuncionario />
      <ListaFuncionariosOperadora />
    </div>
  );
}

function CadastrarFuncionario() {
  const navigate = useNavigate();
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        backgroundColor: Cor.base2,
        width: "100%",
        borderRadius: 22,
        padding: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: Cor.sombra,
      }}
    >
      <p style={{ color: Cor.secundaria, fontSize: "20px" }}>
        Cadastrar Novo Funcionário
      </p>
      <div
        style={{
          width: "60%",
          height: 1,
          backgroundColor: Cor.primaria,
        }}
      />
      <button
        style={{
          color: Cor.base,
          backgroundColor: Cor.primaria,
          padding: "10px 35px",
          borderRadius: 22,
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => navigate("/criarfuncionario")}
      >
        Cadastrar
      </button>
    </div>
  );
}
