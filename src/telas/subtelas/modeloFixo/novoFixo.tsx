import { useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useTema } from "../../../hooks/temaContext";
import { useListaClientes } from "../../../hooks/useEmpresaCliente";
import { useUnidadeCliente } from "../../../hooks/useUnidadesClientes";
import { usePedagios } from "../../../hooks/usePedagios";
import { useMotorista } from "../../../hooks/useMotorista";
import styled from "styled-components";
import { usePassageiros } from "../../../hooks/usePassageiros";
import BtnCriarPassageiro from "../empresaCliente/btnComponentes/criarPassageiro";

export function NovoFixo() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <NovoVoucherFixoConteudo />
      </>
    ),
  });
}

function NovoVoucherFixoConteudo() {
  const [empresaCliente, setEmpresaCliente] = useState("");
  const [unidadeCliente, setUnidadeCliente] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const { Cor } = useTema();

  const [passageirosVoucher, setPassageirosVoucher] = useState<any[]>([]);
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
        <h3 style={{ color: Cor.textoFixo, fontSize: "20px" }}>
          Novo Roteiro Fixo
        </h3>
        <div
          style={{
            width: "75%",
            height: 1,
            backgroundColor: Cor.primaria,
          }}
        />
      </div>
      <DadosGerais
        empresaCliente={empresaCliente}
        setEmpresaCliente={setEmpresaCliente}
        unidadeCliente={unidadeCliente}
        setUnidadeCliente={setUnidadeCliente}
        nomeModelo={nomeModelo}
        setNomeModelo={setNomeModelo}
        origem={origem}
        setOrigem={setOrigem}
        destino={destino}
        setDestino={setDestino}
      />
      <ValoresFixo />
      <DetalhesEntrada />
      <DetalhesSaida />
      <IncluirPassageiros
        empresaCliente={empresaCliente}
        setPassageirosVoucher={setPassageirosVoucher}
        passageirosVoucher={passageirosVoucher}
      />
      <BtnSalvar $cor={Cor.fixo} $texto={Cor.textoFixo}>
        <p>Salvar</p>
        <p style={{ fontFamily: "Icone", fontSize: 24 }}>save</p>
      </BtnSalvar>
    </div>
  );
}

interface BtnSalvarProps {
  $cor: string;
  $texto: string;
}

const BtnSalvar = styled.div<BtnSalvarProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  background-color: ${({ $cor }) => $cor}70;
  padding: 10px 50px;
  border: 1px solid ${({ $cor }) => $cor}CC;
  color: ${({ $texto }) => $texto};
  border-radius: 18px;
  font-weight: bolder;
  cursor: pointer;
  transition: ease-in-out all 0.2s;
  user-select: none;

  &:hover {
    scale: 1.03;
    background-color: ${({ $cor }) => $cor}BB;
    border: 1px solid ${({ $cor }) => $cor}EE;
  }

  &:active {
    scale: 0.97;
    background-color: ${({ $cor }) => $cor};
    border: 1px solid ${({ $cor }) => $cor}EE;
  }
