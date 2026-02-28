import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import {
    LayoutDashboard,
    FileText,
    File,
    Users,
    ShoppingCart,
    Package,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Image,
    Tag,
    Percent,
    Star,
    Zap,
    Store,
    Shield,
    Key,
    Activity,
    DollarSign,
    BarChart3,
    Sliders,
    FolderTree,
    Sun,
    Moon,
    Monitor,
    User,
    ChevronDown,
    Puzzle,
    Warehouse,
} from "lucide-react";

interface NavItem {
    title: string;
    href?: string;
    icon?: React.ReactNode;
    parent?: string;
}

const navItems: NavItem[] = [
    { title: "MAIN", parent: "main" },
    { title: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },

    { title: "BẤT ĐỘNG SẢN", parent: "realestate" },
    { title: "Tin đăng", href: "/listings", icon: <Package size={18} /> },
    { title: "Danh mục BĐS", href: "/categories", icon: <FolderTree size={18} /> },
    { title: "Dự án", href: "/projects", icon: <Store size={18} /> },

    { title: "NGƯỜI DÙNG", parent: "users" },
    { title: "Người dùng", href: "/users", icon: <Users size={18} /> },
    { title: "Môi giới (KYC)", href: "/brokers", icon: <Shield size={18} /> },

    { title: "GIAO DỊCH", parent: "transactions" },
    { title: "Giao dịch", href: "/transactions", icon: <DollarSign size={18} /> },
    { title: "Gói VIP", href: "/vip-packages", icon: <Star size={18} /> },

    { title: "NỘI DUNG", parent: "cms" },
    { title: "Quản lý Menu", href: "/menus", icon: <FolderTree size={18} /> },
    { title: "Bài viết", href: "/posts", icon: <FileText size={18} /> },
    { title: "Danh mục bài viết", href: "/post-categories", icon: <FolderTree size={18} /> },
    { title: "Tags", href: "/post-tags", icon: <Tag size={18} /> },
    { title: "Trang tĩnh", href: "/static-pages", icon: <File size={18} /> },
    { title: "Banners", href: "/banners", icon: <Image size={18} /> },
    { title: "Media", href: "/media", icon: <Image size={18} /> },

    { title: "HỆ THỐNG", parent: "system" },
    { title: "Vai trò", href: "/roles", icon: <Users size={18} /> },
    { title: "Quyền hạn", href: "/permissions", icon: <Shield size={18} /> },
    { title: "Cấu hình chung", href: "/general-config", icon: <Sliders size={18} /> },
    { title: "Cài đặt", href: "/settings", icon: <Settings size={18} /> },
    { title: "Nhật ký", href: "/activity-logs", icon: <Activity size={18} /> },
];

interface IUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
}

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { mutate: logout } = useLogout();
    const { data: user } = useGetIdentity<IUser>();
    const { theme, setTheme } = useTheme();
    const [collapsed, setCollapsed] = React.useState(false);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);

    const themeMenuRef = React.useRef<HTMLDivElement>(null);
    const userMenuRef = React.useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
                setThemeMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const themeOptions = [
        { value: "light" as const, label: "Light", icon: <Sun size={16} /> },
        { value: "dark" as const, label: "Dark", icon: <Moon size={16} /> },
        { value: "system" as const, label: "System", icon: <Monitor size={16} /> },
    ];

    const currentThemeIcon = theme === "light" ? <Sun size={18} /> : theme === "dark" ? <Moon size={18} /> : <Monitor size={18} />;

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={cn(
                    "flex flex-col bg-sidebar border-r border-sidebar-border",
                    "transition-all duration-300 ease-in-out",
                    collapsed ? "w-16" : "w-64"
                )}
                style={{ overflow: 'hidden' }}
            >
                {/* Logo */}
                <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                        A
                    </div>
                    <span className={cn(
                        "ml-3 font-semibold text-lg whitespace-nowrap transition-all duration-300 ease-in-out",
                        collapsed ? "opacity-0 w-0" : "opacity-100"
                    )}>Admin</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {navItems.map((item, index) => {
                        if (item.parent) {
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "px-4 py-2 mt-4 first:mt-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                                        collapsed && "hidden"
                                    )}
                                >
                                    {item.title}
                                </div>
                            );
                        }

                        const isActive = location.pathname === item.href ||
                            (item.href !== "/" && location.pathname.startsWith(item.href || ""));

                        return (
                            <Link
                                key={index}
                                to={item.href || "/"}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-primary"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                )}
                            >
                                <span className={cn("flex-shrink-0", isActive && "text-sidebar-primary")}>
                                    {item.icon}
                                </span>
                                <span className={cn(
                                    "whitespace-nowrap transition-all duration-300 ease-in-out",
                                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                                )}>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <div className="p-4 border-t border-sidebar-border">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card relative z-[100] isolate">
                    <div className="text-sm text-muted-foreground">
                        ADMIN DASHBOARD / <span className="text-primary">{location.pathname.slice(1).toUpperCase() || "DASHBOARD"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle Dropdown */}
                        <div className="relative" ref={themeMenuRef}>
                            <button
                                onClick={() => {
                                    setThemeMenuOpen(!themeMenuOpen);
                                    setUserMenuOpen(false);
                                }}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                                title="Change theme"
                            >
                                {currentThemeIcon}
                                <ChevronDown size={14} />
                            </button>

                            {themeMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-36 rounded-md shadow-xl py-1 z-[9999]" style={{ backgroundColor: 'var(--color-popover)', borderWidth: '1px', borderColor: 'var(--color-border)' }}>
                                    {themeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setTheme(option.value);
                                                setThemeMenuOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2",
                                                theme === option.value && "bg-accent text-primary"
                                            )}
                                        >
                                            {option.icon}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => {
                                    setUserMenuOpen(!userMenuOpen);
                                    setThemeMenuOpen(false);
                                }}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={16} className="text-primary" />
                                </div>
                                <span className="text-sm font-medium">{user?.firstName || user?.email || "Admin"}</span>
                                <ChevronDown size={14} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-xl py-1 z-[9999]" style={{ backgroundColor: 'var(--color-popover)', borderWidth: '1px', borderColor: 'var(--color-border)' }}>
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                                    >
                                        <User size={16} />
                                        Thông tin cá nhân
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            navigate("/user-settings");
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                                    >
                                        <Settings size={16} />
                                        Cài đặt
                                    </button>
                                    <div className="border-t border-border my-1" />
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            logout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-accent transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-background relative z-0">
                    {children}
                </main>
            </div>


        </div>
    );
}
