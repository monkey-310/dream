"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useTimerStoreWithInitialization } from "@/stores/useTimerStore";
import { Constants } from "@/constants/Constants";
import { formatTime } from "@/utils/formatTime";

interface TimerProps {
  callback?: () => void;
  initialTime?: number;
}

export default function Timer(props: TimerProps) {
  const { initialTime, callback = () => {} } = props;
  const { timer, updateTimer, setTimer, timerIsRunning } =
    useTimerStoreWithInitialization();
  const [isTimeVisible, setIsTimeVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!timerIsRunning) return;

    if (timer <= 0) {
      callback();
      updateTimer(0);

      return;
    }

    const intervalId = setInterval(() => {
      updateTimer(timer - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timer, timerIsRunning, callback, updateTimer]);

  useEffect(() => {
    if (initialTime && isMounted) setTimer(initialTime);
  }, [initialTime, isMounted, setTimer]);

  const toggleTimeVisibility = () => setIsTimeVisible(!isTimeVisible);

  const getBorderColor = (timer: number, initialTime: number): string => {
    const percentage = timer / initialTime;
    if (percentage <= 0.25) return "from-red-100 to white";
    if (percentage <= 0.5) return "from-yellow-100 to white";
    return "from-green-100 to white";
  };

  // Prevent hydration errors by not rendering until mounted
  if (!isMounted) {
    return <div className="w-24 h-10"></div>; // Placeholder with same dimensions
  }

  return (
    <Card
      className={`w-24 p-[2px] bg-gradient-to-r ${getBorderColor(
        timer,
        initialTime ?? Constants.MOCK_DEFAULT_TIME_IN_MS
      )} rounded-lg`}
    >
      <CardContent className="flex items-center justify-between p-2">
        <div
          className={`text-sm font-bold tabular-nums transition-all duration-200 ${
            isTimeVisible ? "" : "blur-sm"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(timer)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleTimeVisibility}
          aria-label={isTimeVisible ? "Hide time" : "Show time"}
        >
          {isTimeVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
