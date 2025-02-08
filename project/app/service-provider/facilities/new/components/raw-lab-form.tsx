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
import { Textarea } from "@/components/ui/textarea";

const rawLabSchema = z.object({
  areaDetails: z.array(z.object({
    area: z.number().min(0, "Area must be greater than 0"),
    type: z.string().min(1, "Type is required"),
    furnishing: z.string().min(1, "Furnishing details are required"),
    customisation: z.string().min(1, "Customisation details are required"),
    bestFitFor: z.string().min(1, "Best fit details are required")
  })).min(1, "At least one area detail is required"),
  subscriptionPlans: z.array(z.object({
    plan: z.enum(["Monthly", "Annual"]),
    price: z.number().min(0)
  })).min(1),
  images: z.array(z.string().url()).min(1, "At least one image is required")
});

type FormData = z.infer<typeof rawLabSchema>;

export default function RawLabForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(rawLabSchema),
    defaultValues: {
      areaDetails: [{
        area: 0,
        type: "",
        furnishing: "",
        customisation: "",
        bestFitFor: ""
      }],
      subscriptionPlans: [
        { plan: "Monthly", price: 0 },
        { plan: "Annual", price: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "areaDetails"
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityType: "Raw Space-Lab Setup",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Area Details</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({
                  area: 0,
                  type: "",
                  furnishing: "",
                  customisation: "",
                  bestFitFor: ""
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Area
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
                    <Label>Area (in Sq.ft)</Label>
                    <Input
                      type="number"
                      {...register(`areaDetails.${index}.area`, { valueAsNumber: true })}
                    />
                    {errors.areaDetails?.[index]?.area && (
                      <p className="text-sm text-red-500">
                        {errors.areaDetails[index]?.area?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input {...register(`areaDetails.${index}.type`)} />
                    {errors.areaDetails?.[index]?.type && (
                      <p className="text-sm text-red-500">
                        {errors.areaDetails[index]?.type?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Furnishing Details</Label>
                    <Textarea {...register(`areaDetails.${index}.furnishing`)} />
                    {errors.areaDetails?.[index]?.furnishing && (
                      <p className="text-sm text-red-500">
                        {errors.areaDetails[index]?.furnishing?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Customisation Options</Label>
                    <Textarea {...register(`areaDetails.${index}.customisation`)} />
                    {errors.areaDetails?.[index]?.customisation && (
                      <p className="text-sm text-red-500">
                        {errors.areaDetails[index]?.customisation?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Best Fit For</Label>
                    <Textarea {...register(`areaDetails.${index}.bestFitFor`)} />
                    {errors.areaDetails?.[index]?.bestFitFor && (
                      <p className="text-sm text-red-500">
                        {errors.areaDetails[index]?.bestFitFor?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Subscription Plans</Label>
            {["Monthly", "Annual"].map((plan, index) => (
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