import { useState } from "react";
import { updatePassword } from "../../services/auth";

const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(form);
      onClose();
      alert("Password updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal">
      <input type="password" placeholder="Current Password" onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      <input type="password" placeholder="New Password" onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      <button type="submit">Change</button>
    </form>
  );
};

export default ChangePasswordModal;
