import { auth, currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId, redirectToSignIn } = await auth();
  const user = await currentUser();

  if (!userId) return redirectToSignIn();
  return (
    <div className="p-4">
      Hello {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
    </div>
  );
}
