import QuestionViewHeader from "@/components/diagnostic/question-view-header";

export default function DiagnosticTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <header className=" bg-white shadow-sm">
        <QuestionViewHeader />
      </header>
      <main className="flex flex-col items-center justify-start p-4 mt-4 grid-rows-1">
        {children}
      </main>
    </div>
  );
}
