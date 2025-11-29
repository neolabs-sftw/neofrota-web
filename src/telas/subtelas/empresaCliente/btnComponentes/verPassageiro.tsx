import { useState } from "react";
import { useTema } from "../../../../hooks/temaContext";

interface PassageiroProps {
  passageiro: {
    id: string;
    nome: string;
    matricula: string;
    telefone: string;
    email: string;
    ativo: boolean;
    fotoPerfilPassageiro: string;
    endRua: string;
    endNumero: string;
    endBairro: string;
    endCidade: string;
    pontoApanha: string;
    horarioEmbarque: string;
    centroCustoClienteId: {
      id: string;
      nome: string;
      codigo: string;
    };
    empresaClienteId: {
      id: string;
      nome: string;
    };
  };
}

function VerPassageiro({ passageiro }: PassageiroProps) {
  const [CxVerPassageiro, setCxVerPassageiro] = useState(false);
  return (
    <>
      <LinhaTabelaPassageiro
        passageiro={passageiro}
        setCxVerPassageiro={setCxVerPassageiro}
        CxVerPassageiro={CxVerPassageiro}
      />
    </>
  );
}

export default VerPassageiro;

function LinhaTabelaPassageiro({
  passageiro,
  setCxVerPassageiro,
  CxVerPassageiro,
}: PassageiroProps & {
  setCxVerPassageiro: any;
  CxVerPassageiro: boolean;
}) {
  return (
    <>
      <tr
        key={passageiro.id}
        style={{ cursor: "pointer" }}
        onClick={() => setCxVerPassageiro(true)}
      >
        <td style={{ textAlign: "center" }}>
          <img
            src={passageiro.fotoPerfilPassageiro}
            style={{ width: 35, height: 35, borderRadius: 10 }}
          />
        </td>
        <td>{passageiro.matricula}</td>
        <td>{passageiro.nome}</td>
        <td>{passageiro.horarioEmbarque}h</td>
        <td>
          <p>
            {passageiro.endRua}, {passageiro.endBairro}, {passageiro.endCidade}
          </p>
        </td>
        <td style={{ textAlign: "center" }}>
          {passageiro.centroCustoClienteId.codigo}
        </td>
        <td>{passageiro.telefone}</td>
        <td>
          <ModalVerPassageiro
            passageiro={passageiro}
            setCxVerPassageiro={setCxVerPassageiro}
            CxVerPassageiro={CxVerPassageiro}
          />
        </td>
      </tr>
    </>
  );
}

