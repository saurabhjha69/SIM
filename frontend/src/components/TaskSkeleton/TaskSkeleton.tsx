export default function TaskSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-damaranth/40 border border-damaranth/30 animate-pulse">
      <div className="h-5 w-4/5 bg-night/70 rounded mb-2" />
      <div className="h-5 w-2/3 bg-night/70 rounded mb-5" />
      <div className="h-3 w-full bg-night/60 rounded mb-2" />
      <div className="h-3 w-full bg-night/60 rounded mb-2" />
      <div className="h-3 w-4/5 bg-night/60 rounded mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-5 w-28 bg-night/70 rounded-full" />
        <div className="flex gap-2">
          <div className="h-5 w-10 bg-night/70 rounded" />
          <div className="h-5 w-10 bg-night/70 rounded" />
        </div>
      </div>
    </div>
  );
}