`;

function DadosGerais({
  origem,
  setOrigem,
  destino,
  setDestino,
  empresaCliente,
  setEmpresaCliente,
  unidadeCliente,
  setUnidadeCliente,
  nomeModelo,
  setNomeModelo,
}: {
  origem: string;
  setOrigem: any;
  destino: string;
  setDestino: any;
  empresaCliente: string;
  setEmpresaCliente: any;
  unidadeCliente: string;
  setUnidadeCliente: any;
  nomeModelo: string;
  setNomeModelo: any;
}) {
  const { Cor } = useTema();

  const operId = useAdminLogado()?.operadora.id;

  const { listaClientes: listaClientesTotal } = useListaClientes(operId || "0");

  const listaClientes = listaClientesTotal?.filter(
    (c: any) => c.statusCliente === true,
  );

  const { listaUnidades: listaUnidadesTotal, loading } = useUnidadeCliente(
    empresaCliente || "0",
  );

  const listaUnidades = listaUnidadesTotal?.filter(
    (u: any) => u.statusUnidadeCliente === true,
  );

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        marginTop: 10,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: loading ? 0.5 : 1,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo,
              fontWeight: "bold",
            }}
          >
            Criar Novo Roteiro Fixo
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Preencha a baixo os dados Gerais para criar um novo roteiro fixo.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "60%",
            justifyContent: "flex-end",
            gap: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "50%",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.textoFixo + 90,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Origem:
            </p>
            <div
              style={{
                width: "100%",
                border: `1px solid ${Cor.texto2 + 50}`,
                padding: 10,
                borderRadius: 14,
              }}
            >
              <input
                type="text"
                placeholder="Origem"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: Cor.texto1,
                }}
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
              />
            </div>
          </div>
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 35,
              color: Cor.fixo,
              userSelect: "none",
            }}
          >
            start
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "50%",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.textoFixo + 90,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Destino:
            </p>
            <div
              style={{
                width: "100%",
                border: `1px solid ${Cor.texto2 + 50}`,
                padding: 10,
                borderRadius: 14,
              }}
            >
              <input
                type="text"
                placeholder="Destino"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: Cor.texto1,
                }}
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
            </div>
          </div>
        </div>
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
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Cliente:
          </p>
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
              onChange={(e) => setEmpresaCliente(e.target.value)}
              value={empresaCliente}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione uma Empresa
              </option>
              {listaClientes?.map((cliente: any) => {
                return (
                  <option
                    value={cliente.id}
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
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Unidade:
          </p>
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
              onChange={(e) => setUnidadeCliente(e.target.value)}
              value={unidadeCliente}
              disabled={loading}
            >
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione uma Unidade
              </option>
              {listaUnidades?.map((Unidade: any) => {
                return (
                  <option
                    value={Unidade?.id}
                    key={Unidade?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {Unidade?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "32%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Código do Roteiro:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <input
              type="text"
              placeholder="Código do Roteiro"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
              value={nomeModelo}
              onChange={(e) => setNomeModelo(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ValoresFixo() {
  const { Cor } = useTema();

  const operadoraId = useAdminLogado()?.operadora.id;

  const { listaPedagios } = usePedagios(String(operadoraId));
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
            color: Cor.textoFixo,
            fontWeight: "bold",
          }}
        >
          Valores
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          Informe abaixo os valores que serão cobrados da empresa e repassados
          aos motoristas.
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
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor da Viagem:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    backgroundColor: "transparent",
                    color: Cor.texto1,
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoFixo }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor Adicional:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "transparent",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoFixo }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "28%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Valor Hora Parada:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Cobrança</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
            <div
              style={{ width: 1, height: 30, backgroundColor: Cor.textoFixo }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 11, color: Cor.texto2 }}>Repasse</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: Cor.texto1 }}>R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: 5,
                    color: Cor.texto1,
                    fontSize: 14,
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Pedágio:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <select
              style={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            >
              {listaPedagios.map((p: any) => {
                return (
                  <option
                    style={{ backgroundColor: Cor.base }}
                    value={p.id}
                    key={p.id}
                  >
                    {p.nome}
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

function DetalhesEntrada() {
  const { Cor } = useTema();
  const operadora = useAdminLogado()?.operadora.id;
  const { listaMotoristas } = useMotorista(operadora);

  const [dom, setDom] = useState<boolean>(false);
  const [seg, setSeg] = useState<boolean>(false);
  const [ter, setTer] = useState<boolean>(false);
  const [qua, setQua] = useState<boolean>(false);
  const [qui, setQui] = useState<boolean>(false);
  const [sex, setSex] = useState<boolean>(false);
  const [sab, setSab] = useState<boolean>(false);

  const [habilitado, setHabilitado] = useState<boolean>(false);

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: !habilitado ? 0.5 : 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.textoFixo,
            fontWeight: "bold",
          }}
        >
          Configurações Entrada
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          <strong>Habilite</strong> e selecione o motorista, horários e dias da
          semana o motorista deve chegar no destino.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Ativo:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
            }}
          >
            <BtnAtivarStyled
              $cor={habilitado ? Cor.textoFixo : Cor.texto1}
              $bg={habilitado ? Cor.fixo : Cor.texto2}
              onClick={() => setHabilitado(!habilitado)}
              style={{ width: 100, justifyContent: "space-between" }}
            >
              <p>{habilitado ? "Habilitado" : "Habilitar"}</p>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {habilitado ? "check_box" : "check_box_outline_blank"}
              </p>
            </BtnAtivarStyled>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Motorista:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              opacity: !habilitado ? 0.5 : 1,
            }}
          >
            <select
              disabled={!habilitado}
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
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione um Motorista
              </option>
              {listaMotoristas?.map((m: any) => {
                return (
                  <option
                    value={m.id}
                    key={m?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {m?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Horário:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              opacity: !habilitado ? 0.5 : 1,
            }}
          >
            <input
              disabled={!habilitado}
              type="time"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Dias da Semana:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
              opacity: !habilitado ? 0.3 : 1,
              pointerEvents: !habilitado ? "none" : "auto",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <BtnAtivarStyled
                $cor={dom ? Cor.textoFixo : Cor.texto1}
                $bg={dom ? Cor.fixo : Cor.texto2}
                onClick={() => setDom(!dom)}
              >
                <p>Dom</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {dom ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={seg ? Cor.textoFixo : Cor.texto1}
                $bg={seg ? Cor.fixo : Cor.texto2}
                onClick={() => setSeg(!seg)}
              >
                <p>Seg</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {seg ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={ter ? Cor.textoFixo : Cor.texto1}
                $bg={ter ? Cor.fixo : Cor.texto2}
                onClick={() => setTer(!ter)}
              >
                <p>Ter</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {ter ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={qua ? Cor.textoFixo : Cor.texto1}
                $bg={qua ? Cor.fixo : Cor.texto2}
                onClick={() => setQua(!qua)}
              >
                <p>Qua</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {qua ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={qui ? Cor.textoFixo : Cor.texto1}
                $bg={qui ? Cor.fixo : Cor.texto2}
                onClick={() => setQui(!qui)}
              >
                <p>Qui</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {qui ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={sex ? Cor.textoFixo : Cor.texto1}
                $bg={sex ? Cor.fixo : Cor.texto2}
                onClick={() => setSex(!sex)}
              >
                <p>Sex</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {sex ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={sab ? Cor.textoFixo : Cor.texto1}
                $bg={sab ? Cor.fixo : Cor.texto2}
                onClick={() => setSab(!sab)}
              >
                <p>Sab</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {sab ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetalhesSaida() {
  const { Cor } = useTema();
  const operadora = useAdminLogado()?.operadora.id;
  const { listaMotoristas } = useMotorista(operadora);

  const [dom, setDom] = useState(false);
  const [seg, setSeg] = useState(false);
  const [ter, setTer] = useState(false);
  const [qua, setQua] = useState(false);
  const [qui, setQui] = useState(false);
  const [sex, setSex] = useState(false);
  const [sab, setSab] = useState(false);

  const [habilitado, setHabilitado] = useState<boolean>(false);

  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        opacity: !habilitado ? 0.5 : 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            fontSize: 14,
            color: Cor.textoFixo,
            fontWeight: "bold",
          }}
        >
          Configurações Saída
        </p>
        <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
          <strong>Habilite</strong> e selecione o motorista, horários e dias da
          semana o motorista deve sair do destino.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Ativo:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
            }}
          >
            <BtnAtivarStyled
              $cor={habilitado ? Cor.textoFixo : Cor.texto1}
              $bg={habilitado ? Cor.fixo : Cor.texto2}
              onClick={() => setHabilitado(!habilitado)}
              style={{ width: 100, justifyContent: "space-between" }}
            >
              <p>{habilitado ? "Habilitado" : "Habilitar"}</p>
              <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                {habilitado ? "check_box" : "check_box_outline_blank"}
              </p>
            </BtnAtivarStyled>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Motorista:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              opacity: !habilitado ? 0.5 : 1,
            }}
          >
            <select
              disabled={!habilitado}
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
              <option
                value={""}
                style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
              >
                Selecione um Motorista
              </option>
              {listaMotoristas?.map((m: any) => {
                return (
                  <option
                    value={m.id}
                    key={m?.id}
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 15,
                      margin: 10,
                    }}
                  >
                    {m?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Horário:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <input
              disabled={!habilitado}
              type="time"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                backgroundColor: "transparent",
                color: Cor.texto1,
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: 14,
              color: !habilitado ? Cor.texto1 + 50 : Cor.textoFixo + 90,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Dias da Semana:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 5,
              borderRadius: 14,
              pointerEvents: !habilitado ? "none" : "auto",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <BtnAtivarStyled
                $cor={dom ? Cor.textoFixo : Cor.texto1}
                $bg={dom ? Cor.fixo : Cor.texto2}
                onClick={() => setDom(!dom)}
              >
                <p>Dom</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {dom ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={seg ? Cor.textoFixo : Cor.texto1}
                $bg={seg ? Cor.fixo : Cor.texto2}
                onClick={() => setSeg(!seg)}
              >
                <p>Seg</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {seg ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={ter ? Cor.textoFixo : Cor.texto1}
                $bg={ter ? Cor.fixo : Cor.texto2}
                onClick={() => setTer(!ter)}
              >
                <p>Ter</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {ter ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={qua ? Cor.textoFixo : Cor.texto1}
                $bg={qua ? Cor.fixo : Cor.texto2}
                onClick={() => setQua(!qua)}
              >
                <p>Qua</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {qua ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={qui ? Cor.textoFixo : Cor.texto1}
                $bg={qui ? Cor.fixo : Cor.texto2}
                onClick={() => setQui(!qui)}
              >
                <p>Qui</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {qui ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={sex ? Cor.textoFixo : Cor.texto1}
                $bg={sex ? Cor.fixo : Cor.texto2}
                onClick={() => setSex(!sex)}
              >
                <p>Sex</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {sex ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
              <BtnAtivarStyled
                $cor={sab ? Cor.textoFixo : Cor.texto1}
                $bg={sab ? Cor.fixo : Cor.texto2}
                onClick={() => setSab(!sab)}
              >
                <p>Sab</p>
                <p style={{ fontFamily: "Icone", fontSize: 16 }}>
                  {sab ? "check_box" : "check_box_outline_blank"}
                </p>
              </BtnAtivarStyled>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BtnAtivarProps {
  $cor: string;
  $bg: string;
}

const BtnAtivarStyled = styled.div<BtnAtivarProps>`
  font-size: 14px;
  color: ${({ $cor }) => $cor};
  padding: 5px 10px;
  border-radius: 8px;
  background-color: ${({ $bg }) => $bg}50;
  cursor: pointer;
  transition: ease-in-out all 0.1s;
  user-select: none;
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  font-weight: 500;

  &:hover {
    scale: 1.04;
    background-color: ${({ $bg }) => $bg}AA;
  }

  &:active {
    scale: 0.98;
    background-color: ${({ $bg }) => $bg}FF;
  }
