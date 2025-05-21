
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const NotFound = () => (
  <div className="min-h-screen">
    <Navigation />
    <div className="container flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Страница не найдена</p>
      <Button asChild>
        <Link to="/">Вернуться на главную</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
