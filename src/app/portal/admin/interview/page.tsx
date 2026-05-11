import { db } from "@/db";
import { interviewSchedules, interviewAppointments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { InterviewForm } from "./InterviewForm";
import { InterviewList } from "./InterviewList";
import { InterviewAppointments } from "./InterviewAppointments";

export default async function InterviewPage() {
  const schedules = await db
    .select()
    .from(interviewSchedules)
    .orderBy(desc(interviewSchedules.createdAt));

  const appointments = await db
    .select()
    .from(interviewAppointments)
    .orderBy(desc(interviewAppointments.createdAt));

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#007848] via-[#008f56] to-[#00a864] px-6 md:px-10 py-8 md:py-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <span>Admin</span>
            <span className="text-white/40">/</span>
            <span className="text-white/90 font-medium">Interview</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Interview Management</h1>
          <p className="text-white/80 max-w-xl text-sm md:text-base">
            Manage interview schedules, track available slots, and review submitted interview appointments for Initial and Exit interviews.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2">
              <span className="text-2xl font-bold text-white">{schedules.length}</span>
              <span className="text-white/70 text-xs">Schedule{schedules.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2">
              <span className="text-2xl font-bold text-white">{appointments.length}</span>
              <span className="text-white/70 text-xs">Appointment{appointments.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <InterviewForm />
        </div>
        <div className="lg:col-span-2">
          <InterviewList schedules={schedules} />
        </div>
      </div>

      <InterviewAppointments appointments={appointments} />
    </div>
  );
}
