import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center z-[99999] justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <Loader2 className="w-16 h-16 mx-auto mb-4 text-neutral-500 dark:text-neutral-400 animate-spin" />
      </div>
    </div>
  );
}