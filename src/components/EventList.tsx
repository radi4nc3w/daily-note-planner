
import React from "react";
import { format, formatDistance } from "date-fns";
import { Clock, MapPin, Trash, ArrowRight } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EventListProps {
  title: string;
  events: Event[];
  showActions?: boolean;
  isDayView?: boolean;
}

export const EventList: React.FC<EventListProps> = ({ 
  title, 
  events, 
  showActions = true,
  isDayView = false 
}) => {
  const { deleteEvent, moveEventToTomorrow } = useEvents();

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Group events by hour if in day view
  const groupedEvents = isDayView ? sortedEvents.reduce<Record<string, Event[]>>((acc, event) => {
    const hour = format(new Date(event.startTime), "HH:00");
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(event);
    return acc;
  }, {}) : {};

  // Get hours from 00:00 to 23:00
  const hours = isDayView ? Array.from({ length: 24 }).map((_, i) => {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`;
    return { hour, events: groupedEvents[hour] || [] };
  }) : [];

  if (events.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No events scheduled</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isDayView) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {events.length} event{events.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <div className="timeline">
            {hours.map((hourGroup, index) => (
              <div key={hourGroup.hour} className="flex">
                <div className="text-sm font-medium w-16 text-right pr-4 py-2 sticky left-0">
                  {hourGroup.hour}
                </div>
                <div className="flex-1 border-l pl-4 relative">
                  {hourGroup.events.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      showActions={showActions}
                      onDelete={deleteEvent}
                      onMoveToTomorrow={moveEventToTomorrow}
                    />
                  ))}
                  {index < hours.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {events.length} event{events.length !== 1 ? 's' : ''} scheduled
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            showActions={showActions}
            onDelete={deleteEvent}
            onMoveToTomorrow={moveEventToTomorrow}
          />
        ))}
      </CardContent>
    </Card>
  );
};

interface EventCardProps {
  event: Event;
  showActions: boolean;
  onDelete: (id: string) => void;
  onMoveToTomorrow: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, showActions, onDelete, onMoveToTomorrow }) => {
  const startTime = new Date(event.startTime);
  const isPast = startTime < new Date();
  
  return (
    <Card className={cn(
      "mb-2 overflow-hidden",
      isPast ? "border-muted bg-muted/30" : "border-accent"
    )}>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{event.title}</CardTitle>
          {isPast && <Badge variant="outline">Past</Badge>}
        </div>
        <CardDescription className="text-sm">
          <div className="flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1 inline" />
            <span>{format(startTime, "HH:mm")} • {event.duration} min</span>
          </div>
          <div className="flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1 inline" />
            <span>{event.location}</span>
          </div>
        </CardDescription>
      </CardHeader>
      {event.description && (
        <CardContent className="py-0 px-3">
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </CardContent>
      )}
      {showActions && (
        <CardFooter className="p-2 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(event.id)}
          >
            <Trash className="w-3 h-3 mr-1" />
            Remove
          </Button>
          {isPast && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onMoveToTomorrow(event.id)}
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Tomorrow
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
