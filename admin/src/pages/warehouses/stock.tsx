import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ArrowLeft,
    Warehouse,
    Search,
    Package,
    ExternalLink,
    Edit
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

interface WarehouseStock {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        sku: string;
        thumbnail: string;
        price: number;
    };
    variant?: {
        id: string;
        name: string;
        sku: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface WarehouseInfo {
    id: string;
    name: string;
    code: string;
    address?: string;
    city?: string;
}

const WarehouseStockPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [warehouse, setWarehouse] = useState<WarehouseInfo | null>(null);
    const [stocks, setStocks] = useState<WarehouseStock[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(20);

    const fetchWarehouse = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/warehouses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setWarehouse(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching warehouse:', error);
        }
    };

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/warehouses/${id}/products`, {
                params: { page, limit, search },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStocks(response.data.data || []);
                setTotal(response.data.pagination?.total || 0);
            }
        } catch (error) {
            console.error('Error fetching stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouse();
    }, [id]);

    useEffect(() => {
        fetchStocks();
    }, [id, page, search]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/warehouses')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Warehouse className="h-6 w-6" />
                        Tồn kho: {warehouse?.name || 'Loading...'}
                    </h1>
                    {warehouse && (
                        <p className="text-muted-foreground text-sm">
                            Mã kho: {warehouse.code} | {warehouse.address && `${warehouse.address}, `}{warehouse.city}
                        </p>
                    )}
                </div>
            </div>

            {/* Summary Card */}
            <Card>
                <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                                <p className="text-2xl font-bold">{total}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <Card>
                <CardContent className="py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách sản phẩm trong kho</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : stocks.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Chưa có sản phẩm nào trong kho này</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Biến thể</TableHead>
                                    <TableHead className="text-right">Số lượng</TableHead>
                                    <TableHead className="text-right">Giá</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stocks.map((stock) => (
                                    <TableRow key={stock.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {stock.product?.thumbnail && (
                                                    <img
                                                        src={stock.product.thumbnail}
                                                        alt={stock.product.name}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{stock.product?.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {stock.variant?.sku || stock.product?.sku || '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {stock.variant ? (
                                                <span>{stock.variant.name}</span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={stock.quantity > 10 ? 'success' : stock.quantity > 0 ? 'warning' : 'destructive'}>
                                                {stock.quantity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatPrice(stock.product?.price || 0)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/products/edit/${stock.product?.id}`)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(`/products/${stock.product?.slug}`, '_blank')}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

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
        </div>
    );
};

export default WarehouseStockPage;
