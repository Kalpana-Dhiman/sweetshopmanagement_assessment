import { Sweet } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string) => Promise<void>;
}

const SweetCard = ({ sweet, onPurchase }: SweetCardProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await onPurchase(sweet.id);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
      isOutOfStock && "opacity-60"
    )}>
      <CardContent className="p-0">
        <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
            {sweet.image || '🍬'}
          </span>
          
          <div className="absolute top-2 right-2">
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                Only {sweet.quantity} left
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground leading-tight">{sweet.name}</h3>
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              ₹{sweet.price}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {sweet.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="h-3 w-3" />
              <span>{sweet.quantity} in stock</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handlePurchase}
          disabled={isOutOfStock || isPurchasing}
          className="w-full gap-2"
          variant={isOutOfStock ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4" />
          {isPurchasing ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SweetCard;
