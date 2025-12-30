export function validarVoucher({
  empresaCliente,
  unidadeEmpresaCliente,
  solicitante,
  rotaExtra,
  rotaValor,
  tipo,
  motorista,
}: //   passageirosVoucher,
{
  empresaCliente: any;
  unidadeEmpresaCliente: any;
  solicitante: any;
  rotaExtra: any;
  rotaValor: any;
  tipo: string;
  motorista: any;
  //   passageirosVoucher: any[];
}) {
  // Validações básicas (campos obrigatórios)
  if (!empresaCliente) return { ok: false, erro: "Selecione a empresa." };
  if (!unidadeEmpresaCliente)
    return { ok: false, erro: "Selecione a unidade." };
  if (!solicitante)
    return { ok: false, erro: "Selecione quem é o solicitante." };
  if (!rotaExtra) return { ok: false, erro: "Selecione a rota." };
  if (!rotaValor) return { ok: false, erro: "Defina o valor da rota." };
  if (!tipo || tipo === "")
    return { ok: false, erro: "Escolha o tipo de viagem." };
  if (!motorista) return { ok: false, erro: "Selecione o motorista." };

  // Garante que temos a categoria do veículo
  if (!rotaValor) {
    return { ok: false, erro: "Categoria do veículo não informada." };
  }

  // Tudo dentro das regras
  return { ok: true, erro: null };
}
