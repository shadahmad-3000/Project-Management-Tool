import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteUser, getUsers } from "../../../store/slices/userSlice";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    setLoading(true);

    dispatch(getUsers())
      .unwrap()
      .then((data) => {
        setUsers(data || []);
        setFilteredUsers(data || []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        alert(err || "Failed to fetch users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleSearch = (val) => {
    const value = typeof val === "string" ? val : val.text;
    setSearchValue(value);

    const filtered = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(value.toLowerCase()) ||
        user.empID?.toLowerCase().includes(value.toLowerCase()) ||
        user.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = (empID, isSuperAdmin) => {
    if (isSuperAdmin) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);

    dispatch(deleteUser(empID))
      .unwrap()
      .then((res) => {
        alert(res?.data?.message || "User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user.empID !== empID));
        setFilteredUsers((prev) => prev.filter((user) => user.empID !== empID));
      })
      .catch((err) => {
        console.error("Delete user failed:", err);
        alert(err || "Failed to delete user");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2 className="page-title">Users</h2>

        <div className="page-actions">
          <div className="page-search">
            <FloatingLabelInput
              label="Search Users"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>

          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/users/add")}>
              ＋ New User
            </CButton>
          )}
        </div>
      </div>

      <div className="page-table">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              {(userRole === "Super-Admin" || userRole === "Admin") && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSuperAdmin = user.role === "Super-Admin";
                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNo}</td>
                    <td>{user.role}</td>
                    {(userRole === "Super-Admin" || userRole === "Admin") && (
                      <td>
                        <div className="action-buttons">
                          <CButton
                            variant="text"
                            onClick={() =>
                              navigate(`/home/users/edit/${user.empID}`)
                            }
                          >
                            <EditOutlined />
                          </CButton>
                          <CButton
                            variant="text"
                            disabled={isSuperAdmin}
                            onClick={() =>
                              handleDelete(user.empID, isSuperAdmin)
                            }
                          >
                            <DeleteOutlined />
                          </CButton>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
