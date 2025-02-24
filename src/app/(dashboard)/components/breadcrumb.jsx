"use client";
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";

export default function DynamicBreadcrumb() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 z-10 rounded-xl backdrop-blur-xs">
    <div className="flex items-center gap-2 ">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {/* <DynamicBreadcrumb /> */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="mx-2" />
          <BreadcrumbItem>
            <BreadcrumbLink href={``}></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="mx-2" />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
  );
};



// import { useRouter } from "next/navigation";

// // const DynamicBreadcrumb = () => {
// //   const router = useRouter();

// //   const generateBreadcrumbs = () => {
// //     const paths = router.asPath?.split("/").filter(Boolean) || [];
// //     return paths.map((segment, index) => {
// //       const href = "/" + paths.slice(0, index + 1).join("/");
// //       const name = formatSegmentName(segment);
// //       return { name, href };
// //     });
// //   };

// // const formatSegmentName = (segment) => {
// //   // Capitalize the first letter of each word and add spaces between them
// //   const formatted = segment
// //     .split('-')
// //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //     .join(' ');

// //   return formatted;
// // };

// const breadcrumbs = generateBreadcrumbs();

// return (
//   <Breadcrumb>
//     <BreadcrumbList>
//       <BreadcrumbItem>
//         <BreadcrumbLink href="/">Home</BreadcrumbLink>
//       </BreadcrumbItem>

//       {breadcrumbs.map((breadcrumb, index) => (
//         <React.Fragment key={index}>
//           <BreadcrumbSeparator className="mx-2" />
//           {index < breadcrumbs.length - 1 ? (
//             <BreadcrumbLink href={breadcrumb.href}>
//               {breadcrumb.name}
//             </BreadcrumbLink>
//           ) : (
//             <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
//           )}
//         </React.Fragment>
//       ))}
//     </BreadcrumbList>
//   </Breadcrumb>
// );

// // export default DynamicBreadcrumb;
