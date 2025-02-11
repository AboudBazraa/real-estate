import { Skeleton } from "src/shared/components/ui/skeleton";

export default function LoadingBoxs() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, idx) => (
          <Skeleton
            key={idx}
            className="aspect-video rounded-xl"
          >
            <Skeleton className="h-full w-full rounded-xl bg-gradient-to-rate-300 " />
          </Skeleton>
        ))}
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <Skeleton className="h-full w-full rounded-xl " />
      </div>
    </div>
  );
}
