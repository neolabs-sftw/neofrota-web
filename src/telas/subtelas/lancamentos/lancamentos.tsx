import { useMemo, useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { useTema } from "../../../hooks/temaContext";
import { useMotorista, useMotoristaId } from "../../../hooks/useMotorista";
import {
  useCreateLancamentoMotorista,
  useLancamentosOperadora,
} from "../../../hooks/useLancamentos";
import styled from "styled-components";
import { useFaturamentoMes } from "../../../hooks/useFaturamentoMotorista";

export function Lancamentos() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <LancamentosConteudo />
      </>
    ),
  });
}

function LancamentosConteudo() {
  const { Cor } = useTema();

  const [motoristaSelecionado, setMotoristaSelecionado] = useState<any>("");

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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>Lançamentos</h3>
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
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <AplicarLançamento
          motoristaSelecionado={motoristaSelecionado}
          setMotoristaSelecionado={setMotoristaSelecionado}
        />
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DetalhesMotorista motoristaSelecionado={motoristaSelecionado} />
        </div>
      </div>
      <TabelaLancamentos />
    </div>
  );
}

function AplicarLançamento({
  motoristaSelecionado,
  setMotoristaSelecionado,
}: {
  motoristaSelecionado: any;
  setMotoristaSelecionado: any;
}) {
  const operId = useAdminLogado()?.operadora.id;

  const { listaMotoristas } = useMotorista(operId);
  const { Cor } = useTema();

  return (
    <div
      style={{
        width: "75%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 5,
        }}
      >
        <p
          style={{
            color: Cor.texto1,
            fontSize: 14,
            fontWeight: 500,
            marginLeft: 10,
          }}
        >
          Selecione o Motorista
        </p>
        <div
          style={{
            width: "100%",
            border: `1px solid ${
              motoristaSelecionado !== "" ? Cor.primaria + 30 : Cor.texto2 + 10
            }`,
            padding: 10,
            borderRadius: 14,
            backgroundColor: Cor.base2,
            boxShadow: Cor.sombra,
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
            onChange={(e) => {
              setMotoristaSelecionado(e.target.value);
            }}
            value={motoristaSelecionado}
          >
            <option
              value={""}
              style={{ backgroundColor: Cor.base2, color: Cor.texto2 + 70 }}
            >
              Buscar motorista por nome
            </option>
            {listaMotoristas?.map((m: any) => {
              return (
                <option
                  value={m?.id}
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <CxAplicarLancamento
          tipo={"Crédito"}
          motoristaId={motoristaSelecionado}
        />
        <CxAplicarLancamento
          tipo={"Desconto"}
          motoristaId={motoristaSelecionado}
        />
      </div>
    </div>
  );
}

function CxAplicarLancamento({
  tipo,
  motoristaId,
}: {
  tipo: string;
  motoristaId: string;
}) {
  const { Cor } = useTema();

  const userId = useAdminLogado()?.id;
  const operadoraId = useAdminLogado()?.operadora.id;
  const [valor, setValor] = useState<string>("");
  const [diaDesconto, setDiaDesconto] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const { criarLancamento, loading } = useCreateLancamentoMotorista();

  const formatarParaYMD = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const hoje = new Date();
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const { refetch } = useLancamentosOperadora({
    operadoraId: useAdminLogado()?.operadora.id,
    motoristaId: motoristaId,
    dataInicial: formatarParaYMD(primeiroDia),
    dataFinal: formatarParaYMD(ultimoDia),
  });

  async function criarLancamentoFunc() {
    if (!motoristaId?.trim()) {
      alert("Motorista é obrigatório");
      return;
    }

    if (!valor?.trim()) {
      alert("Valor é obrigatório");
      return;
    }

    if (!diaDesconto?.trim()) {
      alert("Data é obrigatória");
      return;
    }

    if (!descricao?.trim()) {
      alert("Descrição é obrigatória");
      return;
    }

    const dataHora = new Date(diaDesconto);

    if (isNaN(dataHora.getTime())) {
      alert("Data inválida");
      return;
    }

    const lancamentoData = {
      tipo: tipo === "Crédito" ? "Credito" : "Desconto",
      operadoraId: operadoraId ?? "",
      adminUsuarioId: userId ?? "",
      motoristaId,
      valor: Number(valor) || 0,
      dataHora: diaDesconto,
      descricao: descricao,
    };

    try {
      await criarLancamento(lancamentoData);
      // sucesso
      setValor("");
      setDiaDesconto("");
      setDescricao("");
      refetch();
      alert("Lançamento criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar lançamento:", error);
    }
  }
  return (
    <div
      style={{
        width: "50%",
        backgroundColor: Cor.base2,
        borderRadius: 14,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          color: tipo === "Crédito" ? Cor.ativo : Cor.atencao,
        }}
      >
        <strong
          style={{ fontFamily: "Icone", fontWeight: "bolder", fontSize: 24 }}
        >
          {tipo === "Crédito" ? "add_circle" : "do_not_disturb_on"}
        </strong>
        <p>Lançar {tipo}</p>
      </div>
      <div
        style={{ width: "100%", height: 1, backgroundColor: Cor.texto2 + 50 }}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: 5,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              marginLeft: 10,
              fontSize: 14,
              fontWeight: 500,
              color: Cor.texto1,
            }}
          >
            Valor:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              backgroundColor: Cor.base,
              display: "flex",
              flexDirection: "row",
              gap: 5,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: Cor.texto1,
              }}
            >
              R$
            </p>
            <input
              placeholder="0,00"
              type="Number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              style={{
                width: "100%",
                color: Cor.texto1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: 5,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              marginLeft: 10,
              fontSize: 14,
              fontWeight: 500,
              color: Cor.texto1,
            }}
          >
            Data:
          </p>
          <div
            style={{
              width: "100%",
              border: `1px solid ${Cor.texto2 + 50}`,
              padding: 10,
              borderRadius: 14,
              backgroundColor: Cor.base,
              display: "flex",
              flexDirection: "row",
              gap: 5,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <input
              type="date"
              value={diaDesconto}
              onChange={(e) => setDiaDesconto(e.target.value)}
              style={{
                width: "100%",
                color: Cor.texto1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 5,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <p
          style={{
            marginLeft: 10,
            fontSize: 14,
            fontWeight: 500,
            color: Cor.texto1,
          }}
        >
          Descrição:
        </p>
        <div
          style={{
            width: "100%",
            border: `1px solid ${Cor.texto2 + 50}`,
            padding: 10,
            borderRadius: 14,
            backgroundColor: Cor.base,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <textarea
            id="message"
            name="message"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            cols={50}
            placeholder="Digite aqui..."
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: Cor.texto1,
              width: "100%",
              resize: "none",
            }}
          />
        </div>
      </div>
      <BtnSalvarLancamento
        $cor={
          loading ? Cor.texto1 : tipo === "Crédito" ? Cor.ativo : Cor.atencao
        }
        onClick={() => criarLancamentoFunc()}
      >
        {loading ? "Carregando..." : "Lançar"}
      </BtnSalvarLancamento>
    </div>
  );
}

interface BtnSalvarLancamentoProps {
  $cor: string;
}

const BtnSalvarLancamento = styled.div<BtnSalvarLancamentoProps>`
  width: 35%;
  padding: 10px;
  border-radius: 14px;
  background-color: ${({ $cor }) => $cor + 50};
  border: 1px solid ${({ $cor }) => $cor + 90};
  font-size: 14px;
  font-weight: 400;
  color: ${({ $cor }) => $cor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  user-select: none;
  transition: ease-in-out all 0.1s;
  cursor: pointer;
  &:hover {
    scale: 1.04;
    background-color: ${({ $cor }) => $cor + 70};
  }
  &:active {
    scale: 1.02;
  }
`;

function DetalhesMotorista({
  motoristaSelecionado,
}: {
  motoristaSelecionado: any;
}) {
  const { Cor } = useTema();

  const { motorista } = useMotoristaId(motoristaSelecionado);

  const [mesSelecionado, setMesSelecionado] = useState<number>(
    new Date().getMonth() + 1,
  );
  const anoAtual = new Date().getFullYear();

  const { listaMeses } = useFaturamentoMes({
    motoristaId: motoristaSelecionado,
    ano: 2026,
  });

  const { primeiroDia, ultimoDia } = useMemo(() => {
    // O construtor do Date usa meses de 0 a 11, por isso "mesSelecionado - 1"
    const primeiro = new Date(anoAtual, mesSelecionado - 1, 1);
    const ultimo = new Date(anoAtual, mesSelecionado, 0);

    return { primeiroDia: primeiro, ultimoDia: ultimo };
  }, [mesSelecionado, anoAtual]);

  const formatarParaYMD = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const fatuMesAtual = listaMeses.find((m: any) => m.mes === mesSelecionado);

  const { lancamentos } = useLancamentosOperadora({
    operadoraId: useAdminLogado()?.operadora.id,
    motoristaId: motoristaSelecionado,
    dataInicial: formatarParaYMD(primeiroDia),
    dataFinal: formatarParaYMD(ultimoDia),
  });

  const lancamentosDescontos = lancamentos
    .filter((l: any) => l.tipo === "Desconto")
    .reduce((acumulador: any, l: any) => acumulador + l.valor, 0);

  const lancamentosCreditos = lancamentos
    .filter((l: any) => l.tipo === "Credito")
    .reduce((acumulador: any, l: any) => acumulador + l.valor, 0);

  const creditoNoFaturamento =
    fatuMesAtual?.faturamentoTotal + lancamentosCreditos;

  const descontoNoFaturamento = creditoNoFaturamento - lancamentosDescontos;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        boxShadow: Cor.sombra,
      }}
    >
      <div
        style={{
          backgroundColor: Cor.primaria + 30,
          padding: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          border: `1px solid ${Cor.primaria + 50}`,
          borderRadius: 14,
          userSelect: "none",
        }}
      >
        <p
          style={{
            color: Cor.primaria,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Resumo Financeiro
        </p>
      </div>
      <div
        style={{
          width: "100%",
          border: `1px solid ${Cor.texto2 + 50}`,
          padding: 5,
          paddingLeft: 10,
          borderRadius: 14,
          backgroundColor: Cor.base,
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <label htmlFor="mes-select" style={{ color: Cor.texto1, fontSize: 12 }}>
          Filtrar por Mês:{" "}
        </label>
        <select
          style={{
            border: `1px solid ${Cor.texto2 + 50}`,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 5,
            paddingTop: 5,
            borderRadius: 8,
            backgroundColor: Cor.base2,
            color: Cor.texto1,
            outline: "none",
          }}
          id="mes-select"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(Number(e.target.value))}
        >
          <option
            value={1}
            style={{
              backgroundColor: Cor.base2,
              padding: 15,
              margin: 10,
            }}
          >
            Janeiro
          </option>
          <option
            value={2}
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
          >
            Fevereiro
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={3}
          >
            Março
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={4}
          >
            Abril
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={5}
          >
            Maio
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={6}
          >
            Junho
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={7}
          >
            Julho
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={8}
          >
            Agosto
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={9}
          >
            Setembro
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={10}
          >
            Outubro
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={11}
          >
            Novembro
          </option>
          <option
            style={{
              backgroundColor: Cor.base2,
              color: Cor.texto1,
              padding: 15,
              margin: 10,
            }}
            value={12}
          >
            Dezembro
          </option>
        </select>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <p
          style={{
            color: Cor.texto1,
            fontSize: 12,
          }}
        >
          Motorista:
        </p>
        <p
          style={{
            color: Cor.primaria,
            fontSize: 19,
            fontWeight: 500,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {motorista?.nome || "-"}
        </p>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <p
          style={{
            color: Cor.texto1,
            fontSize: 12,
          }}
        >
          Saldo:
        </p>
        <p
          style={{
            color: Cor.primaria,
            fontSize: 32,
            fontWeight: 800,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(descontoNoFaturamento || 0)}
        </p>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <p
          style={{
            color: Cor.texto1,
            fontSize: 12,
          }}
        >
          Total Créditos (Mês):
        </p>
        <p
          style={{
            color: Cor.ativo,
            fontSize: 28,
            fontWeight: 800,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(lancamentosCreditos)}
        </p>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <p
          style={{
            color: Cor.texto1,
            fontSize: 12,
          }}
        >
          Total Descontos (Mês):
        </p>
        <p
          style={{
            color: Cor.atencao,
            fontSize: 28,
            fontWeight: 800,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(lancamentosDescontos)}
        </p>
      </div>
    </div>
  );
}

const listaFiltro = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

function TabelaLancamentos() {
  const { Cor } = useTema();

  const [selecionados, setSelecionados] = useState<any[]>([]);

  const selecionarTodosLancamentos = () => {
    if (selecionados.length === listaFiltro.length) {
      setSelecionados([]);
    } else {
      setSelecionados(listaFiltro.map((v: any) => v.id));
    }
  };

  //   const [mesSelecionado, setMesSelecionado] = useState<number>(
  //     new Date().getMonth() + 1,
  //   );

  const mesSelecionado = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  const { primeiroDia, ultimoDia } = useMemo(() => {
    // O construtor do Date usa meses de 0 a 11, por isso "mesSelecionado - 1"
    const primeiro = new Date(anoAtual, mesSelecionado - 1, 1);
    const ultimo = new Date(anoAtual, mesSelecionado, 0);

    return { primeiroDia: primeiro, ultimoDia: ultimo };
  }, [mesSelecionado, anoAtual]);

  const formatarParaYMD = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const { lancamentos } = useLancamentosOperadora({
    operadoraId: useAdminLogado()?.operadora.id,
    dataInicial: formatarParaYMD(primeiroDia),
    dataFinal: formatarParaYMD(ultimoDia),
  });

  console.log(lancamentos);

  const Cabecalho = (
    <div
      style={{
        backgroundColor: Cor.texto2 + 90,
        width: "100%",
        height: "6%",
        borderRadius: "16px 16px 0 0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        fontSize: 12,
        fontWeight: "bold",
        color: Cor.texto1,
      }}
    >
      <p
        style={{
          width: "2%",
          textAlign: "center",
          fontFamily: "Icone",
          fontSize: 16,
          fontWeight: 400,
          cursor: "pointer",
        }}
        onClick={selecionarTodosLancamentos}
      >
        {selecionados.length > 0 && selecionados.length === listaFiltro.length
          ? "indeterminate_check_box"
          : "square"}
      </p>
      <p style={{ width: "10%", textAlign: "center" }}>Tipo</p>
      <p style={{ width: "10%", textAlign: "center" }}>Valor</p>
      <p style={{ width: "8%", textAlign: "center" }}>Data</p>
      <p style={{ width: "40%" }}>Observação</p>
      <p style={{ width: "20%" }}>Motorista</p>
      <p style={{ width: "10%", textAlign: "center" }}>Ações</p>
    </div>
  );

  const Rodape = (
    <div
      style={{
        backgroundColor: Cor.texto2 + 90,
        width: "100%",
        borderRadius: "0 0 16px 16px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        fontSize: 12,
        fontWeight: "bold",
        color: Cor.texto1,
      }}
    >
      s
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: Cor.sombra,
      }}
    >
      {Cabecalho}
      <div
        style={{
          backgroundColor: Cor.base,
          width: "100%",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "scroll",
          scrollbarWidth: "none",
          padding: 5,
        }}
      >
        {lancamentos?.map((l: any) => {
          return (
            <LinhaLancamentoStyled $texto={Cor.texto1} $bg={Cor.base2} key={l.id}>
              <p
                style={{
                  width: "2%",
                  textAlign: "center",
                  fontFamily: "Icone",
                  fontSize: 16,
                  fontWeight: 400,
                  cursor: "pointer",
                }}
              >
                square
              </p>
              <p
                style={{
                  width: "10%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      l.tipo === "Credito" ? Cor.ativo + 40 : Cor.atencao + 40,
                    padding: "1px 10px",
                    color: l.tipo === "Credito" ? Cor.ativo : Cor.atencao,
                    borderRadius: 14,
                    fontSize: 12,
                    fontWeight: 500,
                    border: `1px solid ${l.tipo === "Credito" ? Cor.ativo + 90 : Cor.atencao + 90}`,
                  }}
                >
                  {l.tipo}
                </div>
              </p>
              <p
                style={{
                  width: "10%",
                  fontWeight: 500,
                  color: l.tipo === "Credito" ? Cor.ativo : Cor.atencao,
                }}
              >
                {l.tipo === "Credito" ? "" : "-"}
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(l.valor)}
              </p>
              <p style={{ width: "8%", textAlign: "center" }}>
                {Intl.DateTimeFormat("pt-BR", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                }).format(new Date(l.dataHora))}
              </p>
              <p
                style={{
                  width: "40%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {l.descricao}
              </p>
              <p
                style={{
                  width: "20%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {l.motorista?.nome}
              </p>
              <p style={{ width: "10%", textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: Cor.texto1 + 10,
                    padding: "1px 10px",
                    color: Cor.texto1,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                >
                  Ações
                </div>
              </p>
            </LinhaLancamentoStyled>
          );
        })}
      </div>
      {Rodape}
    </div>
  );
}

interface LinhaLancamentoProps {
  $texto: string;
  $bg: string;
}

const LinhaLancamentoStyled = styled.div<LinhaLancamentoProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ $bg }) => $bg};
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  border-bottom: 1px solid ${({ $texto }) => $texto + 10};
  align-items: center;
  font-size: 14px;
  color: ${({ $texto }) => $texto};
`;
