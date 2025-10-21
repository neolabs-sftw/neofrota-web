import { useTema } from "../hooks/temaContext";

interface Props {
  status?: string;
  error?: string;
  icone?: any;
  msg?: string;
}

function CxCarregamento({ status, error, icone, msg }: Props) {
  const { Cor } = useTema();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: Cor.base2 + 50,
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 10,
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "20%",
          height: "40%",
          padding: 22,
          backgroundColor: Cor.base,
          borderRadius: 22,
          boxShadow: Cor.sombra,
          border: "1px solid " + Cor.texto1 + 50,
        }}
      >
        {icone}
        <p style={{ color: Cor.texto2, fontSize: 12  }}>{msg}</p>
        {status && <p style={{ color: Cor.texto1, textAlign: "center" }}>{status}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default CxCarregamento;
