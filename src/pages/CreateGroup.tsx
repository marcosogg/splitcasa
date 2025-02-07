
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  currency: z.string().min(1, "Currency is required"),
  information: z.string().optional(),
  participants: z.array(
    z.object({
      name: z.string().min(1, "Participant name is required"),
    })
  ).min(1, "At least one participant is required"),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

const CreateGroup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      currency: "USD",
      information: "",
      participants: [{ name: user?.email?.split("@")[0] || "" }],
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    // Form submission will be implemented after we set up the necessary Supabase tables and policies
    console.log(data);
    toast({
      title: "Group created successfully",
      description: "You will be redirected to the group page",
    });
    navigate("/");
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new group to start sharing expenses
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Group Information</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="USD"
                      {...field}
                      maxLength={3}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about the group"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Participants</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.setValue("participants", [
                    ...form.getValues("participants"),
                    { name: "" },
                  ])
                }
              >
                Add Participant
              </Button>
            </div>

            {form.getValues("participants").map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`participants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {index === 0 ? "Your Name" : `Participant ${index + 1}`}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {index !== 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const currentParticipants =
                              form.getValues("participants");
                            form.setValue(
                              "participants",
                              currentParticipants.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Group</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateGroup;
