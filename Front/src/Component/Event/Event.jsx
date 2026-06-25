import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

// Countdown function for each event
const Countdown = ({ eventDate }) => {
  const lastTotalSecondsRef = useRef(null);
  const calculateTimeLeft = () => {
    const eventDateTime = new Date(eventDate); // Set event date dynamically
    const now = new Date();
    const totalSeconds = Math.max(0, Math.floor((eventDateTime - now) / 2000));

    const timeLeft = {
      days: Math.floor(totalSeconds / (60 * 60 * 24)),
      hours: Math.floor((totalSeconds / (60 * 60)) % 24),
      minutes: Math.floor((totalSeconds / 60) % 60),
      seconds: totalSeconds % 60,
    };

    return { totalSeconds, timeLeft };
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const { timeLeft } = calculateTimeLeft();
    return timeLeft;
  });

  useEffect(() => {
    const update = () => {
      const { totalSeconds, timeLeft } = calculateTimeLeft();
      if (lastTotalSecondsRef.current !== totalSeconds) {
        lastTotalSecondsRef.current = totalSeconds;
        setTimeLeft(timeLeft);
      }
    };

    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="text-center mt-4">
      <p className="text-xl font-semibold">Time Remaining</p>
      <div className="flex justify-center items-center gap-6 mt-4">
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">{timeLeft.days || 0} Days</p>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">{timeLeft.hours || 0} Hours</p>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">{timeLeft.minutes || 0} Min</p>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-2xl font-bold text-white">{timeLeft.seconds || 0} Sec</p>
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  const [events, setEvents] = useState([]); // Store event data
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/SingUpAdmin/allEvent"
        ); // Fetch event data from API
        setEvents(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array ensures it runs only once after component mounts

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
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
    if (events.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 6000); // 6 seconds autoplay
    return () => clearInterval(interval);
  }, [events.length]); // Re-run interval when events data changes

  if (events.length === 0) {
    return <div>Loading events...</div>;
  }

  return (
    <section className="relative py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest flex justify-center items-center gap-2">
          <span>*</span> Upcoming Events <span>*</span>
        </h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
          Join Our Exciting <span className="text-primary">Tech Events</span>!
        </h2>

        {/* Countdown for the current event */}
        <Countdown eventDate={events[currentIndex]?.eventDate} />

        {/* Event Slider */}
        <div
          className="mt-8 flex justify-between items-center gap-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={goToPrev}
            disabled={events.length < 2}
            aria-label="Previous event"
            className="bg-white text-blue-600 hover:text-blue-800 shadow rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
          >
            &lt;
          </button>

          <div className="flex w-full max-w-5xl min-h-[20rem] items-stretch gap-6 bg-white rounded-lg shadow-lg p-6">
            <img
              src={events[currentIndex]?.imgUrl}
              alt={events[currentIndex]?.eventname}
              className="w-72 h-72 object-cover rounded-md shadow-lg self-start"
            />
            <div className="flex-1 text-left">
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                {events[currentIndex]?.eventname}
              </h4>
              <p className="text-lg text-gray-700 mb-3 max-h-28 overflow-hidden">
                {events[currentIndex]?.description}
              </p>
              <p className="text-sm text-gray-500 italic">
                {events[currentIndex]?.eventTime}
                {events[currentIndex]?.eventDate
                  ? ` • ${new Date(events[currentIndex].eventDate).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToNext}
            disabled={events.length < 2}
            aria-label="Next event"
            className="bg-white text-blue-600 hover:text-blue-800 shadow rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {events.map((event, index) => (
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
      </div>
    </section>
  );
};

export default Event;
