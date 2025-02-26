"use server";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addDrillType(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("To show this page you need to be signed in");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("Could not find user");

  try {
    const newDrillType = await prisma.drillType.create({
      data: {
        name,
        userId: user.id,
      },
    });
    revalidatePath("/drills/add");

    return newDrillType;
  } catch (error) {
    console.error("Error adding new DrillType:", error);
    throw error;
  }
}

export async function addDrill(data: {
  name: string;
  typeId: string;
  description: string | null;
  fieldSize: string | null;
  playersAmount: string | null;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("To show this page you need to be signed in");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("Could not find user");

  try {
    const newDrill = await prisma.drill.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
    revalidatePath("/drills");

    return newDrill;
  } catch (error) {
    console.error("Error adding new Drill:", error);
    throw error;
  }
}
