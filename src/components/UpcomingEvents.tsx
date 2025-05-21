
import React from "react";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
import { useEvents } from "@/contexts/EventContext";
import { EventList } from "@/components/EventList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UpcomingEvents: React.FC = () => {
  const { events } = useEvents();
  const today = new Date();

  const getTomorrowEvents = () => {
    const tomorrow = addDays(today, 1);
    const start = startOfDay(tomorrow);
    const end = endOfDay(tomorrow);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= start && eventDate <= end;
    });
  };

  const getDayAfterTomorrowEvents = () => {
    const dayAfterTomorrow = addDays(today, 2);
    const start = startOfDay(dayAfterTomorrow);
    const end = endOfDay(dayAfterTomorrow);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= start && eventDate <= end;
    });
  };

  const getLaterEvents = () => {
    const afterDayAfterTomorrow = addDays(today, 3);
    const start = startOfDay(afterDayAfterTomorrow);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= start;
    });
  };

  const tomorrowEvents = getTomorrowEvents();
  const dayAfterTomorrowEvents = getDayAfterTomorrowEvents();
  const laterEvents = getLaterEvents();

  return (
    <Tabs defaultValue="tomorrow">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="tomorrow">
          Tomorrow
        </TabsTrigger>
        <TabsTrigger value="day-after">
          {format(addDays(today, 2), "EEE, MMM d")}
        </TabsTrigger>
        <TabsTrigger value="later">
          Later
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tomorrow">
        <EventList 
          title={`Tomorrow: ${format(addDays(today, 1), "EEEE, MMMM d")}`} 
          events={tomorrowEvents} 
        />
      </TabsContent>
      <TabsContent value="day-after">
        <EventList 
          title={format(addDays(today, 2), "EEEE, MMMM d")} 
          events={dayAfterTomorrowEvents} 
        />
      </TabsContent>
      <TabsContent value="later">
        <EventList 
          title="Upcoming Events" 
          events={laterEvents} 
        />
      </TabsContent>
    </Tabs>
  );
};
