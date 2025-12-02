import { gql, useQuery } from "@apollo/client";

const GET_ROTAS_EMPRESA_ID = gql`
  query RotaEmpresaClienteId($rotaEmpresaClienteId: ID!) {
    rotaEmpresaClienteId(id: $rotaEmpresaClienteId) {
      id
      origem
      destino
      rotaValor {
        id
        categoria
      }
    }
  }
`;

export function useRotasExtas(rotaEmpresaClienteId: any) {
  const { data, loading, error, refetch } = useQuery(GET_ROTAS_EMPRESA_ID, {
    variables: { rotaEmpresaClienteId },
    fetchPolicy: "cache-and-network",
  });
  return {
    listaRotasExtras: data?.rotaEmpresaClienteId,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}

const GET_ROTA_ID = gql`
  query Rota($rotaId: ID!) {
    rota(id: $rotaId) {
      id
      origem
      destino
      rotaValor {
        id
        categoria
      }
    }
  }
`;

// const GET_ROTA_ID_VALORES = gql`
//   query Rota($rotaId: ID!) {
//     rota(id: $rotaId) {
//       id
//       origem
//       destino
//       rotaValor {
//         id
//         rotaId {
//           id
//           origem
//           destino
//         }
//         categoria
//         empresaClienteId {
//           id
//         }
//         operadoraId {
//           id
//         }
//         valorViagem
//         valorViagemRepasse
//         valorHoraParada
//         valorHoraParadaRepasse
//         valorDeslocamento
//         valorDeslocamentoRepasse
//         valorPedagio {
//           id
//           nome
//           valor
//         }
//       }
//     }
//   }
// `;

export function useRotaId(rotaId: any) {
  const { data, loading, error, refetch } = useQuery(GET_ROTA_ID, {
    variables: { rotaId },
    fetchPolicy: "cache-and-network",
  });
  return {
    rota: data?.rota,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}
