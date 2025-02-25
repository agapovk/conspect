import Upload from "@/components/upload";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) return <div>To show this page you need to be signed in</div>;

  const user = await currentUser();
  return (
    <div>
      <div className="flex items-start justify-between">
        Hello {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
        <Upload />
      </div>
    </div>
  );
}
