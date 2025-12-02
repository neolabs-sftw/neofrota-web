import { gql, useQuery } from "@apollo/client";

const GET_SOLICITANTES_EMPRESA_ID = gql`
  query SolicitantesEmpresaClienteId($solicitantesEmpresaClienteId: ID!) {
    solicitantesEmpresaClienteId(id: $solicitantesEmpresaClienteId) {
      id
      nome
      email
      senha
      funcao
      telefone
      operadoraId {
        id
      }
      statusSolicitante
      empresaClienteId {
        id
      }
      fotoUrlSolicitante
    }
  }
`;

export function useSolicitante(solicitantesEmpresaClienteId: any) {
  const { data, loading, error, refetch } = useQuery(
    GET_SOLICITANTES_EMPRESA_ID,
    {
      variables: { solicitantesEmpresaClienteId },
      fetchPolicy: "cache-and-network" 
    }
  );
  return {
    solicitantes: data?.solicitantesEmpresaClienteId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}
