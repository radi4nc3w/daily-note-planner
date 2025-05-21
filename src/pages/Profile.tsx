
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const usernameSchema = z.object({
  username: z.string().min(2, "Имя пользователя должно содержать не менее 2 символов"),
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUsername } = useAuth();
  const { events } = useEvents();

  React.useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({ username: user.username });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof usernameSchema>) => {
    updateUsername(values.username);
    toast.success("Имя пользователя обновлено");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Count statistics
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.isCompleted).length;
  const upcomingEvents = events.filter(e => !e.isCompleted && new Date(e.startTime) > new Date()).length;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container max-w-screen-xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Информация пользователя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input {...field} />
                            <Button type="submit" size="sm">Сохранить</Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary p-4 rounded-md text-center">
                  <p className="text-2xl font-bold">{totalEvents}</p>
                  <p className="text-sm text-muted-foreground">Всего событий</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md text-center">
                  <p className="text-2xl font-bold">{completedEvents}</p>
                  <p className="text-sm text-muted-foreground">Завершено</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-md text-center">
                  <p className="text-2xl font-bold">{upcomingEvents}</p>
                  <p className="text-sm text-muted-foreground">Предстоит</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
