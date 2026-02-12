import CircularProgress from "@mui/material/CircularProgress";
import BaseTelas from "../../../componentes/baseTelas";
import { useTema } from "../../../hooks/temaContext";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { supabase } from "../../../hooks/supabaseClient";
import {
  useMotoristaId,
  useUpdateMotorista,
} from "../../../hooks/useMotorista";

function EditarMotorista() {
  return BaseTelas({
    conteudo: <EditarMotoristaConteudo />,
  });
}

export default EditarMotorista;

function EditarMotoristaConteudo() {
  const Cor = useTema().Cor;

  const { motoristaId } = useParams();

  const { motorista } = useMotoristaId(String(motoristaId));

  const navigate = useNavigate();

  console.log("Motorista para edição:", motorista);

  const token = localStorage.getItem("token");

  interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const operadoraId = decoded ? decoded.operadoraId : null;

  const [nome, setNome] = useState(motorista ? motorista.nome : "");
  const [email, setEmail] = useState(motorista ? motorista.email : "");
  const [cpf, setCpf] = useState(motorista ? motorista.cpf : "");
  const [cnh, setCnh] = useState(motorista ? motorista.cnh : "");
  const [vCnh, setV_cnh] = useState(motorista ? motorista.vCnh : "");
  const [tipoMotorista, setTipo_motorista] = useState(
    motorista ? motorista.tipoMotorista : "",
  );
  const [imgPreview, setImgPreview] = useState(
    motorista ? motorista.fotoMotorista : "",
  );
  const [status, setStatus] = useState<string>("");
  const [statusCx, setStatusCx] = useState<boolean>(false);

  const [fotoMotorista, setFoto_motorista] = useState<File>();

  useEffect(() => {
    if (motorista) {
      setNome(motorista.nome);
      setEmail(motorista.email);
      setCpf(motorista.cpf);
      setCnh(motorista.cnh);
      setV_cnh(motorista.vCnh);
      setTipo_motorista(motorista.tipoMotorista);
      setImgPreview(motorista.fotoMotorista);
    }
  }, [motorista]);

  const { updateMotorista, loading } = useUpdateMotorista();

  const carregarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file));
      setFoto_motorista(file);
    }
  };

  function removerFoto() {
    setImgPreview("");
    setFoto_motorista(undefined);
  }

  const atualizarMotoristaFunc = async () => {
    setStatusCx(true);
    setStatus("Atualizando dados...");

    if (!operadoraId) {
      setStatus(
        "Erro: Informações de autenticação não encontradas. Por favor, faça login novamente.",
      );
      setTimeout(() => setStatusCx(false), 4000);
      return;
    }

    if (!nome || !email || !cpf || !cnh || !vCnh || !tipoMotorista) {
      setStatus("Erro: Por favor, preencha todos os campos obrigatórios.");
      setTimeout(() => setStatusCx(false), 4000);
      return;
    }

    try {
      let fotoUrlFinal = null;
      if (fotoMotorista) {
        setStatus("Fazendo upload da imagem...");

        const nomeImg = `foto_perfil_motorista/${cpf.replace(
          /\D/g,
          "",
        )}-${Date.now()}.png`;
        const bucket = "neofrotabkt";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(nomeImg, fotoMotorista);

        if (uploadError) {
          console.log(uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(uploadData.path);

        fotoUrlFinal = urlData.publicUrl;
      } else {
        fotoUrlFinal = null;
        setStatus("Registo sem foto...");
      }
      setStatus("Enviando dados para o servidor...");
      await updateMotorista({
        variables: {
          updateMotoristaId: motoristaId,
          input: {
            nome,
            email,
            fotoMotorista: fotoUrlFinal,
            cpf,
            cnh,
            vCnh,
            tipoMotorista,
          },
        },
      });
      setStatus("Motorista atualizado com sucesso!");
      setTimeout(() => {
        setStatusCx(false);
        navigate("/motorista/" + motoristaId);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar motorista:", err);
      setStatus(`Ocorreu um erro: ${err}`);
      setTimeout(() => {
        setStatusCx(false);
      }, 4000);
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
              {/* {error && (
                <p style={{ color: "red" }}>
                  Erro na mutation: {error.message}
                </p>
              )} */}
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
            Editar Motorista
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
              Edite as informações do Motorista
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
                    justifyContent: "flex-start",
                  }}
                >
                  <p style={{ color: Cor.texto1, fontSize: 12 }}>
                    Tipo de Motorista
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
                    onChange={(e) => setTipo_motorista(e.target.value)}
                  >
                    <option value="">Escolha</option>
                    <option value="Agregado">Agredado</option>
                    <option value="Funcionario">Funcionário</option>
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
                  Adicione a foto do motorista.
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
                  <button
                    style={{
                      backgroundColor: Cor.texto2,
                      color: Cor.base,
                      borderRadius: 22,
                      padding: 10,
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={removerFoto}
                  >
                    Remover Foto
                  </button>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "0 20px",
              }}
            >
              <button
                style={{
                  backgroundColor: Cor.texto2,
                  border: "none",
                  alignSelf: "flex-end",
                  padding: "10px 50px",
                  borderRadius: 22,
                  margin: "0 20px",
                  color: Cor.base2,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  0;
                  navigate("/motorista/" + motoristaId);
                }}
              >
                Cancelar
              </button>
              <button
                style={{
                  backgroundColor: Cor.primaria,
                  border: "none",
                  alignSelf: "flex-end",
                  padding: "10px 60px",
                  borderRadius: 22,
                  margin: "0 20px",
                  color: Cor.base2,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  atualizarMotoristaFunc();
                }}
              >
                {loading ? "Salvando..." : "Salvar"}
                
              </button>
            </div>
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
