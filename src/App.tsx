import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./hooks/rotasPrivadas";
import Login from "./telas/login";
import Home from "./telas/home";
import Empresas from "./telas/empresas";
import Agregados from "./telas/agregados";
import Financeiro from "./telas/financeiro";
import Funcionarios from "./telas/funcionarios";
import Operacao from "./telas/operacao";
import Relatorios from "./telas/relatorios";
import Configuracoes from "./telas/configiracao";
import VerEmpresa from "./telas/subtelas/verEmpresa";
import EditarEmpresa from "./telas/subtelas/editarEmpresa";
import CriarEmpresa from "./telas/subtelas/criarEmpresa";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/agregados" element={<Agregados />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/empresas" element={<Empresas />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/funcionarios" element={<Funcionarios />} />
              <Route path="/operacao" element={<Operacao />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/verempresa/:cliente_id" element={<VerEmpresa />} />
              <Route
                path="/editarempresa/:cliente_id"
                element={<EditarEmpresa />}
              />
              <Route path="/criarempresa" element={<CriarEmpresa />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
