
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Bell, Calendar, Award, Zap, ShoppingBag, DollarSign, Dumbbell, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "../hooks/useTranslation";

type Notification = {
  id: string;
  type: "quest" | "achievement" | "level" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  module?: "status" | "look" | "finance" | "skills" | "sport";
};

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "quest",
      title: t("questCompleted"),
      message: t("dailyExerciseCompleted"),
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      module: "sport"
    },
    {
      id: "2",
      type: "achievement",
      title: t("newBadge"),
      message: t("fashionistaUnlocked"),
      timestamp: new Date(Date.now() - 86400000),
      read: false,
      module: "look"
    },
    {
      id: "3",
      type: "level",
      title: t("levelUp"),
      message: t("financeLevelUp"),
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      module: "finance"
    },
    {
      id: "4",
      type: "system",
      title: t("systemUpdate"),
      message: t("newFeaturesAdded"),
      timestamp: new Date(Date.now() - 259200000),
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getModuleIcon = (module?: string) => {
    switch (module) {
      case "status": return <Zap size={18} />;
      case "look": return <ShoppingBag size={18} />;
      case "finance": return <DollarSign size={18} />;
      case "sport": return <Dumbbell size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quest": return <Calendar size={18} />;
      case "achievement": return <Award size={18} />;
      case "level": return <Zap size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t("justNow");
    if (diffInHours < 24) return `${diffInHours} ${t("hoursAgo")}`;
    if (diffInHours < 48) return t("yesterday");
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("notifications")}</h1>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check size={16} className="mr-2" />
              {t("markAllAsRead")}
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center gap-4">
              <Bell size={48} className="text-muted-foreground" />
              <h3 className="text-xl font-semibold">{t("noNotifications")}</h3>
              <p className="text-muted-foreground">{t("allCaughtUp")}</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {unreadCount > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="mr-2">{t("unread")}</span>
                  <Badge variant="default">{unreadCount}</Badge>
                </h2>
                {notifications
                  .filter(notif => !notif.read)
                  .map(notification => (
                    <Card key={notification.id} className="mb-3 border-l-4 border-l-zou-purple">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-zou-purple/10 p-2 rounded-full">
                              {getModuleIcon(notification.module)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {getTypeIcon(notification.type)}
                                  <span className="ml-1">{notification.type}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.timestamp)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
            
            {notifications.some(n => n.read) && (
              <div>
                <h2 className="text-lg font-semibold mb-2">{t("earlier")}</h2>
                {notifications
                  .filter(notif => notif.read)
                  .map(notification => (
                    <Card key={notification.id} className="mb-3 opacity-80">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-muted p-2 rounded-full">
                              {getModuleIcon(notification.module)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {getTypeIcon(notification.type)}
                                  <span className="ml-1">{notification.type}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.timestamp)}</p>
                            </div>
                          </div>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
