import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'

const DashBoard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    // const res = await axios.get(`/api/admin/dashboard`, {
    //   params: { page, search },
    //   headers: {{token}
    // });

    const token = localStorage.getItem("token")
    console.log(token)

const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
  params: { page, search },
  headers: {token}
});


    setUsers(res.data.users);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const suspendUser = async (id) => {
    const gettoken = localStorage.getItem("token")
    await axios.post(`http://localhost:5000/api/admin/users/${id}/suspend`, {}, {
      headers: {token: gettoken} }
    );
    fetchUsers(); // refresh list
  };

  return (
    <div className="p-5">
      <Link to={'/admin/announcement'}>Broad-Cast Meassage</Link>
      <h1 className="text-2xl font-bold mb-4">User Management [Admin Section]</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Users list */}
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u._id} className="p-3 border rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={u.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                {u.banned && <span className="text-red-600 text-xs">Suspended</span>}
              </div>
            </div>
            {!u.banned && (
              <button
                onClick={() => suspendUser(u._id)}
                className="px-3 py-1 bg-white-600 text-black rounded border border-black hover:bg-red-600 hover:text-white"
              >
                Suspend
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {Math.ceil(total / 20)}</span>
        <button
          disabled={page >= Math.ceil(total / 20)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DashBoard;
