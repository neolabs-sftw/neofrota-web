import { gql, useQuery } from "@apollo/client";

const GET_LIST_PASSAGEIROS_BY_EMPRESA_CLIENTE = gql`
  query PassageirosByEmpresaCliente($empresaClienteId: ID!) {
    passageirosByEmpresaCliente(empresaClienteId: $empresaClienteId) {
      id
      nome
      matricula
      telefone
      email
      ativo
      fotoPerfilPassageiro
      endRua
      endNumero
      endBairro
      endCidade
      pontoApanha
      horarioEmbarque
      centroCustoClienteId {
        id
        nome
      }
      empresaClienteId {
        id
        nome
      }
    }
  }
`;

interface Passageiro {
  id: string;
  nome: string;
  matricula: string;
  telefone: string;
  email: string;
  ativo: boolean;
  fotoPerfilPassageiro: string;
  endRua: string;
  endNumero: string;
  endBairro: string;
  endCidade: string;
  pontoApanha: string;
  horarioEmbarque: string;
  centroCustoClienteId: {
    id: string;
    nome: string;
  };
  empresaClienteId: {
    id: string;
    nome: string;
  };
}

interface UsePassageirosResult {
  passageirosByEmpresaCliente: Passageiro[] | undefined;
  loading: boolean;
  error: any;
  refetch: () => Promise<any>;
}

export function usePassageiros(empresaClienteId: string) {
  const { data, loading, error, refetch } = useQuery<UsePassageirosResult>(
    GET_LIST_PASSAGEIROS_BY_EMPRESA_CLIENTE,
    {
      variables: { empresaClienteId },
    }
  );
  return {
    listaPassageiro: data?.passageirosByEmpresaCliente,
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}
