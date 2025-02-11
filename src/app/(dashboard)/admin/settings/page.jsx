import DynamicBreadcrumb from "@/app/(dashboard)/components/breadcrumb";
export default function Page() {
  const name = 'Settings';
  return (
    <>
      <DynamicBreadcrumb namepage={name} />
      <h1>Dashboard Settings</h1>
    </>
  );
}
