import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { useDispatch } from "react-redux";
import { addUsers } from "../../../store/slices/SuperAdminSlice";
import { getUserById, updateUser } from "../../../store/slices/userSlice";

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
  const dispatch = useDispatch();
  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    if (isEditMode && empID) {
      setInitialLoading(true);

      dispatch(getUserById(empID))
        .unwrap()
        .then((user) => {
          setName(user.name || "");
          setEmail(user.email || "");
          setEmpIDInput(user.empID || "");
          setDesignation(user.designation || "");
          setPhoneNo(user.phoneNo || "");
          setDepartment(user.department || "");
        })
        .catch(() => {
          alert("Failed to fetch user");
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [isEditMode, empID, dispatch]);

  const handleSubmit = () => {
    if (!name || !email || (!isEditMode && !password) || !empIDInput) {
      setShowErrors(true);
      return;
    }

    setLoading(true);

    if (isEditMode) {
      const payload = {
        empID,
        updateData: { name, email, designation, phoneNo, department },
      };

      dispatch(updateUser(payload))
        .unwrap()
        .then(() => {
          alert("User updated successfully!");
          navigate("/home/users");
        })
        .catch(() => {
          alert("Failed to update user");
        })
        .finally(() => {
          setLoading(false);
        });
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

      dispatch(addUsers(payload))
        .unwrap()
        .then(() => {
          alert("User created successfully!");
          navigate("/home/users");
        })
        .catch(() => {
          alert("Failed to create user");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (initialLoading) {
    return <div className="form-card">Loading...</div>;
  }

  return (
    <div className="form-card">
      <div className="form-header">
        <CButton onClick={() => navigate(-1)} variant="text">
          <ArrowLeftOutlined style={{ marginRight: 6 }} /> Back
        </CButton>
        <h2 className="form-title">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Name"
          inputValue={name}
          onChangeInputText={(val) =>
            setName(typeof val === "string" ? val : val.text)
          }
        />
        {!name && showErrors && <p className="form-error">Name is required</p>}
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Email"
          inputValue={email}
          onChangeInputText={(val) =>
            setEmail(typeof val === "string" ? val : val.text)
          }
        />
        {!email && showErrors && (
          <p className="form-error">Email is required</p>
        )}
      </div>

      {!isEditMode && (
        <div className="form-group">
          <FloatingLabelInput
            label="Password"
            inputValue={password}
            secureTextEntry
            onChangeInputText={(val) =>
              setPassword(typeof val === "string" ? val : val.text)
            }
          />
          {!password && showErrors && (
            <p className="form-error">Password is required</p>
          )}
        </div>
      )}

      <div className="form-group">
        <FloatingLabelInput
          label="Employee ID"
          inputValue={empIDInput}
          disabled={isEditMode}
          onChangeInputText={(val) =>
            setEmpIDInput(typeof val === "string" ? val : val.text)
          }
        />
        {!empIDInput && showErrors && (
          <p className="form-error">Employee ID is required</p>
        )}
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Designation"
          inputValue={designation}
          onChangeInputText={(val) =>
            setDesignation(typeof val === "string" ? val : val.text)
          }
        />
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Phone Number"
          inputValue={phoneNo}
          keyboardType="number-pad"
          onChangeInputText={(val) =>
            setPhoneNo(typeof val === "string" ? val : val.text)
          }
        />
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Department"
          inputValue={department}
          onChangeInputText={(val) =>
            setDepartment(typeof val === "string" ? val : val.text)
          }
        />
      </div>

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
