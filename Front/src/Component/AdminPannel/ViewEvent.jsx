import React, { useEffect, useState } from "react";

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({});
  const [expandedDescription, setExpandedDescription] = useState({});

  const getEventDateTime = (event) => {
    if (!event?.eventDate) return null;

    const datePart = event.eventDate.slice(0, 10);
    const timePart = event?.eventTime || "00:00";
    const eventDateTime = new Date(`${datePart}T${timePart}`);

    return Number.isNaN(eventDateTime.getTime()) ? null : eventDateTime;
  };

  const isUpcomingEvent = (event, now = new Date()) => {
    const eventDateTime = getEventDateTime(event);
    return eventDateTime ? eventDateTime >= now : false;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/SingUpAdmin/allEvent"
      );
      const data = await response.json();
      const sortedEvents = data.sort(
        (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/SingUpAdmin/deleteEvent/${eventId}`, {
        method: "DELETE",
      });
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event._id);
    setUpdatedEvent({ ...event });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/SingUpAdmin/updateEvent/${editingEvent}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (response.ok) {
        setEvents(
          events.map((event) =>
            event._id === editingEvent ? updatedEvent : event
          )
        );
        setEditingEvent(null);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const now = new Date();
  const upcomingEvents = [...events]
    .filter((event) => isUpcomingEvent(event, now))
    .sort(
      (a, b) =>
        (getEventDateTime(a)?.getTime() || 0) -
        (getEventDateTime(b)?.getTime() || 0)
    );
  const previousEvents = [...events]
    .filter((event) => !isUpcomingEvent(event, now))
    .sort(
      (a, b) =>
        (getEventDateTime(b)?.getTime() || 0) -
        (getEventDateTime(a)?.getTime() || 0)
    );

  const renderEventCard = (event) => (
    <div
      key={event._id}
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6"
    >
      <img
        src={event.imgUrl}
        alt={event.eventname}
        className="w-full md:w-1/3 h-64 object-cover rounded-lg"
      />

      <div className="flex-1">
        {editingEvent === event._id ? (
          <div>
            <input
              type="text"
              value={updatedEvent.eventname}
              onChange={(e) =>
                setUpdatedEvent({
                  ...updatedEvent,
                  eventname: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded-md text-lg font-semibold"
            />
            <textarea
              value={updatedEvent.description}
              onChange={(e) =>
                setUpdatedEvent({
                  ...updatedEvent,
                  description: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded-md mt-2 h-32"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingEvent(null)}
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-md mt-3 hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-sky-800">{event.eventname}</h2>
            <p className="text-gray-500 text-sm mt-1">
              Organized by{" "}
              <span className="font-semibold">{event.organizer}</span>
            </p>
            <p className="text-gray-600 mt-2">
              {expandedDescription[event._id]
                ? event.description
                : `${(event.description || "").substring(0, 100)}...`}
              {(event.description || "").length > 100 && (
                <button
                  onClick={() => toggleDescription(event._id)}
                  className="text-blue-500 ml-2 underline"
                >
                  {expandedDescription[event._id] ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              📅 {new Date(event.eventDate).toLocaleDateString()} | ⏰ {event.eventTime}
            </p>
          </div>
        )}
      </div>

      {!editingEvent && (
        <div className="flex gap-2 self-start">
          <button
            onClick={() => handleEdit(event)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-16 min-h-screen flex items-center justify-center ">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center text-sky-800 mb-12">
          Event Management
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-16 h-16 border-8 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600">No events available</p>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-sky-800 mb-6">
                Upcoming Events
              </h2>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-600">No upcoming events available</p>
              ) : (
                <div className="space-y-8">{upcomingEvents.map(renderEventCard)}</div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-sky-800 mb-6">
                Previous Events
              </h2>
              {previousEvents.length === 0 ? (
                <p className="text-gray-600">No previous events available</p>
              ) : (
                <div className="space-y-8">{previousEvents.map(renderEventCard)}</div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSection;
