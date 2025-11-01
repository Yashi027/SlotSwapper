import React, { useEffect, useState, useContext } from "react";
import { api } from "../api.js";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/layout.css";

export default function Requests() {
  const { token } = useContext(AuthContext);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  // Fetch all incoming and outgoing swap requests
  async function load() {
    try {
      const data = await api("/swap/requests", { token });
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      console.error("Error loading requests:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Accept or reject a swap request
  async function respond(id, accept) {
    try {
      await api(`/swap/respond/${id}`, {
        method: "POST",
        token,
        body: { accept },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error responding to swap request:", err);
    }
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Swap Requests</h2>

      {/* Incoming Requests */}
      <section className="section">
        <h4 className="section-title">Incoming Requests</h4>
        {incoming.length === 0 && <p>No incoming requests</p>}

        {incoming.map((req) => (
          <div className="card" key={req._id}>
            <p>
              <strong>{req.requester?.name || "Unknown User"}</strong> wants to
              swap their{" "}
              <em>{req.mySlot?.title || "Deleted Slot"}</em> with your{" "}
              <em>{req.theirSlot?.title || "Deleted Slot"}</em>
            </p>
            <p>Status: {req.status}</p>

            {req.status === "PENDING" && (
              <div style={{ marginTop: "8px" }}>
                <button
                  className="btn"
                  onClick={() => respond(req._id, true)}
                  style={{ marginRight: "8px" }}
                >
                  Accept
                </button>
                <button
                  className="btn-danger"
                  onClick={() => respond(req._id, false)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Outgoing Requests */}
      <section className="section">
        <h4 className="section-title">Outgoing Requests</h4>
        {outgoing.length === 0 && <p>No outgoing requests</p>}

        {outgoing.map((req) => (
          <div className="card" key={req._id}>
            <p>
              To <strong>{req.responder?.name || "Unknown User"}</strong>: Offered{" "}
              <em>{req.mySlot?.title || "Deleted Slot"}</em> for their{" "}
              <em>{req.theirSlot?.title || "Deleted Slot"}</em>
            </p>
            <p>Status: {req.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
