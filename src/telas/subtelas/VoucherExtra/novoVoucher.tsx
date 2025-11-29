import { jwtDecode } from "jwt-decode";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";

function NovoVoucher() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <NovoVoucherConteudo />
      </>
    ),
  });
}

export default NovoVoucher;

function NovoVoucherConteudo() {
  //   const [empresaCliente, setEmpresaCliente] = useState<any>();
  //   const [unidadeEmpresaCliente, setUnidadeEmpresaCliente] = useState<any>();
  //   const [solicitante, setSolicitante] = useState<any>();

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
        gap: 10,
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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Passageiros</h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <DadosGerais />
      <DetalhesDoVoucher />
      <IncluirPassageiros />
    </div>
  );
}

interface JwtPayload {
  adminUsuarioId?: string;
  operadoraId?: string;
}

function DadosGerais() {
  const Cor = useTema().Cor;

  const token = localStorage.getItem("token");

  function getOperadoraId() {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.operadoraId;
    } else {
      console.log("Nenhum token encontrado");
    }
  }

  const operId = getOperadoraId();

  const { listaClientes } = useListaClientes(operId || "0");

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.primariaTxt,
            fontWeight: "bold",
          }}
        >
          Criar Novo Voucher Extra
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Preencha a baixo os dados Gerais para criar um novo voucher extra.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Cliente:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value=""
                    key={cliente?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Unidade:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value=""
                    key={cliente?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Solicitante:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value=""
                    key={cliente?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetalhesDoVoucher() {
  const Cor = useTema().Cor;

  const token = localStorage.getItem("token");

  function getOperadoraId() {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.operadoraId;
    } else {
      console.log("Nenhum token encontrado");
    }
  }

  const operId = getOperadoraId();

  const { listaClientes } = useListaClientes(operId || "0");
  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Detalhes da viagem: informe rota, motorista, data e hora, tipo de
            rota e tipo de veículo.
          </p>
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Rota:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value=""
                    key={cliente?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Motorista:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value=""
                    key={cliente?.id}
                    style={{
                      backgroundColor: Cor.base2,
                    }}
                  >
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>
            Data e Hora Programação:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="datetime-local"
              style={{
                backgroundColor: "transparent",
                color: Cor.texto1,
                width: "100%",
                outline: "none",
                border: "none",
                zIndex: 8,
              }}
            />
            <div
              style={{
                width: 25,
                height: 25,
                backgroundColor: "#F4F4F4",
                borderRadius: 22,
                position: "absolute",
                right: 6,
                alignSelf: "center",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Tipo da Rota:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Defina tipo de Rota
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Entrada
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Saída
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Entrada e Saída
              </option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Tipo do Carro:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              name=""
              id=""
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Defina tipo de Carro
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Compacto
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Minivan
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Van
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Van Alongada
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Micro Ônibus
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Ônibus
              </option>
              <option value="" style={{ backgroundColor: Cor.base2 }}>
                Material
              </option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "15%" }}>
          <p style={{ color: Cor.texto2, margin: 5 }}>Deslocamento/Via:</p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <input
              type="number"
              style={{
                outline: "none",
                border: "none",
                color: Cor.texto1,
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>
        <div style={{ width: "30%" }}></div>
      </div>
    </div>
  );
}

function IncluirPassageiros() {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.primariaTxt,
            fontWeight: "bold",
          }}
        >
          Passageiros:
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Adicione abaixo os Passageiros ao voucher.
        </p>
      </div>
    </div>
  );
}
