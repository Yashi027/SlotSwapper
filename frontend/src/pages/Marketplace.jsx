import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../api.js";
import "../styles/layout.css";

export default function Marketplace() {
  const { token } = useContext(AuthContext);
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [mySlotId, setMySlotId] = useState("");
  const [targetSlotId, setTargetSlotId] = useState("");

  async function load() {
    const market = await api("/swap/swappable", { token });
    setSwappableSlots(market);
    const mine = await api("/events/mine", { token });
    setMySlots(mine.filter((e) => e.status === "SWAPPABLE"));
  }

  useEffect(() => {
    load();
  }, []);

  async function sendRequest() {
    if (!mySlotId || !targetSlotId) return alert("Select both slots first");
    try {
      await api("/swap/request", { method: "POST", token, body: { mySlotId, theirSlotId: targetSlotId } });
      alert("Swap request sent!");
      setMySlotId("");
      setTargetSlotId("");
      load();
    } catch (err) {
      alert(err.data?.message || "Request failed");
    }
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Marketplace</h2>
      <div className="grid-2">
        <div>
          <h4 className="section-title">Other Users' Swappable Slots</h4>
          {swappableSlots.map((slot) => (
            <div
              key={slot._id}
              className={`card ${targetSlotId === slot._id ? "selected" : ""}`}
            >
              <h4>{slot.title}</h4>
              <p>
                {new Date(slot.startTime).toLocaleString()} –{" "}
                {new Date(slot.endTime).toLocaleString()}
              </p>
              <p><strong>By:</strong> {slot.owner.name}</p>
              <button className="btn" onClick={() => setTargetSlotId(slot._id)}>
                {targetSlotId === slot._id ? "Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>

        <div>
          <h4 className="section-title">My Swappable Slots</h4>
          {mySlots.map((slot) => (
            <div
              key={slot._id}
              className={`card ${mySlotId === slot._id ? "selected" : ""}`}
            >
              <h4>{slot.title}</h4>
              <p>{new Date(slot.startTime).toLocaleString()}</p>
              <button className="btn" onClick={() => setMySlotId(slot._id)}>
                {mySlotId === slot._id ? "Selected" : "Select"}
              </button>
            </div>
          ))}
          <button className="btn" onClick={sendRequest} disabled={!mySlotId || !targetSlotId}>
            Send Swap Request
          </button>
        </div>
      </div>
    </div>
  );
}
