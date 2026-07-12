import { Suspense } from "react";
import NewEnquiryForm from "@/components/NewEnquiryForm";
export default function Page(){return <Suspense fallback={<main className="page-shell min-h-screen px-4 py-10 text-center">Loading enquiry form…</main>}><NewEnquiryForm/></Suspense>}
