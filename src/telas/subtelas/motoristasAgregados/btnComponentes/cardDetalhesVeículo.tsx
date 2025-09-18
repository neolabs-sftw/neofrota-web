import { gql, useMutation, useQuery } from "@apollo/client";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import icativo from "../../../../assets/animations/icativo.json";
import icinativo from "../../../../assets/animations/icinativo.json";
import { useTema } from "../../../../hooks/temaContext";
import BtnCriarNovoCarro from "./criarCarro";

const GET_CARRO_ATRELADO = gql`
  query CarroMotoristaId($idMotorista: ID!) {
    carroMotoristaId(idMotorista: $idMotorista) {
      id
      placa
      marca
      modelo
      cor
      crlv
      vCrlv
      chassi
      ano
    }
  }
`;

const GET_LISTA_VEICULOS_PROPRIEDADE = gql`
  query CarrosAgregadoId($id: ID!) {
    carrosAgregadoId(id: $id) {
      id
      placa
      marca
      modelo
      cor
      crlv
      vCrlv
      chassi
      ano
    }
  }
`;

const GET_PROPRIETARIO = gql`
  query RelacaoAgrdFuncId($relacaoAgrdFuncId: ID!) {
    relacaoAgrdFuncId(id: $relacaoAgrdFuncId) {
      id
      motoristaComoAgregado {
        id
        nome
      }
      motoristaComoFuncionario {
        id
        nome
      }
    }
  }
`;

