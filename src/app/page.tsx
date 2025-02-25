import Upload from "@/components/upload";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) return <div>To show this page you need to be signed in</div>;

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      Scheme: true,
    },
  });
  if (!user) return <div>Could not find user</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        Hello {user.firstName ?? user.email}
        <Upload />
      </div>
      <h3 className="text-lg">User images</h3>
      <ul>
        {user.Scheme.map((s) => (
          <li key={s.id}>- {s.name}</li>
        ))}
      </ul>
    </div>
  );
}
