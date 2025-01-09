"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import Link from "next/link";

import { markRead } from "@/app/actions/general-actions";
import { cn } from "@/lib/utils";
import { Notification } from "@prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";

export const NotificationPanel = ({ data }: { data: Notification[] }) => {
  const router = useRouter();

  const handleClick = async () => {
    await markRead(data[0].user_id);
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
          <Bell className="h-5 w-5" />
          {data?.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white animate-pulse">
              {data?.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {data?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              data?.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "w-full px-4 py-3 flex flex-col gap-1 text-left hover:bg-gray-50 transition-colors",
                    !notification.isRead && "bg-blue-600/10"
                  )}
                  //   onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm line-clamp-1 flex-1">
                      {notification.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(notification?.created_at, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                </button>
              ))
            )}
          </div>
          {data?.length > 0 && (
            <div className="border-t border-gray-200">
              <button
                onClick={handleClick}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 transition-colors border-t border-gray-200"
              >
                Mark all as read
              </button>
              <PopoverClose asChild className="text-sm hover:underline">
                <Link href="/notifications">View all</Link>
              </PopoverClose>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
