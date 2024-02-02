import AdminLayout from "@/components/admin/AdminLayout";
import Users from "./Users";

export const metadata = {
    title: "Admin Users",
    description: "Admin Users",
};

export default function AdminUsersPage() {
    return (
        <AdminLayout activeItem="users">
            <Users />
        </AdminLayout>
    );
}
