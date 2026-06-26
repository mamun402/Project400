import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";

const getEventDateTime = (event) => {
  if (!event?.eventDate) {
    return null;
  }

  const eventDateTime = new Date(event.eventDate);
  if (Number.isNaN(eventDateTime.getTime())) {
    return null;
  }

  const [hours = 0, minutes = 0] = (event.eventTime || "")
    .split(":")
    .map(Number);

  eventDateTime.setHours(hours || 0, minutes || 0, 0, 0);
  return eventDateTime;
};

const getTimeLeft = (event, now) => {
  const eventDateTime = getEventDateTime(event);
  const totalSeconds = eventDateTime
    ? Math.max(0, Math.floor((eventDateTime - now) / 1000))
    : 0;

  return {
    days: Math.floor(totalSeconds / (60 * 60 * 24)),
    hours: Math.floor((totalSeconds / (60 * 60)) % 24),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: totalSeconds % 60,
  };
};

const formatEventDate = (event) => {
  const eventDateTime = getEventDateTime(event);
  return eventDateTime ? eventDateTime.toLocaleDateString() : "";
};

const sortByEventDate = (direction = "asc") => (a, b) => {
  const firstDate = getEventDateTime(a)?.getTime() || 0;
  const secondDate = getEventDateTime(b)?.getTime() || 0;
  return direction === "asc"
    ? firstDate - secondDate
    : secondDate - firstDate;
};

const Countdown = ({ event, now }) => {
  const timeLeft = getTimeLeft(event, now);

  return (
    <div className="text-center mt-4">
      <p className="text-xl font-semibold">Time Remaining</p>
      <div className="flex justify-center items-center gap-6 mt-4">
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">
            {timeLeft.days || 0} Days
          </p>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">
            {timeLeft.hours || 0} Hours
          </p>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">
            {timeLeft.minutes || 0} Min
          </p>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">
            {timeLeft.seconds || 0} Sec
          </p>
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/SingUpAdmin/allEvent"
        );
        setAllEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { upcomingEvents, previousEvents } = useMemo(() => {
    const upcoming = [];
    const previous = [];

    allEvents.forEach((event) => {
      const eventDateTime = getEventDateTime(event);
      if (eventDateTime && eventDateTime > now) {
        upcoming.push(event);
      } else {
        previous.push(event);
      }
    });

    return {
      upcomingEvents: upcoming.sort(sortByEventDate("asc")),
      previousEvents: previous.sort(sortByEventDate("desc")),
    };
  }, [allEvents, now]);

  useEffect(() => {
    if (currentIndex >= upcomingEvents.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, upcomingEvents.length]);

  const goToNext = () => {
    if (upcomingEvents.length < 2) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
  };

  const goToPrev = () => {
    if (upcomingEvents.length < 2) return;
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + upcomingEvents.length) % upcomingEvents.length
    );
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) {
      touchStartXRef.current = null;
      touchEndXRef.current = null;
      return;
    }

    const delta = touchStartXRef.current - touchEndXRef.current;
    const threshold = 50;

    if (delta > threshold) {
      goToNext();
    } else if (delta < -threshold) {
      goToPrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  useEffect(() => {
    if (upcomingEvents.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  if (loading) {
    return <div>Loading events...</div>;
  }

  const currentEvent = upcomingEvents[currentIndex];

  return (
    <section className="relative py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest flex justify-center items-center gap-2">
          <span>*</span> Upcoming Events <span>*</span>
        </h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
          Join Our Exciting <span className="text-primary">Tech Events</span>!
        </h2>

        {currentEvent ? (
          <>
            <Countdown event={currentEvent} now={now} />

            <div
              className="mt-8 flex justify-between items-center gap-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button
                type="button"
                onClick={goToPrev}
                disabled={upcomingEvents.length < 2}
                aria-label="Previous event"
                className="bg-white text-blue-600 hover:text-blue-800 shadow rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              >
                &lt;
              </button>

              <div className="flex w-full max-w-5xl min-h-[20rem] items-stretch gap-6 bg-white rounded-lg shadow-lg p-6">
                <img
                  src={currentEvent.imgUrl}
                  alt={currentEvent.eventname}
                  className="w-72 h-72 object-cover rounded-md shadow-lg self-start"
                />
                <div className="flex-1 text-left">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    {currentEvent.eventname}
                  </h4>
                  <p className="text-lg text-gray-700 mb-3 max-h-28 overflow-hidden">
                    {currentEvent.description}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {currentEvent.eventTime}
                    {currentEvent.eventDate
                      ? ` - ${formatEventDate(currentEvent)}`
                      : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={goToNext}
                disabled={upcomingEvents.length < 2}
                aria-label="Next event"
                className="bg-white text-blue-600 hover:text-blue-800 shadow rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {upcomingEvents.map((event, index) => (
                <button
                  key={event._id || event.id || `${event.eventname}-dot-${index}`}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to event ${index + 1}`}
                  className={`h-2 w-2 rounded-full transition ${
                    index === currentIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-8 text-lg font-medium text-gray-600">
            No upcoming events available.
          </p>
        )}

        <div className="mt-16 text-left">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Previous Events
          </h3>
          {previousEvents.length === 0 ? (
            <p className="mt-6 text-center text-gray-600">
              No previous events available.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {previousEvents.map((event) => (
                <article
                  key={event._id || event.id || event.eventname}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={event.imgUrl}
                    alt={event.eventname}
                    className="h-52 w-full object-cover"
                  />
                  <div className="p-5">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {event.eventname}
                    </h4>
                    <p className="mt-2 text-sm text-gray-500 italic">
                      {event.eventTime}
                      {event.eventDate ? ` - ${formatEventDate(event)}` : ""}
                    </p>
                    <p className="mt-3 text-gray-700 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Event;
