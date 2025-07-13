import { useTema } from "../hooks/temaContext";

function CardRankingMotoristas() {
  const Cor = useTema().Cor;
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "85vh",
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
          style={{ width: "100%", height: 200, backgroundColor: "#Fff55515" }}
        ></div>
        <style>
          {`table {
              border-collapse: collapse;
              width: 100%;
               }

            td {
              text-align: left;
              padding: 5px;
              color: ${Cor.texto1};
              border-bottom: 1px solid ${Cor.texto2 + 20};
              }

            tr:nth-child(even) {
              background-color: ${Cor.texto1 + 10};
              }`}
        </style>
        <table>
          <thead>
          <tr style={{ fontSize: 11, color: Cor.texto2 }}>
            <th>Ranking</th>
            <th>Motorista</th>
            <th style={{ textAlign: "right" }}>Qnt.</th>
          </tr>
          </thead>
          <tbody>
            <tr>          
              <td>2</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
            <tr>
              <td>10</td>
              <td>Fulano</td>
              <td style={{ textAlign: "right" }}>300</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CardRankingMotoristas;
