import { useState } from "react";
import { usePassageiros } from "../hooks/usePassageiros";
import { useTema } from "../hooks/temaContext";
import BtnCriarPassageiro from "../telas/subtelas/empresaCliente/btnComponentes/criarPassageiro";

export function ModalSeletorPassageiro({
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
  const [cidadeBusca, setCidadeBusca] = useState<string>("");

  const { listaPassageiro: listaTotal } = usePassageiros(empresaCliente || "0");

  const listaPassageiro = listaTotal?.filter((p: any) => p.ativo === true);

  const Cor = useTema().Cor;

 function normalizarTexto(texto: string | null | undefined) {
  return (texto || "")
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
          setCidadeBusca("");
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
              placeholder="Busca por Passageiro"
              type="text"
              largura="32%"
              onChange={(e) => {
                setNomeBusca(e.target.value);
              }}
              value={nomeBusca}
            />
            <TextoEntrada
              placeholder="Busca por Bairro"
              type="text"
              largura="32%"
              onChange={(e) => {
                setBairroBusca(e.target.value);
              }}
              value={bairroBusca}
            />
            <TextoEntrada
              placeholder="Busca por cidade"
              type="text"
              largura="32%"
              onChange={(e) => {
                setCidadeBusca(e.target.value);
              }}
              value={cidadeBusca}
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
                const cidade = normalizarTexto(p.endCidade);

                const buscaNome = normalizarTexto(nomeBusca);
                const buscaBairro = normalizarTexto(bairroBusca);
                const buscaCidade = normalizarTexto(cidadeBusca);

                const porNome = nome.includes(buscaNome);
                const porBairro = bairro.includes(buscaBairro);
                const porCidade = cidade.includes(buscaCidade);

                return porNome && porBairro && porCidade;
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
      <p
        style={{
          fontFamily: "icone",
          fontWeight: "bold",
          fontSize: 18,
          color: Cor.texto1,
        }}
      >
        search
      </p>
    </div>
  );
}
