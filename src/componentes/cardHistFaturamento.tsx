import { useTema } from "../hooks/temaContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { useFaturamentoDiario } from "../hooks/useFaturamento";
import { useAdminLogado } from "../hooks/AdminLogado";

function CardHistFaturamento() {
  function getMonthRangeISO() {
    const now = new Date();

    const start = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    );
    const end = new Date(
      Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0) - 1,
    );

    return {
      inicioISO: start.toISOString(),
      fimISO: end.toISOString(),
    };
  }

  const operadoraId = useAdminLogado()?.operadora.id;

  const { faturamentoDiario } = useFaturamentoDiario(
    getMonthRangeISO().inicioISO,
    getMonthRangeISO().fimISO,
    String(operadoraId),
  );

  const formatarEixoY = (valor: number) => {
    if (valor === 0) return "0";
    return `${valor / 1000}k`;
  };

  const formatarMoedaBR = (valor: any) => {
    const valorFormatado = Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return [valorFormatado, "Faturamento"] as [string, string];
  };
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: Cor.base2,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: 15,
          borderRadius: 22,
          boxShadow: Cor.sombra,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 5,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Cor.primaria,
                borderRadius: 5,
              }}
            >
              <p
                style={{
                  fontFamily: "Icone",
                  fontWeight: "bold",
                  color: Cor.base2,
                }}
              >
                bar_chart_4_bars
              </p>
            </div>
            <p
              style={{ fontSize: 16, color: Cor.primaria, fontWeight: "bold" }}
            >
              Faturamento Diário
            </p>
          </div>
          <p
            style={{
              fontSize: 12,
              color: Cor.texto2,
              width: 200,
              textAlign: "end",
            }}
          >
            Registros do mês atual
          </p>
        </div>
        <div
          style={{
            width: "100%",
            height: "90%",
            userSelect: "none",
          }}
        >
          <AreaChart
            style={{
              width: "100%",
              maxHeight: "100%",
              aspectRatio: 1.618,
            }}
            responsive
            data={faturamentoDiario}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onContextMenu={(_, e) => e.preventDefault()}
          >
            <CartesianGrid
              strokeDasharray="100 0"
              stroke={Cor.primariaTxt + 20}
              strokeWidth={1}
            />
            <XAxis dataKey="dia" type="category" fontSize={12} />
            <YAxis
              width="auto"
              fontSize={12}
              tickFormatter={formatarEixoY}
              tickCount={9}
            />
            <Tooltip
              animationEasing="ease-in-out"
              useTranslate3d={true}
              formatter={formatarMoedaBR}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke={Cor.primaria}
              strokeWidth={2}
              fill={Cor.primaria + 99}
            />
            <RechartsDevtools />
          </AreaChart>
        </div>
      </div>
    </>
  );
}

export default CardHistFaturamento;
