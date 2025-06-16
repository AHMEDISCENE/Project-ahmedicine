"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    toast({
      title: "Sign In Successful",
      description: "Welcome back to VetOncoData",
    })
    router.push("/")
  }

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true)

    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsGoogleLoading(false)
    toast({
      title: "Google Sign In Successful",
      description: "Welcome to VetOncoData",
    })
    router.push("/")
  }

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset instructions sent to your email",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Activity className="h-10 w-10 text-teal-600" />
            <span className="text-2xl font-bold text-slate-800">VetOncoData</span>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 mx-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {/* Google OAuth Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleAuth}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2" />
                        Signing in with Google...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Continue with Google
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">Or continue with email</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@clinic.com" required />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-teal-600 p-0 h-auto"
                        type="button"
                        onClick={handleForgotPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input id="password" type="password" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicCode">Clinic Code</Label>
                    <Input id="clinicCode" placeholder="Enter your clinic code" required />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {/* Google OAuth Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleAuth}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2" />
                        Creating account with Google...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Sign up with Google
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">Or create account with email</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Dr. Jane Smith" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input id="registerEmail" type="email" placeholder="name@clinic.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input id="registerPassword" type="password" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerClinicCode">Clinic Code</Label>
                    <Input id="registerClinicCode" placeholder="Enter your clinic code" required />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-center p-4 border-t border-slate-200">
            <Lock className="h-4 w-4 text-slate-400 mr-2" />
            <span className="text-xs text-slate-500">Secure, encrypted connection</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
