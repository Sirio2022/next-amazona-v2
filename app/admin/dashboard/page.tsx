import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "./Dashboard";

export const metadata = {
    title: "Admin Dashboard",
    description: "The admin dashboard",
};

export default function AdminDashboardPage() {
    return (
        <AdminLayout activeItem="dashboard">
            <Dashboard />
        </AdminLayout>
    );
}