function ModalVerPassageiro({
  passageiro,
  setCxVerPassageiro,
  CxVerPassageiro,
}: PassageiroProps & {
  setCxVerPassageiro: any;
  CxVerPassageiro: boolean;
}) {
  const Cor = useTema().Cor;

  const [nome, setNome] = useState<string>(passageiro.nome);
  const [email, setEmail] = useState<string>(passageiro.email);
  const [telefone, setTelefone] = useState<string>(passageiro.telefone);
  const [matricula, setMatricula] = useState<string>(passageiro.matricula);
  const [centroCusto, setCentroCusto] = useState<string>(
    passageiro.centroCustoClienteId.nome
  );
  const [endRua, setEndRua] = useState<string>(passageiro.endRua);
  const [endNumero, setEndNumero] = useState<string>(passageiro.endNumero);
  const [endBairro, setEndBairro] = useState<string>(passageiro.endBairro);
  const [endCidade, setEndCidade] = useState<string>(passageiro.endCidade);
  const [horarioEmbarque, setHorarioEmbarque] = useState<string>(
    passageiro.horarioEmbarque
  );
  const [pontoApanha, setPontoApanha] = useState<string>(
    passageiro.pontoApanha
  );
  const [fotoPerfilPassageiro, setFotoPerfilPassageiro] = useState<File>();

  const [imgPreview, setImgPreview] = useState<string>(
    passageiro.fotoPerfilPassageiro
  );

  function carregarImagem(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setFotoPerfilPassageiro(file);
      try {
        const url = URL.createObjectURL(file);
        setImgPreview(url);
      } catch {
        setImgPreview("");
      }
    } else {
      setFotoPerfilPassageiro(undefined);
      setImgPreview("");
    }
  }

  const a = {
    nome: nome,
    email: email,
    telefone: telefone,
    matricula: matricula,
    centroCusto: centroCusto,
    endRua: endRua,
    endNumero: endNumero,
    endBairro: endBairro,
    endCidade: endCidade,
    horarioEmbarque: horarioEmbarque,
    pontoApanha: pontoApanha,
    fotoPerfilPassageiro: fotoPerfilPassageiro,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: Cor.base + 60,
        backdropFilter: "blur(2px)",
        position: "fixed",
        opacity: CxVerPassageiro ? 1 : 0,
        transition: "all 0.3s ease-in-out",
        top: 0,
        left: 0,
        pointerEvents: CxVerPassageiro ? "all" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        zIndex: 10,
        cursor: "default",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setCxVerPassageiro(false);
      }}
    >
      <div
        style={{
          width: "60%",
          backgroundColor: Cor.base,
          boxShadow: Cor.sombra,
          borderRadius: 22,
          display: "flex",
          flexDirection: "column",
          border: "1px solid " + Cor.texto2 + 50,
          scale: CxVerPassageiro ? 1 : 0.8,
          transition: "all 0.3s ease-in-out",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div style={{ width: "100%", padding: "15px 15px 0px 15px" }}>
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
                  color: Cor.primariaTxt,
                  fontWeight: "bold",
                }}
              >
                Criar Passageiro
              </p>
              <p style={{ fontSize: 12, color: Cor.texto2, marginBottom: 5 }}>
                Passageiros são os usuários do transporte. Informe os dados
                corretamente para garantir identificação, comunicação e
                organização das viagens.
              </p>
            </div>
            <p
              style={{
                cursor: "pointer",
                fontFamily: "Icone",
                fontSize: 24,
                color: Cor.primaria,
              }}
              onClick={() => setCxVerPassageiro(false)}
            >
              close
            </p>
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: 15,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              width: "100%",
            }}
          >
            {/* Adicionar Foto */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  width: 150,
                  height: 150,
                  backgroundColor: Cor.base2,
                  borderRadius: 22,
                  border: "1px solid",
                  borderColor: Cor.texto2,
                  boxShadow: Cor.sombra,
                  backgroundImage: `url(${imgPreview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <label
                htmlFor="fotoUpload"
                style={{
                  backgroundColor: Cor.primaria,
                  color: Cor.base,
                  borderRadius: 22,
                  padding: "10px 20px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  justifyContent: "center",
                }}
              >
                <p style={{ fontFamily: "Icone", fontWeight: "bold" }}>add</p>
                <p style={{ fontSize: 15 }}>Foto perfil</p>
              </label>

              <input
                id="fotoUpload"
                type="file"
                title=""
                accept="image/*"
                style={{ display: "none" }}
                onChange={carregarImagem}
              />
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <TextoEntrada
                placeholder="Nome do Passageiro"
                type="text"
                largura="100%"
                onChange={(e) => setNome(e.target.value)}
                value={nome}
              />
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <TextoEntrada
                  placeholder="E-mail"
                  type="text"
                  largura="60%"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
                <TextoEntrada
                  placeholder="Telefone"
                  type="text"
                  largura="40%"
                  onChange={(e) => {
                    setTelefone(e.target.value);
                  }}
                  value={telefone}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "space-between",
                }}
              >
                <TextoEntrada
                  placeholder="Matrícula"
                  type="text"
                  largura="50%"
                  onChange={(e: { target: { value: any } }) => {
                    setMatricula(e.target.value);
                  }}
                  value={matricula}
                />
                <TextoEntrada
                  placeholder="Centro de Custo"
                  type="text"
                  largura="50%"
                  onChange={(e: { target: { value: any } }) => {
                    setCentroCusto(e.target.value);
                  }}
                  value={centroCusto}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  flexDirection: "row",
                }}
              >
                <TextoEntrada
                  placeholder="Rua"
                  type="text"
                  largura="75%"
                  onChange={(e) => setEndRua(e.target.value)}
                  value={endRua}
                />
                <TextoEntrada
                  placeholder="Número"
                  type="text"
                  largura="25%"
                  onChange={(e) => setEndNumero(e.target.value)}
                  value={endNumero}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <TextoEntrada
              placeholder="Bairro"
              type="text"
              largura="33%"
              onChange={(e) => setEndBairro(e.target.value)}
              value={endBairro}
            />
            <TextoEntrada
              placeholder="Cidade"
              type="text"
              largura="34%"
              onChange={(e) => setEndCidade(e.target.value)}
              value={endCidade}
            />
            <TextoEntrada
              placeholder="Horário de Embarque"
              type="text"
              largura="33%"
              onChange={(e) => setHorarioEmbarque(e.target.value)}
              value={horarioEmbarque}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <TextoEntrada
              placeholder="Ponto de Apanha"
              type="text"
              largura="100%"
              onChange={(e) => setPontoApanha(e.target.value)}
              value={pontoApanha}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Cor.texto2 + 50,
          }}
        />
        <div
          style={{
            width: "100%",
            padding: "10px 15px 15px 15px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <div
            style={{
              cursor: "pointer",
              backgroundColor: Cor.primaria,
              padding: "10px 50px",
              borderRadius: 22,
            }}
            onClick={() => {
              //   criarUnidadeFunc();
              console.log(a);
              setCxVerPassageiro(false);
              setNome("");
              setTelefone("");
              setEmail("");
              setMatricula("");
              setCentroCusto("");
              setEndRua("");
              setEndNumero("");
              setEndBairro("");
              setEndCidade("");
              setHorarioEmbarque("");
              setPontoApanha("");
              setImgPreview("");
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: Cor.primariaTxt,
                fontWeight: "bold",
              }}
            >
              Salvar
            </p>
          </div>
        </div>
      </div>
    </div>
  );

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
      </div>
    );
  }
}
