
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { CreateGroupFormComponent } from "@/features/groups/components/create-group-form";
import { useCreateGroup } from "@/features/groups/hooks/use-create-group";
import type { CreateGroupForm } from "@/features/groups/schemas/create-group-schema";

const CreateGroup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createGroupMutation = useCreateGroup();

  const onSubmit = (data: CreateGroupForm) => {
    createGroupMutation.mutate({ ...data, userId: user?.id as string });
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new group to start sharing expenses
        </p>
      </div>

      <CreateGroupFormComponent
        defaultParticipantName={user?.email?.split("@")[0] || ""}
        onSubmit={onSubmit}
        onCancel={() => navigate("/groups")}
        isPending={createGroupMutation.isPending}
      />
    </div>
  );
};

export default CreateGroup;
