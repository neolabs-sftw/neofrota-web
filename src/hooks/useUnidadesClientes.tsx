import { gql, useQuery } from "@apollo/client";

const GET_UNIDADE_CLIENTE = gql`
  query ListaUnidadesEmpresaClienteId($listaUnidadesEmpresaClienteId: ID!) {
    listaUnidadesEmpresaClienteId(id: $listaUnidadesEmpresaClienteId) {
      id
      nome
      cnpj
      endRua
      endNumero
      endBairro
      endCep
      endCidade
      endComplemento
      endUf
      statusUnidadeCliente
      matriz
      empresaClienteId {
        id
      }
      operadoraId {
        id
      }
    }
  }
`;

export function useUnidadeCliente(listaUnidadesEmpresaClienteId: any) {
  const { data, loading, error, refetch } = useQuery(GET_UNIDADE_CLIENTE, {
    variables: { listaUnidadesEmpresaClienteId },
    fetchPolicy: "cache-and-network",
  });
  return {
    listaUnidades: data?.listaUnidadesEmpresaClienteId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}

const GET_UNIDADE_CLIENTE_ID = gql`
  query UnidadeEmpresaClienteId($unidadeEmpresaClienteId: ID!) {
    unidadeEmpresaClienteId(id: $unidadeEmpresaClienteId) {
      id
      nome
      cnpj
      endRua
      endNumero
      endBairro
      endCep
      endCidade
      endComplemento
      endUf
      statusUnidadeCliente
      matriz
    }
  }
`;

export function useUnidadeId(unidadeEmpresaClienteId: string) {
  const { data, loading, error } = useQuery(GET_UNIDADE_CLIENTE_ID, {
    variables: {
      unidadeEmpresaClienteId,
    },
  });
  return {
    unidade: data?.unidadeEmpresaClienteId || "",
    loading,
    error,
  };
}
