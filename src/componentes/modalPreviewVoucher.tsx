import { useEffect } from "react";
import { useTema } from "../hooks/temaContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface CxModalProps {
  $border: string;
  $visivel: boolean;
  $bg: string;
}

const Overlay = styled.div<{ $visivel: boolean; $bg: string }>`
  width: 100vw;
  height: 100vh;
  background-color: ${({ $bg }) => `${$bg}90`};
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  alin-items: center;
  top: 0;
  left: 0;
  padding: 1%;
  z-index: 10;
  backdrop-filter: blur(3px);
  opacity: ${({ $visivel }) => ($visivel ? 1 : 0)};
  pointer-events: ${({ $visivel }) => ($visivel ? "auto" : "none")};
  transition: all 0.3s ease-in-out;
`;

const CxModal = styled.div<CxModalProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 7px;
  padding: 15px;
  width: 70%;
  border-radius: 22px;
  border: 1px solid ${({ $border }) => $border};
  background-color: ${({ $bg }) => $bg};
  position: absolute;
  z-index: 11;
  transform: ${({ $visivel }) => ($visivel ? "scale(1)" : "scale(0.6)")};
  opacity: ${({ $visivel }) => ($visivel ? 1 : 0)};
  pointer-events: ${({ $visivel }) => ($visivel ? "auto" : "none")};
  transition: all 0.3s ease-in-out;
  box-shadow: 4px 4px 8px #00000020;
`;

const BtnEditarVoucher = styled.button<{ $bg: string }>`
  width: 20%;
  background-color: ${({ $bg }) => $bg};
  height: 50px;
  border-radius: 18px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in;

  &:hover {
    background-color: ${({ $bg }) => $bg + 99};
  }

  &:active {
    background-color: ${({ $bg }) => $bg};
  }
`;

function ModalPreviewVoucher({
  visivel,
  setVisivel,
  natureza,
  id,
}: {
  visivel: boolean;
  setVisivel: any;
  natureza: string;
  id: string;
}) {
  const Cor = useTema().Cor;

  const navigate = useNavigate();

  const border = Cor.texto2 + 50;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setVisivel(false);
      } else if(event.key === "Enter") {
        navigate(`/editar/${natureza}/${id}`);
      }
    };

    if (visivel) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visivel, setVisivel]); // Dependências: o efeito roda quando a visibilidade muda


  return (
    <Overlay
      $visivel={visivel}
      $bg={Cor.base}
      onClick={() => setVisivel(false)}
    >
      <CxModal
        $visivel={visivel}
        $bg={Cor.base}
        $border={border}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingBottom: 5,
            borderBottom: `1px solid ${Cor.primaria}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: 14, fontWeight: "bold", color: Cor.texto1 }}>
              Detalhes
            </p>
            <p style={{ fontSize: 12, color: Cor.texto2 }}>
              Mais informações sobre o voucher programado.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 18,
                color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
              }}
            >
              ID: <strong>{id}</strong>
            </p>
            <p
              style={{
                cursor: "pointer",
                fontFamily: "Icone",
                fontSize: 24,
                color: Cor.primaria,
              }}
              onClick={() => setVisivel(false)}
            >
              close
            </p>
          </div>
        </div>
        <PrimeiraLinha />
        <DetalhesDaViagem natureza={natureza} />
        <div
          style={{ width: "100%", height: 1, backgroundColor: Cor.texto2 + 70 }}
        />
        <DetalhesDaViagem2 natureza={natureza} />
        <div
          style={{ width: "100%", height: 1, backgroundColor: Cor.texto2 + 70 }}
        />
        <DetalhesDoMotorista />
        <div
          style={{
            width: "100%",
            height: 180,
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <ListaPassageirosVoucher />
          <Assinatura />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ResultadoVoucher natureza={natureza} />
          <BtnEditarVoucher $bg={Cor.primaria}>
            <p style={{ color: Cor.base, fontWeight: "500", fontSize: 14 }}>
              Editar Voucher
            </p>
          </BtnEditarVoucher>
        </div>
      </CxModal>
    </Overlay>
  );
}

export default ModalPreviewVoucher;

