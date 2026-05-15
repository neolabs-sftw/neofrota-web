
import { useAdminLogado } from "../hooks/AdminLogado";
import { useTema } from "../hooks/temaContext";
import { useVouchersRanking } from "../hooks/useVouchers";

function CardRankingMotoristas() {
  const operadoraId = useAdminLogado()?.operadora.id;

  const formatarParaYMD = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const hoje = new Date();
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const filtro = {
    operadoraId: String(operadoraId),
    adminUsuarioId: "",
    dataFim: formatarParaYMD(ultimoDia),
    dataInicio: formatarParaYMD(primeiroDia),
    empresaClienteId: "",
    motoristaId: "",
    natureza: "",
    solicitanteId: "",
    status: "Concluido",
  };
  const { listaRanking } = useVouchersRanking(filtro);

  const rankingMotoristas = listaRanking.reduce((acc: any, voucher: any) => {
    const { id, nome, fotoMotorista } = voucher.motorista;

    if (!acc[id]) {
      acc[id] = {
        id,
        nome,
        fotoMotorista,
        totalVouchers: 0,
      };
    }

    acc[id].totalVouchers += 1;

    return acc;
  }, {});
  const resultadoFinal = Object.values(rankingMotoristas).sort(
    (a: any, b: any) => b.totalVouchers - a.totalVouchers,
  );

  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "100%",
          height: 510,
          borderRadius: "22px",
          backgroundColor: Cor.base2,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
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
                trophy
              </p>
            </div>
            <p
              style={{ fontSize: 16, color: Cor.primaria, fontWeight: "bold" }}
            >
              Motoristas
            </p>
          </div>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Ranking</p>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "45%",
              aspectRatio: 1,
              backgroundColor: Cor.base2,
              boxShadow: Cor.sombra,
              borderRadius: 14,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                display: "flex",
                flexDirection: "row",
                width: "95%",
                aspectRatio: 1,
                backgroundColor: Cor.base2,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                objectFit: "cover",
              }}
              src={
                (resultadoFinal[0] as any)?.fotoMotorista ||
                "https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/img_perfis/default.png"
              }
              alt="Campeão"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "70%",
              backgroundColor: Cor.base2,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: Cor.primariaTxt,
                width: "70%",
                textAlign: "center",
              }}
            >
              Motorista nº{" "}
              <strong
                style={{
                  fontSize: 16,
                  color: Cor.primaria,
                  width: "70%",
                  textAlign: "center",
                }}
              >
                1
              </strong>{" "}
              do Mês
            </p>
            <p
              style={{
                fontSize: 16,
                color: Cor.primariaTxt,
                fontWeight: "bold",
                width: "70%",
                textAlign: "center",
              }}
            >
              {(resultadoFinal[0] as any)?.nome}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <p
            style={{
              fontSize: 11,
              color: Cor.texto2,
              fontWeight: "bold",
              width: "10%",
            }}
          >
            Raking
          </p>
          <p
            style={{
              fontSize: 11,
              color: Cor.texto2,
              fontWeight: "bold",
              width: "70%",
              textAlign: "center",
            }}
          >
            Motorista
          </p>
          <p
            style={{
              fontSize: 11,
              color: Cor.texto2,
              fontWeight: "bold",
              width: "20%",
              textAlign: "end",
            }}
          >
            Qnt.
          </p>
        </div>
        {resultadoFinal.slice(1, 12).map((motorista: any, index: number) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              borderBottom: `1px solid ${Cor.secundaria + 20}`,
            }}
            key={motorista.id}
          >
            <p
              style={{
                display: "flex",
                width: "10%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: Cor.texto1,
                fontSize: 14,
              }}
            >
              {index + 2}
            </p>
            <p
              style={{
                display: "flex",
                width: "75%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: Cor.texto1,
                fontSize: 14,
              }}
            >
              {motorista.nome}
            </p>
            <p
              style={{
                width: "15%",
                textAlign: "end",
                color: Cor.secundaria,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {motorista.totalVouchers}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default CardRankingMotoristas;
