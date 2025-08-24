# Demo Guide - Daily Activities Gantt Timeline

## 🚀 Getting Started

Your Next.js application is now running at **http://localhost:3000**

## ✨ Features Demo

### 1. **View Sample Data**
The application comes with pre-loaded sample activities for January 15, 2024:
- Morning Routine (6:00 AM - 7:30 AM)
- Work - Planning (8:00 AM - 10:00 AM)
- Lunch Break (12:00 PM - 1:00 PM)
- Work - Development (1:00 PM - 5:00 PM)
- Exercise (5:30 PM - 6:30 PM)
- Dinner & Relaxation (7:00 PM - 9:00 PM)

### 2. **Add New Activities**
1. Use the sidebar form on the left
2. Fill in:
   - **Activity Name**: e.g., "Team Meeting"
   - **Start Time**: Choose date and time
   - **End Time**: Choose end date and time
   - **Progress**: Use slider (0-100%)
   - **Priority**: Select Low/Medium/High
   - **Type**: Choose Task/Project/Milestone
3. Click "Add Activity"

### 3. **Edit Activities**
1. Click the edit icon (pencil) on any activity
2. Modify the details inline
3. Click "Save" or "Cancel"

### 4. **Delete Activities**
1. Click the trash icon on any activity
2. Activity will be removed immediately

### 5. **Navigate Between Dates**
1. Use the date picker in the top-right
2. View activities for different dates
3. See how the timeline changes

### 6. **Priority Color Coding**
- 🔴 **Red**: High Priority
- 🟡 **Yellow**: Medium Priority  
- 🟢 **Green**: Low Priority

### 7. **Progress Tracking**
- Watch the progress bars update in real-time
- Green: Completed (100%)
- Yellow: In Progress (1-99%)
- Red: Not Started (0%)

## 🎯 Interactive Elements

### **Timeline View**
- Each activity appears as a colored bar on the timeline
- Bars show start/end times and duration
- Hover over bars for better visibility

### **Statistics Dashboard**
- Total activities count
- Completed vs. in-progress vs. not started
- High priority activities count

### **Responsive Design**
- Works on desktop and mobile
- Sidebar collapses on smaller screens
- Timeline adjusts to screen size

## 🔧 Customization Examples

### **Change Activity Colors**
Modify the `getPriorityColor` function in `components/GanttChart.tsx`:

```typescript
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-purple-500'    // Change to purple
    case 'medium': return 'bg-blue-500'    // Change to blue
    case 'low': return 'bg-gray-500'       // Change to gray
    default: return 'bg-blue-500'
  }
}
```

### **Add New Activity Types**
Update the `Activity` interface in `types/activity.ts`:

```typescript
type: 'task' | 'project' | 'milestone' | 'meeting' | 'break'
```

### **Modify Time Slots**
Change the 24-hour view to 12-hour in `components/GanttChart.tsx`:

```typescript
const timeSlots = Array.from({ length: 12 }, (_, i) => addHours(startOfSelectedDay, i))
```

## 📱 Mobile Experience

- Touch-friendly interface
- Swipe gestures for navigation
- Responsive sidebar
- Optimized timeline view

## 🚀 Next Steps

1. **Data Persistence**: Connect to a backend API or database
2. **User Authentication**: Add login/signup functionality
3. **Team Collaboration**: Share timelines with team members
4. **Notifications**: Add reminders for upcoming activities
5. **Calendar Integration**: Sync with Google Calendar, Outlook, etc.
6. **Reporting**: Generate productivity reports and analytics

## 🐛 Troubleshooting

### **If the page doesn't load:**
1. Check if the server is running (`npm run dev`)
2. Verify port 3000 is available
3. Check browser console for errors

### **If styles look broken:**
1. Ensure Tailwind CSS is properly configured
2. Check if `globals.css` is imported
3. Verify PostCSS configuration

### **If activities don't appear:**
1. Check the date picker - activities are filtered by date
2. Verify the sample data is loaded
3. Check browser console for JavaScript errors

## 🎉 Enjoy Your Gantt Chart!

The application provides a solid foundation for daily activity management. Feel free to customize it further based on your specific needs!
