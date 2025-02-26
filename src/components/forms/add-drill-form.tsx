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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DrillType, Scheme } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

import { addDrill } from "@/app/actions";
import { useRouter } from "next/navigation";
import { AddDrillTypeForm } from "./add-type-form";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  typeId: z.string(),
  description: z.string().optional(),
  fieldSize: z.string().min(1).min(1).max(30).optional(),
  playersAmount: z.string().min(1).min(1).max(30).optional(),
  schemeId: z.string().optional(),
});

export function AddDrillForm({
  drillTypes,
  schemes,
}: {
  drillTypes: DrillType[];
  schemes: Scheme[];
}) {
  const [showAddTypeDialog, setShowAddTypeDialog] = React.useState(false);
  const [showSelectSchemeDialog, setShowSelectSchemeDialog] =
    React.useState(false);
  const [selectedScheme, setSelectedScheme] = React.useState<Scheme | null>(
    null,
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      fieldSize: "",
      playersAmount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        name: values.name,
        typeId: values.typeId,
        description: values.description ?? null,
        fieldSize: values.fieldSize ?? null,
        playersAmount: values.playersAmount ?? null,
        schemeId: selectedScheme?.id ?? null,
      };
      const newDrill = await addDrill(data);
      console.log(newDrill);
      toast(
        <span>
          New drill <b>{newDrill.name}</b> added!
        </span>,
      );
      form.reset();
      router.push("/drills");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  function handleExistingImageSelect(scheme: Scheme) {
    setSelectedScheme(scheme);
    setShowSelectSchemeDialog(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drill name</FormLabel>
              <FormControl>
                <Input placeholder="Rondo 7x3" type="text" {...field} />
              </FormControl>
              <FormDescription>The drill name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <Dialog
              open={showAddTypeDialog}
              onOpenChange={setShowAddTypeDialog}
            >
              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drill type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tactical" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="w-full">
                            <PlusCircle className="h-5 w-5" />
                            Add type
                          </Button>
                        </DialogTrigger>
                        <SelectSeparator />
                        {drillTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Type of your drill</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new drill type</DialogTitle>
                  <DialogDescription>
                    Add a new drill type to the list of available
                  </DialogDescription>
                </DialogHeader>
                <AddDrillTypeForm setShowAddTypeDialog={setShowAddTypeDialog} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drill description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Try to keep the ball"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Description of the drill</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Drill image
          </p>
          <Dialog
            open={showSelectSchemeDialog}
            onOpenChange={setShowSelectSchemeDialog}
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex">
                <PlusCircle className="h-5 w-5" />
                Add image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Image for the drill</DialogTitle>
                <DialogDescription>
                  Choose image or add a new one
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-2">
                  {schemes.map((scheme) => (
                    <Image
                      key={scheme.id}
                      src={scheme.url}
                      alt={scheme.name}
                      width={100}
                      height={100}
                      className="aspect-video w-full cursor-pointer rounded-md object-contain hover:ring-2 hover:ring-primary"
                      onClick={() => handleExistingImageSelect(scheme)}
                    />
                  ))}
                </div>
                <div>
                  <Button
                  // onChange={handleImageUpload}
                  >
                    Upload new image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {selectedScheme && (
            <>
              <Image
                src={selectedScheme.url}
                alt={selectedScheme.name}
                width={320}
                height={180}
                priority={true}
                className="rounded-md border bg-background object-cover p-2 transition-all hover:scale-110"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setSelectedScheme(null)}
              >
                Delete
              </Button>
            </>
          )}
        </div>

        <FormField
          control={form.control}
          name="fieldSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field size</FormLabel>
              <FormControl>
                <Input placeholder="16x12m" type="text" {...field} />
              </FormControl>
              <FormDescription>Field size</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="playersAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount of players</FormLabel>
              <FormControl>
                <Input placeholder="10" type="text" {...field} />
              </FormControl>
              <FormDescription>
                The amount of players for the drill
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
