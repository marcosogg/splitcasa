
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users2, CreditCard, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface GroupCardProps {
  id: string;
  name: string;
  currency: string;
  memberCount: number;
  totalBalance: number;
}

export const GroupCard = ({
  id,
  name,
  currency,
  memberCount,
  totalBalance,
}: GroupCardProps) => {
  return (
    <Link to={`/groups/${id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="font-semibold text-lg truncate">{name}</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users2 className="h-4 w-4 mr-1" />
              <span>{memberCount} members</span>
            </div>
            <div className="flex items-center font-medium">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>
                {totalBalance.toLocaleString("en-US", {
                  style: "currency",
                  currency: currency,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const GroupCardSkeleton = () => {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-5 w-[80px]" />
        </div>
      </CardContent>
    </Card>
  );
};
