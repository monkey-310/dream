import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink-100 opacity-40"
        animate={{
          x: [0, 30, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-pink-100 opacity-50"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-pink-200 opacity-30"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
