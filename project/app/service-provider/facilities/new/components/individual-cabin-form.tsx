"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./image-upload";

const individualCabinSchema = z.object({
  totalCabins: z.number().min(0),
  availableCabins: z.number().min(0),
  rentalPlans: z.array(z.object({
    plan: z.enum(["Annual", "Monthly", "Weekly", "per day"]),
    price: z.number().min(0)
  })).min(1),
  images: z.array(z.string().url()).min(1)
});

type FormData = z.infer<typeof individualCabinSchema>;

export default function IndividualCabinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(individualCabinSchema),
    defaultValues: {
      totalCabins: 0,
      availableCabins: 0,
      rentalPlans: [
        { plan: "Annual", price: 0 },
        { plan: "Monthly", price: 0 },
        { plan: "Weekly", price: 0 },
        { plan: "per day", price: 0 }
      ],
      images: []
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityType: "Individual Cabin",
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

      // Handle success (e.g., show success message, redirect)
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalCabins">Total Individual Cabins</Label>
              <Input
                id="totalCabins"
                type="number"
                {...register("totalCabins", { valueAsNumber: true })}
              />
              {errors.totalCabins && (
                <p className="text-sm text-red-500">{errors.totalCabins.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableCabins">Available Cabins</Label>
              <Input
                id="availableCabins"
                type="number"
                {...register("availableCabins", { valueAsNumber: true })}
              />
              {errors.availableCabins && (
                <p className="text-sm text-red-500">{errors.availableCabins.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Rental Plans</Label>
            {["Annual", "Monthly", "Weekly", "per day"].map((plan, index) => (
              <div key={plan} className="flex items-center gap-4">
                <span className="w-24">{plan}</span>
                <Input
                  type="number"
                  placeholder="Price"
                  {...register(`rentalPlans.${index}.price` as const, { valueAsNumber: true })}
                />
              </div>
            ))}
          </div>

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