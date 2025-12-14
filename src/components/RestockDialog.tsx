import { useState } from 'react';
import { Sweet } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package } from 'lucide-react';

interface RestockDialogProps {
  open: boolean;
  onClose: () => void;
  onRestock: (id: string, quantity: number) => Promise<void>;
  sweet: Sweet | null;
}

const RestockDialog = ({ open, onClose, onRestock, sweet }: RestockDialogProps) => {
  const [quantity, setQuantity] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sweet || quantity <= 0) return;

    setIsSubmitting(true);
    try {
      await onRestock(sweet.id, quantity);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Restock Sweet
          </DialogTitle>
          <DialogDescription>
            Add more stock for {sweet?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-4">
            <span className="text-3xl">{sweet?.image || '🍬'}</span>
            <div>
              <p className="font-medium">{sweet?.name}</p>
              <p className="text-sm text-muted-foreground">
                Current stock: {sweet?.quantity} units
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restockQty">Quantity to Add</Label>
            <Input
              id="restockQty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm text-success">
              New stock will be: <strong>{(sweet?.quantity || 0) + quantity}</strong> units
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || quantity <= 0}>
              {isSubmitting ? 'Restocking...' : 'Restock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestockDialog;
