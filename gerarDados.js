import { randomUUID } from "crypto"; // Node.js 18+ ou substitua por outra lib
// Se estiver no browser, use crypto.randomUUID()

const empresas = [
  "Alpha Logística",
  "Beta Transportes",
  "Gamma Construções",
  "Delta Atacado",
  "Epsilon Serviços",
  "Zeta Exportações",
  "Omega Indústria",
  "Sigma Distribuidora",
  "Kappa Alimentos",
  "Lambda Tecnologia",
];

const motoristas = [
  "Carlos Almeida",
  "João Pereira",
  "Marcos Santos",
  "Eduardo Lima",
  "André Souza",
  "Rafael Costa",
  "Bruno Martins",
  "Fábio Oliveira",
  "Paulo Ribeiro",
  "Roberto Fernandes",
];

const cidadesRMS = [
  "Simões Filho",
  "Camaçari",
  "Lauro de Freitas",
  "Dias d'Ávila",
  "Mata de São João",
  "São Sebastião do Passé",
  "Candeias",
  "Salvador",
  "Itaparica",
  "Vera Cruz",
];

const FÁBRICA = "Fábrica Central";

function dataAleatoria() {
  const inicio = new Date(2025, 0, 1).getTime(); // 1 Jan 2025
  const fim = Date.now();
  return new Date(inicio + Math.random() * (fim - inicio));
}

function horaAleatoria() {
  const h = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const m = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${h}:${m}`;
}

const dados = Array.from({ length: 50 }, () => {
  const aleatorio = Math.floor(Math.random() * 10) + 1;
  const aleatorio2 = Math.floor(Math.random() * 10) + 1;
  const tipo = aleatorio > 5 ? "entrada" : "saída";
  const natureza = aleatorio2 > 5 ? "fixo" : "extra";
  const data = dataAleatoria();

  return {
    natureza,
    tipo,
    cliente: empresas[Math.floor(Math.random() * empresas.length)],
    motorista: motoristas[Math.floor(Math.random() * motoristas.length)],
    origem:
      tipo === "saída"
        ? "Fábrica"
        : cidadesRMS[Math.floor(Math.random() * cidadesRMS.length)],
    destino:
      tipo === "entrada"
        ? "Fábrica"
        : cidadesRMS[Math.floor(Math.random() * cidadesRMS.length)],
    data: data.toISOString().split("T")[0], // yyyy-mm-dd
    hora: horaAleatoria(),
    id: randomUUID(),
  };
});

console.log(dados);
