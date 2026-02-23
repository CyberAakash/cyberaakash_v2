import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/20", className)}
      {...props}
    />
  );
}

export function SectionSkeleton() {
  return (
    <div className="section-padding max-w-7xl mx-auto w-full space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function SkillSkeleton() {
  return (
    <div className="section-padding max-w-7xl mx-auto w-full space-y-8">
      <div className="flex justify-center flex-col items-center space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 px-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-4 flex flex-col items-center">
        <Skeleton className="h-16 w-[300px] md:w-[600px]" />
        <Skeleton className="h-16 w-[200px] md:w-[400px]" />
      </div>
      <Skeleton className="h-20 w-full max-w-2xl" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
    </div>
  );
}
