# Restaurant Website

A modern restaurant website with table reservation system and role-based access control.

## Features

- Beautiful, responsive design inspired by the Belisa template
- Online table reservation system with real-time updates
- Interactive seating chart
- Role-based access control (Admin, Manager, Host)
- Menu management
- User management
- Real-time table status updates

## Prerequisites

- Node.js (v16.x or higher)
- MongoDB (v4.x or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/restaurant
SESSION_SECRET=your_session_secret_here
PORT=3000
```

4. Start MongoDB service on your machine

5. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Default Users

The following default users are created when you first run the application:

- Admin:
  - Username: admin
  - Password: admin123

- Manager:
  - Username: manager
  - Password: manager123

- Host:
  - Username: host
  - Password: host123

## Project Structure

```
restaurant-website/
├── models/          # Database models
├── routes/          # Route handlers
├── views/           # EJS templates
├── public/          # Static files
│   ├── css/        # Stylesheets
│   ├── js/         # Client-side JavaScript
│   └── images/     # Images
├── app.js          # Main application file
└── package.json    # Project dependencies
```

## User Roles and Permissions

### Admin
- Full system access
- Manage users
- Manage tables
- View and manage all reservations

### Manager
- View and manage reservations
- Update table status
- View table layout

### Host
- View reservations
- Update table status
- Basic table management

## Development

To run the application in development mode with hot reloading:

```bash
npm run dev
```

## Testing

To run tests:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by [Squarespace Belisa Template](https://www.squarespace.com/templates/belisa-fluid-demo)
- Icons from [Font Awesome](https://fontawesome.com/)
- Built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/) 