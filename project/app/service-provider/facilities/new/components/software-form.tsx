"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const softwareSchema = z.object({
  software: z.array(z.object({
    name: z.string().min(1, "Software name is required"),
    version: z.string().min(1, "Version is required")
  })).min(1, "At least one software is required"),
  subscriptionPlans: z.array(z.object({
    plan: z.enum(["Hourly", "Annual", "Monthly", "Weekly", "per day"]),
    price: z.number().min(0)
  })).min(1)
});

type FormData = z.infer<typeof softwareSchema>;

export default function SoftwareForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      software: [{ name: "", version: "" }],
      subscriptionPlans: [
        { plan: "Hourly", price: 0 },
        { plan: "Annual", price: 0 },
        { plan: "Monthly", price: 0 },
        { plan: "Weekly", price: 0 },
        { plan: "per day", price: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "software"
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityType: "Specialized Softwares",
          status: "pending",
          details: data
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Software Details</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", version: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Software
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-end">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Software Name</Label>
                    <Input {...register(`software.${index}.name`)} />
                    {errors.software?.[index]?.name && (
                      <p className="text-sm text-red-500">
                        {errors.software[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Input {...register(`software.${index}.version`)} />
                    {errors.software?.[index]?.version && (
                      <p className="text-sm text-red-500">
                        {errors.software[index]?.version?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Subscription Plans</Label>
            {["Hourly", "Annual", "Monthly", "Weekly", "per day"].map((plan, index) => (
              <div key={plan} className="flex items-center gap-4">
                <span className="w-24">{plan}</span>
                <Input
                  type="number"
                  placeholder="Price"
                  {...register(`subscriptionPlans.${index}.price` as const, { valueAsNumber: true })}
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
} 