export default function Footer() {
  return (
    <footer>
      <div className="absolute bottom-8 left-0 right-0 text-center text-sm">
        © {new Date().getFullYear()} SAT Diagnostic Test | Helping students
        succeed
      </div>
    </footer>
  );
}
