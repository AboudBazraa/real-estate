function ListingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen p-2 sm:p-3 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl overflow-auto shadow-sm transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}

export default ListingLayout;
