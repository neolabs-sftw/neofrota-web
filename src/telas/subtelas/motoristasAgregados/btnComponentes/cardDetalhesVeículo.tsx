import Lottie from "lottie-react";
import icativo from "../../../../assets/animations/icativo.json";
import icinativo from "../../../../assets/animations/icinativo.json";
import { useTema } from "../../../../hooks/temaContext";
import { OptCarros } from "./optCarros";
import { useCarroAtrelado } from "../../../../hooks/useCarros";
import CircularProgress from "@mui/material/CircularProgress";

function CardDetalhesVeiculo({ motorista }: { motorista: any }) {
  const { carroAtrelado, loading } = useCarroAtrelado(motorista?.id || 0);

  const veiculo =
    carroAtrelado && carroAtrelado.length > 0 ? carroAtrelado[0] : null;

  const Cor = useTema().Cor;

  const normalize = (text: string) => {
    if (!text) return "";
    return text
      .normalize("NFD") // separa acento
      .replace(/[\u0300-\u036f]/g, "") // remove acento
      .toLowerCase()
      .replace(/\s+/g, "_"); // troca espaços por _
  };
  // Monta a URL antes do return
  const imgCarro = veiculo
    ? `https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/carros/${normalize(veiculo.marca)}/${normalize(veiculo.modelo)}/${normalize(veiculo.cor)}.png`
    : "";

  if (loading || !veiculo) {
    return (
      <div
        style={{
          width: "50%",
          height: 280,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: Cor.secundaria + 20,
          borderRadius: 22,
          border: "1px solid " + Cor.secundaria + 30,
          padding: 10,
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ color: Cor.secundaria, fontSize: 14 }}>
            Detalhes Veiculo
          </p>
          <div
            style={{ width: "40%", height: 1, backgroundColor: Cor.primaria }}
          />
          <OptCarros />
        </div>
        <div
          style={{
            width: "100%",
            height: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto1, fontSize: 16 }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <CircularProgress
                  size={20}
                  thickness={8}
                  sx={{
                    color: Cor.primaria,
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
                
                <p>"Buscando veículo..."</p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none"
                }}
              >
                <img
                  src="https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/carros/default.png"
                  style={{ width: "80%", opacity: 0.1 }}
                  alt=""
                />
                <p
                  style={{
                    position: "absolute",
                    fontWeight: 900,
                    color: Cor.texto1,
                  }}
                >
                  "Sem Carro atrelado"
                </p>
              </div>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "50%",
        height: 280,
        display: "flex",
        flexDirection: "column",
        backgroundColor: Cor.secundaria + 20,
        borderRadius: 22,
        border: "1px solid " + Cor.secundaria + 30,
        padding: 10,
        boxShadow: Cor.sombra,
        gap: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 14 }}>Detalhes Veiculo</p>
        <div
          style={{ width: "40%", height: 1, backgroundColor: Cor.primaria }}
        />
        <OptCarros />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: "100%",
        }}
      >
        <img
          src={imgCarro}
          alt=""
          style={{ width: "60%", borderRadius: 22, objectFit: "contain" }}
        />
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Marca</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>
              {veiculo?.marca || "carregando..."}
            </p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Modelo</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>
              {veiculo?.modelo || "carregando..."}
            </p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Ano</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>{veiculo?.ano}</p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Placa</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>{veiculo?.placa}</p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <p style={{ color: Cor.secundaria, fontSize: 11 }}>Chassi</p>
          <p style={{ color: Cor.texto1, fontSize: 14 }}>{veiculo?.chassi}</p>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: Cor.texto1 + 50,
            }}
          />
        </div>
        <div
          style={{
            width: "55%",
            height: 40,
            backgroundColor: veiculo?.vCrlv ? Cor.ativo + 20 : Cor.inativo + 20,
            borderRadius: 22,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Lottie
            animationData={veiculo?.vCrlv ? icativo : icinativo}
            loop={true}
            style={{ width: 25, height: 25 }}
            autoPlay
          />
          <p
            style={{
              color: veiculo?.vCrlv ? Cor.ativo : Cor.inativo,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {veiculo?.vCrlv ? "Licenciamento Válido" : "Licenciamento Vencido"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardDetalhesVeiculo;
