"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Camera, Mail, Phone } from "lucide-react"

export default function EditProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="professional">Professional Details</TabsTrigger>
          <TabsTrigger value="social">Social & Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-semibold">Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">Premium Agent</p>
                <p className="text-sm text-muted-foreground">Member since January 2022</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Sarah" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-muted">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input id="email" defaultValue="sarah.johnson@example.com" className="rounded-l-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input id="phone" defaultValue="(555) 123-4567" className="rounded-l-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="Experienced real estate agent specializing in luxury properties and residential homes in the downtown area. Committed to finding the perfect property for every client."
                  className="min-h-32"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update your professional details and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Professional details form would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Contact Preferences</CardTitle>
              <CardDescription>Manage your social media profiles and contact preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Social media and contact preferences form would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

