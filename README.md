# Grooftop App

A modern mobile application for managing and booking rooftop spaces. Built with React Native and Expo.

## Features

- 🏢 Browse available rooftops
- 🔍 Search rooftops by name and location
- 📅 Book rooftop spaces
- 👤 User authentication and profile management
- ⭐ Review and rating system
- 🌙 Dark mode support
- 🎨 Modern UI with smooth animations

## Tech Stack

- React Native with Expo
- TypeScript
- Zustand for state management
- React Navigation for routing
- NestJS backend with Prisma ORM
- PostgreSQL database
- Railway for deployment

## Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Expo Go app for mobile testing

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/grooftop-app.git
cd grooftop-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm start
```

4. Open the app:
   - 📱 Scan the QR code with Expo Go (Android)
   - 📱 Scan the QR code with Camera app (iOS)

## Project Structure

```
src/
├── components/        # Reusable UI components
├── config/           # App configuration
├── features/         # Feature-based modules
│   ├── auth/        # Authentication
│   ├── rooftops/    # Rooftop management
│   ├── bookings/    # Booking system
│   ├── reviews/     # Reviews and ratings
│   └── profile/     # User profile
├── services/        # API services
├── store/          # State management
├── theme/          # UI theme and styling
└── utils/          # Utility functions
```

## Best Practices

- ✨ Follow TypeScript best practices
- 📱 Use responsive design patterns
- 🎨 Maintain consistent styling
- ♻️ Reuse components
- 🧪 Write clean, maintainable code
- 🔐 Implement proper error handling
- 🌐 Support offline functionality

## Available Scripts

- `pnpm start` - Start the Expo development server
- `pnpm android` - Start Android development build
- `pnpm ios` - Start iOS development build
- `pnpm web` - Start web development build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@grooftop.com or join our Slack channel.

## Acknowledgments

- Thanks to all contributors
- Expo team for the amazing framework
- React Native community
