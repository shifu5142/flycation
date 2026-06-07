"use client"

import { useState } from "react"
import { Camera, Moon, Sun, Trash2 } from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { useToast } from "@/components/ToastProvider"
import { mockUser } from "@/lib/mockUser"
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

const themes = ["Default", "Ocean", "Forest", "Sunset"]

export default function SettingsPage() {
  const { toast } = useToast()
  const [name, setName] = useState(mockUser.name)
  const [currency, setCurrency] = useState(mockUser.currency)
  const [travelStyle, setTravelStyle] = useState(mockUser.travelStyle)
  const [darkMode, setDarkMode] = useState(false)
  const [theme, setTheme] = useState("Default")

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle("dark", next)
    toast(next ? "Dark mode enabled" : "Light mode enabled")
  }

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
                    <AvatarImage src={mockUser.avatar} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={mockUser.email}
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
                        Toggle dark theme (UI only)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={darkMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? "On" : "Off"}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {themes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTheme(t)
                          toast(`Theme: ${t}`)
                        }}
                        className={`rounded-xl border p-4 text-sm font-medium transition-all hover:shadow-sm ${
                          theme === t ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {t}
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
