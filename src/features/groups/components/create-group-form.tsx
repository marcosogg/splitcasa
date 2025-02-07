
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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
import { createGroupSchema, type CreateGroupForm } from "../schemas/create-group-schema";

interface CreateGroupFormProps {
  defaultParticipantName: string;
  onSubmit: (data: CreateGroupForm) => void;
  onCancel: () => void;
  isPending: boolean;
}

export const CreateGroupForm = ({
  defaultParticipantName,
  onSubmit,
  onCancel,
  isPending,
}: CreateGroupFormProps) => {
  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      currency: "USD",
      information: "",
      participants: [{ name: defaultParticipantName }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  return (
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
