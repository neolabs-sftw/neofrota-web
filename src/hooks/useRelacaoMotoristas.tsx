import { gql, useQuery } from "@apollo/client";

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

export function useListaRelacao(relacaoAgrdFuncId: string) {
  const { data, loading, error, refetch} = useQuery(GET_PROPRIETARIO, {
    variables:{
        relacaoAgrdFuncId
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    listaRelacao: data?.relacaoAgrdFuncId,
    loading,
    error,
    refetch : refetch || Promise.resolve()
  };
}