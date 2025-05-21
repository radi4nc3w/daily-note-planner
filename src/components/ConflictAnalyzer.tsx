
import React from "react";
import { format, addMinutes } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { Event, EventConflict } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ConflictAnalyzer: React.FC = () => {
  const { events } = useEvents();
  
  const findAllConflicts = (): EventConflict[] => {
    const conflicts: EventConflict[] = [];
    
    events.forEach((event1, index) => {
      const event1Start = new Date(event1.startTime);
      const event1End = addMinutes(event1Start, event1.duration);
      
      events.slice(index + 1).forEach(event2 => {
        const event2Start = new Date(event2.startTime);
        const event2End = addMinutes(event2Start, event2.duration);
        
        // Check for overlap
        if (
          (event1Start <= event2End && event1End >= event2Start) ||
          (event2Start <= event1End && event2End >= event1Start)
        ) {
          conflicts.push({ event1, event2 });
        }
      });
    });
    
    return conflicts;
  };
  
  const conflicts = findAllConflicts();
  
  if (conflicts.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-calendar-conflict mb-6">
      <CardHeader className="bg-calendar-conflict/10">
        <CardTitle className="text-calendar-conflict flex items-center text-lg">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Schedule Conflicts Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {conflicts.map((conflict, index) => (
            <Alert key={index} variant="destructive">
              <AlertTitle className="font-medium">
                {conflict.event1.title} conflicts with {conflict.event2.title}
              </AlertTitle>
              <AlertDescription className="text-sm space-y-1 mt-1">
                <p>
                  <strong>{conflict.event1.title}</strong>: {format(new Date(conflict.event1.startTime), "PPp")} 
                  ({conflict.event1.duration} min)
                </p>
                <p>
                  <strong>{conflict.event2.title}</strong>: {format(new Date(conflict.event2.startTime), "PPp")} 
                  ({conflict.event2.duration} min)
                </p>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
