const SkeletonCard = () => {
  return (
    <div className="w-44 flex-shrink-0 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-bg-elevated/60 mb-3" />
      <div className="h-3 bg-bg-elevated/60 rounded w-3/4 mb-2" />
      <div className="h-2.5 bg-bg-elevated/60 rounded w-1/2" />
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 animate-pulse">
      <div className="w-8 h-4 bg-bg-elevated/60 rounded" />
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-md bg-bg-elevated/60 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-bg-elevated/60 rounded w-32 mb-1.5" />
          <div className="h-2.5 bg-bg-elevated/60 rounded w-20" />
        </div>
      </div>
      <div className="h-3 bg-bg-elevated/60 rounded w-10" />
    </div>
  );
};

export default SkeletonCard;
