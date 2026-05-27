import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface NeedsAssessmentData {
  fullName: string | null;
  studentId: string | null;
  schoolId: string | null;
  academicYear: string | null;
  department: string | null;
  courseOrStrand: string | null;
  email: string | null;
  contactNumber: string | null;
  birthday: string | null;
  age: string | null;
  address: string | null;
  academicDifficultSubjects: string | null;
  academicStudyHabits: string | null;
  academicLearningDifficulties: string | null;
  academicConcerns: string | null;
  personalProblems: string | null;
  personalAdjustment: string | null;
  personalFamilyConcerns: string | null;
  emotionalStressLevel: string | null;
  emotionalAnxiety: string | null;
  emotionalMotivation: string | null;
  emotionalSelfConfidence: string | null;
  socialClassmates: string | null;
  socialFriendships: string | null;
  socialCommunication: string | null;
  socialBullying: string | null;
  financialAllowance: string | null;
  financialExpenses: string | null;
  financialScholarship: string | null;
  careerGoal: string | null;
  careerUncertainty: string | null;
  careerSkills: string | null;
  healthMedical: string | null;
  healthPhysicalLimitations: string | null;
  supportCounseling: boolean | null;
  supportAcademic: boolean | null;
  supportScholarship: boolean | null;
  supportCareer: boolean | null;
  supportOther: string | null;
  otherConcerns: string | null;
  status: string | null;
  createdAt: Date | null;
}

function urlToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function generateNeedsAssessmentPdf(data: NeedsAssessmentData): Promise<jsPDF> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  let spcLogo: string | null = null;
  let sasoLogo: string | null = null;
  try {
    const origin = window.location.origin;
    [spcLogo, sasoLogo] = await Promise.all([
      urlToBase64(`${origin}/SPCLOGO.png`),
      urlToBase64(`${origin}/SASOLOGO.png`),
    ]);
  } catch {
    // logos are optional
  }

  const logoW = 16;
  const logoH = 16;

  if (spcLogo) {
    doc.addImage(spcLogo, "PNG", margin, y - 2, logoW, logoH);
  }
  if (sasoLogo) {
    doc.addImage(sasoLogo, "PNG", pageW - margin - logoW, y - 2, logoW, logoH);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("San Pablo Colleges", pageW / 2, y, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Student Affairs & Services Office", pageW / 2, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Hermanos Belen St., San Pablo City  |  (049) 562-4688  |  www.sanpablocolleges.edu.ph", pageW / 2, y, { align: "center" });
  y += 4;
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Student Needs Assessment Form", pageW / 2, y, { align: "center" });
  y += 6;

  doc.setDrawColor(0, 120, 72);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // I. Basic Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("I. BASIC INFORMATION", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const basicRows = [
    ["Full Name:", data.fullName || "N/A", "Student ID:", data.studentId || "N/A"],
    ["School ID:", data.schoolId || "N/A", "Email:", data.email || "N/A"],
    ["Contact No.:", data.contactNumber || "N/A", "Birthday:", data.birthday || "N/A"],
    ["Age:", data.age || "N/A", "Status:", data.status || "N/A"],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: basicRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 25 }, 1: { cellWidth: 55 }, 2: { fontStyle: "bold", cellWidth: 25 }, 3: { cellWidth: 55 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 3;

  const addrRows = [
    ["Address:", data.address || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: addrRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 25 }, 1: { cellWidth: 135 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // II. School Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("II. SCHOOL INFORMATION", margin, y);
  y += 6;

  const schoolRows = [
    ["Academic Year:", data.academicYear || "N/A", "Department:", data.department || "N/A"],
    ["Course/Strand/Grade Level:", data.courseOrStrand || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: schoolRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 1: { cellWidth: 45 }, 2: { fontStyle: "bold", cellWidth: 25 }, 3: { cellWidth: 55 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // III. Academic Concerns
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("III. ACADEMIC CONCERNS", margin, y);
  y += 6;

  const academicRows = [
    ["Difficult Subjects:", data.academicDifficultSubjects || "N/A", "", ""],
    ["Study Habits:", data.academicStudyHabits || "N/A", "", ""],
    ["Learning Difficulties:", data.academicLearningDifficulties || "N/A", "", ""],
    ["Other Concerns:", data.academicConcerns || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: academicRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 1: { cellWidth: 125 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // IV. Personal Concerns
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("IV. PERSONAL CONCERNS", margin, y);
  y += 6;

  const personalRows = [
    ["Personal Problems:", data.personalProblems || "N/A", "", ""],
    ["Adjustment:", data.personalAdjustment || "N/A", "", ""],
    ["Family Concerns:", data.personalFamilyConcerns || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: personalRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 1: { cellWidth: 125 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // V. Emotional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("V. EMOTIONAL", margin, y);
  y += 6;

  const emotionalRows = [
    ["Stress Level:", data.emotionalStressLevel || "N/A", "", ""],
    ["Anxiety / Sadness / Pressure:", data.emotionalAnxiety || "N/A", "", ""],
    ["Motivation Issues:", data.emotionalMotivation || "N/A", "", ""],
    ["Self-Confidence:", data.emotionalSelfConfidence || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: emotionalRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 }, 1: { cellWidth: 120 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // VI. Social
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VI. SOCIAL", margin, y);
  y += 6;

  const socialRows = [
    ["Relationship w/ Classmates:", data.socialClassmates || "N/A", "", ""],
    ["Friendships / Peer Interaction:", data.socialFriendships || "N/A", "", ""],
    ["Communication Difficulties:", data.socialCommunication || "N/A", "", ""],
    ["Bullying Concerns:", data.socialBullying || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: socialRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 42 }, 1: { cellWidth: 118 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // VII. Financial
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VII. FINANCIAL", margin, y);
  y += 6;

  const financialRows = [
    ["Allowance Concerns:", data.financialAllowance || "N/A", "", ""],
    ["School Expenses Difficulty:", data.financialExpenses || "N/A", "", ""],
    ["Scholarship Needs:", data.financialScholarship || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: financialRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 }, 1: { cellWidth: 120 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // VIII. Career
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VIII. CAREER", margin, y);
  y += 6;

  const careerRows = [
    ["Career Goal / Course Interest:", data.careerGoal || "N/A", "", ""],
    ["Uncertainty sa Course:", data.careerUncertainty || "N/A", "", ""],
    ["Skills or Interests:", data.careerSkills || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: careerRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 42 }, 1: { cellWidth: 118 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // IX. Health
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("IX. HEALTH", margin, y);
  y += 6;

  const healthRows = [
    ["Medical Condition:", data.healthMedical || "N/A", "", ""],
    ["Physical Limitations:", data.healthPhysicalLimitations || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: healthRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 1: { cellWidth: 125 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // X. Support Needed
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("X. SUPPORT NEEDED", margin, y);
  y += 6;

  const supportItems: string[] = [];
  if (data.supportCounseling) supportItems.push("✓ Counseling");
  if (data.supportAcademic) supportItems.push("✓ Academic Support");
  if (data.supportScholarship) supportItems.push("✓ Scholarship Assistance");
  if (data.supportCareer) supportItems.push("✓ Career Guidance");
  const supportStr = supportItems.length > 0 ? supportItems.join(", ") : "None selected";

  const supportRows = [
    ["Support Needed:", supportStr, "", ""],
    ["Other Support:", data.supportOther || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: supportRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 30 }, 1: { cellWidth: 130 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // XI. Other Concerns
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("XI. OTHER CONCERNS", margin, y);
  y += 6;

  const otherRows = [
    [data.otherConcerns || "N/A", "", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: otherRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: contentW } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(128);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`, margin, y);

  return doc;
}
