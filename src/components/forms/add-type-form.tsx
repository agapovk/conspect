"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDrillType } from "@/app/actions";
import type { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
  name: z.string().min(1).min(2).max(20),
});

export function AddDrillTypeForm({
  setShowAddTypeDialog,
}: {
  setShowAddTypeDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newType = await addDrillType(values.name);
      console.log(newType);
      toast(
        <span>
          New drill type <b>{newType.name}</b> added!
        </span>,
      );
      setShowAddTypeDialog(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 py-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add new drill type"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Drill type</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
