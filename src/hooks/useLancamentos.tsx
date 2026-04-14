import { gql, useMutation, useQuery } from "@apollo/client";

const GET_LANCAMENTOS_OPERADORA = gql`
  query Lancamentos($filter: filtroLancamento) {
    lancamentos(filter: $filter) {
      id
      descricao
      valor
      tipo
      dataHora
      motorista {
        nome
      }
      adminUsuario {
        nome
      }
      operadora {
        nome
      }
    }
  }
`;

interface filtroLancamento {
  tipo?: string;
  dataInicial?: string;
  dataFinal?: string;
  motoristaId?: string;
  adminUsuarioId?: string;
  operadoraId?: string;
}

export function useLancamentosOperadora(filter: filtroLancamento) {
  const { data, loading, error, refetch } = useQuery(
    GET_LANCAMENTOS_OPERADORA,
    {
      variables: {
        filter: filter,
      },
      fetchPolicy: "cache-and-network",
      skip: !filter?.operadoraId,
    },
  );
  return {
    lancamentos: data ? data.lancamentos : [],
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}

const CREATE_LANCAMENTO = gql`
  mutation CriarLancamentoMotorista($input: LancamentoMotoristaInput!) {
    criarLancamentoMotorista(input: $input) {
      id
    }
  }
`;

interface criarLancamentoMotoristaProps {
  descricao: string;
  valor: number;
  tipo: string;
  dataHora: string;
  motoristaId: string;
  adminUsuarioId: string;
  operadoraId: string;
}

export function useCreateLancamentoMotorista() {
  const [criar, { data, loading, error }] = useMutation(CREATE_LANCAMENTO);

  const criarLancamento = (input: criarLancamentoMotoristaProps) => {
    return criar({
      variables: {
        input,
      },
    });
  };

  return {
    criarLancamento,
    data,
    loading,
    error,
  };
}