`;

function IncluirPassageiros({
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
}: {
  empresaCliente: any;
  passageirosVoucher: any;
  setPassageirosVoucher: any;
}) {
  const Cor = useTema().Cor;

  const desabilitado = !passageirosVoucher || passageirosVoucher.length === 0;
  return (
    <div
      style={{
        width: "100%",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        gap: 15,
        justifyContent: "space-between",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p
            style={{
              fontSize: 14,
              color: Cor.textoFixo,
              fontWeight: "bold",
            }}
          >
            Passageiros:
          </p>
          <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
            Adicione abaixo os Passageiros ao voucher.
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
          <p style={{ color: Cor.texto2, fontSize: 12 }}>
            Total de Passageiros adicionados{" "}
            <strong style={{ fontSize: 14, color: Cor.textoFixo }}>
              {passageirosVoucher.length}
            </strong>
          </p>
          <SeletorPassageiro
            empresaCliente={empresaCliente}
            passageirosVoucher={passageirosVoucher}
            setPassageirosVoucher={setPassageirosVoucher}
          />
          <button
            disabled={desabilitado}
            style={{
              aspectRatio: 1,
              width: 35,
              backgroundColor: desabilitado
                ? Cor.texto2 + 50
                : Cor.atencao + 50,
              display: "flex",
              border: "none",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              cursor: desabilitado ? "default" : "pointer",
            }}
            onClick={() => setPassageirosVoucher([])}
          >
            <p
              style={{
                fontFamily: "Icone",
                fontWeight: "bold",
                color: desabilitado ? Cor.texto2 : Cor.atencao,
              }}
            >
              delete
            </p>
          </button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 250,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          backgroundColor: Cor.base,
          borderRadius: 22,
          boxShadow: Cor.sombra,
          gap: 5,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {passageirosVoucher.map((passageiro: any) => {
          const selecionado = passageirosVoucher.some(
            (p: any) => p.id === passageiro.id,
          );
          return (
            <LinhaPassageiro
              passageiro={passageiro}
              selecionado={false}
              btnAdd={selecionado}
              setPassageirosVoucher={setPassageirosVoucher}
              key={passageiro.id}
            />
          );
        })}
      </div>
    </div>
  );
}

function SeletorPassageiro({
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
}: {
  empresaCliente: any;
  passageirosVoucher: any;
  setPassageirosVoucher: any;
}) {
  const { listaPassageiro } = usePassageiros(empresaCliente ?? "");

  const desabilitado = !listaPassageiro || listaPassageiro.length === 0;

  const [cxPesquisa, setCxPesquisa] = useState<boolean>(false);

  const { Cor } = useTema();

  return (
    <>
      <button
        disabled={desabilitado}
        style={{
          height: 35,
          backgroundColor: desabilitado ? Cor.texto2 + 50 : Cor.fixo + 50,
          color: desabilitado ? Cor.texto2 : Cor.textoFixo,
          border: "none",
          padding: "8px 25px",
          borderRadius: 12,
          cursor: desabilitado ? "default" : "pointer",
          fontWeight: 700,
        }}
        onClick={() => {
          setCxPesquisa(true);
        }}
      >
        Pesquisar
      </button>
      <ModalSeletorPassageiro
        empresaCliente={empresaCliente}
        passageirosVoucher={passageirosVoucher}
        setPassageirosVoucher={setPassageirosVoucher}
        setCxPesquisa={setCxPesquisa}
        cxPesquisa={cxPesquisa}
      />
    </>
  );
}

function ModalSeletorPassageiro({
  empresaCliente,
  passageirosVoucher,
  setPassageirosVoucher,
  cxPesquisa,
  setCxPesquisa,
}: {
  empresaCliente: any;
  passageirosVoucher: any;
  setPassageirosVoucher: any;
  cxPesquisa: any;
  setCxPesquisa: any;
}) {
  const [nomeBusca, setNomeBusca] = useState<string>("");
  const [bairroBusca, setBairroBusca] = useState<string>("");

  const { listaPassageiro: listaTotal } = usePassageiros(empresaCliente || "0");

  const listaPassageiro = listaTotal?.filter((p: any) => p.ativo === true);

  const Cor = useTema().Cor;

  function normalizarTexto(texto: string) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: cxPesquisa ? 1 : 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: Cor.base2 + 50,
          backdropFilter: "blur(2px)",
          pointerEvents: cxPesquisa ? "auto" : "none",
          transition: "all ease-in-out 0.3s",
          zIndex: 10,
        }}
        onClick={() => {
          setCxPesquisa(false);
          setBairroBusca("");
          setNomeBusca("");
        }}
      >
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            border: `1px solid ${Cor.texto2 + 50}`,
            backgroundColor: Cor.base,
            boxShadow: Cor.sombra,
            borderRadius: 22,
            padding: 15,
            scale: cxPesquisa ? 1 : 0.6,
            transition: "all ease-in-out 0.3s",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextoEntrada
              placeholder="Digite aqui o nome do Passageiro"
              type="text"
              largura="50%"
              onChange={(e) => {
                setNomeBusca(e.target.value);
              }}
              value={nomeBusca}
            />
            <TextoEntrada
              placeholder="Digite aqui o nome do Bairro"
              type="text"
              largura="50%"
              onChange={(e) => {
                setBairroBusca(e.target.value);
              }}
              value={bairroBusca}
            />
            <BtnCriarPassageiro clienteId={String(empresaCliente)} />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: 400,
              padding: 10,
              backgroundColor: Cor.base2,
              boxShadow: Cor.sombra,
              borderRadius: 12,
              overflowY: "auto",
              scrollbarColor: `${Cor.secundaria} ${Cor.base + "00"}`,
              gap: 5,
            }}
          >
            {(
              listaPassageiro?.filter((p) => {
                const nome = normalizarTexto(p.nome);
                const bairro = normalizarTexto(p.endBairro);

                const buscaNome = normalizarTexto(nomeBusca);
                const buscaBairro = normalizarTexto(bairroBusca);

                const porNome = nome.includes(buscaNome);
                const porBairro = bairro.includes(buscaBairro);

                return porNome && porBairro;
              }) || []
            ).map((passageiro) => {
              const selecionado = passageirosVoucher.some(
                (p: any) => p.id === passageiro.id,
              );
              return (
                <LinhaPassageiro
                  key={passageiro.id}
                  passageiro={passageiro}
                  selecionado={selecionado}
                  btnAdd={selecionado}
                  setPassageirosVoucher={setPassageirosVoucher}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function LinhaPassageiro({
  passageiro,
  selecionado,
  setPassageirosVoucher,
  btnAdd,
}: {
  passageiro: any;
  selecionado: boolean;
  setPassageirosVoucher: any;
  btnAdd: any;
}) {
  const Cor = useTema().Cor;

  const adicionarPassageiro = (passageiro: any) => {
    setPassageirosVoucher((prev: any) => {
      const existe = prev.some((p: any) => p.id === passageiro.id);

      if (existe) {
        return prev.filter((p: any) => p.id !== passageiro.id);
      }

      return [...prev, passageiro];
    });
  };

  return (
    <>
      <div
        key={passageiro.id}
        style={{
          width: "100%",
          height: 40,
          border: `1px solid ${Cor.texto2 + 30}`,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          borderRadius: 8,
          backgroundColor: selecionado ? Cor.primaria + 50 : Cor.base2,
          boxShadow: btnAdd ? Cor.sombra : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
            marginRight: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Nome
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.nome}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
            marginRight: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Endereço
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.endRua}, {passageiro.endBairro}, {passageiro.endCidade}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
            marginRight: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Centro de Custo
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.centroCustoClienteId.nome}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "8%",
            borderRight: `1px solid ${Cor.texto2 + 50}`,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto2,
            }}
          >
            Horário
          </p>
          <p
            style={{
              fontSize: 14,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: Cor.texto1,
            }}
          >
            {passageiro.horarioEmbarque}
          </p>
        </div>
        <div
          style={{
            width: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
            borderRadius: 8,
            backgroundColor: btnAdd ? Cor.primaria + 90 : Cor.primaria + 50,
            cursor: "pointer",
          }}
          onClick={() => adicionarPassageiro(passageiro)}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontWeight: "bold",
              fontSize: 20,
              color: Cor.primariaTxt,
            }}
          >
            {btnAdd ? "close" : "add"}
          </p>
        </div>
      </div>
    </>
  );
}

function TextoEntrada({
  placeholder,
  onChange,
  value,
  type,
  largura,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
  largura: string;
}) {
  const Cor = useTema().Cor;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: largura,
        height: 40,
        backgroundColor: Cor.texto2 + 20,
        padding: 10,
        borderRadius: 22,
      }}
    >
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        style={{
          backgroundColor: "transparent",
          color: Cor.texto1,
          border: "none",
          outline: "none",
          width: "100%",
        }}
      />
      <p style={{ fontFamily: "icone", fontWeight: "bold", fontSize: 18 }}>
        search
      </p>
    </div>
  );
}
