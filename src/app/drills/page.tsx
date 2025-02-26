import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DrillsPage() {
  const { userId } = await auth();
  if (!userId) return <div>To show this page you need to be signed in</div>;

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      drills: true,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl">DrillsPage</h3>
        <Link href="/drills/add">
          <Button>Add drill</Button>
        </Link>
      </div>
      <ul>{user?.drills.map((d) => <li key={d.id}>- {d.name}</li>)}</ul>
    </div>
  );
}
