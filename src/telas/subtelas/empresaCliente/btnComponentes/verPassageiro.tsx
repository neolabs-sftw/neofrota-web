interface PassageiroProps {
  passageiro: {
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
      codigo: string;
    };
    empresaClienteId: {
      id: string;
      nome: string;
    };
  };
}

function LinhaTabelaPassageiro({
  passageiro,
  setPassageiro,
  setCxVerPassageiro,
}: PassageiroProps & {
  setPassageiro: any;
  setCxVerPassageiro: any;
  cxVerPassageiro: boolean;
}) {
  return (
    <>
      <tr
        key={passageiro.id}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setCxVerPassageiro(true);
          setPassageiro(passageiro);
        }}
      >
        <td style={{ textAlign: "center" }}>
          <img
            src={
              passageiro?.fotoPerfilPassageiro ||
              "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
            }
            style={{ width: 35, height: 35, borderRadius: 10 }}
          />
        </td>
        <td>{passageiro.matricula}</td>
        <td>{passageiro.nome}</td>
        <td>{passageiro.horarioEmbarque}h</td>
        <td>
          <p>
            {passageiro.endRua}, {passageiro.endBairro}, {passageiro.endCidade}
          </p>
        </td>
        <td style={{ textAlign: "center" }}>
          {passageiro.centroCustoClienteId.codigo}
        </td>
        <td>{passageiro.telefone}</td>
      </tr>
    </>
  );
}

export default LinhaTabelaPassageiro;
