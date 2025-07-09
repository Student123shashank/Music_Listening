import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { favouritesService } from '../services/favourites';

const FavouriteButton = ({ songId, isFavourite: initialIsFavourite }) => {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const { token } = useAuth();

  const handleToggleFavourite = async () => {
    try {
      if (isFavourite) {
        await favouritesService.removeFromFavourites(songId, token);
      } else {
        await favouritesService.addToFavourites(songId, token);
      }
      setIsFavourite(!isFavourite);
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  return (
    <button 
      onClick={handleToggleFavourite}
      className={`p-2 rounded-full ${isFavourite ? 'text-red-500' : 'text-gray-400'}`}
    >
      {isFavourite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavouriteButton;