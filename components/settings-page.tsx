"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Building, Lock, Save, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    clinicCode: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMounted(true)
    }
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profileError && profileError.code !== "PGRST116") {
            throw profileError
          }

          setProfile(profileData)
          setFormData({
            fullName: profileData?.full_name || "",
            clinicCode: profileData?.clinic_code || "",
            email: user.email || "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error loading settings",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [hasMounted])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }))
    }
  }

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.clinicCode.trim()) newErrors.clinicCode = "Clinic code is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters"
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateProfileForm()) return

    setIsSaving(true)
    try {
      // Update profile in public.profiles table
      const { data: profileUpdateData, error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          clinic_code: formData.clinicCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (profileUpdateError) throw profileUpdateError

      setProfile(profileUpdateData) // Update local profile state

      // Update user metadata in auth.users (optional, but good for consistency)
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          clinic_code: formData.clinicCode,
        },
      })

      if (authUpdateError) {
        console.error("Failed to update auth metadata:", authUpdateError)
        // Don't throw, as profile update was successful
      }

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswordForm()) return

    setIsSaving(true)
    try {
      // Supabase's updateUser for password change doesn't require current password
      // if the user is already signed in. If you need current password validation,
      // you'd typically do it via a server function or a separate API.
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      })

      if (error) throw error

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }))
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!hasMounted || loading) {
    return (
      <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
        <Card className="max-w-4xl mx-auto glass-panel shadow-2xl">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Please sign in to view settings.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto glass-panel shadow-2xl">
          <CardHeader className="text-center border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Account Settings</CardTitle>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your profile and application preferences.</p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Profile Settings */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <User className="w-5 h-5 mr-2 text-teal-600" />
                Profile Information
              </h3>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clinicCode" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Clinic Code
                    </Label>
                    <Input
                      id="clinicCode"
                      value={formData.clinicCode}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                      placeholder="Your clinic code"
                    />
                    {errors.clinicCode && (
                      <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.clinicCode}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Role
                    </Label>
                    <Input
                      id="role"
                      value={profile?.role || "user"}
                      disabled
                      className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <Separator className="my-8" />

            {/* Password Settings */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-teal-600" />
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.newPassword}
                    </div>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="confirmNewPassword"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmNewPassword && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmNewPassword}
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <Separator className="my-8" />

            {/* Application Preferences */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <Building className="w-5 h-5 mr-2 text-teal-600" />
                Application Preferences
              </h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Enable Dark Mode
                </Label>
                <Switch id="darkMode" /> {/* ThemeToggle handles this globally */}
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Notifications
                </Label>
                <Switch id="notifications" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
