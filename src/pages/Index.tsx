
import React, { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Bell } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { Calendar } from "@/components/Calendar";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { ConflictAnalyzer } from "@/components/ConflictAnalyzer";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { 
    addEvent, 
    getEventsForDate, 
    getUpcomingEvent,
    cleanupPastEvents
  } = useEvents();
  
  const eventsForSelectedDate = getEventsForDate(selectedDate);
  const upcomingEvent = getUpcomingEvent();
  const isToday = isSameDay(selectedDate, new Date());
  
  useEffect(() => {
    // Clean up past events on initial load
    cleanupPastEvents();
  }, []);

  const handleAddEvent = (event: Event) => {
    addEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Daily Planner</h1>
          <p className="text-muted-foreground text-center mt-2">
            Organize your schedule efficiently
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Calendar */}
          <div className="md:col-span-1 space-y-6">
            <Calendar
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
            />
            
            {upcomingEvent && (
              <Card className="border-calendar-today">
                <CardHeader className="bg-calendar-today/10 pb-2">
                  <CardTitle className="text-calendar-today flex items-center text-lg">
                    <Bell className="mr-2 h-5 w-5" />
                    Next Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="font-medium">{upcomingEvent.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(upcomingEvent.startTime), "PPp")}
                  </p>
                  <p className="text-sm mt-1">{upcomingEvent.location}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    Duration: {upcomingEvent.duration} minutes
                  </p>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Center & Right Columns */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="events">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="events">
                  {isToday ? "Today's Events" : format(selectedDate, "MMM d")}
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Future Events
                </TabsTrigger>
                <TabsTrigger value="new">
                  Add New Event
                </TabsTrigger>
              </TabsList>

              <TabsContent value="events">
                <ConflictAnalyzer />
                <EventList 
                  title={format(selectedDate, "EEEE, MMMM d")} 
                  events={eventsForSelectedDate}
                  isDayView={true}
                />
              </TabsContent>
              
              <TabsContent value="upcoming">
                <UpcomingEvents />
              </TabsContent>
              
              <TabsContent value="new">
                <EventForm 
                  onSubmit={handleAddEvent} 
                  selectedDate={selectedDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
