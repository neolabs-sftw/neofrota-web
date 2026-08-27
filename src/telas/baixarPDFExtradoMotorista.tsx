import { useParams } from "react-router-dom";
import { useTema } from "../hooks/temaContext";
import { useLancamentosOperadora } from "../hooks/useLancamentos";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { gerarExtratoPDF } from "../hooks/exportarExtrato";
import { useMotoristaId } from "../hooks/useMotorista";
import { useVouchersFiltrados } from "../hooks/useVouchers";

interface TokenPayload {
  motoristaId: number;
  dataInicio: string;
  dataFim: string;
  iat?: number;
  exp?: number;
}

type RouteParams = {
  token: string;
};

//FORMATO DO PAYLOAD A SER CONVERTIDO EM JWT:
//{
//   "motoristaId": 66,
//   "dataInicio": "2026-08-01",
//   "dataFim": "2026-08-31"
// }

export default function BaixarPDFExtradoMotorista() {
  const { token } = useParams<RouteParams>();
  const Cor = useTema().Cor;
  const pdfGeradoRef = useRef(false); // Flag para garantir que o PDF seja baixado apenas uma vez

  if (!token) {
    return (
      <div
        style={{
          backgroundColor: Cor.base,
          color: Cor.texto1,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Token não fornecido.
      </div>
    );
  }

  // Decodifica o payload do JWT
  const decoded = jwtDecode<TokenPayload>(token);

  // Hooks de consulta
  const { motorista, loading: loadingMotorista } = useMotoristaId(
    String(decoded?.motoristaId || 0),
  );

  const filtro = {
    operadoraId: String(
      motorista?.operadoraId?.id || motorista?.operadoraId || 0,
    ),
    dataFim: decoded?.dataFim || "",
    dataInicio: decoded?.dataInicio || "",
    motoristaId: String(decoded?.motoristaId || 0),
    status: "Concluido",
  };

  const { listaRelatorio, loading: loadingVouchers } =
    useVouchersFiltrados(filtro);

  const { lancamentos: acc, loading: loadingLancamentos } =
    useLancamentosOperadora({
      operadoraId: String(
        motorista?.operadoraId?.id || motorista?.operadoraId || 0,
      ),
      motoristaId: String(decoded?.motoristaId || 0),
      dataInicial: decoded?.dataInicio || "",
      dataFinal: decoded?.dataFim || "",
    });
  const formatarDataBR = (dataStr?: string) => {
    if (!dataStr) return "";
    if (dataStr.includes("/")) return dataStr; // Se já vier em DD/MM/YYYY
    const [ano, mes, dia] = dataStr.split("-");
    if (!ano || !mes || !dia) return dataStr;
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    // Garante que o PDF só roda quando TODOS os dados terminarem de carregar
    const isLoading = loadingMotorista || loadingVouchers || loadingLancamentos;

    if (!isLoading && motorista && listaRelatorio && !pdfGeradoRef.current) {
      pdfGeradoRef.current = true; // Seta a flag para não baixar novamente no próximo re-render

      // 1. Calcula o total somado dos vouchers para a capa/resumo
      const totalVouchersSomados = listaRelatorio.reduce(
        (sum: number, v: any) => {
          const valorRepasseVoucher =
            (Number(v.valorViagemRepasse) || 0) +
            (Number(v.valorDeslocamentoRepasse) || 0) +
            (Number(v.valorHoraParadaRepasse) || 0) *
              (Number(v.qntTempoParado) || 0) +
            (Number(v.valorPedagio) || 0) +
            (Number(v.valorEstacionamento) || 0);
          return sum + valorRepasseVoucher;
        },
        0,
      );

      // 2. Monta o objeto motoristaData no formato esperado pela função gerarExtratoPDF
      const motoristaData = {
        nomeMotorista:
          motorista?.nome || motorista?.nomeMotorista || "Motorista",
        motoristaId: String(decoded?.motoristaId || 0),
        valoresRepasseSomadosTotal: totalVouchersSomados,
        vouchers: listaRelatorio,
      };

      const nomeOperadora =
        motorista?.operadoraId?.nome ||
        motorista?.operadoraId?.nomeOperadora ||
        "Operadora";

      const dataInicioFormatada = formatarDataBR(decoded?.dataInicio);
      const dataFimFormatada = formatarDataBR(decoded?.dataFim);

      // 3. Executa a geração e o download automático do PDF
      gerarExtratoPDF(
        motoristaData,
        acc || [],
        nomeOperadora,
        dataInicioFormatada,
        dataFimFormatada,
      ).catch((err) => {
        console.error("Erro ao gerar o PDF:", err);
        pdfGeradoRef.current = false; // Permite re-tentativa se falhar
      });
    }
  }, [
    loadingMotorista,
    loadingVouchers,
    loadingLancamentos,
    motorista,
    listaRelatorio,
    acc,
    decoded,
  ]);

  const estaCarregando =
    loadingMotorista || loadingVouchers || loadingLancamentos || !motorista;

  return (
    <div
      style={{
        backgroundColor: Cor.base,
        color: Cor.texto1,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <p>
        {estaCarregando
          ? "Carregando dados..."
          : "Gerando e baixando extrato PDF..."}
      </p>
    </div>
  );
}
