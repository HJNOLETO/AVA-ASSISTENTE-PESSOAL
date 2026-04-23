import { spawnSync } from "node:child_process";

type Step = {
  title: string;
  command: string;
  expected: string;
};

const IMAGE = "ava-assistant-v3-main-ava-cli";

const steps: Step[] = [
  {
    title: "Verificar se a imagem existe localmente",
    command: `docker image inspect ${IMAGE}`,
    expected: "Se existir, retorna metadados da imagem. Se nao existir, erro de imagem nao encontrada.",
  },
  {
    title: "Abrir ajuda do AVA CLI (ENTRYPOINT + --help)",
    command: `docker run --rm ${IMAGE} --help`,
    expected: "Mostra comandos disponiveis, como ask <query>, e encerra o container.",
  },
  {
    title: "Enviar pergunta de teste para o AVA",
    command: `docker run --rm ${IMAGE} ask \"oi\"`,
    expected:
      "Sem Ollama ativo, erro esperado de conexao em http://localhost:11434/api/chat. Com Ollama ativo, retorna resposta.",
  },
];

function run(command: string) {
  return spawnSync(command, {
    shell: true,
    encoding: "utf-8",
  });
}

function explainLifecycle() {
  console.log("\n=== Ciclo de vida Docker no AVA CLI ===");
  console.log("- A imagem fica armazenada localmente e NAO e desfeita a cada execucao.");
  console.log("- Com --rm, quem e removido apos cada run e o container temporario.");
  console.log("- A imagem so sai quando voce remove manualmente (docker rmi) ou limpa o cache.");
  console.log("- Se houver alteracao no Dockerfile/codigo de build, compose pode reconstruir a imagem.");
}

function explainCompose() {
  console.log("\n=== Comando recomendado no projeto ===");
  console.log("docker compose -f docker-compose.cli.yml run --rm ava-cli");
  console.log("- Esse comando usa o ENTRYPOINT do cli.Dockerfile automaticamente.");
  console.log("- O command padrao atual no compose e --help.");
  console.log("- Para pergunta direta: docker compose -f docker-compose.cli.yml run --rm ava-cli ask \"sua pergunta\"");
}

function runGuidedChecks() {
  console.log("\n=== Execucao guiada ===");

  for (const [index, step] of steps.entries()) {
    console.log(`\n[${index + 1}] ${step.title}`);
    console.log(`Comando: ${step.command}`);
    console.log(`Esperado: ${step.expected}`);

    const result = run(step.command);
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
    const compact = output.length > 900 ? `${output.slice(0, 900)}...` : output;

    console.log(`Exit code: ${result.status ?? "null"}`);
    if (compact.length > 0) {
      console.log("Saida:");
      console.log(compact);
    } else {
      console.log("Saida: (vazia)");
    }
  }
}

function main() {
  console.log("AVA CLI Tour - guia rapido para execucao em Docker");
  explainLifecycle();
  explainCompose();

  const withChecks = process.argv.includes("--run-checks");
  if (withChecks) {
    runGuidedChecks();
  } else {
    console.log("\nDica: rode com --run-checks para executar os testes automaticamente.");
    console.log("Exemplo: npx tsx scripts/ava-cli-tour.ts --run-checks");
  }
}

main();