function CardPassageiroVoucher() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        height: 45,
        width: "100%",
        backgroundColor: Cor.base,
        borderRadius: 10,
        border: `1px solid ${Cor.texto2 + 40}`,
        padding: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "28%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Tipo</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "95%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          Fulano de Tal da Virgens Santos Silva Guerra
        </p>
      </div>
      <div style={{ width: 1, height: "100%", backgroundColor: Cor.texto2 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "14%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Telefone</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "95%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          71 9 9999-9999
        </p>
      </div>
      <div style={{ width: 1, height: "100%", backgroundColor: Cor.texto2 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "8%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Horário</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "95%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          23:30
        </p>
      </div>
      <div style={{ width: 1, height: "100%", backgroundColor: Cor.texto2 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "45%",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Endereço</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: Cor.texto1,
            textOverflow: "ellipsis",
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua ut enim ad minim
          veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat
        </p>
      </div>
    </div>
  );
}

function PrimeiraLinha() {
  const Cor = useTema().Cor;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "5px 0 5px 0",
        borderBottom: `1px solid ${Cor.texto2 + 70}`,
      }}
    >
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRight: `1px solid ${Cor.texto2 + 70}`,
          padding: 5,
          gap: 10,
        }}
      >
        <img
          src="src\assets\image\icon.png"
          alt="img_Marca_Cliente"
          style={{
            width: 75,
            height: 75,
            objectFit: "cover",
            borderRadius: 18,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Cliente</p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: Cor.texto1 }}>
            Nome da Empresa Cliente
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Unidade</p>
          <p
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: Cor.texto1,
              textOverflow: "ellipsis",
              maxWidth: "95%",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Nome e Endereço da Unidade selecionada.
          </p>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 5,
        }}
      >
        <img
          src="src\assets\image\img-bg.png"
          alt="img_Marca_Cliente"
          style={{
            width: 75,
            height: 75,
            objectFit: "cover",
            borderRadius: 18,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Motorista</p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: Cor.texto1 }}>
            Nome do motorista
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Veículo</p>
          <p
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: Cor.texto1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            Marca, Modelo, Cor e Placa
          </p>
        </div>
      </div>
    </div>
  );
}

function DetalhesDaViagem({ natureza }: { natureza: string }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        height: 50,
        borderRadius: 18,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 25,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            backgroundColor: natureza === "fixo" ? Cor.fixo : Cor.extra,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: Cor.base,
              fontSize: 24,
            }}
          >
            {natureza === "fixo" ? "history" : "car_tag"}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Natureza</p>
          <p
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            {natureza === "fixo" ? "Fixo" : "Extra"}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            backgroundColor: natureza === "fixo" ? Cor.fixo : Cor.extra,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: Cor.base,
              fontSize: 24,
            }}
          >
            login
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Tipo</p>
          <p
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            Entrada
          </p>
        </div>
      </div>
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "10px 15px",
          backgroundColor: Cor.texto2 + 10,
          border: "1px solid " + Cor.texto2 + 30,
          borderRadius: 10,
          boxShadow: Cor.sombra,
        }}
      >
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: 12, color: Cor.texto2 }}>Origem</p>
            <p
              style={{
                width: 125,
                fontSize: 14,
                fontWeight: "bold",
                color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              Fábrica
            </p>
          </div>
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: natureza === "fixo" ? Cor.fixo : Cor.extra,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                color: Cor.base,
                fontSize: 18,
              }}
            >
              map
            </p>
          </div>
        </div>
        <p
          style={{
            fontFamily: "Icone",
            fontWeight: "bold",
            color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            fontSize: 24,
          }}
        >
          close
        </p>
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: natureza === "fixo" ? Cor.fixo : Cor.extra,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                color: Cor.base,
                fontSize: 20,
              }}
            >
              distance
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: Cor.texto2,
                textAlign: "right",
              }}
            >
              Destino
            </p>
            <p
              style={{
                width: 125,
                fontSize: 14,
                fontWeight: "bold",
                color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                textAlign: "right",
              }}
            >
              Cidade
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            backgroundColor: natureza === "fixo" ? Cor.fixo : Cor.extra,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: Cor.base,
              fontSize: 24,
            }}
          >
            timer
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Programação</p>
          <p
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            {new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function Solicitante({ natureza }: { natureza: string }) {
  const Cor = useTema().Cor;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        backgroundColor: Cor.texto2 + 20,
        padding: "5px 10px",
        borderLeft: `12px solid ${natureza === "fixo" ? Cor.fixo : Cor.extra}`,
        borderTop: `1px solid ${Cor.texto2 + 20}`,
        borderRight: `1px solid ${Cor.texto2 + 20}`,
        borderBottom: `1px solid ${Cor.texto2 + 20}`,
        width: 300,
        borderRadius: 18,
      }}
    >
      <p
        style={{
          fontFamily: "Icone",
          fontWeight: "bold",
          color: natureza === "fixo" ? Cor.fixo : Cor.extra,
          fontSize: 28,
        }}
      >
        person
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Solicitante</p>
        <p
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
          }}
        >
          Manoel Gomes
        </p>
      </div>
    </div>
  );
}

function CodigoRoteiro({ natureza }: { natureza: string }) {
  const Cor = useTema().Cor;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        backgroundColor: Cor.texto2 + 20,
        padding: "5px 10px",
        borderLeft: `12px solid ${natureza === "fixo" ? Cor.fixo : Cor.extra}`,
        borderTop: `1px solid ${Cor.texto2 + 20}`,
        borderRight: `1px solid ${Cor.texto2 + 20}`,
        borderBottom: `1px solid ${Cor.texto2 + 20}`,
        width: 300,
        borderRadius: 18,
      }}
    >
      <p
        style={{
          fontFamily: "Icone",
          fontWeight: "bold",
          color: natureza === "fixo" ? Cor.fixo : Cor.extra,
          fontSize: 28,
        }}
      >
        person
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Código do Roteiro</p>
        <p
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
          }}
        >
          ADM 02
        </p>
      </div>
    </div>
  );
}

