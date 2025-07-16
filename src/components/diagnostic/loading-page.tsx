"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderPageProps {
  // Array of strings to display
  loadingMessages?: string[];
  // Duration each message is displayed in milliseconds
  messageDuration?: number;
  // Color of the loader (defaults to the app's primary color)
  loaderColor?: string;
}

export default function LoaderPage({
  loadingMessages = [
    "Loading your test...",
    "Preparing questions...",
    "Almost ready...",
    "Setting up your diagnostic...",
    "Just a moment...",
    "Calibrating difficulty levels...",
  ],
  messageDuration = 2000,
  loaderColor = "#DB5461",
}: LoaderPageProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Set up interval to cycle through messages
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === loadingMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, messageDuration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [loadingMessages.length, messageDuration]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-pink-50 p-4">
      {/* Loader animation */}
      <div className="mb-8 relative">
        <div className="w-16 h-16 relative">
          {/* Outer spinning circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: loaderColor,
              borderLeftColor: loaderColor,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-3 rounded-full"
            style={{ backgroundColor: loaderColor }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Text animation container */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-700 font-medium"
          >
            {loadingMessages[currentMessageIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Optional progress dots */}
      <div className="flex space-x-1 mt-4">
        {loadingMessages.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              index === currentMessageIndex ? "bg-[#DB5461]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
