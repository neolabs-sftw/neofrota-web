import styled from "styled-components";
import { useTema } from "../../../../hooks/temaContext";

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

interface LinhaPasageiro {
  $bg: string;
  $cor: string;
}

const LinhaPassageiro = styled.div<LinhaPasageiro>`
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  color: ${({ $cor }) => $cor};
  background-color: ${({ $bg }) => $bg}10;
  border-bottom: 1px solid ${({ $cor }) => $cor}10;

  &:hover {
    background-color: ${({ $cor }) => $cor}20;
  }

  &:active
`;

function LinhaTabelaPassageiro({
  par,
  passageiro,
  setPassageiro,
  setCxVerPassageiro,
}: PassageiroProps & {
  par: boolean;
  setPassageiro: any;
  setCxVerPassageiro: any;
  cxVerPassageiro: boolean;
}) {
  const { Cor } = useTema();
  return (
    <LinhaPassageiro
      $cor={Cor.texto1}
      $bg={par ? Cor.texto1 : Cor.base}
      key={passageiro.id}
      onClick={() => {
        setCxVerPassageiro(true);
        setPassageiro(passageiro);
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "5%",
        }}
      >
        <img
          src={
            passageiro?.fotoPerfilPassageiro ||
            "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
          }
          style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover"}}
        />
      </div>
      <p style={{ width: "10%", textAlign: "center" }}>
        {passageiro.matricula}
      </p>
      <p style={{ width: "25%", textAlign: "left" }}>{passageiro.nome} </p>
      <p style={{ width: "5%", textAlign: "center", fontWeight: 700 }}>
        {passageiro.horarioEmbarque}h
      </p>
      <div style={{ width: "30%", textAlign: "left" }}>
        <p>
          {passageiro.endRua}, {passageiro.endBairro}, {passageiro.endCidade}
        </p>
      </div>
      <p style={{ width: "15%", textAlign: "center" }}>
        {passageiro.centroCustoClienteId.codigo}
      </p>
      <p style={{ width: "10%", textAlign: "center" }}>{passageiro.telefone}</p>
    </LinhaPassageiro>
  );
}

export default LinhaTabelaPassageiro;
