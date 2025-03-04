export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="h-8 w-[200px] animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-[150px] animate-pulse rounded-md bg-muted" />
      </div>

      {/* Dashboard Cards Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-8 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Recent Properties Loading */}
      <div className="grid gap-6">
        <div className="h-8 w-[200px] animate-pulse rounded-md bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Activity Cards Loading */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <div className="col-span-full lg:col-span-8 rounded-xl border bg-card shadow-sm p-6">
          <div className="h-6 w-1/4 animate-pulse rounded bg-muted mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
        <div className="col-span-full lg:col-span-4 rounded-xl border bg-card shadow-sm p-6">
          <div className="h-6 w-1/3 animate-pulse rounded bg-muted mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
