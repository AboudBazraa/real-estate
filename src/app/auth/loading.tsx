export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
