interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  const containerClasses = fullScreen
    ? "flex justify-center items-center h-screen"
    : "flex justify-center items-center py-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-blue)] mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
