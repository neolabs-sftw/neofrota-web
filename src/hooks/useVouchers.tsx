import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_VOUCHER = gql`
  mutation CriarVoucher($input: VoucherCreateInput!) {
    criarVoucher(input: $input) {
      id
    }
  }
`;

interface CreateVoucherInput {
  origem: string;
  destino: string;
  dataHoraProgramado: string;
  dataHoraConclusao: string;
  dataHoraCriacao: string;

  qntTempoParado: string;
  assinatura: string;
  observacaoMotorista: string;
  observacao: string;

  valorViagem: number;
  valorViagemRepasse: number;
  valorDeslocamento: number;
  valorDeslocamentoRepasse: number;
  valorHoraParada: number;
  valorHoraParadaRepasse: number;
  valorPedagio: number;
  valorEstacionamento: number;

  natureza: string;
  tipoCorrida: string;
  status: string;

  empresaClienteId: string;
  unidadeClienteId: string;
  motoristaId: string;
  carroId: string;
  adminUsuarioId: string;
  solicitanteId: string;
  operadoraId: string;

  modeloFixoId: string;
  modeloTurnoId: string;
  rotaId: string;

  passageiros: string[];
}

export function useCreateVoucher() {
  const [createVoucher, { data, loading, error }] = useMutation(CREATE_VOUCHER);

  const lancar = (input: CreateVoucherInput) => {
    return createVoucher({
      variables: { input },
    });
  };

  return {
    lancar,
    data,
    loading,
    error,
  };
}

const GET_VOUCHERS = gql`
  query Vouchers(
    $operadiraId: ID
    $filter: VoucherFilterInput
    $offset: Int
    $limit: Int
  ) {
    vouchers(
      operadiraId: $operadiraId
      filter: $filter
      offset: $offset
      limit: $limit
    ) {
      id
      origem
      destino
      dataHoraProgramado
      dataHoraConclusao
      dataHoraCriacao
      qntTempoParado
      assinatura
      observacaoMotorista
      observacao
      valorViagem
      valorViagemRepasse
      valorDeslocamento
      valorDeslocamentoRepasse
      valorHoraParada
      valorHoraParadaRepasse
      valorPedagio
      valorEstacionamento
      natureza
      tipoCorrida
      status
      empresaCliente {
        id
        nome
        fotoLogoCliente
        rSocial
        statusCliente
      }
      unidadeCliente {
        id
        nome
        endBairro
        endCep
        endCidade
        endComplemento
        endNumero
        endRua
        endUf
        statusUnidadeCliente
        cnpj
      }
      motorista {
        id
        nome
        fotoMotorista
        vCnh
        statusMotorista
        statusCnh
      }
      carro {
        id
        marca
        modelo
        cor
        placa
        ano
      }
      adminUsuario {
        id
        nome
        funcao
        fotoAdminOperadora
      }
      solicitante {
        id
        nome
        funcao
        fotoUrlSolicitante
      }

      operadora {
        id
      }
      passageiros {
        id
        statusPresenca
        horarioEmbarqueReal
        rateio
        passageiroId {
          ativo
          email
          endBairro
          endCidade
          endNumero
          endRua
          fotoPerfilPassageiro
          horarioEmbarque
          matricula
          id
        }
      }
    }
  }
`;

interface UseVouchersParams {
  operadiraId?: string; // Troque para 'number' se o seu ID for numérico
  offset?: number;
  limit?: number;
  motoristaId?: string;
  natureza?: string;
  status?: string;
}

export function useVouchers({
  operadiraId,
  offset,
  limit,
  motoristaId,
  natureza,
  status,
}: UseVouchersParams) {
  const { data, loading, error, refetch } = useQuery(GET_VOUCHERS, {
    variables: {
      operadiraId,
      offset,
      filter: {
        motoristaId,
        natureza,
        status,
      },
      limit,
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    listaVouchers: data ? data.vouchers : [],
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}

const GET_VOUCHERS_DATA = gql`
  query VoucherOperadoraData($operadoraId: ID!, $diaSelecionado: String!) {
    voucherOperadoraData(
      operadoraId: $operadoraId
      diaSelecionado: $diaSelecionado
    ) {
      id
      origem
      destino
      dataHoraProgramado
      dataHoraConclusao
      dataHoraCriacao
      qntTempoParado
      assinatura
      observacaoMotorista
      observacao
      valorViagem
      valorViagemRepasse
      valorDeslocamento
      valorDeslocamentoRepasse
      valorHoraParada
      valorHoraParadaRepasse
      valorPedagio
      valorEstacionamento
      natureza
      tipoCorrida
      status
      empresaCliente {
        id
        nome
        fotoLogoCliente
        rSocial
        statusCliente
      }
      unidadeCliente {
        endBairro
        endCep
        endCidade
        endComplemento
        endNumero
        endRua
        endUf
        id
        statusUnidadeCliente
        cnpj
        nome
      }
      motorista {
        id
        cnh
        cpf
        nome
        fotoMotorista
        email
        statusCnh
        statusMotorista
        tipoMotorista
        vCnh
      }

      carro {
        id
        placa
        marca
        modelo
        cor
        crlv
        vCrlv
        chassi
        ano
      }
      adminUsuario {
        id
        nome
      }
      solicitante {
        funcao
        fotoUrlSolicitante
        nome
        telefone
      }
      passageiros {
        horarioEmbarqueReal
        id
        rateio
        statusPresenca
        passageiroId {
          ativo
          email
          endBairro
          endCidade
          endNumero
          endRua
          fotoPerfilPassageiro
          horarioEmbarque
          id
          matricula
          nome
          pontoApanha
          telefone
          centroCustoClienteId {
            id
            nome
            codigo
          }
        }
      }
    }
  }
`;

export function useVouchersData(operadoraId: any, diaSelecionado: string) {
  const { data, loading, error, refetch } = useQuery<any>(GET_VOUCHERS_DATA, {
    variables: {
      operadoraId,
      diaSelecionado,
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    listaVoucherData: data ? data.voucherOperadoraData : [],
    loading,
    error,
    refetch: refetch || Promise.resolve(),
  };
}
