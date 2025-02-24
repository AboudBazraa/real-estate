export default function CardDashboard({ title, icon, value, change, key }) {
  return (
    <div className="rounded-xl border shadow dark:border-zinc-800">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="tracking-tight text-sm font-medium">{title}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path d={icon} />
        </svg>
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-zinc-500 ">{change}</p>
      </div>
    </div>
  );
}
