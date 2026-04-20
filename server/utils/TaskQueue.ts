type QueueTask = {
  run: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  enqueuedAt: number;
  taskType: string;
  provider: string;
};

export type TaskQueueOptions = {
  maxConcurrent: number;
};

export class TaskQueue {
  private readonly maxConcurrent: number;
  private readonly waiting: QueueTask[] = [];
  private running = 0;

  constructor(options: TaskQueueOptions) {
    this.maxConcurrent = Number.isFinite(options.maxConcurrent) && options.maxConcurrent > 0
      ? Math.floor(options.maxConcurrent)
      : 1;
  }

  enqueue<T>(
    run: () => Promise<T>,
    meta: { taskType: string; provider: string },
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.waiting.push({
        run,
        resolve: (value) => resolve(value as T),
        reject,
        enqueuedAt: Date.now(),
        taskType: meta.taskType,
        provider: meta.provider,
      });

      console.log(
        `[TaskQueue] Processo [${meta.taskType}/${meta.provider}] entrou na Fila. Tamanho da fila: ${this.waiting.length}`,
      );

      this.process();
    });
  }

  private process(): void {
    while (this.running < this.maxConcurrent && this.waiting.length > 0) {
      const next = this.waiting.shift();
      if (!next) return;

      const waitMs = Date.now() - next.enqueuedAt;
      console.log(
        `[TaskQueue] Iniciando Processo [${next.taskType}/${next.provider}] da fila. Tempo na espera: ${waitMs} ms`,
      );

      this.running += 1;

      Promise.resolve()
        .then(next.run)
        .then(next.resolve)
        .catch(next.reject)
        .finally(() => {
          this.running -= 1;
          console.log("[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...");
          this.process();
        });
    }
  }
}
