import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="p-6 bg-card rounded-2xl shadow-lg">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-10 w-1/2 mt-4" />
      <Skeleton className="h-20 mt-4" />
    </div>
  );
};

export default SkeletonCard;
