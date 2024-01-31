import AdminLayout from "@/components/admin/AdminLayout";
import Products from "./Products";

export const metadata = {
    title: 'Admin Products',
    description: 'Manage products',
};

export default function AdminProductsPage() {
    return (
        <AdminLayout activeItem="products">
            <Products />
        </AdminLayout>
    );
}