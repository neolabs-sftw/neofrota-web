import { gql, useQuery } from "@apollo/client";

const GET_CARRO = gql`
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
      agregadoId {
        id
      }
      motoristaId {
        id
      }
      operadoraId {
        id
      }
    }
  }
`;

interface Carro {
  id: string;
  agregadoId: string;
  ano: string;
  chassi: string;
  cor: string;
  marca: string;
  modelo: string;
  placa: string;
  motoristaId: string;
  operadoraId: string;
}

interface CarroResponse {
  carroMotoristaId: Carro[];
}

export function useCarros(idMotorista: string) {
  const { data, loading, error, refetch } = useQuery<CarroResponse>(
    GET_CARRO,
    {
      variables: {
        idMotorista,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  return {
    listaCarros: data?.carroMotoristaId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}

// const GET_LISTA_CARROS = gql`

// `;
