
import { useForm, useFieldArray } from "react-hook-form";
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
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

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

  // Use useFieldArray for better performance with dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: CreateGroupForm) => {
      // Insert the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: data.name,
          currency: data.currency,
          information: data.information || null,
          created_by: user?.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Insert participants
      const participants = data.participants.map((p) => ({
        name: p.name,
        group_id: group.id,
        user_id: p.name === user?.email?.split("@")[0] ? user?.id : null,
      }));

      const { error: participantsError } = await supabase
        .from("participants")
        .insert(participants);

      if (participantsError) throw participantsError;

      return group;
    },
    onSuccess: (group) => {
      toast({
        title: "Group created successfully",
        description: "You will be redirected to the group page",
      });
      // Navigate to the specific group page instead of the dashboard
      navigate(`/groups/${group.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateGroupForm) => {
    createGroupMutation.mutate(data);
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
                onClick={() => append({ name: "" })}
              >
                Add Participant
              </Button>
            </div>

            {fields.map((field, index) => (
              <FormField
                key={field.id}
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
                          onClick={() => remove(index)}
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
              onClick={() => navigate("/groups")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createGroupMutation.isPending}
            >
              {createGroupMutation.isPending ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateGroup;
