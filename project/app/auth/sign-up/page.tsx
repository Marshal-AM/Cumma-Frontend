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
  startupName: z.string().min(2),
  contactNumber: z.string().min(10),
  contactName: z.string().min(2),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userType: "startup",
          authProvider: "local",
        }),
      });

      if (response.ok) {
        router.push("/auth/sign-in");
      } else {
        console.error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
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
            Create an account to explore more features on FacilitiEase.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: weebsitestudio@gmail.com"
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
                placeholder="Ex: Abcd@12345"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="startupName" className="block text-sm font-medium text-gray-700">
                Startup Name
              </label>
              <Input
                id="startupName"
                type="text"
                placeholder="Ex: Weebsitestudio pvt ltd"
                {...register("startupName")}
                className={errors.startupName ? "border-red-500" : ""}
              />
              {errors.startupName && (
                <p className="mt-1 text-xs text-red-500">{errors.startupName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number / WhatsApp Number
              </label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Ex: +91 78459 55939"
                {...register("contactNumber")}
                className={errors.contactNumber ? "border-red-500" : ""}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.contactNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                Contact Name
              </label>
              <Input
                id="contactName"
                type="text"
                placeholder="Ex: John Doe"
                {...register("contactName")}
                className={errors.contactName ? "border-red-500" : ""}
              />
              {errors.contactName && (
                <p className="mt-1 text-xs text-red-500">{errors.contactName.message}</p>
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
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create an account"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">OR</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full p-2"
              onClick={() => {/* Handle Google sign in */}}
            >
              G
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full p-2 bg-[#1877F2] text-white hover:bg-[#1865D1]"
              onClick={() => {/* Handle Facebook sign in */}}
            >
              f
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full p-2 bg-black text-white hover:bg-gray-800"
              onClick={() => {/* Handle Apple sign in */}}
            >
              
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="font-medium text-green-600 hover:text-green-500">
                Go to Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}