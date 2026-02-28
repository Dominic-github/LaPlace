import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/ui/pagination';
import {
    Warehouse,
    Plus,
    Search,
    Edit,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Package,
    CheckCircle,
    XCircle,
    Star
} from 'lucide-react';
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const WarehouseListPage: React.FC = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/warehouses`, {
                params: { page, limit, search },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setWarehouses(response.data.data);
                setTotal(response.data.pagination.total);
            }
        } catch (error: any) {
            console.error('Error fetching warehouses:', error);
            showMessage('error', 'Không thể tải danh sách kho');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, [page, search]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/warehouses/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('success', 'Đã xóa kho thành công');
            setDeleteId(null);
            fetchWarehouses();
        } catch (error: any) {
            showMessage('error', error.response?.data?.message || 'Không thể xóa kho');
        } finally {
            setDeleting(false);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Warehouse className="h-6 w-6" />
                        Quản lý Kho hàng
                    </h1>
                    <p className="text-muted-foreground">Quản lý các kho hàng và tồn kho sản phẩm</p>
                </div>
                <Button onClick={() => navigate('/warehouses/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kho mới
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên, mã hoặc thành phố..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Warehouse List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : warehouses.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Warehouse className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Chưa có kho hàng nào</p>
                    </div>
                ) : (
                    warehouses.map((warehouse) => (
                        <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {warehouse.name}
                                            {warehouse.isDefault && (
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </CardTitle>
                                        <Badge variant="secondary" className="mt-1">
                                            {warehouse.code}
                                        </Badge>
                                    </div>
                                    <Badge variant={warehouse.isActive ? 'success' : 'destructive'}>
                                        {warehouse.isActive ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Hoạt động
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Tạm dừng
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {warehouse.address && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <span>
                                            {warehouse.address}
                                            {warehouse.district && `, ${warehouse.district}`}
                                            {warehouse.city && `, ${warehouse.city}`}
                                        </span>
                                    </div>
                                )}
                                {warehouse.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{warehouse.phone}</span>
                                    </div>
                                )}
                                {warehouse.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{warehouse.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span>{warehouse._count?.productStock || 0} sản phẩm</span>
                                </div>

                                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => navigate(`/warehouses/${warehouse.id}/edit`)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => navigate(`/warehouses/${warehouse.id}/stock`)}
                                    >
                                        <Package className="h-4 w-4 mr-1" />
                                        Tồn kho
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteId(warehouse.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {total > limit && (
                <div className="flex justify-center">
                    <Pagination
                        current={page}
                        total={total}
                        pageSize={limit}
                        onChange={setPage}
                    />
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogHeader>
                    <DialogTitle>Xóa kho hàng?</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa kho hàng này? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteId(null)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <Spinner size="sm" /> : 'Xóa'}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default WarehouseListPage;
