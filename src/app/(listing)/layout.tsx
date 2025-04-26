function ListingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen p-2 sm:p-3 bg-slate-100 dark:bg-zinc-900 transition-colors duration-300">
      <div className="flex-1 bg-white overflow-hidden dark:bg-black rounded-xl  shadow-sm transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}

export default ListingLayout;
