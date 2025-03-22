'use client'
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

// Mock data for our posts
const scheduledPosts = [
  {
    id: 'post-1',
    title: "New Product Launch #trending",
    platform: "tiktok",
    time: "10:00 AM",
    status: "scheduled",
    date: new Date(2025, 2, 12) // March 12, 2025
  },
  {
    id: 'post-2',
    title: "Behind the scenes footage",
    platform: "instagram",
    time: "2:30 PM",
    status: "scheduled",
    date: new Date(2025, 2, 14) // March 14, 2025
  },
  {
    id: 'post-3',
    title: "Tutorial: How to use our product",
    platform: "tiktok",
    time: "5:45 PM",
    status: "draft",
    date: new Date(2025, 2, 15) // March 15, 2025
  },
  {
    id: 'post-4',
    title: "Q&A session with our experts",
    platform: "facebook",
    time: "11:30 AM",
    status: "scheduled",
    date: new Date(2025, 2, 16) // March 16, 2025
  },
  {
    id: 'post-5',
    title: "Product update announcements",
    platform: "instagram",
    time: "4:00 PM",
    status: "scheduled",
    date: new Date(2025, 2, 13) // March 13, 2025
  }
]

// Generate days for our calendar
const generateCalendarDaysForWeek = (startDate: Date) => {
  const days = []
  const today = new Date()
  
  // Generate 7 days for the week view
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    // Filter posts for this date
    const postsForDay = scheduledPosts.filter(post => {
      return post.date.toDateString() === date.toDateString()
    })
    
    days.push({
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
      posts: postsForDay
    })
  }
  
  return days
}

export default function ContentCalendar() {
  // Get the current Sunday as the default start of week
  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = date.getDay();
    result.setDate(date.getDate() - day);
    return result;
  };

  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [calendarDays, setCalendarDays] = useState(generateCalendarDaysForWeek(weekStart));
  const [isDragging, setIsDragging] = useState(false);

  // Function to format date range for display
  const formatDateRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const startMonth = start.toLocaleString('default', { month: 'long' });
    const endMonth = end.toLocaleString('default', { month: 'long' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
    setCalendarDays(generateCalendarDaysForWeek(newStart));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
    setCalendarDays(generateCalendarDaysForWeek(newStart));
  };

  // Go to current week
  const goToToday = () => {
    const today = new Date();
    const newStart = getStartOfWeek(today);
    setWeekStart(newStart);
    setCalendarDays(generateCalendarDaysForWeek(newStart));
  };

  // Handle drag end
  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Parse the source and destination data
    const sourceDay = parseInt(source.droppableId.split('-')[1]);
    const sourcePost = draggableId;
    const destinationDay = parseInt(destination.droppableId.split('-')[1]);
    
    // Calculate time based on drop position
    const hourHeight = 100 / 9; // 9 hours displayed (9am-6pm)
    const dropTimePercent = (destination.index * hourHeight);
    const hour = Math.floor(dropTimePercent / hourHeight) + 9; // Starting at 9am
    const minute = Math.round(((dropTimePercent % hourHeight) / hourHeight) * 60);
    
    // Format the time
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const formattedTime = `${formattedHour}:${minute < 10 ? '0' + minute : minute} ${amPm}`;
    
    // Create a new date for the destination day
    const newDate = new Date(weekStart);
    newDate.setDate(weekStart.getDate() + destinationDay);
    
    // Update the post data
    const updatedPosts = scheduledPosts.map(post => {
      if (post.id === sourcePost) {
        return {
          ...post,
          date: newDate,
          time: formattedTime
        };
      }
      return post;
    });
    
    // In a real app, you would save this to the database
    // For now, we'll just update our local state
    
    // Update the calendar days with the new post information
    setCalendarDays(generateCalendarDaysForWeek(weekStart));
  };

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Get platform specific styles
  const getPlatformStyles = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-red-50 border-l-red-500';
      case 'instagram':
        return 'bg-purple-50 border-l-purple-500';
      case 'facebook':
        return 'bg-blue-50 border-l-blue-500';
      case 'youtube':
        return 'bg-red-50 border-l-red-700';
      default:
        return 'bg-gray-50 border-l-gray-500';
    }
  };

  // Calculate position based on time
  const calculateTimePosition = (timeString: string) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    
    // Calculate percentage from 9AM (hour 9) to 6PM (hour 18)
    const totalMinutesFromNine = (hour - 9) * 60 + minute;
    const percentageOfDay = (totalMinutesFromNine / (9 * 60)) * 100;
    
    return percentageOfDay;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPreviousWeek}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-medium text-gray-900">
            {formatDateRange(weekStart)}
          </h2>
          <button 
            onClick={goToNextWeek}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            Today
          </button>
          <select className="bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200">
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b border-gray-200">
        {calendarDays.map((day, idx) => (
          <div key={day.date.toISOString()} className="border-r border-gray-200 last:border-r-0">
            <div className={`py-2 text-center ${day.isToday ? 'bg-blue-50' : ''}`}>
              <p className="text-xs text-gray-500 font-medium">{day.dayName}</p>
              <p className={`text-sm mt-1 font-semibold ${day.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                {day.dayNumber}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="grid grid-cols-7 h-[400px] relative">
          {/* Time indicators */}
          <div className="absolute left-0 top-0 w-full h-full flex flex-col text-xs text-gray-500 pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex-1 border-b border-gray-100 relative">
                <span className="absolute -top-2.5 left-1">{`${i + 9}:00`}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar columns */}
          {calendarDays.map((day, dayIndex) => (
            <Droppable 
              droppableId={`day-${dayIndex}`} 
              key={day.date.toISOString()}
              // Using a direction type that supports positioning the draggables
              type="POST"
              // This special function helps create a grid-like drop area
              direction="vertical"
            >
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`border-r border-gray-200 last:border-r-0 relative h-full ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  }`}
                >
                  {day.posts.map((post, idx) => (
                    <Draggable 
                      draggableId={post.id} 
                      index={idx} 
                      key={post.id}
                    >
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`absolute w-[95%] left-[2.5%] p-2 rounded-md shadow-sm text-xs border-l-4 ${getPlatformStyles(post.platform)}
                            ${snapshot.isDragging ? 'shadow-md ring-2 ring-blue-400 z-10' : ''}
                          `}
                          style={{
                            ...provided.draggableProps.style,
                            position: 'absolute',
                            top: `${calculateTimePosition(post.time)}%`,
                            height: '10%'
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="truncate">
                              <span className="font-medium">{post.time}</span>
                              <p className="truncate">{post.title}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                              <EllipsisHorizontalIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      {isDragging && (
        <div className="p-3 bg-blue-50 border-t border-blue-200 text-sm text-blue-700">
          Drag post to reschedule. Release to confirm new time.
        </div>
      )}
    </div>
  )
}
