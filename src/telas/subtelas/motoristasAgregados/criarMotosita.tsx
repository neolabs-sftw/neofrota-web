import { useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { supabase } from "../../../hooks/supabaseClient";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function CriarMotorista() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <CriarMotoristaConteudo />
      </>
    ),
  });
}

export default CriarMotorista;

const CRIAR_MOTORISTA = gql`
  mutation CreateMotorista($input: MotoristaInput!) {
    createMotorista(input: $input) {
      id
      nome
    }
  }
`;

function CriarMotoristaConteudo() {
  const Cor = useTema().Cor;

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const operadoraId = decoded ? decoded.operadoraId : null;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fotoMotorista, setFoto_motorista] = useState<File>();
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [vCnh, setV_cnh] = useState("");
  const [tipoMotorista, setTipo_motorista] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [status, setStatus] = useState<string>("");
  const [statusCx, setStatusCx] = useState<boolean>(false);

  const [criarMotorista, { loading, error }] = useMutation(CRIAR_MOTORISTA);

  const carregarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file));
      setFoto_motorista(file); // gera a URL temporária
    }
  };

  const criarMotoristaFunc = async () => {
    // Passo 1: Inicia o processo e mostra o modal de carregamento.
    setStatusCx(true);
    setStatus("A validar os dados...");

    // Passo 2: Validações essenciais que ocorrem sempre.
    if (!operadoraId) {
      setStatus(
        "Erro: Informações de autenticação não encontradas. Por favor, faça login novamente."
      );
      setTimeout(() => setStatusCx(false), 4000); // Esconde o modal após 4s
      return;
    }

    if (!nome || !email || !cpf || !cnh || !vCnh || !tipoMotorista) {
      setStatus("Erro: Por favor, preencha todos os campos obrigatórios.");
      setTimeout(() => setStatusCx(false), 4000);
      return;
    }

    try {
      // Passo 3: Prepara a variável da URL da foto, começando como nula.
      let fotoUrlFinal = null;

      // Passo 4: Bloco condicional para o upload. Só executa se houver um arquivo.
      if (fotoMotorista) {
        setStatus("A fazer o upload da imagem...");

        const nomeImg = `foto_perfil_motorista/${cpf.replace(
          /\D/g,
          ""
        )}-${Date.now()}.png`;
        const bucket = "neofrotabkt";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(nomeImg, fotoMotorista);

        if (uploadError) {
          // Se o upload falhar, lança o erro para o bloco catch.
          throw uploadError;
        }

        // Se o upload for bem-sucedido, obtém a URL pública.
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(uploadData.path);

        // Atualiza a nossa variável com a URL final.
        fotoUrlFinal = urlData.publicUrl;
      } else {
        setStatus("A criar registo sem foto...");
      }

      // Passo 5: Executa a mutation do GraphQL.
      // A variável 'fotoUrlFinal' terá a URL da imagem ou será 'null'.
      setStatus("A enviar dados para o servidor...");

      await criarMotorista({
        variables: {
          input: {
            nome,
            email,
            fotoMotorista: fotoUrlFinal, // Usa a variável final aqui
            cpf,
            cnh,
            vCnh,
            tipoMotorista,
            operadoraId: parseInt(operadoraId, 10),
          },
        },
      });

      // Passo 6: Lida com o sucesso da operação.
      setStatus("Motorista criado com sucesso!");
      setTimeout(() => {
        setStatusCx(false); // Esconde o modal.
        navigate("/agregados"); // Navega para a lista.
        window.location.reload();
      }, 2000); // Espera 2 segundos para o utilizador ver a mensagem.
    } catch (err) {
      // Passo 7: Lida com qualquer erro que possa ter ocorrido (upload ou graphql).
      console.error("Erro ao criar motorista:", err);
      setStatus(`Ocorreu um erro: ${err}`);
      setTimeout(() => {
        setStatusCx(false);
      }, 4000); // Deixa a mensagem de erro visível por 5 segundos.
    }
  };

  return (
    <>
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
        {statusCx && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: Cor.base2 + 50,
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              zIndex: 10,
              top: 0,
              left: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                width: "20%",
                height: "40%",
                padding: 22,
                backgroundColor: Cor.base,
                borderRadius: 22,
                boxShadow: Cor.sombra,
                border: "1px solid" + Cor.texto1 + 50,
              }}
            >
              <CircularProgress sx={{ color: Cor.primaria }} thickness={5} />
              <p style={{ color: Cor.texto1 }}>Salvando...</p>
              {status && <p style={{ color: Cor.texto1 }}>{status}</p>}
              {error && (
                <p style={{ color: "red" }}>
                  Erro na mutation: {error.message}
                </p>
              )}
            </div>
          </div>
        )}
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
          <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
            Novo Motorista
          </h3>
          <div
            style={{
              width: "70%",
              height: 1,
              backgroundColor: Cor.primaria,
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 20,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div>
            <p style={{ color: Cor.secundaria, fontSize: 20 }}>
              Informações do Motorista
            </p>
            <p style={{ color: Cor.texto1, fontSize: 12 }}>
              Preencha abaixo todos os campos e salve para seguir com o
              cadastro.
            </p>
          </div>
          <div
            style={{
              width: "100%",
              borderRadius: 22,
              marginTop: 20,
              boxShadow: Cor.sombra,
              border: "1px solid" + Cor.texto2 + 25,
              backgroundColor: Cor.base2,
              display: "flex",
              flexDirection: "column",
              padding: "20px 0",
            }}
          >
            <p
              style={{
                color: Cor.secundaria,
                fontSize: 14,
                fontWeight: "500",
                padding: "0 0 20px 20px",
              }}
            >
              Informações Iniciais
            </p>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  padding: "0 20px",
                }}
              >
                <TextoEntrada
                  placeholder="Nome do Motorista"
                  onChange={(e: { target: { value: any } }) =>
                    setNome(e.target.value)
                  }
                  value={nome}
                  type="text"
                  largura="100%"
                />
                <TextoEntrada
                  placeholder="E-mail"
                  onChange={(e: { target: { value: any } }) =>
                    setEmail(e.target.value)
                  }
                  value={email}
                  type="text"
                  largura="100%"
                />
                <TextoEntrada
                  placeholder="CPF"
                  onChange={(e: { target: { value: any } }) => {
                    setCpf(formatCPF(e.target.value));
                  }}
                  value={cpf}
                  type="text"
                  largura="100%"
                />
                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                  <TextoEntrada
                    placeholder="CNH"
                    onChange={(e: { target: { value: any } }) =>
                      setCnh(e.target.value)
                    }
                    value={cnh}
                    type="text"
                    largura="60%"
                  />
                  <div
                    style={{
                      width: "40%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <p style={{ color: Cor.texto1, fontSize: 12 }}>Válidade</p>
                    <TextoEntrada
                      placeholder="Validade CNH"
                      onChange={(e: { target: { value: any } }) =>
                        setV_cnh(e.target.value)
                      }
                      value={vCnh}
                      type="date"
                      largura="100%"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    justifyContent:
                      tipoMotorista === "Funcionario"
                        ? "space-between"
                        : "flex-start",
                  }}
                >
                  <p style={{ color: Cor.texto1, fontSize: 12 }}>
                    Tipo de Motorista
                  </p>
                  <select
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 10,
                      borderRadius: 22,
                      border: "1px solid" + Cor.texto2 + 25,
                      color: Cor.texto1,
                      fontSize: 12,
                    }}
                    onChange={(e) => setTipo_motorista(e.target.value)}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Agregado">Agredado</option>
                    <option value="Funcionario">Funcionário</option>
                  </select>
                  {tipoMotorista === "Funcionario" ? (
                    <TextoEntrada
                      placeholder="Cód. Agregado"
                      onChange={() => {}}
                      value={""}
                      type="text"
                      largura="40%"
                    />
                  ) : null}
                </div>
              </div>
              <div
                style={{
                  width: 150,
                  height: 200,
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
              <div
                style={{
                  width: "calc(50% - 150px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <p style={{ color: Cor.texto1, fontSize: 12 }}>
                  Adicione a logo da empresa.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <input
                    type="file"
                    title=""
                    accept="image/*"
                    style={{
                      backgroundColor: Cor.primaria,
                      color: Cor.base,
                      borderRadius: 22,
                      padding: 10,
                    }}
                    onChange={carregarImagem}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto2,
                margin: "20px 0",
              }}
            />
            <button
              style={{
                backgroundColor: Cor.primaria,
                border: "none",
                width: "30%",
                alignSelf: "flex-end",
                padding: "10px 60px",
                borderRadius: 22,
                margin: "0 20px",
                color: Cor.base2,
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                criarMotoristaFunc();
              }}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
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

function formatCPF(value: any) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é número
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .slice(0, 14); // Limita o tamanho
}
