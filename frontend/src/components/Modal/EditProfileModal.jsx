import { useState } from "react";
import { updateProfile } from "../../services/auth";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState({ username: user.username, email: user.email });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      onUpdate(); // refetch user
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal">
      <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditProfileModal;
