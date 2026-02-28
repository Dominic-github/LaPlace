import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Warehouse, ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const EditWarehousePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        city: '',
        district: '',
        phone: '',
        email: '',
        isActive: true,
        isDefault: false
    });

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/warehouses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    const warehouse = response.data.data;
                    setFormData({
                        name: warehouse.name || '',
                        code: warehouse.code || '',
                        address: warehouse.address || '',
                        city: warehouse.city || '',
                        district: warehouse.district || '',
                        phone: warehouse.phone || '',
                        email: warehouse.email || '',
                        isActive: warehouse.isActive,
                        isDefault: warehouse.isDefault
                    });
                }
            } catch (error) {
                console.error('Error fetching warehouse:', error);
                showMessage('error', 'Không thể tải thông tin kho');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWarehouse();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.code) {
            showMessage('error', 'Vui lòng nhập tên và mã kho');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/warehouses/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('success', 'Đã cập nhật kho hàng thành công');
            setTimeout(() => navigate('/warehouses'), 1000);
        } catch (error: any) {
            showMessage('error', error.response?.data?.message || 'Không thể cập nhật kho');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast Message */}
            {message && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${message.type === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/warehouses')}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Warehouse className="h-6 w-6" />
                        Chỉnh sửa kho hàng
                    </h1>
                    <p className="text-muted-foreground">Cập nhật thông tin chi tiết cho kho hàng</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Tên kho *</Label>
                                        <Input
                                            id="name"
                                            placeholder="VD: Kho Hà Nội - Đống Đa"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Mã kho *</Label>
                                        <Input
                                            id="code"
                                            placeholder="VD: HN01"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Địa chỉ</Label>
                                    <Input
                                        id="address"
                                        placeholder="Số nhà, tên đường..."
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Thành phố</Label>
                                        <Input
                                            id="city"
                                            placeholder="VD: Hà Nội"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">Quận/Huyện</Label>
                                        <Input
                                            id="district"
                                            placeholder="VD: Đống Đa"
                                            value={formData.district}
                                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin liên hệ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input
                                            id="phone"
                                            placeholder="VD: 024-1234-5678"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="VD: kho.hn01@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                                    />
                                    <Label htmlFor="isActive" className="cursor-pointer">
                                        Đang hoạt động
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isDefault: !!checked })}
                                    />
                                    <Label htmlFor="isDefault" className="cursor-pointer">
                                        Kho mặc định
                                    </Label>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Kho mặc định sẽ được chọn tự động khi thêm sản phẩm mới
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <Button type="submit" className="w-full" disabled={saving}>
                                    {saving ? (
                                        <Spinner size="sm" className="mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Cập nhật kho hàng
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditWarehousePage;
