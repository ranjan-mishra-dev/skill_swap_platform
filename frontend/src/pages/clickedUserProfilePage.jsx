import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProfilePage = () => {
  const { id } = useParams(); // profile being viewed (receiverId)
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggesdInUser] = useState(null);
  const { backendUrl, token } = useContext(AppContext);

  const [showPopup, setShowPopup] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState("");
  const [requestedSkill, setRequestedSkill] = useState("");
  const [message, setMessage] = useState("");

  const getUserData = async () => {
    const res = await axios.get(
      backendUrl + `/request/get-user-by-id/${id}`,
      { headers: { token } }
    );
    setUser(res.data.user);
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  const loggedInUserData = async () => {
    const res = await axios.get(
      backendUrl + '/users/me',
      { headers: { token } }
    );
    setLoggesdInUser(res.data.userData);
    console.log(res.data.userData)
  };

  useEffect(() => {
    loggedInUserData();
  }, []);

  const handleRequestClick = () => {
    setShowPopup(true);
  };

  const handleSubmitRequest = async () => {
    try {
      await axios.post(
        backendUrl + "/swaps",
        {
          requesterId: loggedInUser._id,
          receiverId: user._id,
          offeredSkill,
          requestedSkill,
          message,
        },
        { headers: { token } }
      );

      alert("Swap request sent!");
      setShowPopup(false);
      setOfferedSkill("");
      setRequestedSkill("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="relative max-w-3xl mx-auto my-8 p-6 border rounded-xl shadow-lg bg-white">
      {/* Profile Info */}
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h1 className="text-2xl font-bold text-center mt-4">{user.name}</h1>
      <p className="text-center text-gray-600">{user.location}</p>

      {/* Bio */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Bio</h2>
        <p>{user.bio}</p>
      </div>

      {/* Skills */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Skills Offered</h2>
        <ul className="list-disc pl-6">
          {user.skillsOffered.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-lg">Skills Wanted</h2>
        <ul className="list-disc pl-6">
          {user.skillsWanted.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Availability */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Availability</h2>
        <p>Weekends: {user.availability.weekends ? "✅" : "❌"}</p>
        <p>Weekdays (Daytime): {user.availability.weekdaysDaytime ? "✅" : "❌"}</p>
        <p>Weekdays (Evenings): {user.availability.weekdaysEvenings ? "✅" : "❌"}</p>
      </div>

      {/* Request Button */}
      <div className="absolute bottom-5 right-5">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg border border-transparent 
                     hover:bg-white hover:text-black hover:border-blue-700"
          onClick={handleRequestClick}
        >
          Request
        </button>
      </div>

      {/* Rating */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Rating</h2>
        {/* <p>{user.rating.avg} ⭐ ({user.rating.count} reviews)</p> */}
      </div>

      {/* Request Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Send Swap Request</h2>

            {/* Offered Skill */}
            <label className="block mb-2 font-semibold">Choose your offered skill:</label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">-- Select Skill --</option>
              {loggedInUser.skillsOffered.map((skill, i) => (
                <option key={i} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            {/* Requested Skill */}
            <label className="block mb-2 font-semibold">Choose skill you want:</label>
            <select
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">-- Select Skill --</option>
              {user.skillsOffered.map((skill, i) => (
                <option key={i} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            {/* Message */}
            <label className="block mb-2 font-semibold">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              rows="3"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
