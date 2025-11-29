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
  });
  return {
    data: data?.listaUnidadesEmpresaClienteId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}
