import { gql, useQuery } from "@apollo/client";

const GET_MOTORISTAS = gql`
  query MotoristasOperadora(
    $motoristasOperadoraId: ID!
    $orderBy: MotoristaOrderByInput
  ) {
    motoristasOperadora(id: $motoristasOperadoraId, orderBy: $orderBy) {
      id
      nome
      email
      senha
      fotoMotorista
      cpf
      cnh
      vCnh
      statusMotorista
      tipoMotorista
      dataCriacao
      statusCnh
    }
  }
`;

export function useMotorista(motoristasOperadoraId: any) {
  const { data, loading, error, refetch } = useQuery(GET_MOTORISTAS, {
    variables: {
      motoristasOperadoraId,
      orderBy: {
        direction: "asc",
        field: "nome",
      },
    },
    fetchPolicy: "cache-and-network",
  });
  return {
    listaMotoristas: data?.motoristasOperadora,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}
