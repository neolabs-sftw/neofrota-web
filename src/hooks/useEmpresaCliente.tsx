import { gql, useQuery } from "@apollo/client";

const GET_EMPRESA_CLIENTE = gql`
  query EmpresaClienteId($empresaClienteId: ID!) {
    empresaClienteId(id: $empresaClienteId) {
      id
      nome
      rSocial
      cnpj
      fotoLogoCliente
      operadoraId {
        id
        nome
      }
      statusCliente
    }
  }
`;


export function useEmpresaCliente(empresaClienteId: string) {
  const { data, loading, error, refetch } = useQuery(GET_EMPRESA_CLIENTE, {
    variables: { empresaClienteId },
  });
  return {
    empresaCliente: data?.empresaClienteId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}


const GET_LISTA_EMPRESA_CLIENTES = gql`
  query EmpresaClienteOper($operadoraId: String) {
    empresaClienteOper(operadoraId: $operadoraId) {
      id
      nome
      rSocial
      cnpj
      fotoLogoCliente
      operadoraId {
        id
      }
      statusCliente
    }
  }
`;

export function useListaClientes(operadoraId: string) {
  const { data, loading, error, refetch } = useQuery(
    GET_LISTA_EMPRESA_CLIENTES,
    {
      variables: { operadoraId },
    }
  );
  return {
    listaClientes: data?.empresaClienteOper,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}


