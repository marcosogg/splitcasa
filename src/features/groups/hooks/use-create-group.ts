
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CreateGroupForm } from "../schemas/create-group-schema";

export const useCreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateGroupForm & { userId: string }) => {
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: data.name,
          currency: data.currency,
          information: data.information || null,
          created_by: data.userId,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const participants = data.participants.map((p) => ({
        name: p.name,
        group_id: group.id,
        user_id: p.name === data.userId ? data.userId : null,
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
};
