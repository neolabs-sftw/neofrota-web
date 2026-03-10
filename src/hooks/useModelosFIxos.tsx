import { gql, useQuery } from "@apollo/client";

const GET_MODELOS_FIXOS = gql`
  query ModelosVoucherFixo($operadoraId: ID!) {
    modelosVoucherFixo(operadoraId: $operadoraId) {
      id
      nomeModelo
      ativo
      empresaCliente {
        nome
        id
        fotoLogoCliente
        statusCliente
      }
      unidadeCliente {
        id
        nome
        statusUnidadeCliente
        endUf
        endRua
        endNumero
        endComplemento
        endCidade
        endCep
        endBairro
      }
      pedagio {
        id
        valor
        nome
      }
      valorDeslocamento
      valorDeslocamentoRepasse
      valorHoraParada
      valorHoraParadaRepasse
      valorPedagio
      valorViagem
      valorViagemRepasse
      configuracoes {
        id
        tipo
        destino
        origem
        horario
        domingo
        segunda
        terca
        quarta
        quinta
        sexta
        sabado
        motorista {
          id
          nome
          fotoMotorista
        }
        carro {
          cor
          marca
          modelo
          placa
        }
      }
    }
  }
`;

export function useModelosFixos(operadoraId: string) {
  const { data, loading, error, refetch } = useQuery(GET_MODELOS_FIXOS, {
    variables: { operadoraId: operadoraId },
    fetchPolicy: "cache-and-network",
    skip: !operadoraId,
    notifyOnNetworkStatusChange: true,
  });

  return {
    listaModelos: data?.modelosVoucherFixo ?? [],
    loading,
    error,
    refetch,
  };
}
