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
import VerEmpresa from "./telas/subtelas/empresaCliente/verEmpresa";
import EditarEmpresa from "./telas/subtelas/empresaCliente/editarEmpresa";
import CriarEmpresa from "./telas/subtelas/empresaCliente/criarEmpresa";
import CriarMotorista from "./telas/subtelas/motoristasAgregados/criarMotosita";
import EditarMotorista from "./telas/subtelas/motoristasAgregados/editarMotorista";
import VerMotorista from "./telas/subtelas/motoristasAgregados/verMotorista";
import Rotas from "./telas/subtelas/rotas/rotas";
import CriarFuncionario from "./telas/subtelas/funcionario/criarFuncionario";
import Passageiros from "./telas/subtelas/empresaCliente/passageiros";
import NovoVoucher from "./telas/subtelas/VoucherExtra/novoVoucher";
import { ModelosFixos } from "./telas/subtelas/modeloFixo/modelosFixos";
import EditarFuncionario from "./telas/subtelas/funcionario/editarFuncionario";
import { NovoFixo } from "./telas/subtelas/modeloFixo/novoFixo";
import { EditarFixo } from "./telas/subtelas/modeloFixo/editarFixos";
import { Lancamentos } from "./telas/subtelas/lancamentos/lancamentos";
import { ModelosTurnos } from "./telas/subtelas/modeloTurno/modelosTurnos";
import { GerarVouchersTurno } from "./telas/subtelas/modeloTurno/novoTurno";
import { EditarTurno } from "./telas/subtelas/modeloTurno/editarTurnos";
import { NovoModeloTurno } from "./telas/subtelas/modeloTurno/novoModeloTurno";

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
              <Route
                path="/editarfuncionario/:adminId"
                element={<EditarFuncionario />}
              />
              <Route path="/operacao" element={<Operacao />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/verempresa/:clienteId" element={<VerEmpresa />} />
              <Route
                path="/editarempresa/:clienteId"
                element={<EditarEmpresa />}
              />
              <Route path="/criarempresa" element={<CriarEmpresa />} />
              <Route
                path="/motorista/:motoristaId"
                element={<VerMotorista />}
              />
              <Route
                path="/editarmotorista/:motoristaId"
                element={<EditarMotorista />}
              />
              <Route path="/criarmotorista" element={<CriarMotorista />} />
              <Route path="/rotas" element={<Rotas />} />
              <Route path="/criarfuncionario" element={<CriarFuncionario />} />
              <Route path="/passageiros/:clienteId" element={<Passageiros />} />
              <Route path="/novovoucher" element={<NovoVoucher />} />
              <Route path="/modelosvouchersfixos" element={<ModelosFixos />} />
              <Route path="/novofixo" element={<NovoFixo />} />
              <Route path="/editarfixo/:FixoId" element={<EditarFixo />} />
              <Route
                path="/modelosvouchersturnos"
                element={<ModelosTurnos />}
              />
              <Route path="/gerarcouchersturno/:TurnoId" element={<GerarVouchersTurno />} />
              <Route path="/novomodeloturno" element={<NovoModeloTurno />} />
              <Route path="/editarturno/:TurnoId" element={<EditarTurno />} />
              <Route path="/lancamentos" element={<Lancamentos />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
