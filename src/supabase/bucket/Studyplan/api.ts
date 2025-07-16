import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Schema for the input
const insertStudyPlanSchema = z.object({
  userId: z.string().describe("The ID of the user"),
  pdfBase64: z.string().describe("The PDF file as a base64 string"),
  fileName: z
    .string()
    .optional()
    .default("studyplan.pdf")
    .describe("Optional custom filename"),
});

// Type inference from the schema
type InsertStudyPlanInput = z.infer<typeof insertStudyPlanSchema>;

/**
 * Inserts a study plan PDF into the user's folder in the studyplan bucket
 * @param input The input containing userId, base64 PDF, and optional filename
 * @returns Object with success status, URL, and optional error message
 */
export async function insertStudyPlan(input: InsertStudyPlanInput) {
  try {
    // Validate input
    const validatedInput = insertStudyPlanSchema.parse(input);
    const { userId, pdfBase64, fileName } = validatedInput;

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Convert base64 to blob
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const pdfBlob = new Blob([bytes], { type: "application/pdf" });

    // Create user-specific path
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("studyplan")
      .upload(filePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Error uploading study plan:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("studyplan").getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Error in insertStudyPlan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
