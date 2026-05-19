import { Inbox } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 mb-4">
        <Inbox className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-xs mx-auto">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 font-bold" variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}