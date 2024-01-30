import AdminLayout from "@/components/admin/AdminLayout";
import Orders from "./Orders";

export const metadata = {
    title: "Admin Orders",
    description: "Admin Orders",
};

export default function AdminOrdersPage() {
    return (
        <AdminLayout activeItem='orders'>
            <Orders />
        </AdminLayout>
    );
}