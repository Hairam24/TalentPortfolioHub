import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Loader2 } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(1, { message: "Please select a role" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  skills: z.string().min(1, { message: "Please provide at least one skill" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  location: z.string().min(1, { message: "Please enter a location" }),
  availability: z.string().min(1, { message: "Please select availability" }),
  linkedIn: z.string().url({ message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal("")),
  website: z.string().url({ message: "Please enter a valid website URL" }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const roles = [
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "Video Editor", label: "Video Editor" },
  { value: "3D Animator", label: "3D Animator" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Illustrator", label: "Illustrator" },
  { value: "Logo Designer", label: "Logo Designer" },
];

const availabilityOptions = [
  { value: "Available Now", label: "Available Now" },
  { value: "Limited Availability", label: "Limited Availability" },
  { value: "Unavailable", label: "Unavailable" },
];

const AddTalentDialog = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      skills: "",
      email: "",
      location: "",
      availability: "",
      linkedIn: "",
      website: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setUploading(true);

    try {
      let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random`;
      
      // If a file was uploaded, store it in Firebase Storage
      if (file) {
        const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Wait for the upload to complete
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {},
            (error) => reject(error),
            async () => {
              avatarUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }
      
      // Add document to Firestore
      await addDoc(collection(db, "talents"), {
        name: values.name,
        role: values.role,
        bio: values.bio,
        skills: values.skills.split(",").map((skill) => skill.trim()),
        email: values.email,
        location: values.location,
        availability: values.availability,
        linkedIn: values.linkedIn || null,
        website: values.website || null,
        avatar: avatarUrl,
        rating: 5.0, // Default rating for new talents
        completedProjects: 0,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Talent added successfully",
        description: "The talent profile has been added to the directory",
      });
      
      // Reset form and close dialog
      form.reset();
      setFile(null);
      setUploading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error adding talent:", error);
      toast({
        title: "Error",
        description: "There was an error adding the talent profile. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Talent Profile</DialogTitle>
          <DialogDescription>
            Add a new freelancer to your talent network.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availabilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Photoshop, After Effects, Figma" {...field} />
                      </FormControl>
                      <FormDescription>Separate skills with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A short description of the talent's experience and skills" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Profile Picture (optional)</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlusIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      JPEG, PNG or GIF, up to 2MB
                    </p>
                  </div>
                </div>
              </FormControl>
            </FormItem>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Profile"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTalentDialog;
