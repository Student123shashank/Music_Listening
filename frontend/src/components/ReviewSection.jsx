import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviews';

const ReviewSection = ({ type, id }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = type === 'song' 
          ? await reviewService.getSongReviews(id)
          : await reviewService.getPlaylistReviews(id);
        setReviews(response.data);
      } catch (err) {
        setError('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const reviewData = {
        userId: user._id,
        [type === 'song' ? 'songId' : 'playlistId']: id,
        rating: newReview.rating,
        comment: newReview.comment
      };
      
      const response = await reviewService.addReview(reviewData, token);
      setReviews([response.data.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      setError('Failed to add review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {user && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="mb-2">
            <label className="block mb-1 font-medium">Your Rating</label>
            <select 
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} star{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      )}
      
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{review.user?.username || 'Anonymous'}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;