import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUserById, updateUser } from "../../../utils/User";
import { addUsers } from "../../../utils/superAdmin";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const AddEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empIDInput, setEmpIDInput] = useState("");
  const [designation, setDesignation] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [department, setDepartment] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const navigate = useNavigate();
  const { empID } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    if (isEditMode && empID) {
      const fetchUser = async () => {
        setInitialLoading(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("No token found. Please log in again.");
            return;
          }
          const res = await getUserById(empID, token);
          if (res.data?.data) {
            const user = res.data.data;
            setName(user.name || "");
            setEmail(user.email || "");
            setEmpIDInput(user.empID || "");
            setDesignation(user.designation || "");
            setPhoneNo(user.phoneNo || "");
            setDepartment(user.department || "");
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          alert("Failed to fetch user");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchUser();
    }
  }, [isEditMode, empID]);

  const handleSubmit = async () => {
    if (!name || !email || (!isEditMode && !password) || !empIDInput) {
      setShowErrors(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      if (isEditMode) {
        const payload = {
          empID,
          updateData: { name, email, designation, phoneNo, department },
        };
        await updateUser(payload, token);
        alert("User updated successfully!");
      } else {
        const payload = {
          name,
          email,
          password,
          empID: empIDInput,
          designation,
          phoneNo,
          department,
        };
        await addUsers(payload, token);
        alert("User created successfully!");
      }

      navigate("/home/users");
    } catch (err) {
      console.error("User save failed:", err);
      alert("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );
  }

  return (
    <div
      className="card p-4"
      style={{
        backgroundColor: "#141414",
        color: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <CButton onClick={() => navigate(-1)} variant="text">
        <ArrowLeftOutlined style={{ marginRight: 6 }} />
        Back
      </CButton>

      <h2 className="my-3">{isEditMode ? "Edit User" : "Add New User"}</h2>

      <FloatingLabelInput
        label="Name"
        inputValue={name}
        onChangeInputText={(val) =>
          setName(typeof val === "string" ? val : val.text)
        }
      />
      {!name && showErrors && <p className="text-danger">Name is required</p>}

      <FloatingLabelInput
        label="Email"
        inputValue={email}
        onChangeInputText={(val) =>
          setEmail(typeof val === "string" ? val : val.text)
        }
      />
      {!email && showErrors && <p className="text-danger">Email is required</p>}

      {!isEditMode && (
        <>
          <FloatingLabelInput
            label="Password"
            inputValue={password}
            secureTextEntry
            onChangeInputText={(val) =>
              setPassword(typeof val === "string" ? val : val.text)
            }
          />
          {!password && showErrors && (
            <p className="text-danger">Password is required</p>
          )}
        </>
      )}

      <FloatingLabelInput
        label="Employee ID"
        inputValue={empIDInput}
        disabled={isEditMode}
        onChangeInputText={(val) =>
          setEmpIDInput(typeof val === "string" ? val : val.text)
        }
      />
      {!empIDInput && showErrors && (
        <p className="text-danger">Employee ID is required</p>
      )}

      <FloatingLabelInput
        label="Designation"
        inputValue={designation}
        onChangeInputText={(val) =>
          setDesignation(typeof val === "string" ? val : val.text)
        }
      />

      <FloatingLabelInput
        label="Phone Number"
        inputValue={phoneNo}
        keyboardType="number-pad"
        onChangeInputText={(val) =>
          setPhoneNo(typeof val === "string" ? val : val.text)
        }
      />

      <FloatingLabelInput
        label="Department"
        inputValue={department}
        onChangeInputText={(val) =>
          setDepartment(typeof val === "string" ? val : val.text)
        }
      />

      <CButton
        onClick={handleSubmit}
        loading={loading}
        style={{ width: "100%" }}
      >
        {isEditMode ? "Update User" : "Create User"}
      </CButton>
    </div>
  );
};

export default AddEditUser;
