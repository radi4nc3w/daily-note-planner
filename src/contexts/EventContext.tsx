import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, EventConflict } from "@/types/event";
import { addDays, isSameDay, isAfter, isBefore, addMinutes, isToday } from "date-fns";
import { toast } from "sonner";

type EventContextType = {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => Event[];
  getFutureEvents: () => Event[];
  getUpcomingEvent: () => Event | null;
  checkForConflicts: (event: Event) => EventConflict[];
  cleanupPastEvents: () => void;
  moveEventToTomorrow: (id: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      return JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime),
      }));
    }
    return [];
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Check for upcoming events and show notifications
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date();
      const upcomingEvents = events.filter(
        (event) => {
          const eventTime = new Date(event.startTime);
          const timeDiff = (eventTime.getTime() - now.getTime()) / (1000 * 60);
          return timeDiff > 0 && timeDiff <= 15 && !event.isCompleted; // Events within 15 minutes
        }
      );

      upcomingEvents.forEach(event => {
        toast.info(`Upcoming: ${event.title} in ${Math.round((new Date(event.startTime).getTime() - now.getTime()) / (1000 * 60))} minutes`, {
          description: `At ${event.location}`
        });
      });
    };

    const interval = setInterval(checkUpcomingEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  // Clean up past events once a day
  useEffect(() => {
    const checkForMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        cleanupPastEvents();
      }
    };

    const interval = setInterval(checkForMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
    const conflicts = checkForConflicts(event);
    if (conflicts.length > 0) {
      toast.warning("Time conflict detected!", {
        description: "This event overlaps with existing events."
      });
    }
  };

  const updateEvent = (id: string, updatedFields: Partial<Event>) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, ...updatedFields } : event
    );
    setEvents(updatedEvents);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startTime), date));
  };

  const getFutureEvents = () => {
    const now = new Date();
    return events.filter(event => isAfter(new Date(event.startTime), now));
  };

  const getUpcomingEvent = (): Event | null => {
    const now = new Date();
    const futureEvents = events
      .filter(event => isAfter(new Date(event.startTime), now) && !event.isCompleted)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return futureEvents.length > 0 ? futureEvents[0] : null;
  };

  const checkForConflicts = (newEvent: Event): EventConflict[] => {
    const conflicts: EventConflict[] = [];
    const newEventStart = new Date(newEvent.startTime);
    const newEventEnd = addMinutes(newEventStart, newEvent.duration);

    events.forEach(existingEvent => {
      if (existingEvent.id === newEvent.id) return; // Skip the same event

      const existingStart = new Date(existingEvent.startTime);
      const existingEnd = addMinutes(existingStart, existingEvent.duration);

      // Check for overlap
      if (
        (isAfter(newEventStart, existingStart) && isBefore(newEventStart, existingEnd)) ||
        (isAfter(newEventEnd, existingStart) && isBefore(newEventEnd, existingEnd)) ||
        (isBefore(newEventStart, existingStart) && isAfter(newEventEnd, existingEnd)) ||
        (isSameDay(newEventStart, existingStart) && newEventStart.getTime() === existingStart.getTime())
      ) {
        conflicts.push({ event1: existingEvent, event2: newEvent });
      }
    });

    return conflicts;
  };

  const cleanupPastEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pastEvents = events.filter(event => 
      isBefore(new Date(event.startTime), today) && !event.isCompleted
    );
    
    const currentEvents = events.filter(event => 
      !pastEvents.some(pastEvent => pastEvent.id === event.id)
    );
    
    setEvents(currentEvents);
    
    // Optional: Notification about cleanup
    if (pastEvents.length > 0) {
      toast.info(`${pastEvents.length} past events have been removed`, {
        description: "You can find them in the archive"
      });
    }
  };

  const moveEventToTomorrow = (id: string) => {
    setEvents(events.map(event => {
      if (event.id === id) {
        const tomorrow = addDays(new Date(), 1);
        const eventDate = new Date(event.startTime);
        
        // Create a new date with tomorrow's date but keep the time
        const newDate = new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          eventDate.getHours(),
          eventDate.getMinutes()
        );
        
        return { ...event, startTime: newDate };
      }
      return event;
    }));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate,
        getFutureEvents,
        getUpcomingEvent,
        checkForConflicts,
        cleanupPastEvents,
        moveEventToTomorrow
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
