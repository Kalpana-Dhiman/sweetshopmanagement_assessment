import { Sweet } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  sweets: Sweet[];
}

const StatsCards = ({ sweets }: StatsCardsProps) => {
  const totalItems = sweets.length;
  const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);
  const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0);
  const outOfStock = sweets.filter(s => s.quantity === 0).length;
  const lowStock = sweets.filter(s => s.quantity > 0 && s.quantity <= 5).length;

  const stats = [
    {
      label: 'Total Products',
      value: totalItems,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Stock',
      value: totalStock,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Inventory Value',
      value: `₹${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Needs Attention',
      value: outOfStock + lowStock,
      subtext: `${outOfStock} out, ${lowStock} low`,
      icon: AlertTriangle,
      color: outOfStock > 0 ? 'text-destructive' : 'text-muted-foreground',
      bgColor: outOfStock > 0 ? 'bg-destructive/10' : 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {stat.subtext && (
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
