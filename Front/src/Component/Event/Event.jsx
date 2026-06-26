import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
<<<<<<< HEAD

const getEventDatePart = (eventDate) => {
  if (!eventDate) return "";

  if (typeof eventDate === "string") {
    return eventDate.slice(0, 10);
  }

  const parsedDate = new Date(eventDate);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toISOString().slice(0, 10);
};

const getEventDateTime = (event) => {
  const datePart = getEventDatePart(event?.eventDate);
  if (!datePart) return null;

  const timePart = event?.eventTime || "00:00";
  const eventDateTime = new Date(`${datePart}T${timePart}`);
  return Number.isNaN(eventDateTime.getTime()) ? null : eventDateTime;
};

const isExpiredEvent = (event, now = new Date()) => {
  const eventDateTime = getEventDateTime(event);
  return eventDateTime ? eventDateTime <= now : false;
};

const formatEventDate = (eventDate) => {
  const datePart = getEventDatePart(eventDate);
  if (!datePart) return "";

  const parsedDate = new Date(`${datePart}T00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString();
};

// Countdown function for each event
const Countdown = ({ event }) => {
  const lastTotalSecondsRef = useRef(null);
  const calculateTimeLeft = () => {
    const eventDateTime = getEventDateTime(event);
    const now = new Date();
    const totalSeconds = eventDateTime
      ? Math.max(0, Math.floor((eventDateTime - now) / 1000))
      : 0;
=======

const getEventDateTime = (event) => {
  if (!event?.eventDate) {
    return null;
  }
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79

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

<<<<<<< HEAD
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [event]);
=======
const Countdown = ({ event, now }) => {
  const timeLeft = getTimeLeft(event, now);
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79

  return (
    <div className="text-center mt-4">
      <p className="text-xl font-semibold">Time Remaining</p>
      <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
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

const EventCard = ({ event }) => (
  <div className="flex w-full max-w-5xl min-h-[20rem] items-stretch gap-6 bg-white rounded-lg shadow-lg p-6">
    <img
      src={event?.imgUrl}
      alt={event?.eventname}
      className="w-72 h-72 object-cover rounded-md shadow-lg self-start"
    />
    <div className="flex-1 text-left">
      <h4 className="text-2xl font-semibold text-gray-900 mb-2">
        {event?.eventname}
      </h4>
      <p className="text-lg text-gray-700 mb-3 max-h-28 overflow-hidden">
        {event?.description}
      </p>
      <p className="text-sm text-gray-500 italic">
        {event?.eventTime}
        {event?.eventDate ? ` • ${formatEventDate(event.eventDate)}` : ""}
      </p>
    </div>
  </div>
);

const Event = () => {
<<<<<<< HEAD
  const [events, setEvents] = useState([]);
=======
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  const { upcomingEvents, previousEvents } = useMemo(() => {
    const sortedEvents = [...events].sort((a, b) => {
      const firstDate = getEventDateTime(a)?.getTime() || 0;
      const secondDate = getEventDateTime(b)?.getTime() || 0;
      return firstDate - secondDate;
    });

    return {
      upcomingEvents: sortedEvents.filter((event) => !isExpiredEvent(event, now)),
      previousEvents: sortedEvents
        .filter((event) => isExpiredEvent(event, now))
        .reverse(),
    };
  }, [events, now]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/SingUpAdmin/allEvent"
        );
<<<<<<< HEAD
        setEvents(response.data);
=======
        setAllEvents(Array.isArray(response.data) ? response.data : []);
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

=======
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

>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
  useEffect(() => {
    if (currentIndex >= upcomingEvents.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, upcomingEvents.length]);
<<<<<<< HEAD

  useEffect(() => {
    if (upcomingEvents.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  const goToNext = () => {
    if (upcomingEvents.length === 0) return;
=======

  const goToNext = () => {
    if (upcomingEvents.length < 2) return;
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
    setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
  };

  const goToPrev = () => {
<<<<<<< HEAD
    if (upcomingEvents.length === 0) return;
=======
    if (upcomingEvents.length < 2) return;
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
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

<<<<<<< HEAD
  if (events.length === 0) {
=======
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
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
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
<<<<<<< HEAD
            <Countdown event={currentEvent} />
=======
            <Countdown event={currentEvent} now={now} />
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79

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

<<<<<<< HEAD
              <EventCard event={currentEvent} />
=======
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
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79

              <button
                type="button"
                onClick={goToNext}
                disabled={upcomingEvents.length < 2}
                aria-label="Next event"
                className="bg-white text-blue-600 hover:text-blue-800 shadow rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              >
                &gt;
              </button>
<<<<<<< HEAD
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
          <p className="mt-8 text-lg font-medium text-gray-700">
            No upcoming events available.
          </p>
        )}

        {previousEvents.length > 0 && (
          <div className="mt-16 text-left">
            <h3 className="text-3xl font-extrabold text-gray-900 text-center">
              Previous <span className="text-primary">Events</span>
            </h3>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {previousEvents.map((event) => (
                <div
                  key={event._id || event.id || event.eventname}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={event.imgUrl}
                    alt={event.eventname}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900">
                      {event.eventname}
                    </h4>
                    <p className="mt-2 text-gray-700 line-clamp-3">
                      {event.description}
                    </p>
                    <p className="mt-4 text-sm text-gray-500 italic">
                      {event.eventTime}
                      {event.eventDate ? ` • ${formatEventDate(event.eventDate)}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
=======
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
>>>>>>> 1358da0338ccbb4875b732fcbbb3871084ee9f79
      </div>
    </section>
  );
};

export default Event;
