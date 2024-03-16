import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/userauth/admin/users/all`
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

  const handleToggle = async (id, status) => {
    try {
      const changeStatus = await axios.post(
        `http://localhost:3000/userauth/accountstatus`,
        { accountstatus: !status, id: id }
      );
      if (changeStatus.status) {
        setUsers((prevList) =>
          prevList.map((user) =>
            user.id === id ? { ...user, isactive: !status } : user
          )
        );
      }
    } catch (error) {
      console.error("error sending data:", error);
    }
  };
  return (
    <div>
      <h1>Users List</h1>
      <div>
        <ul>
          {users?.map((user) => (
            <li key={user.id}>
              <span>{user.username}</span>
              <button onClick={() => handleToggle(user.id, user.isactive)}>
                {user.isactive ? "Block User" : "Unblock User"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
