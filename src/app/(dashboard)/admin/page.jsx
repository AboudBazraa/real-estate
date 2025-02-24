import DynamicBreadcrumb from "@/app/(dashboard)/components/breadcrumb";
import CardDashboard from "@/app/(dashboard)/components/card";
import { ChartOne, ChartTwo } from "@/app/(dashboard)/admin/components/chart";
import { TableDemo } from "@/app/(dashboard)/admin/components/table";
export default function AdminPage() {
  const metricsData = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    },
    {
      title: "Subscriptions",
      value: "+2350",
      change: "+180.1% from last month",
      icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    },
    {
      title: "Sales",
      value: "+12,234",
      change: "+19% from last month",
      icon: "M2 5h20v14H2zM2 10h20",
    },
    {
      title: "Active Now",
      value: "+573",
      change: "+201 since last hour",
      icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((data) => (
          <div key={data.title} className="w-full">
            <CardDashboard
              title={data.title}
              icon={data.icon}
              value={data.value}
              change={data.change}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mt-4">
        <div className="rounded-xl border dark:border-zinc-800 shadow md:col-span-1 lg:col-span-2 xl:col-span-4 max-h-96 p-4">
          <TableDemo />
        </div>
        <div className="rounded-xl border dark:border-zinc-800 shadow md:col-span-1 lg:col-span-2 xl:col-span-3 h-auto md:h-96">
          <ChartOne />
        </div>
      </div>
      <div className="mt-4">
        <div className="rounded-xl border dark:border-zinc-800 shadow w-full h-auto">
          <ChartTwo />
        </div>
      </div>
    </div>
  );
}
