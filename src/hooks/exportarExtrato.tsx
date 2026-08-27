import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import logoNeoFrota from "../assets/image/Logo-NeoFrotaW.png";

// Correção segura para fontes
(pdfMake as any).vfs =
  (pdfFonts as any).pdfMake?.vfs ||
  (pdfFonts as any).vfs ||
  (pdfFonts as any).default?.pdfMake?.vfs ||
  (pdfFonts as any).default?.vfs;

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    valor,
  );

const extrairDataString = (dataIso: string) => {
  if (!dataIso) return "";

  const [ano, mes, dia] = dataIso.split("T")[0].split("-");

  return `${dia}/${mes}/${ano}`;
};

const formatarDataCabecalho = (dataString: string) => {
  const [ano, mes, dia] = dataString.split("-");
  const meses = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  return `${dia} ${meses[Number(mes) - 1]} ${ano}`;
};

const formatarHora = (dataIso: string) => {
  if (!dataIso) return "-";
  const d = new Date(dataIso);
  return (
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + "h"
  );
};

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const gerarExtratoPDF = async (
  motoristaData: any,
  lancamentosData: any[],
  nomeOperadora: string,
  dataInicioStr: string,
  dataFimStr: string,
) => {
  const logoBase64 = await getBase64ImageFromUrl(logoNeoFrota);

  // 1. Cálculos Globais
  const totalVouchers = motoristaData.valoresRepasseSomadosTotal || 0;

  const totalCreditos = lancamentosData.reduce(
    (acc, lanc) =>
      lanc.tipo === "Credito" ? acc + (Number(lanc.valor) || 0) : acc,
    0,
  );

  const totalDescontos = lancamentosData.reduce(
    (acc, lanc) =>
      lanc.tipo === "Desconto" ? acc + (Number(lanc.valor) || 0) : acc,
    0,
  );

  const saldoFinal = totalVouchers + totalCreditos - totalDescontos;

  // 2. Agrupamento por Dia (Vouchers + Lançamentos)
  const extratoPorDia: Record<
    string,
    { vouchers: any[]; lancamentos: any[]; totalDia: number }
  > = {};

  // 2.1 Processar Vouchers
  motoristaData.vouchers.forEach((v: any) => {
    const dataStr = extrairDataString(v.dataHoraProgramado);
    if (!extratoPorDia[dataStr])
      extratoPorDia[dataStr] = { vouchers: [], lancamentos: [], totalDia: 0 };

    const valorRepasseVoucher =
      (Number(v.valorViagemRepasse) || 0) +
      (Number(v.valorDeslocamentoRepasse) || 0) +
      (Number(v.valorHoraParadaRepasse) || 0) *
        (Number(v.qntTempoParado) || 0) +
      (Number(v.valorPedagio) || 0) +
      (Number(v.valorEstacionamento) || 0);

    extratoPorDia[dataStr].vouchers.push({
      ...v,
      valorTotalCalculado: valorRepasseVoucher,
    });
    extratoPorDia[dataStr].totalDia += valorRepasseVoucher;
  });

  // 2.2 Processar Lançamentos
  lancamentosData.forEach((lanc: any) => {
    const dataStr = extrairDataString(lanc.dataHora);
    if (!extratoPorDia[dataStr])
      extratoPorDia[dataStr] = { vouchers: [], lancamentos: [], totalDia: 0 };

    const valor = Number(lanc.valor) || 0;
    extratoPorDia[dataStr].lancamentos.push(lanc);
    extratoPorDia[dataStr].totalDia += lanc.tipo === "Credito" ? valor : -valor;
  });

  // 3. Ordenar as datas
  const datasOrdenadas = Object.keys(extratoPorDia).sort();

  // 4. Montar o Conteúdo do PDF
  const content: Content[] = [];

  // CABEÇALHO DO EXTRATO
  content.push(
    {
      columns: [
        {
          text: nomeOperadora.toUpperCase(),
          style: "marcaOperadora",
          width: "50%",
        },
        {
          text: `Período: ${dataInicioStr} a ${dataFimStr}\nSaldo final do período\n`,
          alignment: "right",
          style: "periodoOperadora",
          width: "50%",
        },
      ],
      margin: [0, 0, 0, 5],
    },
    {
      text: formatarMoeda(saldoFinal),
      style: "saldoFinalDestaque",
      alignment: "right",
      margin: [0, 0, 0, 20],
    },

    // INFO MOTORISTA
    { text: "EXTRATO DE VIAGENS", style: "tituloSecao" },
    { text: motoristaData.nomeMotorista, style: "nomeMotorista" },
    {
      text: `Matrícula/ID: ${motoristaData.motoristaId}`,
      style: "infoSubtext",
      margin: [0, 0, 0, 15],
    },

    // QUADRO DE RESUMO (Valores em R$)
    {
      style: "tabelaResumo",
      table: {
        widths: ["*", "auto"],
        body: [
          [{ text: "Valores em R$", colSpan: 2, style: "tableHeaderDark" }, {}],
          [
            { text: "Total em Vouchers", style: "linhaNormal" },
            { text: formatarMoeda(totalVouchers), style: "linhaValor" },
          ],
          [
            { text: "Lançamentos de Créditos", style: "linhaNormal" },
            { text: formatarMoeda(totalCreditos), style: "linhaValorCredito" },
          ],
          [
            { text: "Lançamentos de Descontos", style: "linhaNormal" },
            {
              text: formatarMoeda(totalDescontos),
              style: "linhaValorDesconto",
            },
          ],
          [
            { text: "Saldo Final do Período", style: "linhaDestaque" },
            { text: formatarMoeda(saldoFinal), style: "linhaValorDestaque" },
          ],
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 0, 0, 30],
    },
  );

  // ITERAÇÃO DIÁRIA
  datasOrdenadas.forEach((data) => {
    const dia = extratoPorDia[data];

    // Título do Dia
    content.push({ text: formatarDataCabecalho(data), style: "diaHeader" });

    const linhasDia: any[] = [];

    // Vouchers do Dia
    if (dia.vouchers.length > 0) {
      dia.vouchers.forEach((v) => {
        const rotaStr =
          v.origem && v.destino
            ? `${v.origem} X ${v.destino}`
            : "Rota não informada";
        const opStr = v.tipoCorrida === "Saida" ? "Saída" : "Entrada";

        linhasDia.push([
          { text: v.id, style: "tabelaTexto" },
          { text: v.empresaCliente?.nome || "-", style: "tabelaTextoBold" },
          {
            text: `${rotaStr}\n${opStr} | ${formatarHora(v.dataHoraProgramado)}`,
            style: "tabelaTextoSub",
          },
          { text: v.natureza || "Outro", style: "tabelaTexto" },
          { text: formatarMoeda(v.valorTotalCalculado), style: "tabelaValor" },
        ]);
      });
    }

    // Lançamentos do Dia
    if (dia.lancamentos.length > 0) {
      dia.lancamentos.forEach((lanc) => {
        const isCredito = lanc.tipo === "Credito";
        const tipoStr = isCredito ? "Acr." : "Dec.";
        const valorFormatado = isCredito
          ? `+${formatarMoeda(lanc.valor)}`
          : `-${formatarMoeda(lanc.valor)}`;

        linhasDia.push([
          {
            text: tipoStr,
            style: isCredito ? "textoCredito" : "textoDesconto",
          },
          { text: "Lançamento", style: "tabelaTextoBold" },
          { text: lanc.descricao || "Ajuste manual", style: "tabelaTextoSub" },
          { text: "-", style: "tabelaTexto" }, // Coluna natureza vazia para lançamentos
          {
            text: valorFormatado,
            style: isCredito ? "tabelaValorCredito" : "tabelaValorDesconto",
          },
        ]);
      });
    }

    // Tabela do Dia
    content.push({
      table: {
        widths: [40, "auto", "*", 50, 80],
        body: linhasDia,
      },
      layout: "noBorders",
      margin: [0, 5, 0, 5],
    });

    // Total do Dia
    content.push({
      table: {
        widths: ["*", "auto", 80],
        body: [
          [
            "",
            { text: "Total do dia", style: "totalDiaLabel" },
            { text: formatarMoeda(dia.totalDia), style: "totalDiaValor" },
          ],
        ],
      },
      layout: "lightHorizontalLines",
      margin: [0, 0, 0, 20],
    });
  });

  // 5. Configuração Final do Documento
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 60], // Margem inferior maior para o rodapé
    content: content,
    background: (_currentPage: any, pageSize: any) => {
      return {
        canvas: [
          // HEADER
          {
            type: "rect",
            x: 0,
            y: 0,
            w: pageSize.width, // Usa a largura total da página automaticamente
            h: 10,
            color: "#AAA",
          },
          // FOOTER (Faixa Laranja no Fundo)
          {
            type: "rect",
            x: 0,
            y: pageSize.height - 60, // Pega o fim da página e sobe 70 pixels
            w: pageSize.width,
            h: 60,
            color: "#FF8E00",
          },
        ],
      };
    },
    footer: function (currentPage, pageCount) {
      const agora = new Date();
      const dataExtrato = `${agora.getDate()} de ${agora.toLocaleString("pt-BR", { month: "long" })} de ${agora.getFullYear()} ás ${agora.getHours()}:${String(agora.getMinutes()).padStart(2, "0")}`;

      return {
        columns: [
          {
            image: logoBase64,
            width: 45,
            margin: [0, 2, 0, 0],
          },
          {
            text: "",
            width: 15,
          },
          {
            text: [
              `Tem alguma dúvida? Entre em contato com a central da operadora ${nomeOperadora}.\n`,
              `Extrato gerado no dia ${dataExtrato}\n`,
              `Acesse: www.neofronta.com`
            ],
            style: "rodapeTexto",
            color: "#FFFFFF",
            width: "*",
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: "right",
            style: "rodapeTexto",
            color: "#FFFFFF",
            width: 100,
          },
        ],
        margin: [40, 10, 40, 10],
      };
    },
    styles: {
      marcaOperadora: { fontSize: 20, bold: true, color: "#FF8E00" }, // Cor laranja neo frota
      periodoOperadora: { fontSize: 10, color: "#666" },
      saldoFinalDestaque: { fontSize: 22, bold: true, color: "#2c3e50" },
      tituloSecao: {
        fontSize: 14,
        bold: true,
        color: "#7f8c8d",
        margin: [0, 10, 0, 0],
      },
      nomeMotorista: { fontSize: 18, bold: true, color: "#2c3e50" },
      infoSubtext: { fontSize: 10, color: "#95a5a6" },

      // Estilos Tabela Resumo
      tableHeaderDark: {
        bold: true,
        fontSize: 12,
        fillColor: "#ecf0f1",
        margin: [0, 5, 0, 5],
      },
      linhaNormal: { fontSize: 11, margin: [0, 5, 0, 5] },
      linhaValor: { fontSize: 11, alignment: "right", margin: [0, 5, 0, 5] },
      linhaValorCredito: {
        fontSize: 11,
        color: "#27ae60",
        alignment: "right",
        margin: [0, 5, 0, 5],
      },
      linhaValorDesconto: {
        fontSize: 11,
        color: "#c0392b",
        alignment: "right",
        margin: [0, 5, 0, 5],
      },
      linhaDestaque: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] },
      linhaValorDestaque: {
        fontSize: 12,
        bold: true,
        alignment: "right",
        margin: [0, 5, 0, 5],
      },

      // Estilos Loop Diário
      diaHeader: {
        fontSize: 14,
        bold: true,
        color: "#f39c12",
        margin: [0, 10, 0, 5],
      },
      tabelaTexto: { fontSize: 10, color: "#333", margin: [0, 4, 0, 4] },
      tabelaTextoBold: {
        fontSize: 10,
        bold: true,
        color: "#2c3e50",
        margin: [0, 4, 0, 4],
      },
      tabelaTextoSub: { fontSize: 9, color: "#7f8c8d", margin: [0, 4, 0, 4] },
      tabelaValor: { fontSize: 10, alignment: "right", margin: [0, 4, 0, 4] },

      textoCredito: {
        fontSize: 10,
        bold: true,
        color: "#27ae60",
        margin: [0, 4, 0, 4],
      },
      textoDesconto: {
        fontSize: 10,
        bold: true,
        color: "#c0392b",
        margin: [0, 4, 0, 4],
      },
      tabelaValorCredito: {
        fontSize: 10,
        bold: true,
        color: "#27ae60",
        alignment: "right",
        margin: [0, 4, 0, 4],
      },
      tabelaValorDesconto: {
        fontSize: 10,
        bold: true,
        color: "#c0392b",
        alignment: "right",
        margin: [0, 4, 0, 4],
      },

      totalDiaLabel: {
        fontSize: 11,
        bold: true,
        color: "#7f8c8d",
        alignment: "right",
        margin: [0, 5, 0, 5],
      },
      totalDiaValor: {
        fontSize: 12,
        bold: true,
        color: "#2c3e50",
        alignment: "right",
        margin: [0, 5, 0, 5],
      },

      rodapeTexto: { fontSize: 9, color: "#bdc3c7" },
    },
    defaultStyle: { fontSize: 10 },
  };

  const pdfBase = (pdfMake as any).default || pdfMake;
  if (pdfBase && typeof pdfBase.createPdf === "function") {
    pdfBase
      .createPdf(docDefinition)
      .download(
        `Extrato_${motoristaData.nomeMotorista.replace(/\s/g, "_")}.pdf`,
      );
  }
};
