import BaseTelas from "../componentes/baseTelas";
import EditPerfil from "../componentes/editPerfil";
import { useTema } from "../hooks/temaContext";
import { useEffect, useState } from "react";
import BtnProximaViagem from "../componentes/btnProximaViagem";
import ListaProximasViagens from "../componentes/listaProximasViagens";
import { useNavigate } from "react-router-dom";
import { useVouchers } from "../hooks/useVouchers";
import ModalPreviewVoucher from "../componentes/modalPreviewVoucher";

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

function OperacaoConteudo() {
  const [dataHora, setDataHora] = useState("");

  const [modalPreveiw, setModalPreview] = useState(false);
  const [voucherPreview, setVoucherPreview] = useState<any>(null);

  const { listaVouchers } = useVouchers();

  console.log("Lista de Vouchers:", listaVouchers);

  useEffect(() => {
    const atualizarDataHora = () => {
      setDataHora(
        new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      );
    };

    atualizarDataHora(); // chama na montagem

    const intervalId = setInterval(atualizarDataHora, 30000); // a cada 30s

    return () => clearInterval(intervalId); // limpa ao desmontar
  }, []);

  const Cor = useTema().Cor;

  const navigate = useNavigate();

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
      <ModalPreviewVoucher
        setVisivel={setModalPreview}
        visivel={modalPreveiw}
        v={voucherPreview}
      />
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
          {listaVouchers.slice(-8).map((v: any) => (
            <BtnProximaViagem
              v={v}
              key={v.id}
              modalPreveiw={modalPreveiw}
              setModalPreview={setModalPreview}
              setVoucherPreview={setVoucherPreview}
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
            onClick={() => {
              navigate("/novovoucher");
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            height: 100,
          }}
        >
          {" "}
          <p>Área de Consultas</p>{" "}
        </div>
        {listaVouchers.map((v: any) => (
          <ListaProximasViagens
            v={v}
            key={v.id}
            modalPreveiw={modalPreveiw}
            setModalPreview={setModalPreview}
            setVoucherPreview={setVoucherPreview}
          />
        ))}
      </div>
    </div>
  );
}
