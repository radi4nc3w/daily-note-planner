
import React from "react";
import { Calendar } from "@/components/Calendar";
import { EventForm } from "@/components/EventForm";
import { ConflictAnalyzer } from "@/components/ConflictAnalyzer";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Navigation } from "@/components/Navigation";
import { useEvents } from "@/contexts/EventContext";

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const { addEvent } = useEvents();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <ConflictAnalyzer />
          </div>
          <div className="space-y-6">
            <EventForm selectedDate={selectedDate} onSubmit={addEvent} />
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
