import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { BMIInputForm } from "@/components/bmi-input-form";
import { BMIChart } from "@/components/bmi-chart";
import { BMIStats } from "@/components/bmi-stats";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch BMI entries for the user
  const entries = await prisma.bMIEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  // Serialize dates to strings to avoid passing Date objects to client components
  const serializedEntries = entries.map(entry => ({
    ...entry,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto p-4 space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1">
          <BMIInputForm />
        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-2">
          <BMIChart data={serializedEntries} />
        </div>
      </div>

      {/* Bottom Section: Stats */}
      <BMIStats data={serializedEntries} />
    </div>
  );
}
