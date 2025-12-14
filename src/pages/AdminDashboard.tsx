import { useState } from 'react';
import { useSweets } from '@/hooks/useSweets';
import { useAuth } from '@/context/AuthContext';
import { Sweet } from '@/types';
import Navbar from '@/components/Navbar';
import StatsCards from '@/components/StatsCards';
import SweetForm from '@/components/SweetForm';
import RestockDialog from '@/components/RestockDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const { allSweets, addSweet, updateSweet, deleteSweet, restockSweet } = useSweets();
  const { isAdmin } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [restockOpen, setRestockOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sweetToDelete, setSweetToDelete] = useState<Sweet | null>(null);

  const filteredSweets = allSweets.filter(sweet => 
    sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sweet.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormMode('add');
    setSelectedSweet(null);
    setFormOpen(true);
  };

  const handleEdit = (sweet: Sweet) => {
    setFormMode('edit');
    setSelectedSweet(sweet);
    setFormOpen(true);
  };

  const handleRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockOpen(true);
  };

  const handleDeleteClick = (sweet: Sweet) => {
    setSweetToDelete(sweet);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!sweetToDelete) return;
    try {
      await deleteSweet(sweetToDelete.id);
      toast.success('Sweet deleted successfully');
      setDeleteDialogOpen(false);
      setSweetToDelete(null);
    } catch {
      toast.error('Failed to delete sweet');
    }
  };

  const handleFormSubmit = async (data: Omit<Sweet, 'id'>) => {
    try {
      if (formMode === 'add') {
        await addSweet(data);
        toast.success('Sweet added successfully');
      } else if (selectedSweet) {
        await updateSweet(selectedSweet.id, data);
        toast.success('Sweet updated successfully');
      }
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleRestockSubmit = async (id: string, quantity: number) => {
    try {
      await restockSweet(id, quantity);
      toast.success('Stock updated successfully');
    } catch {
      toast.error('Restock failed');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">403 Forbidden — Admin only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your sweet shop inventory</p>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Sweet
            </Button>
          </div>

          {/* Stats */}
          <StatsCards sweets={allSweets} />

          {/* Inventory Table */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription>Manage all products in your shop</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSweets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSweets.map((sweet) => (
                        <TableRow key={sweet.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{sweet.image || '🍬'}</span>
                              <span className="font-medium">{sweet.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sweet.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{sweet.price}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={sweet.quantity === 0 ? 'destructive' : sweet.quantity <= 5 ? 'outline' : 'secondary'}
                              className={sweet.quantity > 0 && sweet.quantity <= 5 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : ''}
                            >
                              {sweet.quantity} units
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(sweet)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRestock(sweet)}>
                                  <Package className="h-4 w-4 mr-2" />
                                  Restock
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClick(sweet)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <SweetForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        sweet={selectedSweet}
        mode={formMode}
      />

      <RestockDialog
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
        onRestock={handleRestockSubmit}
        sweet={selectedSweet}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sweet?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sweetToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
