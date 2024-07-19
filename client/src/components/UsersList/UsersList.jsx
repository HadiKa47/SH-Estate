import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest"; // Update based on your setup
import "./usersList.scss"; // Create or update this CSS file for styling

function UsersList({ onUserSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiRequest("/users"); // Ensure this path matches your API endpoint
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="usersList">
      <h1>Users</h1>
      <div className="userListItems">
        {users.map((user) => (
          <div
            key={user.id}
            className="userItem"
            onClick={() => onUserSelect(user.id)}
          >
            <img src={user.avatar || "/noavatar.jpg"} alt={user.username} />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
