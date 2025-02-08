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

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        // Handle error
        console.error("Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
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
            Sign in with this account to explore more features on FacilitiEase.
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
                <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>
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
                <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  {...register("rememberMe")}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">OR</p>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {/* Handle Google sign in */}}
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#1877F2] text-white hover:bg-[#1865D1]"
              onClick={() => {/* Handle Facebook sign in */}}
            >
              Continue with Facebook
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={() => {/* Handle Apple sign in */}}
            >
              Continue with Apple
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Not yet registered?{" "}
              <Link href="/auth/sign-up" className="font-medium text-green-600 hover:text-green-500">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}