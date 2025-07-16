import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </div>
  );
};
