import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface MetricPoint {
  timestamp: string;
  cpu: number;
  ram: number;
  gpu?: number;
}

export function ResourceMonitor() {
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);

  const hardwareMetricsQuery = trpc.hardware.getMetrics.useQuery(undefined, {
    refetchInterval: 2000, // Update every 2 seconds
  });
  const detectModeQuery = trpc.hardware.detectMode.useQuery();

  const recordSnapshotMutation = trpc.hardware.recordSnapshot.useMutation();

  useEffect(() => {
    if (hardwareMetricsQuery.data) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString("pt-BR");

      setCurrentMetrics(hardwareMetricsQuery.data);

      // Add to history (keep last 30 points)
      setMetrics((prev) => [
        ...prev.slice(-29),
        {
          timestamp,
          cpu: hardwareMetricsQuery.data.cpuUsage,
          ram: hardwareMetricsQuery.data.ramUsage,
          gpu: hardwareMetricsQuery.data.gpuUsage,
        },
      ]);

      // Record snapshot every 10 seconds
      if (metrics.length % 5 === 0) {
        recordSnapshotMutation.mutate({
          cpuUsage: hardwareMetricsQuery.data.cpuUsage,
          ramUsage: hardwareMetricsQuery.data.ramUsage,
          ramAvailable: hardwareMetricsQuery.data.ramAvailable,
          gpuUsage: hardwareMetricsQuery.data.gpuUsage,
          gpuVram: hardwareMetricsQuery.data.gpuVram,
          mode: (detectModeQuery.data?.mode as "ECO" | "STANDARD" | "PERFORMANCE") || "ECO",
        });
      }
    }
  }, [hardwareMetricsQuery.data]);

  const getStatusIcon = (value: number, threshold: number = 80) => {
    if (value >= threshold) {
      return <AlertTriangle className="h-3.5 w-3.5 text-destructive/60" />;
    }
    if (value >= threshold * 0.7) {
      return <AlertCircle className="h-3.5 w-3.5 text-yellow-500/60" />;
    }
    return <CheckCircle2 className="h-3.5 w-3.5 text-green-500/40" />;
  };

  return (
    <div className="space-y-3">
      {/* Current Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CPU Card */}
        <Card className="bg-muted/5 border-border/20 shadow-none rounded-xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">CPU</CardTitle>
              {getStatusIcon(currentMetrics?.cpuUsage || 0)}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-medium text-foreground/80">{currentMetrics?.cpuUsage || 0}%</div>
            <Progress
              value={currentMetrics?.cpuUsage || 0}
              className="h-1 mt-2 bg-muted/20"
            />
            <p className="text-[10px] text-muted-foreground/40 mt-2">Processador</p>
          </CardContent>
        </Card>

        {/* RAM Card */}
        <Card className="bg-muted/5 border-border/20 shadow-none rounded-xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">RAM</CardTitle>
              {getStatusIcon(currentMetrics?.ramUsage || 0)}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-medium text-foreground/80">{currentMetrics?.ramUsage || 0}%</div>
            <Progress
              value={currentMetrics?.ramUsage || 0}
              className="h-1 mt-2 bg-muted/20"
            />
            <p className="text-[10px] text-muted-foreground/40 mt-2">
              {currentMetrics?.ramAvailable || 0} GB disponível
            </p>
          </CardContent>
        </Card>

        {/* GPU Card */}
        <Card className="bg-muted/5 border-border/20 shadow-none rounded-xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">GPU</CardTitle>
              {currentMetrics?.gpuUsage !== undefined ? (
                getStatusIcon(currentMetrics.gpuUsage)
              ) : (
                <span className="text-[10px] text-muted-foreground/30 uppercase">N/A</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-medium text-foreground/80">
              {currentMetrics?.gpuUsage !== undefined ? `${currentMetrics.gpuUsage}%` : "N/A"}
            </div>
            {currentMetrics?.gpuUsage !== undefined && (
              <Progress
                value={currentMetrics.gpuUsage}
                className="h-1 mt-2 bg-muted/20"
              />
            )}
            <p className="text-[10px] text-muted-foreground/40 mt-2">
              {currentMetrics?.gpuVram ? `${currentMetrics.gpuVram} GB` : "Não detectada"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Historical Chart */}
      <Card className="bg-muted/5 border-border/20 shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">Histórico de Recursos (60s)</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {metrics.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground)/0.4)" }}
                  interval={Math.floor(metrics.length / 4)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground)/0.4)" }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--muted)/0.9)",
                    border: "1px solid hsl(var(--border)/0.2)",
                    borderRadius: "8px",
                    fontSize: "10px",
                    color: "hsl(var(--foreground))",
                    backdropFilter: "blur(4px)",
                  }}
                  itemStyle={{ fontSize: "10px" }}
                  formatter={(value: number) => [`${value}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", color: "hsl(var(--muted-foreground)/0.6)" }} />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="hsl(var(--muted-foreground)/0.4)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                  name="CPU"
                />
                <Line
                  type="monotone"
                  dataKey="ram"
                  stroke="hsl(var(--muted-foreground)/0.2)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                  name="RAM"
                />
                {metrics.some((m) => m.gpu !== undefined) && (
                  <Line
                    type="monotone"
                    dataKey="gpu"
                    stroke="hsl(var(--muted-foreground)/0.6)"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                    name="GPU"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground/30 font-medium">
              Coletando dados...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      {currentMetrics && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-900">Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800 space-y-1">
            {currentMetrics.cpuUsage > 80 && <p>⚠️ CPU acima de 80%</p>}
            {currentMetrics.ramUsage > 80 && <p>⚠️ RAM acima de 80%</p>}
            {currentMetrics.gpuUsage && currentMetrics.gpuUsage > 80 && <p>⚠️ GPU acima de 80%</p>}
            {currentMetrics.cpuUsage <= 80 &&
              currentMetrics.ramUsage <= 80 &&
              (!currentMetrics.gpuUsage || currentMetrics.gpuUsage <= 80) && (
                <p className="text-green-700">✓ Sistema operando normalmente</p>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
