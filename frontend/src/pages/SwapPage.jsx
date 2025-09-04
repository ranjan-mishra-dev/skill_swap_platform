import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const SwapsPage = () => {
  const [activeTab, setActiveTab] = useState("inbox"); // inbox | outbox | completed
  const [inbox, setInbox] = useState([]);
  const [outbox, setOutbox] = useState([]);
  const {backendUrl, token} = useContext(AppContext)
  const [completed, setCompleted] = useState([]);
  console.log(token)

  // fetch inbox
  const fetchInbox = async () => {
    const { data } = await axios.get(backendUrl + "/swaps/inbox", {headers: {token}});
    setInbox(data);
  };
  
  // fetch outbox
  const fetchOutbox = async () => {
    const { data } = await axios.get(backendUrl + "/swaps/outbox", {headers: {token}});
    setOutbox(data);
    console.log("data from outbox", outbox)
  };

  // fetch completed
  const fetchCompleted = async () => {
    const { data } = await axios.get(backendUrl + "/swaps/completed", {headers: {token}});
    setCompleted(data);
    console.log(completed)
    console.log("completed")
  };

  useEffect(() => {
    fetchInbox();
    fetchOutbox();
    fetchCompleted();
  }, []);

  // Accept Swap
  const handleAccept = async (id) => {
await axios.patch(
  backendUrl + `/swaps/${id}/accept`,
  null, // no request body
  { headers: { token } } // headers
);
    fetchInbox();
  };

  // Reject Swap
  const handleReject = async (id) => {
    await axios.patch(backendUrl + `/swaps/${id}/reject`, {headers: {token}});
    fetchInbox();
  };

  // Mark as Completed
  const handleComplete = async (id) => {
    await axios.patch(backendUrl + `/swaps/${id}/completed`, null, {headers: {token}});
    fetchInbox();
    fetchCompleted();
  };

  // Withdraw Outbox
  const handleWithdraw = async (id) => {
    await axios.delete(backendUrl + `/swaps/${id}/withdraw`, {headers: {token}});
    fetchOutbox();
  };

  // Submit feedback in completed
  const handleFeedback = async (id, rating, feedback) => {
    await axios.post(backendUrl + `/rate/${id}/feedback`, { rating, feedback }, {headers: {token}});
    fetchCompleted();
  };

  const renderInbox = () => (
    <div>
      {inbox.map((swap) => (
        <div key={swap._id} className="border p-4 rounded mb-3 flex relative">
          <div className="flex items-center gap-3">
            <img
              src={swap.requesterId.avatarUrl}
              alt="profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h3 className="font-bold">{swap.requesterId.name}</h3>
              <p>
                <span className="text-amber-800"> Skill requester Wants: </span> <b>{swap.requestedSkill}</b> </p> 
                <p> <span className="text-red-400"> Offers: </span>
                <b>{swap.offeredSkill}</b>
              </p>
              <p><span className="text-blue-500">Message by requester: </span>{swap.message}</p>
              {/* <p>⭐ {swap.requester.rating || "No rating yet"}</p> */}
            </div>
              <p className="absolute top-2 right-2"><span className="text-blue-500">Current Status: </span> <br />{swap.status}</p>
          </div>
          {swap.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleAccept(swap._id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(swap._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
          {swap.status === "accepted" && (
            <div className="mt-3">
              <button
                onClick={() => handleComplete(swap._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Mark as Completed
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderOutbox = () => (
    <div>
      {outbox.map((swap) => (
        
        <div key={swap._id} className="border p-4 rounded mb-3">
          <div className="flex items-center gap-3">
            <img
              src={swap.receiverId.avatarUrl}
              alt="profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h3 className="font-bold">{swap.receiverId.name}</h3>
              <p>
                <span className="text-pink-400">You Offer: </span> <b>{swap.offeredSkill}</b> | You Want:{" "}
                <b>{swap.requestedSkill}</b>
              </p>
              {/* <p>⭐ {swap.receiverId.rating || "No rating yet"}</p> */}
              <p> <span className="text-red-600"> Status: </span>{swap.status}</p>
              <p><span className="text-blue-500">Message</span> sent: {swap.message}</p>
            </div>
          </div>
          {swap.status === "pending" && (
            <div className="mt-3">
              <button
                onClick={() => handleWithdraw(swap._id)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-white-400 hover:text-black hover:rounded-lg hover:border-b-2 hover:bg-white"
              >
                Withdraw
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCompleted = () => (
  <div>
    {completed.map((swap) =>
      swap.feedbackGiven ? (
        <div key={swap._id} className="p-3 border rounded bg-gray-100 mt-2">
        <h3 className="font-bold text-green-500">Completed Swap</h3>
    <div className="bg-white shadow-md rounded-xl p-5 mb-4 border hover:shadow-lg transition">
  {/* Header */}
  <div className="flex items-center justify-between border-b pb-2 mb-3">
    <h3 className="text-lg font-semibold text-gray-800">Completed Swap</h3>
    <span className="text-sm text-gray-500">
      With: <span className="font-medium text-gray-700">{swap.requesterId?.name}</span>
    </span>
  </div>

  {/* Skills Section */}
  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
    <div className="bg-gray-100 rounded-lg p-2 text-center">
      <p className="font-semibold text-green-600">Offered</p>
      <p className="text-gray-700">{swap.offeredSkill}</p>
    </div>
    <div className="bg-gray-100 rounded-lg p-2 text-center">
      <p className="font-semibold text-blue-600">Wanted</p>
      <p className="text-gray-700">{swap.requestedSkill}</p>
    </div>
  </div>

  {/* Rating */}
  <div className="flex items-center mb-3">
    <span className="text-yellow-500 text-lg">
      {"⭐".repeat(swap.feedback?.rating || 0)}
    </span>
    <span className="ml-2 text-gray-600 text-sm">
      {swap.feedback?.rating}/5
    </span>
  </div>

  {/* Feedback */}
  <p>Feedback:</p>
  {swap.feedback?.comment && ( 
    <blockquote className="italic text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-green-400">
      “{swap.feedback.comment}”
    </blockquote>
  )}
</div>

        </div>
      ) : (
        <div key={swap._id} className="border p-4 rounded mb-3">
          <div className="flex items-center gap-3">
            <img
              src={swap.requesterId.avatarUrl}
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-bold">{swap.name}</h3>
              <p>
                Exchanged: <b>{swap.offeredSkill}</b> ↔{" "}
                <b>{swap.requestedSkill}</b>
              </p>
            </div>
          </div>
          <div className="mt-3">
            <FeedbackForm
              onSubmit={(rating, feedback) =>
                handleFeedback(swap._id, rating, feedback)
              }
            />
          </div>
        </div>
      )
    )}
  </div>
);


  return (
    <div className="p-5">
      <div className="flex gap-5 mb-5">
        <button onClick={() => setActiveTab("inbox")}>Inbox</button>
        <button onClick={() => setActiveTab("outbox")}>Outbox</button>
        <button onClick={() => setActiveTab("completed")}>Completed</button>
      </div>

      {activeTab === "inbox" && renderInbox()}
      {activeTab === "outbox" && renderOutbox()}
      {activeTab === "completed" && renderCompleted()}
    </div>
  );
};

// Feedback form for completed swaps
const FeedbackForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");


  return (
    <div>
      <label>Rating: </label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <textarea
        className="border p-2 block w-full mt-2"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Leave feedback..."
      />
      <button
        onClick={() => onSubmit(rating, feedback)}
        className="px-3 py-1 bg-green-600 text-white rounded mt-2"
      >
        Submit
      </button>
    </div>
  );
};

export default SwapsPage;
