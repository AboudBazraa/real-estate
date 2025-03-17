export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-8 w-[200px] animate-pulse rounded-md bg-muted" />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted animate-pulse md:min-h-min" />
    </div>
  );
}
