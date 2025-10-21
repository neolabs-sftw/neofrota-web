import { useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import CircularProgress from "@mui/material/CircularProgress";
import { gql, useMutation } from "@apollo/client";
import { useAdminLogado } from "../../../hooks/AdminLogado";
import { supabase } from "../../../hooks/supabaseClient";
import { useNavigate } from "react-router-dom";
import CxCarregamento from "../../../componentes/cxCarregamento";
import Lottie from "lottie-react";
import check from "../../../assets/animations/Check.json";

const CRIAR_FUNCIONARIO_MUTATION = gql`
  mutation CreateAdminUsuario($data: AdminUsuarioInput!) {
    createAdminUsuario(data: $data) {
      id
    }
  }
`;

function CriarFuncionario() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <CriarFuncionarioConteudo />
      </>
    ),
  });
}

export default CriarFuncionario;

function CriarFuncionarioConteudo() {
  const Cor = useTema().Cor;
  const checkIcon = (
    <Lottie
      animationData={check}
      loop={true}
      style={{ width: 130, height: 130 }}
    />
  );
  const erroIcon = (
    <p
      style={{
        color: Cor.atencao,
        fontSize: 120,
        fontFamily: "Icone",
        fontWeight: "bold",
      }}
    >
      report
    </p>
  );
  const [statusCx, setStatusCx] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [statusIcon, setStatusIcon] = useState<any>(erroIcon);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fotoFuncionario, setFotoFuncionario] = useState<File>();
  const [funcao, setFuncao] = useState<string>("");

  const useAdmin = useAdminLogado();

  const navigate = useNavigate();

  const operadoraId = useAdmin?.operadora?.id;

  const [imgPreview, setImgPreview] = useState<string>("");

  //   const [error, serError] = useState<boolean>(false);

  const carregarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file));
      setFotoFuncionario(file);
    }
  };

  const [criarFuncionario, { loading, error }] = useMutation(
    CRIAR_FUNCIONARIO_MUTATION
  );

  const criarfuncionariofunc = async () => {
    setStatusCx(true);
    setStatus("Validando dados...");
    setStatusIcon(
      <CircularProgress sx={{ color: Cor.primaria }} thickness={5} size={120} />
    );

    if (!nome || !email || !funcao) {
      setStatus("Você precisa preencher todos os campos para seguir.");
      setStatusMsg("Erro!");
      setStatusIcon(erroIcon);
      setTimeout(() => {
        setStatusCx(false);
      }, 4000);
      return;
    }

    if (!operadoraId) {
      setStatusMsg("Erro Crítico!");
      setStatusIcon(erroIcon);
      setStatus(
        "Erro: Informações de autenticação não encontradas. Por favor, faça login novamente."
      );
      setTimeout(() => setStatusCx(false), 4000);
      return;
    }

    try {
      let fotoUrlFinal = null;
      if (fotoFuncionario) {
        setStatus("Fazendo upload da imagem...");

        const nomeImg = `img_perfis/${nome}-${Date.now()}.png`;
        const bucket = "neofrotabkt";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(nomeImg, fotoFuncionario);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(uploadData.path);

        fotoUrlFinal = urlData.publicUrl;
      } else {
        setStatus("Registo sem foto...");
      }
      setStatus("Enviando dados para o servidor...");

      await criarFuncionario({
        variables: {
          data: {
            nome,
            email,
            senha: "0000",
            fotoAdminOperadora: fotoUrlFinal,
            funcao,
            operadoraId: String(operadoraId),
          },
        },
      });
      setStatusIcon(checkIcon);
      setStatus("Funcionario criado com sucesso!");
      setTimeout(() => {
        setStatusCx(false);
      }, 3000);
      setTimeout(() => {
        navigate("/funcionarios");
      }, 3050);
    } catch (err) {
      console.error("Erro ao criar funcionario:", err);
      setStatusMsg("Erro!");
      setStatusIcon(erroIcon);
      setStatus("Erro ao criar funcionario");
      setTimeout(() => {
        setStatusCx(false);
      }, 4000);
    }
  };

  return (
    <>
      {statusCx === true ? (
        <CxCarregamento
          status={status}
          error={error?.message}
          icone={statusIcon}
          msg={statusMsg}
        />
      ) : null}
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
          <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
            Novo Funcionário
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
                  placeholder="Nome do Funcionário"
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <p style={{ color: Cor.texto1, fontSize: 12 }}>
                    Tipo do Funcionário
                  </p>
                  <select
                    style={{
                      backgroundColor: Cor.base2,
                      padding: 10,
                      appearance: "none",
                      outline: "none",
                      borderRadius: 22,
                      width: 220,
                      border: "1px solid" + Cor.texto2 + 25,
                      color: Cor.texto1,
                      fontSize: 12,
                    }}
                    onChange={(e) => setFuncao(e.target.value)}
                  >
                    <option value="">Escolha</option>
                    <option value="Master">Master</option>
                    <option value="Admin">Administrador(a)</option>
                    <option value="Finc">Financeiro(a)</option>
                    <option value="Oper">Operador(a)</option>
                  </select>
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
                  Adicione a foto do funcionário.
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
                criarfuncionariofunc();
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
