# Daily Activities Gantt Timeline

A modern React/Next.js application that provides an interactive Gantt chart interface for tracking and visualizing daily activities and schedules.

## Features

- **Interactive Gantt Chart**: Visual timeline representation of daily activities
- **Activity Management**: Add, edit, and delete activities with ease
- **Priority System**: Color-coded priority levels (High, Medium, Low)
- **Progress Tracking**: Monitor completion status of each activity
- **Date Navigation**: Switch between different dates to view schedules
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant visual feedback when modifying activities

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Next.js built-in bundler

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gantt-js
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gantt-js/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/             # React components
│   ├── ActivityForm.tsx   # Form for adding/editing activities
│   └── GanttChart.tsx     # Main Gantt chart component
├── types/                  # TypeScript type definitions
│   └── activity.ts        # Activity and related interfaces
├── package.json           # Project dependencies and scripts
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Usage

### Adding Activities

1. Use the sidebar form to add new activities
2. Set the activity name, start/end times, progress, priority, and type
3. Click "Add Activity" to add it to your timeline

### Managing Activities

- **Edit**: Click the edit icon on any activity to modify its details
- **Delete**: Click the trash icon to remove activities
- **Progress**: Update completion status using the progress bar

### Navigation

- Use the date picker to switch between different dates
- View daily summaries and statistics
- Filter activities by priority and type

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize colors, spacing, and other design elements by modifying:

- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - Global styles and custom CSS

### Data Structure

Activities follow this structure:

```typescript
interface Activity {
  id: number
  text: string
  start_date: string
  end_date: string
  progress: number
  parent: number
  type: 'task' | 'project' | 'milestone'
  priority: 'low' | 'medium' | 'high'
  color?: string
  duration?: number
}
```

### Adding New Features

The modular component structure makes it easy to extend functionality:

- Add new activity types in the `Activity` interface
- Create new chart views in the `GanttChart` component
- Implement data persistence by connecting to a backend API

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Date utilities from [date-fns](https://date-fns.org/)
