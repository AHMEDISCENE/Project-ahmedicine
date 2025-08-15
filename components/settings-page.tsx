"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Monitor, User, Bell, Shield } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-0 shadow-2xl rounded-lg h-[600px] animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-0 shadow-xl">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</CardTitle>
          <p className="text-slate-600 dark:text-slate-400">Manage your account preferences and application settings</p>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Sun className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Dr. Sarah Johnson" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="sarah.johnson@vetclinic.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic">Clinic Name</Label>
                  <Input id="clinic" defaultValue="University Teaching Hospital" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Veterinary Oncologist" />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-slate-500" />
                  Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Enable two-factor authentication</Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Case Reminders</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive reminders for follow-up appointments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Case Alerts</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get notified when new cases are added
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Treatment Updates</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive updates on treatment protocols
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Announcements</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Important system updates and announcements
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Notification Frequency</h3>

                <RadioGroup defaultValue="daily">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="realtime" id="realtime" />
                    <Label htmlFor="realtime">Real-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly summary</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Theme Preference</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      theme === "light"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2">
                        <Sun className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="font-medium">Light</span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      theme === "dark"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-2">
                        <Moon className="h-6 w-6 text-slate-400" />
                      </div>
                      <span className="font-medium">Dark</span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      theme === "system"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white to-slate-900 border border-slate-200 flex items-center justify-center mb-2">
                        <Monitor className="h-6 w-6 text-slate-600" />
                      </div>
                      <span className="font-medium">System</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data Display</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact View</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Display more data in less space</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Case IDs</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Display case ID numbers in listings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
