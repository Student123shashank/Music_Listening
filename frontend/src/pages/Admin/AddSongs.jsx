import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiPlus, FiMusic, FiUpload, FiFile, FiImage } from "react-icons/fi";

const AddSong = () => {
  const [song, setSong] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
    audioFile: null,
    coverImageFile: null,
    releaseDate: "",
    rating: 0,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSong((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSong((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSuccessMessage = () => {
    Swal.fire({
      title: "Success!",
      text: "Song added successfully!",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#4f46e5",
    });
  };

  const showErrorMessage = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#4f46e5",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", song.title);
      formData.append("artist", song.artist);
      formData.append("album", song.album);
      formData.append("genre", song.genre);
      formData.append("duration", song.duration);
      formData.append("releaseDate", song.releaseDate);
      formData.append("rating", song.rating);

      if (song.audioFile) {
        formData.append("audio", song.audioFile);
      }
      if (song.coverImageFile) {
        formData.append("coverImage", song.coverImageFile);
      }

      await axios.post(
        "http://localhost:1000/api/v1/add-song",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      showSuccessMessage();
      setSong({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        audioFile: null,
        coverImageFile: null,
        releaseDate: "",
        rating: 0,
      });
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to add song. Try again!";
      showErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Song</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["title", "artist", "album", "genre", "duration", "rating", "releaseDate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === "releaseDate" ? "date" : field === "rating" || field === "duration" ? "number" : "text"}
                    name={field}
                    value={song[field]}
                    onChange={handleChange}
                    required={["title", "artist", "genre", "duration"].includes(field)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              ))}

              {/* Cover Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span className="flex items-center gap-2">
                      <FiImage className="text-indigo-500" />
                      {song.coverImageFile ? song.coverImageFile.name : "Choose file"}
                    </span>
                    <input
                      type="file"
                      name="coverImageFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Audio File Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Audio File</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span className="flex items-center gap-2">
                      <FiMusic className="text-indigo-500" />
                      {song.audioFile ? song.audioFile.name : "Choose file"}
                    </span>
                    <input
                      type="file"
                      name="audioFile"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="md:col-span-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : <><FiUpload /> Add Song</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSong;
