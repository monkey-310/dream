"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Target,
  User as UserIcon,
} from "lucide-react";
import { startTransition, useState, useTransition } from "react";
import { Button } from "../ui/button";
import ProcessIndicator from "./process-indicator";
import { createPersonalizedPlan } from "@/actions/gen-ai-actions";
import ReactMarkdown from "react-markdown";

// Skeleton component for loading states
const Skeleton = ({ className = "", ...props }) => {
  return <div className={`bg-gray-200 rounded-md ${className}`} {...props} />;
};

interface UserDetailProps {
  userData: { user: User | null };
  diagnostic?: any;
  userProfile?: any;
}

export default function UserDetailView({
  userData,
  diagnostic,
  userProfile,
}: UserDetailProps) {
  const { user } = userData;
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const [markdown, setMarkdown] = useState<string | null>(null);
  //#endregion
  // Get display name (name or email)
  const displayName =
    user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
      : user?.email?.split("@")[0] || "User";

  // Format date helper function
  const formatDate = (
    dateString: string | undefined,
    format: string = "dd.MM.yyyy"
  ) => {
    if (!dateString) return null;
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(dateString));
    } catch (e) {
      return null;
    }
  };

  // Calculate days until exam if exam date exists
  const daysUntilExam = userProfile?.sat_metadata?.exam_date
    ? Math.ceil(
        (new Date(userProfile.sat_metadata.exam_date).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getActiveStep = () => {
    if (!userProfile) {
      return "profile";
    }

    if (!diagnostic?.verbal_diagnostic_id && diagnostic?.math_diagnostic_id) {
      return "verbal";
    }

    if (!diagnostic?.math_diagnostic_id && diagnostic?.verbal_diagnostic_id) {
      return "math";
    }

    if (!diagnostic?.verbal_diagnostic_id && !diagnostic?.math_diagnostic_id) {
      return "verbal";
    }

    if (diagnostic?.verbal_diagnostic_id && diagnostic?.math_diagnostic_id) {
      return "results";
    }

    return null;
  };

  const handleStudyPlan = async () => {
    startTransition(async () => {
      const markdown = await createPersonalizedPlan(
        user?.user_metadata?.first_name,
        userProfile?.sat_metadata?.desired_score,
        userProfile?.sat_metadata?.exam_date,
        diagnostic?.math_diagnostic_id,
        diagnostic?.verbal_diagnostic_id
      );

      setMarkdown(markdown);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl ml-8">
      {/* User Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt={displayName}
            />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-gray-500 text-sm">
                  {user?.email || <Skeleton className="h-4 w-32" />}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="flex items-center gap-1 px-2 py-1 bg-[#DB5461] text-white">
                  <Clock className="h-3 w-3" />
                  <span>
                    Joined{" "}
                    {formatDate(user?.created_at) || (
                      <Skeleton className="h-3 w-16 inline-block" />
                    )}
                  </span>
                </Badge>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Estimated Exam Date</div>
                  {userProfile?.sat_metadata?.exam_date ? (
                    <div className="text-sm text-gray-500">
                      {formatDate(userProfile.sat_metadata.exam_date)}
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-24 mt-1" />
                  )}
                  {daysUntilExam !== null && daysUntilExam > 0 && (
                    <div className="text-xs text-blue-600 font-medium">
                      {daysUntilExam} days remaining
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Target Score</div>
                  {userProfile?.sat_metadata?.desired_score ? (
                    <div className="text-sm text-gray-500">
                      {userProfile.sat_metadata.desired_score}
                      <span className="text-xs text-green-600 font-medium ml-1">
                        / 1600
                      </span>
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-20 mt-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Speech Bubble */}
        {userProfile?.sat_metadata?.motivation ? (
          <div className="mt-6 relative">
            <div
              className="bg-gray-100 p-4 rounded-lg rounded-tl-none text-gray-700 text-sm"
              style={{
                maxHeight: expanded ? "none" : "80px",
                overflow: "hidden",
              }}
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-gray-500" />
              </div>
              <div className="pl-4">{userProfile.sat_metadata.motivation}</div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        )}
      </div>

      {/* Process Indicator */}
      <div className="border-t border-gray-200 p-6 pt-4 bg-gray-50">
        <ProcessIndicator
          completedSteps={{
            profile: Boolean(userProfile),
            verbal: Boolean(diagnostic?.verbal_diagnostic_id),
            math: Boolean(diagnostic?.math_diagnostic_id),
            results:
              Boolean(userProfile) &&
              Boolean(diagnostic.verbal_diagnostic_id) &&
              Boolean(diagnostic?.math_diagnostic_id),
          }}
          activeStep={getActiveStep()}
        />
      </div>
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-[#DB5461] hover:bg-[#c64854] text-white flex items-center justify-center gap-2"
            size="lg"
            disabled={!Boolean(diagnostic?.math_diagnostic_id)}
            onClick={() => {
              window.open(
                `/shared/result/${diagnostic?.math_diagnostic_id}`,
                "_blank"
              );
            }}
          >
            <FileText className="h-5 w-5" />
            View Math Diagnostic Results
            {!Boolean(diagnostic?.math_diagnostic_id) && (
              <span className="text-xs">(Incomplete)</span>
            )}
          </Button>

          <Button
            className="flex-1 bg-[#DB5461] hover:bg-[#c64854]  flex items-center justify-center gap-2"
            size="lg"
            variant="outline"
            disabled={!Boolean(diagnostic?.verbal_diagnostic_id)}
            onClick={() => {
              window.open(
                `/shared/result/${diagnostic?.verbal_diagnostic_id}`,
                "_blank"
              );
            }}
          >
            <FileText className="h-5 w-5" />
            View Verbal Diagnostic Results
            {!Boolean(diagnostic?.verbal_diagnostic_id) && (
              <span className="text-xs">(Incomplete)</span>
            )}
          </Button>
          <Button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
            size="lg"
            onClick={() => handleStudyPlan()}
            isLoading={pending}
            disabled={
              !!Boolean(diagnostic?.verbal_diagnostic_id) &&
              !Boolean(diagnostic?.math_diagnostic_id)
            }
          >
            <BookOpen className="h-5 w-5" />
            View Study Plan
          </Button>
        </div>
      </div>
      {markdown && <ReactMarkdown children={markdown} />}
    </div>
  );
}
