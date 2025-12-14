import { SearchFilters } from '@/types';
import { CATEGORIES } from '@/data/mockSweets';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface SearchFilterProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const SearchFilter = ({ filters, onFilterChange }: SearchFilterProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleReset = () => {
    onFilterChange({
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null,
    });
  };

  const hasActiveFilters = filters.name || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-4 p-4 rounded-xl bg-card border border-border/50">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={filters.name}
            onChange={(e) => onFilterChange({ ...filters, name: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Select
          value={filters.category || 'All'}
          onValueChange={(value) => onFilterChange({ ...filters, category: value === 'All' ? '' : value })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={showAdvanced ? 'bg-primary text-primary-foreground' : ''}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
          <div className="space-y-2">
            <Label htmlFor="minPrice" className="text-sm text-muted-foreground">Min Price (₹)</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={(e) => onFilterChange({ 
                ...filters, 
                minPrice: e.target.value ? Number(e.target.value) : null 
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-sm text-muted-foreground">Max Price (₹)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="1000"
              value={filters.maxPrice ?? ''}
              onChange={(e) => onFilterChange({ 
                ...filters, 
                maxPrice: e.target.value ? Number(e.target.value) : null 
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
