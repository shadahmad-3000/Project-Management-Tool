// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Select,
//   Card,
//   message as antdMessage,
// } from "antd";
// import { updateTask } from "../../../utils/superAdmin";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeftOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const UpdateTask = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const payload = {
//         taskId: values.taskId,
//         updateTask: {
//           taskName: values.taskName,
//           description: values.description,
//           taskStatus: values.taskStatus,
//           taskduration: values.taskduration,
//           taskPriority: values.taskPriority,
//         },
//       };

//       console.log("Update Task Payload:", payload);
//       const res = await updateTask(payload);

//       antdMessage.success(res.data?.message || "Task updated successfully!");
//       form.resetFields();
//       navigate("/home/tasks");
//     } catch (err) {
//       console.error("Update Task error:", err);
//       antdMessage.error(err.response?.data?.message || "Task update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card
//       className="shadow-xl p-6"
//       style={{
//         backgroundColor: "#1f1f1f",
//         color: "#f5f5f5",
//         borderRadius: "10px",
//       }}
//     >
//       <Button
//         type="text"
//         icon={<ArrowLeftOutlined />}
//         onClick={() => navigate(-1)}
//         className="absolute top-4 left-4 text-gray-300 hover:text-white"
//       >
//         Back
//       </Button>
//       <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
//         Update Task
//       </h2>

//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <Form.Item
//           label="Task ID"
//           name="taskId"
//           rules={[{ required: true, message: "Task ID is required" }]}
//         >
//           <Input placeholder="Enter task ID to update" />
//         </Form.Item>

//         <Form.Item label="Task Name" name="taskName">
//           <Input placeholder="Enter new task name (optional)" />
//         </Form.Item>

//         <Form.Item label="Description" name="description">
//           <Input.TextArea
//             rows={3}
//             placeholder="Update description (optional)"
//           />
//         </Form.Item>

//         <Form.Item label="Task Status" name="taskStatus">
//           <Select placeholder="Update status">
//             <Option value="Not Started">Not Started</Option>
//             <Option value="Pending">Pending</Option>
//             <Option value="In Progress">In Progress</Option>
//             <Option value="Completed">Completed</Option>
//             <Option value="On Hold">On Hold</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Duration (in hours)" name="taskduration">
//           <Input type="number" placeholder="Update duration (optional)" />
//         </Form.Item>

//         <Form.Item label="Priority" name="taskPriority">
//           <Select placeholder="Update priority">
//             <Option value="Low">Low</Option>
//             <Option value="Medium">Medium</Option>
//             <Option value="High">High</Option>
//           </Select>
//         </Form.Item>

//         <Button type="primary" htmlType="submit" loading={loading} block>
//           Update Task
//         </Button>
//       </Form>
//     </Card>
//   );
// };

// export default UpdateTask;
