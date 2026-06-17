"use client"

import { useEffect, useState } from "react"
import { Camera, KeyRound, Moon, ShieldAlert, Sun, Trash2 } from "lucide-react"

import { DashboardShell } from "@/components/Sidebar"
import { useTheme } from "@/components/ThemeProvider"
import { useToast } from "@/components/ToastProvider"
import { supabase } from "@/app/services/supabase/client"
import { colorThemes } from "@/lib/themes"
import { getAvatarFromMetadata, getNameFromMetadata } from "@/lib/user-display"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
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

function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { colorTheme, darkMode, setColorTheme, toggleDarkMode } = useTheme()
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [currency, setCurrency] = useState("USD")
  const [travelStyle, setTravelStyle] = useState<"budget" | "balanced" | "luxury">("balanced")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const canDeleteAccount =
    deleteConfirmText.trim().toLowerCase() === "confirm delete account"

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) setDeleteConfirmText("")
  }

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return

      setUserEmail(user.email ?? "")
      setUserName(getNameFromMetadata(user.user_metadata))

      setAvatar(getAvatarFromMetadata(user.user_metadata))
    }

    loadUser()
  }, [])

  const handleSaveProfile = () => {
    toast("Profile updated!")
  }

  const handleDeleteAccount = async () => {
    if (!canDeleteAccount) return
  
    setDeleteDialogOpen(false)
  
    if (deleteConfirmText.toLowerCase() !== "confirm delete account") {
      toast("Please type 'confirm delete account' to continue", "info")
      return
    }
  
    try {
      const { data } = await supabase.auth.getUser()
      const user = data.user
  
      if (!user) {
        toast("No user found")
        return
      }
  
      const response = await fetch("/api/setting-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })
  
      const result = await response.json()
      console.log(result)
      if (!response.ok) {
        toast(result.error || "Error deleting account")
        return
      }
  
      await supabase.auth.signOut()
  
      toast("Account deleted!")
      router.push("/")
    } catch (error) {
      toast("Something went wrong")
      console.error(error)
    }
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
                <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="size-4" />
                      Delete account
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    overlayClassName="bg-black/55 backdrop-blur-sm"
                    className="gap-0 overflow-hidden border border-destructive/25 bg-background p-0 shadow-xl shadow-destructive/15 sm:max-w-md"
                  >
                    <div className="border-b border-destructive/15 bg-destructive/5 px-6 py-5">
                      <DialogHeader className="space-y-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
                          <Trash2 className="size-5 text-destructive" />
                        </div>
                        <DialogTitle className="text-xl text-destructive">
                          Delete account?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          This will permanently remove your account and all
                          associated data.
                        </DialogDescription>
                      </DialogHeader>
                    </div>

                    <div className="space-y-6 px-6 py-5">
                      <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3.5">
                        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          This action is permanent and cannot be undone. All your
                          trips and data will be removed. To continue, type{" "}
                          <strong className="font-medium text-destructive">
                            CONFIRM DELETE ACCOUNT
                          </strong>
                          .
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="delete-confirm"
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <KeyRound className="size-4 text-destructive/70" />
                          Confirmation
                        </Label>
                        <Input
                          id="delete-confirm"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="confirm delete account"
                          autoComplete="off"
                          className="h-11 border-destructive/20 focus-visible:ring-destructive/30"
                        />
                      </div>
                    </div>

                    <DialogFooter className="gap-2 border-t border-destructive/15 bg-destructive/5 px-6 py-4 sm:gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDeleteDialogChange(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={!canDeleteAccount}
                        onClick={handleDeleteAccount}
                      >
                        <Trash2 className="size-4" />
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
