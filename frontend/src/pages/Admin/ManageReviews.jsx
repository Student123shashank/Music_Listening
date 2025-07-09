import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editReview, setEditReview] = useState(null); // to store the review being edited
  const [editData, setEditData] = useState({ rating: "", comment: "" });

  // Fetch all reviews
  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:1000/api/v1/all");
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reviews.");
      setLoading(false);
    }
  };

  // Delete a review
  const handleDelete = async (reviewId) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:1000/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  // Open edit form
  const handleEditClick = (review) => {
    setEditReview(review);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  // Update review
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:1000/update/${update._id}`, editData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updated = res.data.data;
      setReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setEditReview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update review");
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage All Reviews</h1>
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-md p-4 border flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">
                  By: {review.user?.username || "Unknown User"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700">
                <span className="font-medium">Rating:</span> {review.rating}/5
              </p>

              <p className="text-gray-800 mt-1">
                <span className="font-medium">Comment:</span> {review.comment}
              </p>

              {review.song && (
                <p className="text-blue-600 mt-1">
                  <span className="font-medium">Song ID:</span> {review.song}
                </p>
              )}

              {review.playlist && (
                <p className="text-green-600 mt-1">
                  <span className="font-medium">Playlist ID:</span> {review.playlist}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Review</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={editData.rating}
                onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Comment</label>
              <textarea
                rows="3"
                value={editData.comment}
                onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditReview(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
