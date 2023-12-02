import { fetchAllUsers } from "@/actions/admin";
import UserList from "@/components/userslist";

export default async function Page() {
  const users = await fetchAllUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">ADMIN DASHBOARD</h1>
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <UserList users={users} />
    </div>
  );
}