function DetalhesDaViagem2({ natureza }: { natureza: string }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        height: 50,
        borderRadius: 18,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.fixo : Cor.extra,
              fontSize: 24,
            }}
          >
            request_quote
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Valor Cobrança</p>
          <p
            style={{
              fontSize: 20,
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            R$ <strong>91,58</strong>
          </p>
        </div>
      </div>
      <div
        style={{
          width: 1,
          height: "80%",
          backgroundColor: Cor.texto2 + 70,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.fixo : Cor.extra,
              fontSize: 24,
            }}
          >
            mintmark
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Valor Repasse</p>
          <p
            style={{
              fontSize: 20,
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            R$ <strong>71,58</strong>
          </p>
        </div>
      </div>
      <div
        style={{
          width: 1,
          height: "80%",
          backgroundColor: Cor.texto2 + 70,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.fixo : Cor.extra,
              fontSize: 24,
            }}
          >
            request_quote
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Desloc. Cobrança</p>
          <p
            style={{
              fontSize: 20,
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            R$ <strong>15,00</strong>
          </p>
        </div>
      </div>
      <div
        style={{
          width: 1,
          height: "80%",
          backgroundColor: Cor.texto2 + 70,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              color: natureza === "fixo" ? Cor.fixo : Cor.extra,
              fontSize: 24,
            }}
          >
            mintmark
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 12, color: Cor.texto2 }}>Desloc. Repasse</p>
          <p
            style={{
              fontSize: 20,
              color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
            }}
          >
            R$ <strong>11,00</strong>
          </p>
        </div>
      </div>
      <div
        style={{
          width: 1,
          height: "80%",
          backgroundColor: Cor.texto2 + 70,
        }}
      />
      {natureza === "fixo" ? (
        <CodigoRoteiro natureza={natureza} />
      ) : (
        <Solicitante natureza={natureza} />
      )}
    </div>
  );
}

function DetalhesDoMotorista() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.texto2 + 20,
        height: 70,
        borderRadius: 18,
        alignItems: "center",
        display: "flex",
        padding: 10,
      }}
    >
      <p style={{ fontSize: 12, color: Cor.texto1 }}>Detalhes</p>
    </div>
  );
}

function ListaPassageirosVoucher() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "80%",
        backgroundColor: Cor.texto2 + 20,
        height: 180,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        gap: 5,
        padding: 10,
        border: `1px solid ${Cor.texto2 + 20}`,
        scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
      }}
    >
      <CardPassageiroVoucher />
      <CardPassageiroVoucher />
      <CardPassageiroVoucher />
      <CardPassageiroVoucher />
    </div>
  );
}

function Assinatura() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "20%",
        backgroundColor: Cor.texto2 + 20,
        height: 180,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        padding: 10,
        border: `1px solid ${Cor.texto2 + 20}`,
        scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
      }}
    >
      <p style={{ fontSize: 12, color: Cor.texto1 }}>Assinatura:</p>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 10,
          backgroundColor: Cor.texto2 + 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Cor.secundaria,
            maskImage: `url(data:image/png;base64,${assinaturaBase64})`,
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url(data:image/png;base64,${assinaturaBase64})`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
        ></div>
      </div>
    </div>
  );
}

const assinaturaBase64 = `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B6uNcfCMCQEEEEAAAQQQQACBoQrwqwpDXXL0G4HhCTwhsMs3BeYjGwIIIIAAAggggAACCLQgwIGDFpBpAgEEggV+EpyTjAgggAACCCCAAAIIIIAAAgggMCqBkEsVnIeEAAIIIIAAAggggAACCCCAAAITFfiDxp11nwPPIyGAAAIIIIAAAggggAACCCCAwIQF1tbY0w4eeJrnkRBAAAEEEEAAAQQQQKBnAg/oWX/oDgIITEPAlyREN0s8Q8//bxrDZpQIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAwP9vh44FAAAAAAb5W09jRyFkwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwGocsdAAABOGSURBVIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMbAYCZmwr7cbuZeoAAAAASUVORK5CYII=`;

function ResultadoVoucher({ natureza }: { natureza: string }) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: 14, color: Cor.texto1 }}>Valor Total:</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Total Cobrança</p>
        <p
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
          }}
        >
          R$<strong>106,58</strong>
        </p>
      </div>
      <div
        style={{
          width: 1,
          height: "80%",
          backgroundColor: Cor.texto2 + 70,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p style={{ fontSize: 12, color: Cor.texto2 }}>Total Repasse</p>
        <p
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: natureza === "fixo" ? Cor.textoFixo : Cor.textoExtra,
          }}
        >
          R$ <strong>82,58</strong>
        </p>
      </div>
    </div>
  );
}
