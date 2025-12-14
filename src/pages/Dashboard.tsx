import { useSweets } from '@/hooks/useSweets';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import SearchFilter from '@/components/SearchFilter';
import SweetCard from '@/components/SweetCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Package } from 'lucide-react';

const Dashboard = () => {
  const { sweets, loading, filters, setFilters, purchaseSweet } = useSweets();
  const { user } = useAuth();

  const handlePurchase = async (sweetId: string) => {
    try {
      await purchaseSweet(sweetId);
      toast.success('Purchase successful! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">Browse our delicious collection of sweets</p>
          </div>

          {/* Search & Filter */}
          <SearchFilter filters={filters} onFilterChange={setFilters} />

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{sweets.length}</strong> products
              </span>
            </div>
            {(filters.name || filters.category || filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="text-xs">
                Filters applied
              </Badge>
            )}
          </div>

          {/* Sweets Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : sweets.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-lg font-medium">No sweets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
