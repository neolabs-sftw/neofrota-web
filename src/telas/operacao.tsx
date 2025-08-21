import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import { useEffect, useState } from "react";
import BtnProximaViagem from "../componentes/btnProximaViagem";
import ListaProximasViagens from "../componentes/listaProximasViagens";

function Operacao() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <OperacaoConteudo />
      </>
    ),
  });
}

export default Operacao;

const vouchers = [
 {
    natureza: 'extra',
    tipo: 'entrada',  
    cliente: 'Omega Indústria',
    motorista: 'André Souza',
    origem: 'Lauro de Freitas',
    destino: 'São Sebastião do Passé',
    data: '2025-02-22',
    hora: '06:46',
    id: '76d5e0f3-c5be-4f0e-a6a6-e901142f3331'
  },
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Alpha Logística',
    motorista: 'Carlos Almeida',
    origem: 'Mata de São João',
    destino: 'Candeias',
    data: '2025-03-27',
    hora: '19:57',
    id: '78529a11-fd6a-4f92-a6f3-e4734b36823f'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Delta Atacado',
    motorista: 'Marcos Santos',
    origem: 'Vera Cruz',
    destino: 'Lauro de Freitas',
    data: '2025-03-26',
    hora: '00:00',
    id: '80a11682-7572-47e1-aed3-5edbd10b8257'
  },
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Gamma Construções',
    motorista: 'Roberto Fernandes',
    origem: 'São Sebastião do Passé',
    destino: 'Lauro de Freitas',
    data: '2025-07-23',
    hora: '10:30',
    id: '6648f89d-4117-4b37-89d2-cd6cd0df177c'
  },
  {
    natureza: 'fixo',
    tipo: 'saída',
    cliente: 'Epsilon Serviços',
    motorista: 'Rafael Costa',
    origem: 'Mata de São João',
    destino: 'Salvador',
    data: '2025-03-27',
    hora: '01:26',
    id: '874f8542-8c26-4ed4-aad2-a4bdf7ba749e'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Kappa Alimentos',
    motorista: 'João Pereira',
    origem: 'Simões Filho',
    destino: "Dias d'Ávila",
    data: '2025-05-14',
    hora: '01:19',
    id: 'df72d317-0c2c-43c4-8cd0-f8c9c67f16ac'
  },
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Sigma Distribuidora',
    motorista: 'Fábio Oliveira',
    origem: 'Vera Cruz',
    destino: 'Itaparica',
    data: '2025-02-04',
    hora: '21:24',
    id: '6815e095-0793-4c47-a1e1-4c5c3da6db4f'
  },
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Lambda Tecnologia',
    motorista: 'Marcos Santos',
    origem: 'Camaçari',
    destino: "Dias d'Ávila",
    data: '2025-03-25',
    hora: '05:45',
    id: 'ae2ca07f-ca28-4509-aa0f-506d0be1ee57'
  },
];

const vouchers2 = [
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Sigma Distribuidora',
    motorista: 'Paulo Ribeiro',
    origem: 'Vera Cruz',
    destino: 'Fábrica',
    data: '2025-04-25',
    hora: '11:05',
    id: '19a122e7-dac3-46e0-bc73-46429f271c80'
  },
  {
    natureza: 'extra',
    tipo: 'entrada',
    cliente: 'Kappa Alimentos',
    motorista: 'Marcos Santos',
    origem: "Dias d'Ávila",
    destino: 'Fábrica',
    data: '2025-08-06',
    hora: '09:35',
    id: 'e8d4eb37-cd2d-44c0-b5b9-a2e11239b370'
  },
  {
    natureza: 'fixo',
    tipo: 'saída',
    cliente: 'Omega Indústria',
    motorista: 'Roberto Fernandes',
    origem: 'Fábrica',
    destino: 'São Sebastião do Passé',
    data: '2025-04-04',
    hora: '15:26',
    id: '26c79a99-ce9f-4cc8-9b03-8f8dc39f3f9c'
  },
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Gamma Construções',
    motorista: 'Carlos Almeida',
    origem: 'Simões Filho',
    destino: 'Fábrica',
    data: '2025-01-21',
    hora: '12:28',
    id: '24f56bb6-52e4-4937-b318-546039e90b23'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Omega Indústria',
    motorista: 'Roberto Fernandes',
    origem: 'Fábrica',
    destino: 'Vera Cruz',
    data: '2025-04-18',
    hora: '04:10',
    id: '8902b8df-98d0-4107-9868-bc30ac3d3a0b'
  },
  {
    natureza: 'fixo',
    tipo: 'saída',
    cliente: 'Zeta Exportações',
    motorista: 'Marcos Santos',
    origem: 'Fábrica',
    destino: 'Mata de São João',
    data: '2025-08-02',
    hora: '10:18',
    id: '11b4dccd-b2e0-4806-a94e-2c27bbde8d40'
  },
  {
    natureza: 'fixo',
    tipo: 'saída',
    cliente: 'Zeta Exportações',
    motorista: 'Carlos Almeida',
    origem: 'Fábrica',
    destino: 'Lauro de Freitas',
    data: '2025-06-03',
    hora: '17:14',
    id: 'a0c4e56b-1ae0-4980-a2ed-c00f71eb605a'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Omega Indústria',
    motorista: 'Marcos Santos',
    origem: 'Fábrica',
    destino: 'Mata de São João',
    data: '2025-05-06',
    hora: '09:57',
    id: '2e18fb4f-d4bb-4f77-a4b2-90662b8ebfd5'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Beta Transportes',
    motorista: 'João Pereira',
    origem: 'Fábrica',
    destino: 'Simões Filho',
    data: '2025-03-11',
    hora: '21:48',
    id: '285aa02f-21a2-4e7e-843a-133eea1ba3d6'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Gamma Construções',
    motorista: 'Bruno Martins',
    origem: 'Fábrica',
    destino: 'Vera Cruz',
    data: '2025-01-27',
    hora: '19:38',
    id: '3c0fea52-eb38-4704-ae76-efe0c6e4342c'
  },
  {
    natureza: 'extra',
    tipo: 'entrada',
    cliente: 'Alpha Logística',
    motorista: 'Eduardo Lima',
    origem: 'São Sebastião do Passé',
    destino: 'Fábrica',
    data: '2025-05-31',
    hora: '00:18',
    id: '91ea52be-4246-4640-aecf-14b8b98546ba'
  },
  {
    natureza: 'fixo',
    tipo: 'entrada',
    cliente: 'Gamma Construções',
    motorista: 'Paulo Ribeiro',
    origem: "Dias d'Ávila",
    destino: 'Fábrica',
    data: '2025-02-10',
    hora: '00:34',
    id: 'ab3c76f9-8382-4df0-85ef-1686d8d81605'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Epsilon Serviços',
    motorista: 'Fábio Oliveira',
    origem: 'Fábrica',
    destino: 'São Sebastião do Passé',
    data: '2025-07-31',
    hora: '13:34',
    id: '9aae6c29-7feb-4b23-8950-b0b5f88f07de'
  },
  {
    natureza: 'extra',
    tipo: 'saída',
    cliente: 'Alpha Logística',
    motorista: 'Bruno Martins',
    origem: 'Fábrica',
    destino: 'Lauro de Freitas',
    data: '2025-04-14',
    hora: '03:43',
    id: 'ff80f3a2-50e2-4847-a086-37b1ae7efe7c'
  },
  {
    natureza: 'fixo',
    tipo: 'saída',
    cliente: 'Delta Atacado',
    motorista: 'Carlos Almeida',
    origem: 'Fábrica',
    destino: 'Candeias',
    data: '2025-02-16',
    hora: '17:54',
    id: 'ac452b4c-a85d-4fce-94d6-0f133f0254f9'
  }
]


