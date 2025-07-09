import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUser } from "../../services/auth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => getAllUsers().then(res => setUsers(res.data.users));

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleUpdate = async (id) => {
    const username = prompt("New username:");
    const email = prompt("New email:");
    await updateUser(id, { username, email });
    fetchUsers();
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      {users.map(u => (
        <div key={u._id} className="flex justify-between items-center border-b py-2">
          <div>
            <p>{u.username}</p>
            <p>{u.email}</p>
          </div>
          <div>
            <button onClick={() => handleUpdate(u._id)} className="mr-2">Edit</button>
            <button onClick={() => handleDelete(u._id)} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageUsers;
