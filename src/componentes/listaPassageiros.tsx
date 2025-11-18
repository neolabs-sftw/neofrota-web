import { useTema } from "../hooks/temaContext";

function ListaPassageiros() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        padding: 15, 
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
          backgroundColor: "yellow",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: Cor.primaria,
              borderRadius: 14,
            }}
          ></div>
          <div>
            <p style={{ fontWeight: "500", color: Cor.primaria }}>
              Lista de Passageiros
            </p>
            <p style={{ fontSize: 12, color: Cor.secundaria }}>
              Lista de passageiros cadastrados na empresa " ".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListaPassageiros;
