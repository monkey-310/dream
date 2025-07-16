"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUserProfile } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Routes } from "@/routes/Routes";
import { createClient } from "@/supabase/client";
import { SupabaseApi } from "@/supabase/SupabaseApi";
import BackgroundAnimation from "./background-animation";
import { updateDiagnostic } from "@/actions/diagnostic-actions";

// Form schema with validation
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  examDate: z.date({
    required_error: "Please select an estimated exam date",
  }),
  desiredScore: z
    .number({
      required_error: "Please enter your desired score",
      invalid_type_error: "Please enter a number",
    })
    .min(400, { message: "Minimum SAT score is 400" })
    .max(1600, { message: "Maximum SAT score is 1600" }),
  motivation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StudentProfileForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      desiredScore: 1200,
      motivation: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      try {
        const result = await updateUserProfile(data);
        const diagnostic = await updateDiagnostic({
          user_profile_id: result.userProfileData?.id!,
        });

        if (!result.success || !diagnostic.success) {
          console.error(result.error);
          return;
        }

        // Navigate to the next page (the actual diagnostic test)
        router.push(Routes.DiagnosticTest);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const isFormValid = form.formState?.isValid;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-pink-50">
      <BackgroundAnimation />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Student Profile
            </h1>
            <p className="mt-2 text-gray-600">
              Tell us a bit about yourself before starting the diagnostic test
            </p>
            <div className="h-1 w-16 bg-[#DB5461] mx-auto mt-4 rounded-full"></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className="text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        className="text-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2 text-gray-800">
                      Estimated Exam Date
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-sm">
                              If you haven't scheduled your exam yet, please
                              provide your best estimate
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal text-gray-900"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-muted-foreground">
                                Select a date
                              </span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white"
                        align="start"
                      >
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-white text-gray-900"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-gray-600">
                      Choose the date you plan to take the SAT exam
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desiredScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Desired SAT Score (400-1600)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={400}
                        max={1600}
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                        className="text-gray-900"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      What score are you aiming to achieve?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Motivation (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us why you're taking the SAT and what you hope to achieve..."
                        className="resize-none min-h-[100px] text-gray-900"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-[#DB5461] hover:bg-[#c64854] text-white flex items-center gap-2"
                  disabled={!isFormValid}
                  isLoading={pending}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
