import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Loader2, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { TalentProfile } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  client: z.string().min(2, { message: "Client name must be at least 2 characters" }),
  dueDate: z.string().min(1, { message: "Please select a due date" }),
  status: z.string().min(1, { message: "Please select a status" }),
  budget: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const statuses = [
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Under Review", label: "Under Review" },
];

const AddProjectDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TalentProfile[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Array<{ name: string; id: string }>>([]);
  const [newTask, setNewTask] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      client: "",
      dueDate: "",
      status: "In Progress",
      budget: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (tasks.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one task to the project",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please assign at least one team member to the project",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get the selected team members
      const selectedTeamMembers = teamMembers.filter((member) =>
        selectedMembers.includes(member.id)
      );
      
      // Create the project tasks
      const projectTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        status: "Not Started",
        completed: false,
      }));
      
      // Add document to Firestore
      await addDoc(collection(db, "projects"), {
        title: values.title,
        description: values.description,
        client: values.client,
        dueDate: values.dueDate,
        status: values.status,
        budget: values.budget || null,
        team: selectedTeamMembers.map((member) => ({
          id: member.id,
          name: member.name,
          avatar: member.avatar,
        })),
        tasks: projectTasks,
        fileCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Project added successfully",
        description: "Your new project has been created",
      });
      
      // Reset form and state
      form.reset();
      setTasks([]);
      setSelectedMembers([]);
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description: "There was an error creating the project. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "talents"));
      const members: TalentProfile[] = [];
      querySnapshot.forEach((doc) => {
        members.push({
          id: doc.id,
          ...doc.data(),
        } as TalentProfile);
      });
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: `task-${Date.now()}`, name: newTask.trim() }]);
      setNewTask("");
    }
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      fetchTeamMembers();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">
          <PlusIcon className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new project and assign team members to it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter budget" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Tasks</FormLabel>
              <div className="flex items-center mt-2 mb-3">
                <Input
                  placeholder="Add a task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="mr-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 border rounded-md border-gray-200 dark:border-gray-700">
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No tasks added yet. Add some tasks to get started.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <Checkbox id={task.id} className="mr-2" />
                        <label htmlFor={task.id} className="text-sm">
                          {task.name}
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <FormLabel>Assign Team Members</FormLabel>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md border-gray-200 dark:border-gray-700">
                {teamMembers.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2 text-center py-4">
                    Loading team members...
                  </p>
                ) : (
                  teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-2 p-2 rounded bg-gray-50 dark:bg-gray-800"
                    >
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleCheckboxChange(member.id)}
                      />
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {member.name} ({member.role})
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