function CardDetalhesVeiculo({ motorista }: { motorista: any }) {
  const [carroSelecionado, setCarroSelecionado] = useState<any>("");
  const [carros, setCarros] = useState<any[]>([]);

  const { data: carroAtrelado } = useQuery(GET_CARRO_ATRELADO, {
    variables: { idMotorista: motorista?.id },
    skip: !motorista?.id,
  });

  const { data: dataCarrosAgregado } = useQuery(
    GET_LISTA_VEICULOS_PROPRIEDADE,
    {
      variables: { id: motorista?.id },
      skip: !motorista?.id || motorista?.tipoMotorista === "Funcionario",
      onCompleted: (data) => {
        setCarros(data?.carrosAgregadoId);
      },
    }
  );

  const { data: dataProprietario } = useQuery(GET_PROPRIETARIO, {
    variables: { relacaoAgrdFuncId: motorista?.id },
    skip: !motorista?.id,
  });

  const proprietarioId = dataProprietario?.relacaoAgrdFuncId?.motoristaComoAgregado?.id;

  const { data: dataCarrosFuncionario } = useQuery(
    GET_LISTA_VEICULOS_PROPRIEDADE,
    {
      variables: { id: proprietarioId },
      skip: !proprietarioId,
    }
  );

  useEffect(() => {
    if (motorista?.tipoMotorista === "Agregado") {
      setCarros(dataCarrosAgregado?.carrosAgregadoId || []);
    }
    if (motorista?.tipoMotorista === "Funcionario") {
      setCarros(dataCarrosFuncionario?.carrosAgregadoId || []);
    }
  }, [dataCarrosAgregado, dataCarrosFuncionario, motorista]);

  const Cor = useTema().Cor;

  useEffect(() => {
    // Verifica se a query do carro atrelado retornou dados
    if (carroAtrelado?.carroMotoristaId) {
      const carrosAtrelados = carroAtrelado.carroMotoristaId;

      // Verifica se a lista de carros atrelados não está vazia
      if (carrosAtrelados.length > 0) {
        // Pega o ID do primeiro carro da lista e define como selecionado
        const idCarroPrincipal = carrosAtrelados[0];
        setCarroSelecionado(idCarroPrincipal);
      }
    }
  }, [carroAtrelado]);

  const normalize = (text: string) => {
    if (!text) return "";
    return text
      .normalize("NFD") // separa acento
      .replace(/[\u0300-\u036f]/g, "") // remove acento
      .toLowerCase()
      .replace(/\s+/g, "_"); // troca espaços por _
  };
  // Monta a URL antes do return
  const imgCarro = `https://iyqleanlhzcnndzuugkg.supabase.co/storage/v1/object/public/neofrotabkt/carros/${normalize(
    carroSelecionado?.marca
  )}/${normalize(carroSelecionado?.modelo)}/${normalize(
    carroSelecionado?.cor
  )}.png`;

  if (carroSelecionado === "") {
    return (
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: Cor.secundaria + 20,
          borderRadius: 22,
          border: "1px solid " + Cor.secundaria + 30,
          padding: 10,
          boxShadow: Cor.sombra,
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: Cor.texto1, fontSize: 16 }}>Sem Carro atrelado</p>
        </div>

        <DropSelectCarro
          carroSelecionado={carroSelecionado}
          setCarroSelecionado={setCarroSelecionado}
          carros={carros}
          motorista={motorista}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: Cor.secundaria + 20,
        borderRadius: 22,
        border: "1px solid " + Cor.secundaria + 30,
        padding: 10,
        boxShadow: Cor.sombra,
        gap: 10,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: Cor.secundaria, fontSize: 14 }}>Detalhes Veiculo</p>
        <div
          style={{ width: "70%", height: 1, backgroundColor: Cor.primaria }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          width: "100%",
        }}
      >
        <img
          src={imgCarro}
          alt=""
          style={{ width: "60%", borderRadius: 22, objectFit: "contain" }}
        />
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Marca</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>
              {carroSelecionado?.marca || "carregando..."}
            </p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Modelo</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>
              {carroSelecionado?.modelo || "carregando..."}
            </p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Ano</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>
              {carroSelecionado?.ano}
            </p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: Cor.secundaria, fontSize: 11 }}>Placa</p>
            <p style={{ color: Cor.texto1, fontSize: 14 }}>
              {carroSelecionado?.placa}
            </p>
            <div
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Cor.texto1 + 50,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <p style={{ color: Cor.secundaria, fontSize: 11 }}>Chassi</p>
          <p style={{ color: Cor.texto1, fontSize: 14 }}>
            {carroSelecionado?.chassi}
          </p>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: Cor.texto1 + 50,
            }}
          />
        </div>
        <div
          style={{
            width: "55%",
            height: 40,
            backgroundColor: carroSelecionado?.vCrlv
              ? Cor.ativo + 20
              : Cor.inativo + 20,
            borderRadius: 22,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Lottie
            animationData={carroSelecionado?.vCrlv ? icativo : icinativo}
            loop={true}
            style={{ width: 25, height: 25 }}
            autoPlay
          />
          <p
            style={{
              color: carroSelecionado?.vCrlv ? Cor.ativo : Cor.inativo,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {carroSelecionado?.vCrlv
              ? "Licenciamento Válido"
              : "Licenciamento Vencido"}
          </p>
        </div>
      </div>

      <DropSelectCarro
        carroSelecionado={carroSelecionado}
        setCarroSelecionado={setCarroSelecionado}
        carros={carros}
        motorista={motorista}
      />
    </div>
  );
}

function DropSelectCarro({
  carroSelecionado,
  setCarroSelecionado,
  carros,
  motorista,
}: any) {
  const ATRELAR_CARRO = gql`
    mutation UpdateCarro($updateCarroId: ID!, $data: CarroInput!) {
      updateCarro(id: $updateCarroId, data: $data) {
        id
      }
    }
  `;
  const [updateCarro] = useMutation(ATRELAR_CARRO);

  const atrelarCarro = async () => {
    try {
      await updateCarro({
        variables: {
          updateCarroId: carroSelecionado.id,
          data: {
            motoristaId: parseInt(motorista.id),
          },
        },
      });
      console.log("Carro atualizado com sucesso!");
      window.location.reload();
    } catch (err) {
      console.error("Erro ao atualizar carro:", err);
    }
  };

  const Cor = useTema().Cor;
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ color: Cor.secundaria, fontSize: 11 }}>Veículo</p>
      <div
        style={{
          width: "75%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: Cor.texto2 + 20,
          borderRadius: 22,
        }}
      >
        <select
          style={{
            width: "85%",
            outline: "none",
            border: "none",
            appearance: "none",
            padding: 10,
            backgroundColor: Cor.texto2 + "00",
            borderRadius: 22,
            color: Cor.texto1,
            fontSize: 16,
          }}
          onChange={(e) => {
            setCarroSelecionado(JSON.parse(e.target.value));
          }}
          value={carroSelecionado}
        >
          <option
            value=""
            style={{ color: Cor.texto1, backgroundColor: Cor.base2 }}
          >
            Selecione um carro
          </option>
          {carros?.map((carro: any) => (
            <option
              value={JSON.stringify(carro)}
              key={carro.id}
              style={{ color: Cor.texto1, backgroundColor: Cor.base2 }}
            >
              {carro.modelo}, {carro.cor}, {carro.placa}
            </option>
          ))}
        </select>
        <div
          style={{
            width: "15%",
            display: "flex",
            alignItems: "center",
            backgroundColor: Cor.secundaria,
            borderRadius: "0px 22px 22px 0px",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => atrelarCarro()}
        >
          <p
            style={{
              fontFamily: "Icone",
              fontSize: 24,
              color: Cor.base2,
              fontWeight: "bold",
            }}
          >
            save
          </p>
        </div>
      </div>

      {motorista?.tipoMotorista === "Agregado" ? <BtnCriarNovoCarro /> : null}
    </div>
  );
}

export default CardDetalhesVeiculo;
