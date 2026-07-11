import React from "react";
import { useTema } from "../hooks/temaContext";

export default function PoliticaPrivacidadeMotorista() {
  const { Cor } = useTema();
  return (
    <>
      <div style={{ backgroundColor: Cor.primaria, padding: 100 }}>
        <p style={styles.date}>NeoFrota</p>
        <h1 style={styles.title}>Política de Privacidade</h1>
        <p style={styles.date}>Última atualização: 07 de Julho de 2026</p>
      </div>
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={styles.paragraph}>
            A sua privacidade é importante para nós. Esta Política de
            Privacidade explica como o aplicativo{" "}
            <strong>NeoFrota Motorista</strong> ("nós", "nosso") processa,
            utiliza, compartilha e protege as informações dos utilizadores
            motoristas ("você", "seu") ao utilizar o nosso aplicativo e serviços
            associados.
          </p>

          {/* SEÇÃO 1 */}
          <h2 style={styles.heading}>1. Informações que Coletamos</h2>
          <p style={styles.paragraph}>
            Para que o aplicativo funcione corretamente e permita a gestão do
            serviço, recolhemos e processamos as seguintes informações:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Dados de Registo e Acesso:</strong> O aplicativo não
              permite a criação de contas de forma autônoma pelo utilizador. O
              seu registo profissional (contendo nome, CPF, CNH e dados do
              veículo) é realizado previamente junto da administração da frota.
              O aplicativo recolhe apenas as suas credenciais de acesso (login e
              senha), fornecidas pela operadora, para autenticar a sua entrada
              no sistema e vincular as atividades à sua identidade.
            </li>
            <li style={styles.listItem}>
              <strong>Dados de Transações, Vouchers e Assinaturas:</strong>{" "}
              Registamos informações referentes aos serviços realizados, como
              datas, horários e o uso de vouchers digitais ou saldos associados
              à frota. Além disso,{" "}
              <strong>
                recolhemos a sua assinatura na tela do dispositivo
              </strong>{" "}
              no momento da finalização do atendimento, que é armazenada como
              comprovante de validação da operação.
            </li>
            <li style={styles.listItem}>
              <strong>Dados do Dispositivo:</strong> Recolhemos informações
              técnicas sobre o aparelho utilizado, como modelo, sistema
              operativo, endereço IP e registos de erros. Estes dados são
              utilizados exclusivamente para fins de diagnóstico de falhas,
              melhoria contínua e garantia da estabilidade do sistema.
            </li>
            <li style={styles.listItem}>
              <strong>Localização:</strong> Este aplicativo <strong>não</strong>{" "}
              recolhe, rastreia ou armazena dados de localização (GPS) do seu
              dispositivo, seja em primeiro ou em segundo plano.
            </li>
          </ul>

          {/* SEÇÃO 2 */}
          <h2 style={styles.heading}>2. Como Usamos as Suas Informações</h2>
          <p style={styles.paragraph}>
            As informações recolhidas são utilizadas exclusivamente para os
            seguintes fins operacionais:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Validação de Serviços:</strong> Processar e validar o uso
              de vouchers digitais e armazenar a sua assinatura digital como
              comprovação do serviço prestado.
            </li>
            <li style={styles.listItem}>
              <strong>Gestão de Frotas:</strong> Fornecer à
              administração/operadora os relatórios de serviços realizados,
              horários e histórico de transações vinculadas ao seu perfil.
            </li>
            <li style={styles.listItem}>
              <strong>Melhoria e Suporte:</strong> Monitorizar a estabilidade do
              aplicativo, diagnosticar possíveis falhas técnicas e fornecer
              suporte adequado em caso de erros no sistema.
            </li>
            <li style={styles.listItem}>
              <strong>Conformidade Legal:</strong> Cumprir obrigações legais,
              regulatórias e fiscais vigentes aplicáveis à prestação do serviço
              de transporte e gestão.
            </li>
          </ul>

          {/* SEÇÃO 3 */}
          <h2 style={styles.heading}>3. Partilha de Dados</h2>
          <p style={styles.paragraph}>
            Nós não vendemos ou comercializamos os seus dados. A partilha ocorre
            de forma restrita e apenas nas seguintes situações:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Com a Operadora/Gestão da Frota:</strong> Todos os dados
              de transações, vouchers validados e assinaturas recolhidas são
              sincronizados com o painel administrativo da operadora que gere o
              seu registo para fins de faturação e auditoria.
            </li>
            <li style={styles.listItem}>
              <strong>Provedores de Nuvem e Infraestrutura:</strong> Os dados
              são armazenados de forma segura em servidores e serviços de banco
              de dados de terceiros, que atuam em nosso nome e estão sujeitos a
              rigorosas obrigações de confidencialidade e segurança (LGPD).
            </li>
            <li style={styles.listItem}>
              <strong>Ordem Legal:</strong> Podemos partilhar informações
              mediante exigência legal, ordem judicial ou solicitação de
              autoridades competentes.
            </li>
          </ul>

          {/* SEÇÃO 4 */}
          <h2 style={styles.heading}>
            4. Permissões Solicitadas no Dispositivo
          </h2>
          <p style={styles.paragraph}>
            Como o aplicativo não rastreia localização, as permissões
            solicitadas são mínimas para garantir a privacidade:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Acesso à Internet/Rede:</strong> Necessário para
              sincronizar as validações de vouchers, assinaturas e dados de
              login com os nossos servidores em tempo real.
            </li>
          </ul>

          {/* SEÇÃO 5 */}
          <h2 style={styles.heading}>5. Seus Direitos e Retenção de Dados</h2>
          <p style={styles.paragraph}>
            Você possui direitos sobre os seus dados conforme a Lei Geral de
            Proteção de Dados (LGPD):
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Exclusão e Inativação:</strong> Como o seu registo é
              gerido pela operadora, você pode solicitar a inativação do seu
              acesso e a exclusão dos seus dados pessoais vinculados ao app.
              Essa solicitação pode ser feita através do menu do aplicativo ou
              diretamente junto ao escritório.
            </li>
            <li style={styles.listItem}>
              <strong>Retenção:</strong> Após a inativação, alguns dados
              referentes aos serviços prestados (como vouchers validados e
              assinaturas) poderão ser retidos de forma anonimizada ou bloqueada
              pelo prazo legal necessário para auditorias fiscais e prestação de
              contas da operadora.
            </li>
          </ul>

          {/* SEÇÃO 6 */}
          <h2 style={styles.heading}>6. Contactos</h2>
          <p style={styles.paragraph}>
            Para dúvidas sobre o tratamento dos seus dados ou sobre esta
            Política de Privacidade, entre em contacto:
          </p>
          <div style={styles.contactBox}>
            <p style={{ margin: "4px 0" }}>
              <strong>E-mail: </strong> falecom@neofrota.com
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Telefone/WhatsApp: </strong> (71) 9.9211-1240
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Estilos embutidos para facilitar o copy-paste
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  content: {
    maxWidth: "800px",
    width: "100%",
    color: "#333333",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "8px",
    marginTop: "0",
  },
  date: {
    fontSize: "14px",
    color: "#777777",
    marginTop: "50px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: "40px",
    marginBottom: "16px",
    borderLeft: "4px solid #3182ce",
    paddingLeft: "12px",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "16px",
    textAlign: "justify",
    color: "#777777"
  },
  list: {
    marginTop: "8px",
    marginBottom: "24px",
    paddingLeft: "24px",
    color: "#777777"
  },
  listItem: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "12px",
    textAlign: "justify",
  },
  contactBox: {
    backgroundColor: "#f7fafc",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginTop: "16px",
  },
};
