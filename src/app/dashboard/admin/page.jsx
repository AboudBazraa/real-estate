import LayoutDashboard from "@/app/dashboard/layout";
import DynamicBreadcrumb from "@/app/dashboard/components/breadcrumb";
export default function Page() {
  const name = "Dashboard";

  return (
    <div>
      <DynamicBreadcrumb namepage={name}/>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold">Dashboard Admin</h1> 
            <p className="text-lg text-gray-500">Welcome to your dashboard</p>
          </div>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
          <h1 className="text-3xl font-bold">.</h1>
        </div>
      </div>
    </div>
  );
}
