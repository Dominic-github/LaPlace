import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    GripVertical,
    Settings2
} from 'lucide-react';

interface SpecItem {
    label: string;
    value: string;
}

interface SpecGroup {
    name: string;
    specs: SpecItem[];
    isExpanded?: boolean;
}

interface SpecificationEditorProps {
    specifications: SpecGroup[];
    onChange: (specs: SpecGroup[]) => void;
}

export const SpecificationEditor: React.FC<SpecificationEditorProps> = ({
    specifications,
    onChange
}) => {
    const [groups, setGroups] = useState<SpecGroup[]>(
        specifications.length > 0 ? specifications : []
    );

    const updateGroups = (newGroups: SpecGroup[]) => {
        setGroups(newGroups);
        onChange(newGroups);
    };

    const addGroup = () => {
        const newGroups = [
            ...groups,
            { name: 'Nhóm thông số mới', specs: [{ label: '', value: '' }], isExpanded: true }
        ];
        updateGroups(newGroups);
    };

    const removeGroup = (groupIndex: number) => {
        const newGroups = groups.filter((_, i) => i !== groupIndex);
        updateGroups(newGroups);
    };

    const updateGroupName = (groupIndex: number, name: string) => {
        const newGroups = [...groups];
        newGroups[groupIndex].name = name;
        updateGroups(newGroups);
    };

    const toggleGroup = (groupIndex: number) => {
        const newGroups = [...groups];
        newGroups[groupIndex].isExpanded = !newGroups[groupIndex].isExpanded;
        setGroups(newGroups);
    };

    const addSpec = (groupIndex: number) => {
        const newGroups = [...groups];
        newGroups[groupIndex].specs.push({ label: '', value: '' });
        updateGroups(newGroups);
    };

    const removeSpec = (groupIndex: number, specIndex: number) => {
        const newGroups = [...groups];
        newGroups[groupIndex].specs = newGroups[groupIndex].specs.filter((_, i) => i !== specIndex);
        updateGroups(newGroups);
    };

    const updateSpec = (groupIndex: number, specIndex: number, field: 'label' | 'value', value: string) => {
        const newGroups = [...groups];
        newGroups[groupIndex].specs[specIndex][field] = value;
        updateGroups(newGroups);
    };

    // Predefined spec templates
    const templates = [
        {
            name: 'Tổng quan',
            specs: [
                { label: 'Loại sản phẩm', value: '' },
                { label: 'Thương hiệu', value: '' },
                { label: 'Model', value: '' },
                { label: 'Xuất xứ', value: '' },
                { label: 'Năm sản xuất', value: '' },
                { label: 'Bảo hành', value: '' }
            ]
        },
        {
            name: 'Kích thước & Trọng lượng',
            specs: [
                { label: 'Chiều dài', value: '' },
                { label: 'Chiều rộng', value: '' },
                { label: 'Chiều cao', value: '' },
                { label: 'Trọng lượng', value: '' }
            ]
        },
        {
            name: 'Thông số kỹ thuật',
            specs: [
                { label: 'Công suất', value: '' },
                { label: 'Điện áp', value: '' },
                { label: 'Tần số', value: '' }
            ]
        }
    ];

    const addFromTemplate = (template: SpecGroup) => {
        const newGroups = [...groups, { ...template, isExpanded: true }];
        updateGroups(newGroups);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        Thông số kỹ thuật
                    </CardTitle>
                    <div className="flex gap-2">
                        {/* Template dropdown */}
                        <div className="relative group">
                            <Button type="button" variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Thêm từ mẫu
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                            <div className="absolute right-0 top-full mt-1 w-56 bg-card border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="p-1">
                                    {templates.map((template, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded"
                                            onClick={() => addFromTemplate(template)}
                                        >
                                            {template.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addGroup}>
                            <Plus className="h-4 w-4 mr-1" />
                            Thêm nhóm
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {groups.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Settings2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có thông số kỹ thuật</p>
                        <p className="text-sm">Thêm nhóm thông số hoặc chọn từ mẫu có sẵn</p>
                    </div>
                ) : (
                    groups.map((group, groupIndex) => (
                        <div
                            key={groupIndex}
                            className="border rounded-lg overflow-hidden"
                            style={{ borderColor: 'var(--color-border)' }}
                        >
                            {/* Group Header */}
                            <div
                                className="flex items-center gap-2 p-3 bg-muted/30 cursor-pointer"
                                onClick={() => toggleGroup(groupIndex)}
                            >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={group.name}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        updateGroupName(groupIndex, e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-medium bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                                    placeholder="Tên nhóm thông số"
                                />
                                <div className="flex-1" />
                                <span className="text-xs text-muted-foreground">
                                    {group.specs.length} thông số
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeGroup(groupIndex);
                                    }}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                {group.isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>

                            {/* Group Content */}
                            {group.isExpanded && (
                                <div className="p-3 space-y-3">
                                    {group.specs.map((spec, specIndex) => (
                                        <div key={specIndex} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <Input
                                                    value={spec.label}
                                                    onChange={(e) => updateSpec(groupIndex, specIndex, 'label', e.target.value)}
                                                    placeholder="Tên thông số (VD: Công suất)"
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    value={spec.value}
                                                    onChange={(e) => updateSpec(groupIndex, specIndex, 'value', e.target.value)}
                                                    placeholder="Giá trị (VD: 1000W)"
                                                    className="text-sm"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeSpec(groupIndex, specIndex)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addSpec(groupIndex)}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Thêm thông số
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default SpecificationEditor;
