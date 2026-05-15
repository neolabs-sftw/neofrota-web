import styled from "styled-components";
import BaseTelas from "../../componentes/baseTelas";
import EditPerfil from "../../componentes/editPerfil";
import { useTema } from "../../hooks/temaContext";

export function Pagamentos() {
  return BaseTelas({
    conteudo: (
      <>
        <PagamentosConteudo />
        <EditPerfil />
      </>
    ),
  });
}

function PagamentosConteudo() {
  const { Cor } = useTema();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        padding: "25px 15px 15px 15px",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Pagamentos</h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "50%",
          }}
        >
          <h2 style={{ color: Cor.texto1, fontSize: 20 }}>
            Resumo de Pagameots/Repasses
          </h2>
          <p style={{ color: Cor.texto2, fontSize: 14 }}>
            Visão geral financeira de repasse para motoristas.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            backgroundColor: Cor.base2,
            border: `1px solid ${Cor.texto2 + 90}`,
            padding: 10,
            borderRadius: 10,
            width: "40%",
          }}
        >
          <p style={{ color: Cor.texto2, fontSize: 14 }}>Período:</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <input
              type="date"
              style={{
                padding: 5,
                border: `1px solid ${Cor.texto2 + 90}`,
                outline: "none",
                borderRadius: 10,
                backgroundColor: Cor.texto2 + 50,
                color: Cor.texto1,
              }}
            />
            <p
              style={{ color: Cor.primaria, fontSize: 14, fontWeight: "bold" }}
            >
              Até
            </p>
            <input
              type="date"
              style={{
                padding: 5,
                border: `1px solid ${Cor.texto2 + 90}`,
                outline: "none",
                borderRadius: 10,
                backgroundColor: Cor.texto2 + 50,
                color: Cor.texto1,
              }}
            />
            <BtnFiltrar $bg={Cor.primaria} $texto={Cor.base}>
              Filtrar
            </BtnFiltrar>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.fixo}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.textoFixo }}>Total Repasses Fixos</p>
          <p style={{ fontSize: 22, color: Cor.fixo, fontWeight: "bold" }}>
            R$ 35.000,00
          </p>
        </div>
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.turno}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.texto1 }}>Total Repasses Turnos</p>
          <p style={{ fontSize: 22, color: Cor.turno, fontWeight: "bold" }}>
            R$ 35.000,00
          </p>
        </div>
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.extra}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.texto1 }}>Total Repasses Extra</p>
          <p style={{ fontSize: 22, color: Cor.extra, fontWeight: "bold" }}>
            R$ 35.000,00
          </p>
        </div>
        <div
          style={{
            width: "25%",
            height: 75,
            backgroundColor: Cor.base2,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${Cor.texto2 + 90}`,
            borderRight: `1px solid ${Cor.texto2 + 90}`,
            borderLeft: `5px solid ${Cor.primaria}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p style={{ color: Cor.texto1 }}>Total Geral</p>
          <p style={{ fontSize: 22, color: Cor.primaria, fontWeight: "bold" }}>
            R$ 35.000,00
          </p>
        </div>
      </div>
      <ListaMotoristaPagamentos />
    </div>
  );
}

interface BtnFiltrarProps {
  $bg: string;
  $texto: string;
}

const BtnFiltrar = styled.div<BtnFiltrarProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $texto }) => $texto};
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background-color: ${({ $bg }) => $bg + "BA"};
    scale: 1.02;
  }

  &:active {
    scale: 0.98;
    background-color: ${({ $bg }) => $bg + 90};
  }
`;

function ListaMotoristaPagamentos() {
  const { Cor } = useTema();

  // const listaMotoristasPagamentos: any = [];
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div>
          <p style={{ fontWeight: "500", color: Cor.primaria }}>
            Lista de Motoristas Pagamentos
          </p>
          <p style={{ fontSize: 12, color: Cor.secundaria }}>
            Visão geral financeira de repasse para motoristas.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              fontSize: "24px",
              color: Cor.primaria,
              cursor: "pointer",
            }}
            // onClick={() =>
            //   exportarPlanilha(
            //     lista_unidades,
            //     `Unidades ${empresa?.nome}`,
            //     "csv"
            //   )
            // }
          >
            download
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "5px 15px",
              backgroundColor: Cor.texto2 + 20,
              borderRadius: 22,
              gap: 5,
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "24px",
                color: Cor.primaria,
              }}
            >
              search
            </p>
            <input
              type="text"
              style={{
                border: "none",
                backgroundColor: "transparent",
                width: "100%",
                outline: "none",
                color: Cor.texto1,
              }}
              placeholder="Buscar..."
              //   value={busca}
              //   onChange={(e) => setBusca(e.target.value)}
            />
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: "24px",
                color: Cor.primaria,
                cursor: "pointer",
              }}
            >
              close
            </p>
          </div>
        </div>
      </div>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <p style={{backgroundColor:Cor.atencao}}>Motorista</p>
        <p style={{backgroundColor:Cor.atencao + 90}}>Tipo</p>
        <p style={{backgroundColor:Cor.atencao + 50}}>Fixos</p>
        <p style={{backgroundColor:Cor.atencao + 30}}>Extras</p>
        <p style={{backgroundColor:Cor.atencao + 15}}>Turnos</p>
        <p style={{backgroundColor:Cor.atencao + 5}}>Total</p>
        <p style={{backgroundColor:Cor.atencao}}>Ver</p>
      </div>
    </div>
  );
}
