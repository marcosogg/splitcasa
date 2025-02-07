
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GroupCard, GroupCardSkeleton } from "@/components/GroupCard";

interface Group {
  id: string;
  name: string;
  currency: string;
  member_count: number;
  total_balance: number;
}

const Index = () => {
  const { data: groups, isLoading, error } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data: groupsData, error: groupsError } = await supabase
        .from("group_summaries")
        .select("*")
        .throwOnError();

      if (groupsError) throw groupsError;

      return groupsData;
    },
  });

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground mt-2">
            Manage your shared expenses with friends and family
          </p>
        </div>
        <Button size="lg">
          <Plus className="mr-2" /> New Group
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <GroupCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load groups</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      ) : groups?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold">No groups yet</h3>
          <p className="text-muted-foreground mt-1">
            Create a group to start sharing expenses
          </p>
          <Button className="mt-4">
            <Plus className="mr-2" /> Create your first group
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              currency={group.currency}
              memberCount={group.member_count}
              totalBalance={group.total_balance}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
