import { auditLog, getRecentLogs } from "./audit-logger.js";

type StageName =
  | "entry"
  | "classification"
  | "policy_applied"
  | "execution"
  | "output_validation"
  | "response";

type RouteStatus = "success" | "fallback" | "error" | "blocked";

type RouteMetric = {
  route: string;
  count: number;
  totalLatencyMs: number;
  errors: number;
  fallbacks: number;
};

const metricsByRoute = new Map<string, RouteMetric>();

export function logGuardRailStage(params: {
  request_id: string;
  stage: StageName;
  route: string;
  details?: Record<string, unknown>;
}): void {
  auditLog({
    request_id: params.request_id,
    event: "pipeline_stage",
    timestamp: new Date().toISOString(),
    details: {
      stage: params.stage,
      route: params.route,
      ...(params.details ?? {}),
    },
  });
}

export function recordRouteMetric(params: {
  route: string;
  status: RouteStatus;
  latency_ms: number;
}): void {
  const current =
    metricsByRoute.get(params.route) ??
    ({
      route: params.route,
      count: 0,
      totalLatencyMs: 0,
      errors: 0,
      fallbacks: 0,
    } satisfies RouteMetric);

  current.count += 1;
  current.totalLatencyMs += Math.max(0, params.latency_ms);

  if (params.status === "error" || params.status === "blocked") {
    current.errors += 1;
  }

  if (params.status === "fallback") {
    current.fallbacks += 1;
  }

  metricsByRoute.set(params.route, current);
}

export function getGuardRailMetrics(): Array<{
  route: string;
  avg_latency_ms: number;
  requests: number;
  error_rate: number;
  fallback_rate: number;
}> {
  return Array.from(metricsByRoute.values()).map((metric) => ({
    route: metric.route,
    avg_latency_ms: metric.count > 0 ? Math.round(metric.totalLatencyMs / metric.count) : 0,
    requests: metric.count,
    error_rate: metric.count > 0 ? metric.errors / metric.count : 0,
    fallback_rate: metric.count > 0 ? metric.fallbacks / metric.count : 0,
  }));
}

export function diagnoseByRequestId(request_id: string): {
  request_id: string;
  events: ReturnType<typeof getRecentLogs>;
  diagnostic_ready: boolean;
} {
  const events = getRecentLogs({ request_id, limit: 200 });
  return {
    request_id,
    events,
    diagnostic_ready: events.length > 0,
  };
}
