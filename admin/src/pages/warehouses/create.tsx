import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Warehouse, ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const CreateWarehousePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.code) {
            showMessage('error', 'Vui lòng nhập tên và mã kho');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/warehouses`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('success', 'Đã tạo kho hàng thành công');
            setTimeout(() => navigate('/warehouses'), 1000);
        } catch (error: any) {
            showMessage('error', error.response?.data?.message || 'Không thể tạo kho');
        } finally {
            setLoading(false);
        }
    };

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
                        Thêm kho hàng mới
                    </h1>
                    <p className="text-muted-foreground">Điền thông tin chi tiết cho kho hàng</p>
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
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <Spinner size="sm" className="mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Lưu kho hàng
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateWarehousePage;
