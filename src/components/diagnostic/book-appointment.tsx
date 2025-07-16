"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import BackgroundAnimation from "./background-animation";
import CalenderEmbedding from "./calender-embedding";

export default function BookAppointment() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-pink-50">
      {/* Confetti animation */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          colors={["#DB5461", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"]}
        />
      )}

      {/* Animated background elements */}
      <BackgroundAnimation />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl mx-auto"
        >
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Congratulations!
            </h1>
            <p className="mt-2 text-xl text-gray-600 max-w-2xl mx-auto">
              You've completed both diagnostic modules. Schedule a free
              consultation to review your results.
            </p>
            <div className="h-1 w-16 bg-[#DB5461] mx-auto mt-4 rounded-full"></div>
          </div>
        </motion.div>

        {/* Calendar Embed Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 max-w-4xl w-full">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#DB5461]" />
              Schedule Your Free Consultation
            </h3>
          </div>

          {/* Mock Calendar Embed */}
          <CalenderEmbedding />
        </div>
      </div>
    </div>
  );
}
