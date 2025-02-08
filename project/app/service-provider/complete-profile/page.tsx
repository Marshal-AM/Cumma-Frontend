"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";

const serviceProviderSchema = z.object({
  serviceProviderType: z.enum([
    "Incubator",
    "Accelerator",
    "Institution/University",
    "Private Coworking Space",
    "Community Space",
    "Cafe"
  ]),
  serviceName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  stateProvince: z.string().min(1),
  zipPostalCode: z.string().min(1),
  primaryContact1Name: z.string().min(1),
  primaryContact1Designation: z.string().min(1),
  contact2Name: z.string().nullable(),
  contact2Designation: z.string().nullable(),
  primaryContactNumber: z.string().min(1),
  alternateContactNumber: z.string().nullable(),
  primaryEmailId: z.string().email(),
  alternateEmailId: z.string().email().nullable(),
  websiteUrl: z.string().url().nullable(),
});

export default function CompleteProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("serviceProviderSignup");
    if (!savedData) {
      router.push("/service-provider/auth/sign-up");
      return;
    }
    setInitialData(JSON.parse(savedData));
  }, [router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      serviceName: initialData?.serviceName || "",
      primaryContactNumber: initialData?.contactNumber || "",
      primaryEmailId: initialData?.email || "",
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      if (!initialData) {
        throw new Error("Initial signup data not found");
      }

      // Create user and service provider profile
      const response = await fetch("/api/auth/service-provider/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email: initialData.email,
            password: initialData.password,
            userType: "Service Provider",
            authProvider: "local",
          },
          serviceProvider: {
            ...data,
            serviceName: initialData.serviceName,
          }
        }),
      });

      if (response.ok) {
        localStorage.removeItem("serviceProviderSignup");
        router.push("/service-provider/dashboard");
      } else {
        const result = await response.json();
        setError(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    }
    setIsLoading(false);
  };

  if (!initialData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto space-y-8 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="FacilitiEase Logo"
              width={200}
              height={80}
              className="mx-auto"
              priority
            />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Complete Your Service Provider Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please provide all the required information to complete your profile
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 required">
                  Service Provider Type
                </label>
                <Select
                  onValueChange={(value) => setValue("serviceProviderType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Incubator">Incubator</SelectItem>
                    <SelectItem value="Accelerator">Accelerator</SelectItem>
                    <SelectItem value="Institution/University">Institution/University</SelectItem>
                    <SelectItem value="Private Coworking Space">Private Coworking Space</SelectItem>
                    <SelectItem value="Community Space">Community Space</SelectItem>
                    <SelectItem value="Cafe">Cafe</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceProviderType && (
                  <p className="mt-1 text-xs text-red-500">{errors.serviceProviderType.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 required">
                  Address
                </label>
                <Input
                  {...register("address")}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 required">
                  City
                </label>
                <Input
                  {...register("city")}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 required">
                  State/Province
                </label>
                <Input
                  {...register("stateProvince")}
                  className={errors.stateProvince ? "border-red-500" : ""}
                />
                {errors.stateProvince && (
                  <p className="mt-1 text-xs text-red-500">{errors.stateProvince.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 required">
                  ZIP/Postal Code
                </label>
                <Input
                  {...register("zipPostalCode")}
                  className={errors.zipPostalCode ? "border-red-500" : ""}
                />
                {errors.zipPostalCode && (
                  <p className="mt-1 text-xs text-red-500">{errors.zipPostalCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 required">
                  Primary Contact Name
                </label>
                <Input
                  {...register("primaryContact1Name")}
                  className={errors.primaryContact1Name ? "border-red-500" : ""}
                />
                {errors.primaryContact1Name && (
                  <p className="mt-1 text-xs text-red-500">{errors.primaryContact1Name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 required">
                  Primary Contact Designation
                </label>
                <Input
                  {...register("primaryContact1Designation")}
                  className={errors.primaryContact1Designation ? "border-red-500" : ""}
                />
                {errors.primaryContact1Designation && (
                  <p className="mt-1 text-xs text-red-500">{errors.primaryContact1Designation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Contact Name (Optional)
                </label>
                <Input
                  {...register("contact2Name")}
                  className={errors.contact2Name ? "border-red-500" : ""}
                />
                {errors.contact2Name && (
                  <p className="mt-1 text-xs text-red-500">{errors.contact2Name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Contact Designation (Optional)
                </label>
                <Input
                  {...register("contact2Designation")}
                  className={errors.contact2Designation ? "border-red-500" : ""}
                />
                {errors.contact2Designation && (
                  <p className="mt-1 text-xs text-red-500">{errors.contact2Designation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Contact Number (Optional)
                </label>
                <Input
                  {...register("alternateContactNumber")}
                  className={errors.alternateContactNumber ? "border-red-500" : ""}
                />
                {errors.alternateContactNumber && (
                  <p className="mt-1 text-xs text-red-500">{errors.alternateContactNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Email ID (Optional)
                </label>
                <Input
                  type="email"
                  {...register("alternateEmailId")}
                  className={errors.alternateEmailId ? "border-red-500" : ""}
                />
                {errors.alternateEmailId && (
                  <p className="mt-1 text-xs text-red-500">{errors.alternateEmailId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website URL (Optional)
                </label>
                <Input
                  type="url"
                  {...register("websiteUrl")}
                  placeholder="https://example.com"
                  className={errors.websiteUrl ? "border-red-500" : ""}
                />
                {errors.websiteUrl && (
                  <p className="mt-1 text-xs text-red-500">{errors.websiteUrl.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}