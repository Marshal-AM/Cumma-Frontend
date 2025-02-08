"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  serviceName: z.string().min(1),
  contactNumber: z.string().min(10),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export default function ServiceProviderSignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      // Store initial data in localStorage
      const initialData = {
        email: data.email,
        password: data.password,
        serviceName: data.serviceName,
        contactNumber: data.contactNumber,
        userType: "Service Provider",
        authProvider: "local",
      };
      localStorage.setItem("serviceProviderSignup", JSON.stringify(initialData));
      router.push("/service-provider/complete-profile");
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="FacilitiEase Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
          <p className="mt-2 text-sm text-gray-600">
            Create a Service Provider account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: provider@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
                Service Provider Name
              </label>
              <Input
                id="serviceName"
                type="text"
                placeholder="Ex: Tech Growth Hub"
                {...register("serviceName")}
                className={errors.serviceName ? "border-red-500" : ""}
              />
              {errors.serviceName && (
                <p className="mt-1 text-xs text-red-500">{errors.serviceName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Ex: +1-415-555-1234"
                {...register("contactNumber")}
                className={errors.contactNumber ? "border-red-500" : ""}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.contactNumber.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => {
                  setValue("agreeToTerms", checked, { shouldValidate: true });
                }}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                By Signing up, you agree to our terms of service and policy.
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={isLoading || !agreeToTerms}
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/service-provider/auth/sign-in" className="font-medium text-green-600 hover:text-green-500">
                Go to Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}