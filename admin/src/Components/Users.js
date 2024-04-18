import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NGROK_URL}/userauth/admin/users/all`, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          }
        );
        if (response.data.length > 0) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("error while fetching data:", error);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="users-container">
      <h1>Users List</h1>
      <div>
        <ul className="users-list">
          {users
            ?.filter((user) => user.role === "regular")
            .map((user) => (
              <li key={user.id}>
                <span>{user.username}</span>
                <Link to={`/manageuser?id=${user.id}`}>
                  <button>Manage User</button>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
