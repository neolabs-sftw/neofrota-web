import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";

function Configuracoes() {
  return BaseTelas({
    conteudo: (
      <>
      <EditPerfil/>
        <h1>Configuracoes</h1>
      </>
    ),
  });
}

export default Configuracoes;