function OperacaoConteudo() {
  const [dataHora, setDataHora] = useState("");

  useEffect(() => {
    // função para formatar e atualizar
    const atualizarDataHora = () => {
      setDataHora(
        new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })
      );
    };

    atualizarDataHora(); // chama na montagem

    const intervalId = setInterval(atualizarDataHora, 1000); // a cada 30s

    return () => clearInterval(intervalId); // limpa ao desmontar
  }, []);

  const Cor = useTema().Cor;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        padding: "25px 15px 15px 15px",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Dashboard</h3>
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
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: Cor.texto2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                color: Cor.base,
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              next_week
            </p>
          </div>
          <p style={{ color: Cor.texto1, fontSize: 14 }}>Próximas Viagens</p>
        </div>
        <p style={{ color: Cor.texto1 }}>
          Data e Hora: <strong>{dataHora}</strong>
        </p>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          padding: 10,
          borderRadius: 22,
          backgroundColor: Cor.texto2 + 20,
        }}
      >
        <div
          style={{
            width: "80%",
            height: "50vh",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {vouchers.map((item) => (
            <BtnProximaViagem
              natureza={item.natureza}
              tipo={item.tipo}
              cliente={item.cliente}
              motorista={item.motorista}
              origem={item.origem}
              destino={item.destino}
              data={item.data}
              hora={item.hora}
              id={item.id}
              key={item.id}
            />
          ))}
        </div>
        <div
          style={{
            width: "20%",
            height: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
         
          <div
            className="btn-novo-voucher"
            style={{
              width: "100%",
              height: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid" + Cor.primaria + 50,
              borderRadius: 18,
              cursor: "pointer",
            }}
          >
            <style>{`
          .btn-novo-voucher {              
              background-color: ${Cor.primaria + 10};
              transition: all 0.1s ease-in-out;
          }
          .btn-novo-voucher:hover {
            background-color: ${Cor.primaria + 30};
          }
          .btn-novo-voucher:active{
              background-color: ${Cor.primaria + 60};
          }
         `}</style>
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: 48,
                color: Cor.primaria,
              }}
            >
              history
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: 18,
                color: Cor.secundaria,
              }}
            >
              Roteiros Fixos
            </p>
          </div>
          <div
            className="btn-novo-voucher"
            style={{
              width: "100%",
              height: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid" + Cor.primaria + 50,
              borderRadius: 18,
              cursor: "pointer",
            }}
          >
            <style>{`
          .btn-novo-voucher {              
              background-color: ${Cor.primaria + 10};
              transition: all 0.1s ease-in-out;
          }
          .btn-novo-voucher:hover {
            background-color: ${Cor.primaria + 30};
          }
          .btn-novo-voucher:active{
              background-color: ${Cor.primaria + 60};
          }
         `}</style>
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                fontSize: 48,
                color: Cor.primaria,
              }}
            >
              car_tag
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: 18,
                color: Cor.secundaria,
              }}
            >
             Novo Voucher
            </p>
          </div>
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
              placeholder="Filtrar Motorista"
              // value={busca}
              // onChange={(e) => setBusca(e.target.value)}
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
              placeholder="Filtrar Empresa"
              // value={busca}
              // onChange={(e) => setBusca(e.target.value)}
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
      <div
        style={{
          width: "100%",
          backgroundColor: Cor.base2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "22px",
          padding: 10,
          gap: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 10, height: 100 }}> <p>Área de Consultas</p> </div>
          {vouchers2.map((v) => (
            <ListaProximasViagens key={v.id} v={v}/>
          ))}
      </div>
    </div>
  );
}
