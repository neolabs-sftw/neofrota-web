import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";

function Rotas() {
  return  BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <ConteudoRotas />
      </>
    ),
  });;
}

export default Rotas;

function ConteudoRotas() {
  return <h1>Rotas</h1>;
}
