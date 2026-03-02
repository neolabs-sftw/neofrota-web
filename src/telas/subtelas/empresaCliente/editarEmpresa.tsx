import { useState } from "react";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import { useTema } from "../../../hooks/temaContext";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../../../hooks/supabaseClient";
import {
  useEditarEmpresaCliente,
  useEmpresaCliente,
} from "../../../hooks/useEmpresaCliente";

function EditarEmpresa() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <EditarEmpresaConteudo />
      </>
    ),
  });
}

function EditarEmpresaConteudo() {
  const Cor = useTema().Cor;

  const { clienteId } = useParams();

  const { empresaCliente } = useEmpresaCliente(String(clienteId));

  const [nome, setNome] = useState(empresaCliente?.nome);
  const [cnpj, setCnpj] = useState(empresaCliente?.cnpj);
  const [razaoSocial, setRazaoSocial] = useState(empresaCliente?.rSocial);
  const [imgLogo, setImgLogo] = useState<File>();
  const [imgPreview, setImgPreview] = useState(empresaCliente?.fotoLogoCliente);
  const [status, setStatus] = useState("");

  function removerFoto() {
    setImgPreview("");
    setImgLogo(undefined);
  }

  const carregarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file));
      setImgLogo(file); // gera a URL temporária
    }
  };

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  interface JwtPayload {
    adminUsuarioId?: string;
    operadoraId?: string;
  }
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const operadoraId = decoded ? decoded.operadoraId : null;
  const adminUsuarioId = decoded ? decoded.adminUsuarioId : null;

  const { editarEmpresa, loading, error } = useEditarEmpresaCliente(
    String(operadoraId),
  );

  const criarEmpresaFunc = async () => {
    setStatus("Carregando...");

    // PASSO 1: Validação dos IDs obtidos do token.
    // Garante que o usuário está devidamente autenticado e com os dados corretos.
    if (!operadoraId || !adminUsuarioId) {
      setStatus(
        "Erro: Informações de autenticação não encontradas. Por favor, faça login novamente.",
      );
      console.error("operadoraId ou adminUsuarioId são nulos.", {
        operadoraId,
        adminUsuarioId,
      });
      return;
    }

    try {
      let fotoUrl = empresaCliente?.fotoLogoCliente || null;

      if (imgLogo) {
        setStatus("Fazendo upload da imagem...");

        const nomeImg = `foto_logo_cliente/${cnpj.replace(
          /\D/g,
          "",
        )}-${Date.now()}.png`;
        const bucket = "neofrotabkt";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(nomeImg, imgLogo);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(uploadData.path);

        fotoUrl = urlData.publicUrl;
        setStatus("Imagem enviada, criando registro...");
      } else if (!imgPreview) {
        fotoUrl = null;
        setStatus("Removendo Foto");
      } else {
        setStatus("Registro Sem foto!");
      }

      setStatus("Enviando dados para o servidor...");

      await editarEmpresa("1", {
        nome,
        rSocial: razaoSocial,
        cnpj,
        fotoLogoCliente: fotoUrl,
        operadoraId: parseInt(operadoraId, 10),
      });

      setStatus("Editada com sucesso!");
      navigate("/empresas");
      window.location.reload();
    } catch (error: any) {
      console.error("Falha ao criar empresa:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
      setStatus(`Erro ao criar empresa: ${errorMessage}`);
    }
  };

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
        <h3 style={{ color: Cor.secundaria, fontSize: "20px" }}>
          Novo Cliente
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
            Informações do Cliente
          </p>
          <p style={{ color: Cor.texto1, fontSize: 12 }}>
            Preencha abaixo todos os campos e salve para seguir com o cadastro.
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
                placeholder="Nome Fantasia"
                onChange={(e: { target: { value: any } }) =>
                  setNome(e.target.value)
                }
                value={nome}
                type="text"
                largura="100%"
              />
              <TextoEntrada
                placeholder="Razão Social"
                onChange={(e: { target: { value: any } }) =>
                  setRazaoSocial(e.target.value)
                }
                value={razaoSocial}
                type="text"
                largura="100%"
              />
              <TextoEntrada
                placeholder="CNPJ"
                onChange={(e: { target: { value: any } }) => {
                  setCnpj(formatCNPJ(e.target.value));
                }}
                value={cnpj}
                type="text"
                largura="100%"
              />
            </div>
            <div
              style={{
                width: 150,
                aspectRatio: 1,
                backgroundColor: Cor.base2,
                borderRadius: 22,
                border: "4px solid",
                borderColor: Cor.texto1 + "DD",
                backgroundImage: `url(${imgPreview})`,
                backgroundSize: "cover",
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
              <p
                style={{
                  width: "50%",
                  padding: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Cor.texto2,
                  borderRadius: 12,
                  color: Cor.base,
                  cursor: "pointer"
                }}
                onClick={()=> removerFoto()}
              >
                Remover Foto
              </p>
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
            onClick={criarEmpresaFunc}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
      {status && <p>{status}</p>}
      {error && (
        <p style={{ color: "red" }}>Erro na mutation: {error.message}</p>
      )}
    </div>
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

function formatCNPJ(value: any) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é número
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18); // Limita o tamanho
}

export default EditarEmpresa;
