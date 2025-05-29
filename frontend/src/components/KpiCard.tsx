
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const KpiCard = ({ title, value, description, icon, trend, className }: KpiCardProps) => {
  return (
    <Card className={cn("overflow-hidden border shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-4">
            <div className={cn(
              "flex items-center justify-center rounded-full p-1 mr-2",
              trend.isPositive ? "bg-green-100" : "bg-red-100"
            )}>
              {trend.isPositive ? 
                <TrendingUp className="h-3 w-3 text-green-600" /> : 
                <TrendingDown className="h-3 w-3 text-red-600" />
              }
            </div>
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">desde el mes pasado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
