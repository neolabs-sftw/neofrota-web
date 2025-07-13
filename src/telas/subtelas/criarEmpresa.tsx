import { useState } from "react";
import BaseTelas from "../../componentes/baseTelas";
import EditPerfil from "../../componentes/editPerfil";
import { useTema } from "../../hooks/temaContext";

function CriarEmpresa() {
  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        <CriarClienteConteudo />
      </>
    ),
  });
}

export default CriarEmpresa;

function CriarClienteConteudo() {
  const Cor = useTema().Cor;

  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [imgLogo, setImgLogo] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [cnpjUnidade, setCnpjUnidade] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgPreview(URL.createObjectURL(file)); // gera a URL temporária
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
                borderColor: Cor.secundaria + 20,
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
                  onChange={handleChange}
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
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              gap: 20,
              flexDirection: "column",
            }}
          >
            <p
              style={{
                color: Cor.secundaria,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Dados Unidade Matriz
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <TextoEntrada
                placeholder="Nome"
                onChange={(e: { target: { value: any } }) =>
                  setNomeUnidade(e.target.value)
                }
                value={nomeUnidade}
                type="text"
                largura="50%"
              />
              <TextoEntrada
                placeholder="CNPJ"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatCNPJ(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="50%"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <TextoEntrada
                placeholder="Endereço"
                onChange={(e: { target: { value: any } }) =>
                  setNomeUnidade(e.target.value)
                }
                value={nomeUnidade}
                type="text"
                largura="40%"
              />
              <TextoEntrada
                placeholder="Número"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatCNPJ(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="10%"
              />
              <TextoEntrada
                placeholder="Bairro"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatCNPJ(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="25%"
              />{" "}
              <TextoEntrada
                placeholder="Cidade"
                onChange={(e: { target: { value: any } }) =>
                  setNomeUnidade(e.target.value)
                }
                value={nomeUnidade}
                type="text"
                largura="25%"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <TextoEntrada
                placeholder="Complemento"
                onChange={(e: { target: { value: any } }) =>
                  setNomeUnidade(e.target.value)
                }
                value={nomeUnidade}
                type="text"
                largura="60%"
              />
              <TextoEntrada
                placeholder="CEP"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatCNPJ(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="25%"
              />
              <TextoEntrada
                placeholder="UF"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatCNPJ(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="15%"
              />
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
              padding: "0 20px",
              display: "flex",
              gap: 20,
              flexDirection: "column",
            }}
          >
            <p
              style={{
                color: Cor.secundaria,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Dados Gestor Responsável
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <TextoEntrada
                placeholder="Nome"
                onChange={(e: { target: { value: any } }) =>
                  setNomeUnidade(e.target.value)
                }
                value={nomeUnidade}
                type="text"
                largura="50%"
              />
              <TextoEntrada
                placeholder="Email"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatTelefone(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="50%"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <TextoEntrada
                placeholder="Nome"
                onChange={(e: { target: { value: any } }) =>
                  setNomeUnidade(e.target.value)
                }
                value={nomeUnidade}
                type="text"
                largura="33%"
              />
              <TextoEntrada
                placeholder="Telefone"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatTelefone(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="33%"
              />
              <TextoEntrada
                placeholder="Senha"
                onChange={(e: { target: { value: any } }) =>
                  setCnpjUnidade(formatTelefone(e.target.value))
                }
                value={cnpjUnidade}
                type="text"
                largura="33%"
              />
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
          >
            Salvar
          </button>
        </div>
      </div>
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

function formatTelefone(value: any) {
  const numero = value.replace(/\D/g, ""); // Remove tudo que não é número

  // Aplica a máscara
  const formatado = numero
    .replace(/^(\d{2})(\d)/, "($1) $2") // (71) 9
    .replace(/(\d{1})?(\d{4})(\d{4})$/, "$1 $2-$3"); // 9 9999-9999

  return formatado.slice(0, 19); // Limita o tamanho
}
