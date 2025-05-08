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
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  tags: z.string(),
  creatorId: z.string().min(1, { message: "Please select a creator" }),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  { value: "Video Editing", label: "Video Editing" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "3D Animation", label: "3D Animation" },
  { value: "Logo Design", label: "Logo Design" },
  { value: "UI/UX Design", label: "UI/UX Design" },
];

const creators = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "Emily Rodriguez" },
  { id: "4", name: "Alex Wong" },
  { id: "5", name: "David Kim" },
  { id: "6", name: "Nina Patel" },
];

const AddWorkDialog = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      creatorId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload an image for this work",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `works/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          toast({
            title: "Upload failed",
            description: "There was an error uploading your file. Please try again.",
            variant: "destructive",
          });
          setUploading(false);
        },
        async () => {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Get creator info
          const creator = creators.find((c) => c.id === values.creatorId);
          
          // Add document to Firestore
          await addDoc(collection(db, "works"), {
            title: values.title,
            description: values.description,
            category: values.category,
            tags: values.tags.split(",").map((tag) => tag.trim()),
            imageUrl: downloadURL,
            creator: {
              id: values.creatorId,
              name: creator?.name || "",
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(creator?.name || "")}&background=random`,
            },
            createdAt: serverTimestamp(),
          });

          toast({
            title: "Work added successfully",
            description: "Your work has been added to the showcase",
          });
          
          // Reset form and close dialog
          form.reset();
          setFile(null);
          setUploading(false);
          setOpen(false);
        }
      );
    } catch (error) {
      console.error("Error adding work:", error);
      toast({
        title: "Error",
        description: "There was an error adding your work. Please try again.",
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
          <PlusIcon className="mr-2 h-4 w-4" /> Add Work
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add New Work</DialogTitle>
          <DialogDescription>
            Upload a new work to showcase in the portfolio.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter work title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a description of this work" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. logo, animation, 3D" {...field} />
                    </FormControl>
                    <FormDescription>Separate tags with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="creatorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select creator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {creators.map((creator) => (
                        <SelectItem key={creator.id} value={creator.id}>
                          {creator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
                  <div className="text-center">
                    {file ? (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Selected file: {file.name}
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="cursor-pointer text-primary-600 hover:text-primary-500">
                            <span>Upload a file</span>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>{" "}
                          or drag and drop
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress < 100 ? `Uploading ${Math.round(uploadProgress)}%` : "Processing..."}
                  </>
                ) : (
                  "Add Work"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkDialog;
