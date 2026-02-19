import { gql, useMutation, useQuery } from "@apollo/client";

const GET_RELACAO_BY_FUNC = gql`
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

export function useListaRelacaoByFunc(relacaoAgrdFuncId: string) {
  const { data, loading, error, refetch } = useQuery(GET_RELACAO_BY_FUNC, {
    variables: {
      relacaoAgrdFuncId,
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    listaRelacao: data?.relacaoAgrdFuncId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}

const GET_RELACAO_BY_AGRD = gql`
  query ListaFuncionariosAgregadoId($listaFuncionariosAgregadoId: ID!) {
    listaFuncionariosAgregadoId(id: $listaFuncionariosAgregadoId) {
      id
      motoristaComoFuncionario {
        id
        nome
        statusCnh
        email
      }
    }
  }
`;

export function useListaRelacaoByAgrd(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_RELACAO_BY_AGRD, {
    variables: {
      listaFuncionariosAgregadoId: id,
    },
  });
  return {
    listaRelacaoFunc: data?.listaFuncionariosAgregadoId || [],
    loading,
    error,
    refetch: refetch || Promise.resolve()
  };
}

const DELETE_RELACAO = gql`
  mutation DeleteRelacaoAgrdFunc($deleteRelacaoAgrdFuncId: ID!) {
    deleteRelacaoAgrdFunc(id: $deleteRelacaoAgrdFuncId) {
      id
    }
  }
`;

export function useDeleteRelacao() {
  const [deletar, { loading, error }] = useMutation(DELETE_RELACAO);

  const deletarRelacao = (id: string) => {
    return deletar({
      variables: {
        deleteRelacaoAgrdFuncId: id,
      },
    });
  };

  return { deletarRelacao, loading, error };
}
