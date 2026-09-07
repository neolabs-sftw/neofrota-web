// import Lottie from "lottie-react";
import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
// import icativo from "../assets/animations/icativo.json";
// import icinativo from "../assets/animations/icinativo.json";
import ListaMotoristasAgregados from "../componentes/listaMotoristasAgregados";
import { useNavigate } from "react-router-dom";

function Agregados() {

  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <AgregadosConteudo />
      </>
    ),
  });
}

export default Agregados;

function AgregadosConteudo() {
  const Cor = useTema().Cor;

  const navigate = useNavigate();
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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Motoristas</h3>
        <div
          style={{
            width: "75%",
            height: 1,

            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          backgroundColor: Cor.base2,
          padding: 15,
          borderRadius: 22,
          boxShadow: Cor.sombra,
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 20 }}>
          Cadastrar Novo Motorista
        </p>
        <div
          style={{ width: "65%", height: 1, backgroundColor: Cor.primaria }}
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
          onClick={() => navigate("/criarMotorista")}
        >
          Cadastrar
        </button>
      </div>
      <ListaMotoristasAgregados />
    </div>
  );
}


