import { Skeleton } from './ui/skeleton';

export function DashboardLayoutSkeleton() {
  return (
    <div className="flex min-h-screen bg-background animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-[280px] border-r border-border/10 bg-muted/5 p-4 flex flex-col gap-6">
        {/* Logo area */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Skeleton className="h-8 w-8 rounded-xl bg-muted/20" />
          <Skeleton className="h-4 w-24 bg-muted/20" />
        </div>

        {/* New Chat Button */}
        <div className="px-1">
          <Skeleton className="h-10 w-full rounded-xl bg-muted/20" />
        </div>

        {/* Navigation Items */}
        <div className="space-y-1.5 px-1">
          <Skeleton className="h-9 w-full rounded-lg bg-muted/20" />
          <Skeleton className="h-9 w-full rounded-lg bg-muted/20" />
          <Skeleton className="h-9 w-full rounded-lg bg-muted/20" />
        </div>

        {/* Search bar */}
        <div className="px-1">
          <Skeleton className="h-9 w-full rounded-lg bg-muted/20" />
        </div>

        {/* Recent Section */}
        <div className="flex-1 space-y-3 px-1 mt-4">
          <Skeleton className="h-3 w-16 mx-3 bg-muted/20" />
          <div className="space-y-1">
            <Skeleton className="h-9 w-full rounded-lg bg-muted/10" />
            <Skeleton className="h-9 w-full rounded-lg bg-muted/10" />
            <Skeleton className="h-9 w-full rounded-lg bg-muted/10" />
            <Skeleton className="h-9 w-full rounded-lg bg-muted/10" />
            <Skeleton className="h-9 w-full rounded-lg bg-muted/10" />
          </div>
        </div>

        {/* User profile area at bottom */}
        <div className="mt-auto pt-4 border-t border-border/5">
          <div className="flex items-center gap-3 px-2 py-1">
            <Skeleton className="h-9 w-9 rounded-full bg-muted/20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20 bg-muted/20" />
              <Skeleton className="h-2 w-32 bg-muted/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8 flex flex-col gap-8">
        {/* Header area */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-lg bg-muted/10" />
          <Skeleton className="h-8 w-32 rounded-lg bg-muted/10" />
        </div>

        {/* Grid content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-3xl bg-muted/5 border border-border/5" />
          <Skeleton className="h-40 rounded-3xl bg-muted/5 border border-border/5" />
          <Skeleton className="h-40 rounded-3xl bg-muted/5 border border-border/5" />
        </div>

        {/* Large content block */}
        <Skeleton className="flex-1 rounded-3xl bg-muted/5 border border-border/5" />
      </div>
    </div>
  );
}
