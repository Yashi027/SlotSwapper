import React from "react";
import "../styles/components.css";

export default function EventList({ events, onToggleSwappable, onDelete }) {
  return (
    <div className="event-list">
      {events.length === 0 && <div>No events available</div>}
      {events.map((ev) => (
        <div className="event-card" key={ev._id}>
          <div className="event-title">{ev.title}</div>
          <div className="event-time">
            {new Date(ev.startTime).toLocaleString()} – {new Date(ev.endTime).toLocaleString()}
          </div>
          <div className="event-status">Status: {ev.status}</div>
          <div className="event-actions">
            {ev.status === "BUSY" && (
              <button onClick={() => onToggleSwappable(ev._id, "SWAPPABLE")}>
                Make Swappable
              </button>
            )}
            {ev.status === "SWAPPABLE" && (
              <button onClick={() => onToggleSwappable(ev._id, "BUSY")}>
                Unmark Swappable
              </button>
            )}
            <button className="delete-btn" onClick={() => onDelete(ev._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
