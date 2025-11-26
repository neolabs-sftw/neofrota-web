import styled from "styled-components";
import { useTema } from "../hooks/temaContext";
import { usePassageiros } from "../hooks/usePassageiros";
import { useParams } from "react-router-dom";
import { useEmpresaCliente } from "../hooks/useEmpresaCliente";
import VerPassageiro from "../telas/subtelas/empresaCliente/btnComponentes/verPassageiro";

function ListaPassageiros() {
  const Cor = useTema().Cor;

  const clienteId = useParams().clienteId;

  const empresaCliente = useEmpresaCliente(clienteId!).empresaCliente;

  const logo = empresaCliente?.fotoLogoCliente;
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: Cor.base2,
        borderRadius: 22,
        boxShadow: Cor.sombra,
        padding: 15,
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid" + Cor.texto2 + 50,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <img
            src={logo}
            alt="Logo Empresa"
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              objectFit: "cover",
              boxShadow: Cor.sombra,
            }}
          />
          <div>
            <p style={{ fontWeight: "500", color: Cor.primaria }}>
              Lista de Passageiros
            </p>
            <p style={{ fontSize: 12, color: Cor.secundaria }}>
              Lista de passageiros cadastrados na empresa{" "}
              <strong style={{ fontSize: 16 }}>
                {empresaCliente?.nome}
              </strong>
              .
            </p>
          </div>
        </div>
      </div>
      <TabelaPassageiros />
    </div>
  );
}

export default ListaPassageiros;

interface TabelaPassageirosProps {
  $texto1: string;
  $texto2: string;
  $base: string;
}

const TabelaPassageirosStyled = styled.table<TabelaPassageirosProps>`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 5px;
    color: ${({ $texto1 }) => $texto1};
    font-size: 12px;
    background-color: ${({ $texto2 }) => $texto2 + 80};
  }
  td {
    text-align: left;
    padding: 5px;
    color: ${({ $texto1 }) => $texto1};
  }
  tr:nth-child(even) {
    background-color: ${({ $base }) => $base};
  }
  tr:hover {
    background-color: ${({ $texto1 }) => $texto1 + 15};
  }
`;

function TabelaPassageiros() {
  const Cor = useTema().Cor;
  const clienteId = useParams().clienteId;
  const { listaPassageiro } = usePassageiros(clienteId!);
  console.log(listaPassageiro);
  return (
    <TabelaPassageirosStyled
      $texto1={Cor.texto1}
      $texto2={Cor.texto2}
      $base={Cor.base}
    >
      <thead>
        <tr>
          <th style={{ width: "5%", textAlign: "center" }}>Foto</th>
          <th style={{ width: "10%", textAlign: "center" }}>Matrícula</th>
          <th style={{ width: "25%", textAlign: "center" }}>Nome</th>
          <th style={{ width: "5%", textAlign: "center" }}>Horário</th>
          <th style={{ width: "30%", textAlign: "center" }}>Endereço</th>
          <th style={{ width: "15%", textAlign: "center" }}>Centro Custo</th>
          <th style={{ width: "10%", textAlign: "center" }}>Telefone</th>
        </tr>
      </thead>
      <tbody>
        {listaPassageiro?.slice(60).map((passageiro: any) => (
          <VerPassageiro passageiro={passageiro} key={passageiro.id}/>
        ))}
      </tbody>
    </TabelaPassageirosStyled>
  );
}
