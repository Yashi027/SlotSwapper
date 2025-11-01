import React, { useEffect, useState, useContext } from "react";
import { api } from "../api.js";
import { AuthContext } from "../contexts/AuthContext";
import EventList from "../components/EventList";
import "../styles/layout.css";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  async function loadEvents() {
    const data = await api("/events/mine", { token });
    setEvents(data);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    try {
      await api("/events", {
        method: "POST",
        token,
        body: { title, startTime: start, endTime: end },
      });
      setTitle("");
      setStart("");
      setEnd("");
      loadEvents();
    } catch {
      alert("Error creating event");
    }
  }

  async function toggleStatus(id, newStatus) {
    await api(`/events/${id}`, { method: "PUT", token, body: { status: newStatus } });
    loadEvents();
  }

  async function deleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;
    await api(`/events/${id}`, { method: "DELETE", token });
    loadEvents();
  }

  return (
    <div className="page-container">
      <h2 className="page-title">My Dashboard</h2>

      <section className="section">
        <h4 className="section-title">Create New Event</h4>
        <form onSubmit={createEvent}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            required
          />
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
          <button className="btn" type="submit">Add Event</button>
        </form>
      </section>

      <section className="section">
        <h4 className="section-title">My Events</h4>
        <EventList events={events} onToggleSwappable={toggleStatus} onDelete={deleteEvent} />
      </section>
    </div>
  );
}
