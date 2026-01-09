import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "hero" | "section" | "dark";
}

export const AnimatedBackground = ({
  className,
  variant = "hero",
}: AnimatedBackgroundProps) => {
  const blobs = [
    {
      size: "w-[600px] h-[600px]",
      position: "top-[-200px] right-[-100px]",
      color: "bg-primary/5",
      delay: "0s",
    },
    {
      size: "w-[400px] h-[400px]",
      position: "bottom-[-100px] left-[-50px]",
      color: "bg-accent/5",
      delay: "2s",
    },
    {
      size: "w-[300px] h-[300px]",
      position: "top-[40%] left-[30%]",
      color: "bg-primary/3",
      delay: "4s",
    },
  ];

  const darkBlobs = [
    {
      size: "w-[500px] h-[500px]",
      position: "top-[-150px] right-[-100px]",
      color: "bg-primary/10",
      delay: "0s",
    },
    {
      size: "w-[350px] h-[350px]",
      position: "bottom-[-80px] left-[-50px]",
      color: "bg-accent/10",
      delay: "2s",
    },
  ];

  const selectedBlobs = variant === "dark" ? darkBlobs : blobs;

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {selectedBlobs.map((blob, index) => (
        <div
          key={index}
          className={cn(
            "absolute rounded-full blur-3xl animate-blob",
            blob.size,
            blob.position,
            blob.color
          )}
          style={{
            animationDelay: blob.delay,
            animationDuration: `${8 + index * 2}s`,
          }}
        />
      ))}

      {/* Subtle grain overlay */}
      {variant === "hero" && (
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
};
