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

const meetingRoomSchema = z.object({
  conferenceRooms: z.object({
    total: z.number().min(0),
    seaters: z.number().min(0)
  }),
  trainingRooms: z.object({
    total: z.number().min(0),
    seaters: z.number().min(0)
  }),
  rentalPlans: z.array(z.object({
    plan: z.enum(["per day", "hourly", "weekly"]),
    price: z.number().min(0)
  })).min(1),
  images: z.array(z.string().url()).min(1)
});

type FormData = z.infer<typeof meetingRoomSchema>;

export default function MeetingRoomForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(meetingRoomSchema),
    defaultValues: {
      conferenceRooms: { total: 0, seaters: 0 },
      trainingRooms: { total: 0, seaters: 0 },
      rentalPlans: [
        { plan: "per day", price: 0 },
        { plan: "hourly", price: 0 },
        { plan: "weekly", price: 0 }
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
          facilityType: "Meeting/Board Rooms",
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
            <Label>Conference Rooms</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="confTotal">Total Rooms</Label>
                <Input
                  id="confTotal"
                  type="number"
                  {...register("conferenceRooms.total", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confSeaters">Number of Seaters</Label>
                <Input
                  id="confSeaters"
                  type="number"
                  {...register("conferenceRooms.seaters", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Training Rooms</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainTotal">Total Rooms</Label>
                <Input
                  id="trainTotal"
                  type="number"
                  {...register("trainingRooms.total", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainSeaters">Number of Seaters</Label>
                <Input
                  id="trainSeaters"
                  type="number"
                  {...register("trainingRooms.seaters", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Rental Plans</Label>
            {["per day", "hourly", "weekly"].map((plan, index) => (
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