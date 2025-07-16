"use server";

import { createSupabaseServerClient } from "@/supabase/server";
import { createOpenAI } from "@ai-sdk/openai";
import chromium from "@sparticuz/chromium";
import { generateText } from "ai";
import puppeteer from "puppeteer-core";

export async function createPersonalizedPlan(
  studentName: string,
  targetScore: number,
  examDate: string,
  math_diagnostic_id: string,
  verbal_diagnostic_id: string
) {
  const mathResult = await getExamResultTool(math_diagnostic_id);
  const verbalResult = await getExamResultTool(verbal_diagnostic_id);

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: SystemPrompt,
    prompt: `
        Generate a personalized study plan for ${studentName} to achieve a score of ${targetScore} on the SAT by ${examDate}.

        The following are the results of the diagnostic tests: 

        Math Diagnostic Results: ${mathResult}
        Verbal Diagnostic Results: ${verbalResult}

        Analyse the performances of the student in each of the sections and draft a study plans as your instructions say.
    `,
  });

  //const html = await marked.parse(result.text);
  //const pdfBuffer = await generatePdf(html);

  //return pdfBuffer?.toString("base64");
  return result.text;
}

const SystemPrompt = `

      You are an expert SAT tutor and study plan creator. Your role is to create personalized study plans for students based on:

        1. Their diagnostic test scores in the Math and Verbal sections
        2. Their target exam date
        3. Their target exam score
        4. Available exam results from the database

        When creating a study plan:
        - Analyze the student's strengths and weaknesses based on their scores
        - Create a structured timeline leading up to the exam date
        - Include specific practice questions from the database
        - Provide clear goals and milestones
        - Include both subject-specific and mixed practice sessions
        - Consider the student's current level and target score
        - Adapt the plan based on any existing study plan provided

        Use the available tools to:
        1. Fetch the relevant exam results

        Your output should be a well-structured markdown document. The markdown must have the following sections:

        Overview
        - Student Name
        - Exam Date
        - Target Score
        
        Lesson Plan
        - Propose the overall number of sessions for a student to achieve the target score for both Math and Verbal

        Session Breakdown and Focus Area
        - Break down each lesson into a specific focus area
        - each lesson should have a clear objecttive, a description and a title
        - Highlight for each focus area the areas the student needs to improve on

        Final thoughts
        - Add final thoughts on what the student should do to achieve the target score, focus on 2 - 3 sentences at max.

        IMPORTANT: Your result is the markdown document. Do not include any other text or formatting.


`;

export const getExamResultTool = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("exam_results")
    .select("*")
    .eq("id", id)
    .single();

  if (data) {
    const enhancedData = [];
    const { single_result } = data;

    for (const result of single_result) {
      const { data: questionData, error: questionError } = await supabase
        .from("sat_questions")
        .select("question, subtopic, difficulty_level, choices")
        .eq("id", result.question_id)
        .single();

      const questionString = `Question Subtopic: ${questionData?.subtopic}, Difficulty Level: ${questionData?.difficulty_level}`;

      enhancedData.push({ ...result, question: questionString });
    }

    return {
      data: enhancedData,
      error: error?.message || undefined,
    };
  }

  return {
    data,
    error: error?.message || undefined,
  };
};

const generatePdf = async (html: string) => {
  let browser = null;

  try {
    if (process.env.NODE_ENV === "production") {
      browser = await puppeteer.launch({
        args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      });
    }

    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (e) {
    console.log(e);
  }
};
