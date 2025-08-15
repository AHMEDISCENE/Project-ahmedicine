export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 py-8 mt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} VetOncoData. All rights reserved.</p>
        <p className="mt-2">Built with ❤️ for veterinary oncology professionals.</p>
      </div>
    </footer>
  )
}
