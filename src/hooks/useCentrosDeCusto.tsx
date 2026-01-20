import { gql, useQuery } from "@apollo/client";

const GET_CENTROS_CUSTO_BY_EMPRESA = gql`
  query CentroCustoEmpresaClienteId($centroCustoEmpresaClienteId: ID!) {
    centroCustoEmpresaClienteId(id: $centroCustoEmpresaClienteId) {
      id
      nome
      codigo
    }
  }
`;

export function useCentroCustoByEmpresa(id: string) {
  const { data, loading, error } = useQuery(GET_CENTROS_CUSTO_BY_EMPRESA, {
    variables: {
      centroCustoEmpresaClienteId: id,
    },
  });

  return {
    listaCentrosCustos: data?.centroCustoEmpresaClienteId || [],
    loading,
    error,
  };
}
