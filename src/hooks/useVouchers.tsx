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
  query Vouchers {
    vouchers {
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
        rSocial
        fotoLogoCliente
        cnpj
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
      }
      motorista {
        id
        nome
        fotoMotorista
        vCnh
      }
      carro {
        cor
        marca
        modelo
        id
        placa
      }
      adminUsuario {
        id
        nome
      }
      solicitante {
        id
        nome
        funcao
        fotoUrlSolicitante
      }
      operadora {
        id
        nome
      }

      rota {
        tributacao
      }
      passageiros {
        id
        statusPresenca
        horarioEmbarqueReal
        rateio
        passageiroId {
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
            codigo
            nome
            id
          }
        }
      }
    }
  }
`;

export function useVouchers() {
  const { data, loading, error, refetch } = useQuery(GET_VOUCHERS, {
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
