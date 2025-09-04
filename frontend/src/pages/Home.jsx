import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import e from "cors";
import { useNavigate } from "react-router-dom";
import Announcements from "./Announcement";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(""); // availability filter

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { backendUrl, token } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate()
  
  
  const handleRequestClick = (user) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect to login if not logged in
      return;
    }
    setSelectedUser(user); // store the clicked user in state
    console.log(selectedUser)
    navigate(`/request-profile/${user._id}`);

};


  const searchIt = async () => {
    try {
      console.log("searching for:", search);

      let url = `${backendUrl}/homepage-data/search?search=${search}`;
      const res = await axios.get(url, { headers: { token } });

      // ✅ update `users` instead of `results`
      setUsers(res.data.searchResult);

      console.log("search result", res.data.searchResult);
    } catch (err) {
      console.error(err);
    }
  };

  // Optional: auto-search whenever search input changes
  useEffect(() => {
    if (search.trim() !== "") {
      searchIt();
    }
  }, [search]); // no need to include setUsers here

  useEffect(() => {

    const fetchUsers = async () => {
      setLoading(true);
      try {
        // build URL
        let url = `${backendUrl}/homepage-data?page=${page}&limit=5`;
        if (filter) {
          url += `&availability=${filter}`;
        }

        const res = await axios.get(url, {
          headers: { token },
        });

        setUsers(res.data.users || []);
        setPages(res.data.pagination?.pages || 1);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, filter, backendUrl, token]);

  return (
    <div className="p-6">
      <p className="text-2xl font-bold gap-4 my-5 mx-20">
        Your Next Skill Starts with Someone Here ✨
      </p>

      {/* Availability filter buttons */}

      <div className="flex justify-between gap-4 my-5 mx-20">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("weekends")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "weekends"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-blue-50"
            }`}
          >
            Weekends
          </button>
          <button
            onClick={() => setFilter("weekdaysDaytime")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "weekdaysDaytime"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-blue-50"
            }`}
          >
            Weekdays Daytime
          </button>
          <button
            onClick={() => setFilter("weekdaysEvenings")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "weekdaysEvenings"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-blue-50"
            }`}
          >
            Weekdays Evenings
          </button>
          <button
            onClick={() => setFilter("")}
            className={`px-4 py-2 rounded-lg border ${
              filter === ""
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-blue-50"
            }`}
          >
            Show All
          </button>
        </div>
        <div>
          <input
            className="px-5 w-60 border border-black p-2 rounded-3xl"
            type="text"
            name="search"
            placeholder="e.g. react developer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={searchIt}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Search
          </button>
        </div>
      </div>

      {/* User list */}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 my-5 mx-20">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-4 border rounded-3xl shadow-sm"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="ml-4 flex-1 space-y-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-600">
                  <strong>Offered:</strong> {user.skillsOffered.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Wanted:</strong> {user.skillsWanted.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Availability:</strong>{" "}
                  {user.availability.weekends && "| Weekends | "}
                  {user.availability.weekdaysDaytime && " | Daytime  | "}
                  {user.availability.weekdaysEvenings && " | Evenings | "}
                </p>
              </div>
              <div className="flex flex-col space-y-5 mx-10 my-5">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg border border-transparent 
                     hover:bg-white hover:text-black hover:border-blue-700"
                  onClick={() => handleRequestClick(user)}
                >
                  Request
                </button>
                <p className="text-sm text-gray-600">
                  ⭐ Rating: {user.rating?.avg || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      ) : (
        <p>No users found.</p>
      )}


      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(pages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded-full ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
