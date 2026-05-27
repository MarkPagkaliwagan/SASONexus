import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CrfData {
  fullName: string | null;
  schoolId: string | null;
  academicYear: string | null;
  department: string | null;
  collegeProgram: string | null;
  email: string | null;
  contactNumber: string | null;
  address: string | null;
  birthday: string | null;
  age: string | null;
  nationality: string | null;
  elemSchool: string | null;
  elemYear: string | null;
  jhsSchool: string | null;
  jhsYear: string | null;
  shsSchool: string | null;
  shsYear: string | null;
  collegeYearLevel: string | null;
  corUpload: string | null;
  enrollmentFormUpload: string | null;
  admissionRecordUpload: string | null;
  reportCardUpload: string | null;
  torUpload: string | null;
  subjectLoadUpload: string | null;
  psaBirthCertUpload: string | null;
  idPictureUpload: string | null;
  schoolIdUpload: string | null;
  goodMoralUpload: string | null;
  conductRecordUpload: string | null;
  parentName: string | null;
  parentRelationship: string | null;
  parentContact: string | null;
  emergencyPerson: string | null;
  emergencyRelationship: string | null;
  emergencyContact: string | null;
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

export async function generateCrfPdf(data: CrfData): Promise<jsPDF> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── Logos ──
  let spcLogo: string | null = null;
  let sasoLogo: string | null = null;
  try {
    const origin = window.location.origin;
    [spcLogo, sasoLogo] = await Promise.all([
      urlToBase64(`${origin}/SPCLOGO.png`),
      urlToBase64(`${origin}/SASOLOGO.png`),
    ]);
  } catch {
    // logos are optional; continue without them
  }

  const logoW = 16;
  const logoH = 16;

  if (spcLogo) {
    doc.addImage(spcLogo, "PNG", margin, y - 2, logoW, logoH);
  }
  if (sasoLogo) {
    doc.addImage(sasoLogo, "PNG", pageW - margin - logoW, y - 2, logoW, logoH);
  }

  // ── Header ──
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
  doc.text("Cumulative Record Folder (SF10-REV)", pageW / 2, y, { align: "center" });
  y += 6;

  // thin line
  doc.setDrawColor(0, 120, 72);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // ── 1. Student Basic Info ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("I. STUDENT INFORMATION", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const basicRows = [
    ["Full Name:", data.fullName || "N/A", "School ID:", data.schoolId || "N/A"],
    ["Academic Year:", data.academicYear || "N/A", "Department:", data.department || "N/A"],
    ["Course/Strand/Grade Level:", data.collegeProgram || "N/A", "Status:", data.status || "N/A"],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: basicRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 30 }, 1: { cellWidth: 55 }, 2: { fontStyle: "bold", cellWidth: 30 }, 3: { cellWidth: 55 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // ── 2. Personal Info ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("II. PERSONAL INFORMATION", margin, y);
  y += 6;

  const personalRows = [
    ["Email:", data.email || "N/A", "Contact No.:", data.contactNumber || "N/A"],
    ["Address:", data.address || "N/A", "", ""],
    ["Birthday:", data.birthday || "N/A", "Age:", data.age || "N/A"],
    ["Nationality:", data.nationality || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: personalRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 25 }, 1: { cellWidth: 55 }, 2: { fontStyle: "bold", cellWidth: 25 }, 3: { cellWidth: 55 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // ── 3. Educational Background ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("III. EDUCATIONAL BACKGROUND", margin, y);
  y += 6;

  const eduRows = [
    ["Elementary School:", data.elemSchool || "N/A", "Year Graduated:", data.elemYear || "N/A"],
    ["Junior High School:", data.jhsSchool || "N/A", "Year Graduated:", data.jhsYear || "N/A"],
    ["Senior High School:", data.shsSchool || "N/A", "Year Graduated:", data.shsYear || "N/A"],
    ["College Program:", data.collegeProgram || "N/A", "Year Level:", data.collegeYearLevel || "N/A"],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: eduRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 35 }, 1: { cellWidth: 40 }, 2: { fontStyle: "bold", cellWidth: 30 }, 3: { cellWidth: 35 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // ── 4. Document Checklist ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("IV. DOCUMENT CHECKLIST", margin, y);
  y += 6;

  const docs: [string, string | null][] = [
    ["Certificate of Registration (COR)", data.corUpload],
    ["Enrollment / Admission Form", data.enrollmentFormUpload],
    ["Admission Record", data.admissionRecordUpload],
    ["Report Card (Form 138)", data.reportCardUpload],
    ["Transcript of Records (Form 137)", data.torUpload],
    ["Subject Load / Schedule", data.subjectLoadUpload],
    ["PSA Birth Certificate", data.psaBirthCertUpload],
    ["2x2 ID Picture", data.idPictureUpload],
    ["School ID Copy", data.schoolIdUpload],
    ["Good Moral Certificate", data.goodMoralUpload],
    ["Discipline / Conduct Record", data.conductRecordUpload],
  ];
  const docRows = docs.map(([name, file]) => [name, file ? "✓ Submitted" : "— Not Submitted"]);
  autoTable(doc, {
    startY: y,
    head: [["Document", "Status"]],
    body: docRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 120, 72], textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 60 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // ── 5. Emergency Contact ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("V. EMERGENCY CONTACT", margin, y);
  y += 6;

  const emergencyRows = [
    ["Parent/Guardian:", data.parentName || "N/A", "Relationship:", data.parentRelationship || "N/A"],
    ["Parent Contact:", data.parentContact || "N/A", "", ""],
    ["Emergency Person:", data.emergencyPerson || "N/A", "Relationship:", data.emergencyRelationship || "N/A"],
    ["Emergency Contact:", data.emergencyContact || "N/A", "", ""],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: emergencyRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 30 }, 1: { cellWidth: 45 }, 2: { fontStyle: "bold", cellWidth: 25 }, 3: { cellWidth: 40 } },
    margin: { left: margin },
    tableWidth: contentW,
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Footer ──
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(128);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`, margin, y);

  return doc;
}
