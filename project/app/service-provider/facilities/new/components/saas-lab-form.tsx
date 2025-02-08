"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./image-upload";
import { Plus, Trash2 } from "lucide-react";

// Schema is identical to Prototyping Labs
const saasLabSchema = z.object({
  equipment: z.array(z.object({
    equipmentName: z.string().min(1, "Equipment name is required"),
    capacity: z.string().min(1, "Capacity is required"),
    make: z.string().min(1, "Make is required")
  })).min(1, "At least one equipment is required"),
  subscriptionPlans: z.array(z.object({
    plan: z.enum(["Hourly", "Annual", "Monthly", "Weekly", "per day"]),
    price: z.number().min(0)
  })).min(1),
  images: z.array(z.string().url()).min(1, "At least one image is required")
});

type FormData = z.infer<typeof saasLabSchema>;

export default function SaasLabForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(saasLabSchema),
    defaultValues: {
      equipment: [{ equipmentName: "", capacity: "", make: "" }],
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
    name: "equipment"
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityType: "SAAS Labs and Facilities",
          status: "pending",
          details: {
            ...data,
            images
          }
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

  // The JSX is identical to Prototyping Labs form
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Equipment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Equipment Details</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ equipmentName: "", capacity: "", make: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Equipment Name</Label>
                    <Input {...register(`equipment.${index}.equipmentName`)} />
                    {errors.equipment?.[index]?.equipmentName && (
                      <p className="text-sm text-red-500">
                        {errors.equipment[index]?.equipmentName?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Input {...register(`equipment.${index}.capacity`)} />
                    {errors.equipment?.[index]?.capacity && (
                      <p className="text-sm text-red-500">
                        {errors.equipment[index]?.capacity?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input {...register(`equipment.${index}.make`)} />
                    {errors.equipment?.[index]?.make && (
                      <p className="text-sm text-red-500">
                        {errors.equipment[index]?.make?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subscription Plans Section */}
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

          {/* Images Section */}
          <div className="space-y-4">
            <Label>Facility Images</Label>
            <ImageUpload
              value={images}
              onChange={setImages}
              onRemove={(url) => setImages(images.filter((image) => image !== url))}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
} 