import { AddDrillForm } from "@/components/forms/add-drill-form";
import { db } from "@/server/db";

import { auth } from "@clerk/nextjs/server";

export default async function AddDrillPage() {
  const { userId } = await auth();
  if (!userId) return <div>To show this page you need to be signed in</div>;

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      drillTypes: true,
      schemes: true,
    },
  });

  return (
    <div>
      AddDrillPage
      <AddDrillForm
        drillTypes={user?.drillTypes ?? []}
        schemes={user?.schemes ?? []}
      />
    </div>
  );
}
