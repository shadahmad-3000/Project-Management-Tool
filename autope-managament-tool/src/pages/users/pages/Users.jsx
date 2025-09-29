import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, getUsers } from "../../../utils/User";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found, please login.");
          return;
        }
        const res = await getUsers();
        setUsers(res.data?.data || []);
        setFilteredUsers(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const handleDelete = async (empID, isSuperAdmin) => {
    if (isSuperAdmin) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found, please login.");
        return;
      }

      const res = await deleteUser(empID, token);
      alert(res.data?.message || "User deleted successfully!");
      setUsers((prev) => prev.filter((user) => user.empID !== empID));
      setFilteredUsers((prev) => prev.filter((user) => user.empID !== empID));
    } catch (err) {
      console.error("Delete user failed:", err.response || err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px",
        minHeight: "90vh",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Users</h2>

        <div className="d-flex align-items-center gap-2">
          <div style={{ width: "250px" }}>
            <FloatingLabelInput
              label="Search Users"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>

          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/users/add")}>
              <span style={{ marginRight: "8px" }}>＋</span>
              New User
            </CButton>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>User Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Phone Number</th>
              <th>OTP Verification</th>
              <th>Approval Status</th>
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
                    <td>{user.empID}</td>
                    <td>{user.email}</td>
                    <td>{user.designation}</td>
                    <td>{user.phoneNo}</td>
                    <td>
                      {user.isVerified ? (
                        <span className="badge bg-success">Verified</span>
                      ) : (
                        <span className="badge bg-danger">Not Verified</span>
                      )}
                    </td>
                    <td>
                      {user.isApproved ? (
                        <span className="badge bg-primary">Approved</span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      )}
                    </td>
                    <td>{user.role}</td>
                    {(userRole === "Super-Admin" || userRole === "Admin") && (
                      <td>
                        <div className="d-flex gap-2">
                          <CButton
                            variant="text"
                            onClick={() =>
                              navigate(`/home/users/edit/${user.empID}`)
                            }
                          >
                            ✏️
                          </CButton>
                          <CButton
                            variant="text"
                            disabled={isSuperAdmin}
                            onClick={() =>
                              handleDelete(user.empID, isSuperAdmin)
                            }
                          >
                            🗑️
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
