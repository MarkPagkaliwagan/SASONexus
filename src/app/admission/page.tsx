import { db } from "@/db";
import { admissionContent } from "@/db/schema";
import AdmissionPageClient from "./AdmissionPageClient";

export default async function AdmissionPage() {
  const rows = await db.select().from(admissionContent);
  const contentMap: Record<string, string> = {};
  for (const row of rows) contentMap[row.section] = row.content;

  const hero = contentMap.hero ? JSON.parse(contentMap.hero) : { heading: "Admission Office", subheading: "Begin your academic journey at SPC.", buttonText: "Start Your Application" };
  const requirements = contentMap.requirements ? JSON.parse(contentMap.requirements) : [];
  const steps = contentMap.steps ? JSON.parse(contentMap.steps) : [];
  const basis = contentMap.basis ? JSON.parse(contentMap.basis) : [];
  const hours = contentMap.hours ? JSON.parse(contentMap.hours) : [];

  return <AdmissionPageClient hero={hero} requirements={requirements} steps={steps} basis={basis} hours={hours} />;
}
