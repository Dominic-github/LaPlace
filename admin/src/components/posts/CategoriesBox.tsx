import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, Plus, Search, ChevronRight, ChevronDown, Check } from 'lucide-react';

interface CategoriesBoxProps {
  categories?: any[];
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
  onAddNew?: () => void;
}

export const CategoriesBox: React.FC<CategoriesBoxProps> = ({
  categories = [],
  selectedCategoryId,
  onCategoryChange,
  onAddNew,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Build tree structure
  const buildTree = (items: any[], parentId: string | null = null): any[] => {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };

  const treeData = buildTree(categories);

  // Filter categories based on search
  const filterCategories = (items: any[], search: string): any[] => {
    if (!search) return items;

    return items.filter(item => {
      const matchesSelf = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesChildren = item.children && filterCategories(item.children, search).length > 0;
      return matchesSelf || matchesChildren;
    }).map(item => ({
      ...item,
      children: filterCategories(item.children || [], search),
    }));
  };

  const filteredData = filterCategories(treeData, searchValue);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderCategory = (category: any, level: number = 0) => {
    const isExpanded = expandedIds.has(category.id);
    const isSelected = selectedCategoryId === category.id;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md text-sm ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
            }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onCategoryChange?.(category.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(category.id);
              }}
              className="p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}

          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1">{category.name}</span>

          {isSelected && <Check className="h-4 w-4 text-primary" />}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {category.children.map((child: any) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Chuyên mục
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm chuyên mục..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Categories Tree */}
        <div className="max-h-48 overflow-y-auto border rounded-md p-2" style={{ borderColor: 'var(--color-border)' }}>
          {filteredData.length > 0 ? (
            filteredData.map(category => renderCategory(category))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Chưa có chuyên mục nào
            </div>
          )}
        </div>

        {/* Add New Button */}
        {onAddNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddNew}
            className="p-0 h-auto text-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm chuyên mục mới
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
