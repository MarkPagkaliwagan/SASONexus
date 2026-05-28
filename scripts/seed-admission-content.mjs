import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

await sql`
  CREATE TABLE IF NOT EXISTS "admission_content" (
    "id" serial PRIMARY KEY NOT NULL,
    "section" varchar(50) NOT NULL UNIQUE,
    "content" text NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )
`;

const sections = [
  {
    section: "hero",
    content: JSON.stringify({
      heading: "Admission Office",
      subheading: "Begin your academic journey at SPC. Review all requirements and follow the registration procedures.",
      buttonText: "Start Your Application",
    }),
  },
  {
    section: "requirements",
    content: JSON.stringify([
      {
        tab: "freshmen",
        label: "Freshmen",
        groups: [
          {
            title: "Admission Test",
            items: ["Applicants should take the SPC Admission Test (SPCAT)", "SPCAT Result"],
          },
          {
            title: "Academic Documents",
            items: [
              "Original and Photocopy of Form 138 (SHS Grade 12 Card)",
              "Original and Photocopy of Form 137 (JHS Grade 7-10 Student Permanent Record)",
              "National Career Assessment Examination (NCAE) result, if any",
            ],
          },
          {
            title: "Personal Documents",
            items: [
              "Four (4) 2x2 ID pictures - colored, white background, with name tag",
              "Certificate of Good Moral Character signed by SHS Principal/Guidance Counselor",
              "PSA authenticated Birth Certificate (or one issued by the Local Civil Registrar if not readable)",
              "For female married applicants: Photocopy of PSA authenticated Marriage Contract",
            ],
          },
        ],
      },
      {
        tab: "transferees",
        label: "Transferees",
        groups: [
          {
            title: "Admission Test",
            items: ["Applicants should take the SPC Admission Test (SPCAT)", "SPCAT Result"],
          },
          {
            title: "Academic Documents",
            items: [
              "Transfer Credential Form (Honorable Dismissal Form)",
              "Certification of Grades for evaluation purposes",
              "Original Transcript of Records with remark 'Copy for San Pablo Colleges'",
            ],
          },
          {
            title: "Personal Documents",
            items: [
              "Certification of Good Moral Character",
              "PSA authenticated Birth Certificate",
              "For female married applicants: Photocopy of PSA authenticated Marriage Contract",
            ],
          },
        ],
      },
      {
        tab: "foreign",
        label: "Foreign Students",
        groups: [
          {
            title: "Special Instructions",
            items: ["Please refer to the leaflet for Foreign Students / Filipinos residing abroad available at the Registrar's Office."],
          },
        ],
      },
      {
        tab: "law",
        label: "Juris Doctor",
        groups: [
          {
            title: "Admission Test",
            items: ["Applicants shall take the SPC College of Law Admission Test (SPCCLAT)"],
          },
          {
            title: "Academic Requirements",
            items: [
              "Must have earned 18 units of English, 6 units of Math, and 18 units of Social Science in bachelor's degree",
              "Certificate of General Weighted Average of 2.5 (80%) or above",
              "C-1 Certificate of Eligibility in the Law Course",
              "Certification of Grades for evaluation purposes",
              "Original Transcript of Records with remark 'Copy for San Pablo Colleges'",
            ],
          },
          {
            title: "Personal Documents",
            items: ["PSA authenticated Birth Certificate", "For female married applicants: Photocopy of Marriage Contract"],
          },
        ],
      },
      {
        tab: "graduate",
        label: "Graduate School",
        groups: [
          {
            title: "Program-Specific Requirements",
            items: [
              "MBA: BSBA/BSA graduate; otherwise, complete 18 units of Professional Business Education Subjects",
              "MA: BSED/BEED graduate; otherwise, complete 18 units of Professional Education Subjects + Photocopy of Valid PRC ID (LET)",
              "MA in Guidance Counseling: AB Psych, BS Psych, or BSEd in Guidance and Counseling; otherwise, complete 18 units of Professional Subjects",
              "MAN: Bachelor's degree in Nursing + Photocopy of Valid PRC ID (NLE)",
              "EdD: MA degree holder with Thesis; otherwise, subject to evaluation of unit requirement in Professional Education Subjects",
              "DBA: MBA/MM degree holder with Thesis; otherwise, take MBA 113a (Position Paper)",
            ],
          },
          {
            title: "General Requirements",
            items: [
              "Interview by the Dean of Graduate School",
              "Certification of Grades for evaluation purposes",
              "Original Transcript of Records with remark 'Copy for San Pablo Colleges'",
              "PSA authenticated Birth Certificate",
            ],
          },
        ],
      },
    ]),
  },
  {
    section: "steps",
    content: JSON.stringify([
      { step: "01", title: "Submit Requirements", description: "Submit your SHS Grade 12 Report Card, Certificate of Good Moral Character, and two (2) identical 2x2 colored pictures with white background." },
      { step: "02", title: "Screening & Entrance Exam", description: "Compliant applicants are screened by the concerned department. Pay the admission fee at the Cashier's Office before taking the SPCAT." },
      { step: "03", title: "Secure Admission Kit", description: "Obtain the Admission Kit from the Admission Office. It includes two (2) Admission Forms, the SPC Primer with Academic Information, and Enrollment Procedures." },
      { step: "04", title: "Accomplish Admission Form", description: "Fill out the Admission Form in duplicate, attach two (2) 2x2 pictures, and schedule your SPCAT at the Guidance Unit. Results are released three days after the exam." },
      { step: "05", title: "Interview", description: "Applicants who have submitted all requirements including F-138, Certificate of Good Moral, and Exam Result will be scheduled for an interview with the respective Department Dean." },
    ]),
  },
  {
    section: "basis",
    content: JSON.stringify([
      { label: "Scholastic Standing", value: "33.33%" },
      { label: "Entrance Examination", value: "33.33%" },
      { label: "Interview Result", value: "33.33%" },
    ]),
  },
  {
    section: "hours",
    content: JSON.stringify([
      { day: "Monday - Saturday", time: "8:00 AM - 5:00 PM" },
      { day: "Sunday", time: "Closed" },
    ]),
  },
];

for (const s of sections) {
  await sql`
    INSERT INTO admission_content (section, content, updated_at)
    VALUES (${s.section}, ${s.content}, NOW())
    ON CONFLICT (section) DO UPDATE SET content = ${s.content}, updated_at = NOW()
  `;
}

console.log("Admission content seeded successfully");
await sql.end();
