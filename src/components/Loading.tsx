export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-[#007848]/20 rounded-full" />
          <div className="w-16 h-16 border-4 border-[#007848] border-t-transparent rounded-full animate-spin" />
          <div className="absolute w-8 h-8 border-[3px] border-[#007848]/40 border-b-transparent rounded-full animate-spin animation-delay-150" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold text-[#007848] tracking-wide">Loading</span>
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-[#007848] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#007848] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#007848] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
