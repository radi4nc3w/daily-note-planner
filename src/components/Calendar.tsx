
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/contexts/EventContext";

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getEventsForDate } = useEvents();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPreviousMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate empty grid cells for start of month
  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const emptyStartCells = Array(firstDayOfMonth).fill(null);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekdayLabels.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {emptyStartCells.map((_, index) => (
            <div key={`empty-start-${index}`} className="h-10" />
          ))}

          {days.map((day, dayIndex) => {
            const events = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            
            return (
              <Button
                key={`day-${dayIndex}`}
                variant="outline"
                className={cn(
                  "h-10 justify-center",
                  !isCurrentMonth && "text-muted-foreground opacity-30",
                  isSelected && "border-calendar-selected bg-calendar-selected/10",
                  isCurrentDay && !isSelected && "border-calendar-today",
                  events.length > 0 && !isSelected && "bg-calendar-event/10"
                )}
                onClick={() => onSelectDate(day)}
              >
                <span className="relative flex items-center justify-center">
                  <span>{format(day, "d")}</span>
                  {events.length > 0 && (
                    <span className="absolute bottom-0 w-1 h-1 rounded-full bg-calendar-event" />
                  )}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
