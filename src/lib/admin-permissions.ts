const routePermissions: [string, string][] = [
  ["/portal/admin/admission/academic-years", "academic-setup"],
  ["/portal/admin/admission/courses", "academic-setup"],
  ["/portal/admin/admission/strands", "academic-setup"],
  ["/portal/admin/admission/announcements", "announcements"],
  ["/portal/admin/academic-setup", "academic-setup"],
  ["/portal/admin/cumulative-records", "cumulative-records"],
  ["/portal/admin/student-needs-assessment", "student-needs-assessment"],
  ["/portal/admin/handbooks-pillars", "handbooks-pillars"],
  ["/portal/admin/personnel", "personnel"],
  ["/portal/admin/admission", "admission"],
  ["/portal/admin/interview", "interview"],
  ["/portal/admin/document-claims", "document-claims"],
];

export function getRequiredPermission(pathname: string): string | null {
  for (const [route, permission] of routePermissions) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return permission;
    }
  }
  return null;
}
