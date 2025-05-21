
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/contexts/EventContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const Profile = () => {
  const { events } = useEvents();
  const userName = localStorage.getItem("userName") || "User";
  
  // Count total completed and upcoming events
  const completedEvents = events.filter(event => event.isCompleted).length;
  const upcomingEvents = events.filter(event => !event.isCompleted).length;
  
  // Find closest upcoming event
  const now = new Date();
  const closestEvent = events
    .filter(event => new Date(event.startTime) > now && !event.isCompleted)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
    
  const handleNameChange = () => {
    const newName = prompt("Enter your name:", userName);
    if (newName && newName.trim() !== "") {
      localStorage.setItem("userName", newName);
      window.location.reload();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Личный кабинет</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Профиль</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium">{userName}</h2>
              <p className="text-sm text-muted-foreground">Пользователь ежедневника</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleNameChange}>
              Изменить имя
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="summary">Общие данные</TabsTrigger>
                <TabsTrigger value="next">Ближайшее событие</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <h3 className="font-medium text-sm text-muted-foreground">Завершенные события</h3>
                    <p className="text-3xl font-bold">{completedEvents}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <h3 className="font-medium text-sm text-muted-foreground">Запланировано</h3>
                    <p className="text-3xl font-bold">{upcomingEvents}</p>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Всего запланировано событий: {events.length}
                </p>
              </TabsContent>
              
              <TabsContent value="next">
                {closestEvent ? (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">{closestEvent.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="text-muted-foreground">Дата:</span> 
                      <span>{format(new Date(closestEvent.startTime), "dd.MM.yyyy HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-muted-foreground">Место:</span> 
                      <span>{closestEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-muted-foreground">Длительность:</span> 
                      <span>{closestEvent.duration} мин.</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">Нет запланированных событий</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
