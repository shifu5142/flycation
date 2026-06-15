"use client"

import { useEffect, useState } from "react"
import { Camera, Moon, Sun, Trash2 } from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { useTheme } from "@/components/ThemeProvider"
import { useToast } from "@/components/ToastProvider"
import { supabase } from "@/app/services/supabase/client"
import { colorThemes } from "@/lib/themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD"]
const travelStyles = [
  { value: "budget", label: "Budget", description: "Save money, maximize experiences" },
  { value: "balanced", label: "Balanced", description: "Mix of comfort and value" },
  { value: "luxury", label: "Luxury", description: "Premium stays and experiences" },
] as const

function getUserName(metadata: Record<string, unknown> | undefined) {
  const first = typeof metadata?.first_name === "string" ? metadata.first_name : ""
  const last = typeof metadata?.last_name === "string" ? metadata.last_name : ""
  const full = `${first} ${last}`.trim()
  if (full) return full
  if (typeof metadata?.full_name === "string") return metadata.full_name
  return ""
}

function SettingsPage() {
  const { toast } = useToast()
  const { colorTheme, darkMode, setColorTheme, toggleDarkMode } = useTheme()
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [currency, setCurrency] = useState("USD")
  const [travelStyle, setTravelStyle] = useState<"budget" | "balanced" | "luxury">("balanced")

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return

      setUserEmail(user.email ?? "")
      setUserName(getUserName(user.user_metadata))

      const image =
        (typeof user.user_metadata?.avatar_url === "string" && user.user_metadata.avatar_url) ||
        (typeof user.user_metadata?.picture === "string" && user.user_metadata.picture) ||
        null
      setAvatar(image)
    }

    loadUser()
  }, [])

  const handleSaveProfile = () => {
    toast("Profile updated!")
  }

  const handleDeleteAccount = () => {
    toast("Account deletion is disabled in demo mode", "info")
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
            <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-20">
                    {avatar && <AvatarImage src={avatar} alt={userName || "User"} />}
                    <AvatarFallback>
                      {(userName || userEmail || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" onClick={() => toast("Avatar upload is UI only")}>
                    <Camera className="size-4" />
                    Upload photo
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={userName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userEmail}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <Button onClick={handleSaveProfile}>Save changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your travel defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {currency}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {currencies.map((c) => (
                        <DropdownMenuItem
                          key={c}
                          onClick={() => {
                            setCurrency(c)
                            toast(`Currency set to ${c}`)
                          }}
                        >
                          {c}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Travel style</Label>
                  <div className="grid gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => {
                          setTravelStyle(style.value)
                          toast(`Travel style: ${style.label}`)
                        }}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-sm ${
                          travelStyle === style.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{style.label}</p>
                          <p className="text-sm text-muted-foreground">{style.description}</p>
                        </div>
                        {travelStyle === style.value && (
                          <Badge>Active</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Flycation looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
                    <div>
                      <p className="font-medium">Dark mode</p>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark mode
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={darkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      toggleDarkMode()
                      toast(!darkMode ? "Dark mode enabled" : "Light mode enabled")
                    }}
                  >
                    {darkMode ? "On" : "Off"}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {colorThemes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setColorTheme(t.id)
                          toast(`Theme: ${t.label}`)
                        }}
                        className={`rounded-xl border p-4 text-sm font-medium transition-all hover:shadow-sm ${
                          colorTheme === t.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account">
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Danger zone</CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="size-4" />
                      Delete account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete account?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. All your trips and data will be permanently removed.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

export default SettingsPage
