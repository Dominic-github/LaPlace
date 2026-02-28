import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus, X } from 'lucide-react';

interface TagsBoxProps {
  availableTags?: any[];
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  onAddNew?: () => void;
}

export const TagsBox: React.FC<TagsBoxProps> = ({
  availableTags = [],
  selectedTags = [],
  onTagsChange,
  onAddNew,
}) => {
  const [searchValue, setSearchValue] = useState('');

  // Filter available tags based on search
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );

  // Get selected tag objects
  const selectedTagObjects = availableTags.filter(tag =>
    selectedTags.includes(tag.id)
  );

  const handleAddTag = (tagId: string) => {
    if (!selectedTags.includes(tagId) && onTagsChange) {
      onTagsChange([...selectedTags, tagId]);
    }
    setSearchValue('');
  };

  const handleRemoveTag = (tagId: string) => {
    if (onTagsChange) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Tags className="h-4 w-4" />
          Tags
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Selected Tags */}
        {selectedTagObjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map(tag => (
              <Badge
                key={tag.id}
                variant="default"
                className="flex items-center gap-1 pr-1"
              >
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Search Tags */}
        <Input
          placeholder="Tìm hoặc thêm tag..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        {/* Available Tags */}
        {searchValue && filteredTags.length > 0 && (
          <div
            className="max-h-36 overflow-y-auto border rounded-md p-2 space-y-1"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {filteredTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag.id)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-accent rounded-md text-left"
              >
                <Tags className="h-3 w-3" />
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {searchValue && filteredTags.length === 0 && (
          <div className="text-center py-3 text-muted-foreground text-sm">
            Không tìm thấy tag phù hợp
          </div>
        )}

        {/* Add New Button */}
        {onAddNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddNew}
            className="p-0 h-auto text-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm tag mới
          </Button>
        )}

        {/* Help Text */}
        <p className="text-xs text-muted-foreground italic">
          💡 Tìm kiếm và click để thêm tag
        </p>
      </CardContent>
    </Card>
  );
};
