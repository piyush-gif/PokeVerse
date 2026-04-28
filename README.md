# PokeVerse

A full-stack Pokémon interactive web application where users can explore, battle, collect, and trade Pokémon. Built with FastAPI and React, deployed on Oracle Cloud servers.

## Live Application

Currently hosted on Oracle Cloud Server at: **[http://193.123.191.146:5173](http://193.123.191.146:5173)**

## Overview

PokeVerse is a modern web application that brings the Pokémon experience to life. Users can create accounts, explore different Pokémon, engage in battles, collect Pokémon for their personal Pokédex, browse and purchase items from the shop, and manage their player profile.

## Features

- **User Authentication**: Secure login and registration system with JWT token-based authentication
- **Explore**: Discover and encounter random Pokémon in different environments
- **Pokédex**: Build and manage your personal collection of captured Pokémon
- **Battle System**: Engage in real-time battles with other players' Pokémon
- **Shop**: Purchase items, potions, and enhancements for your Pokémon
- **User Profiles**: Manage your player profile, track achievements, and view statistics
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Modern build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **MySQL 8.0** - Relational database
- **SQLAlchemy** - ORM for database operations
- **PyJWT** - JWT authentication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Prerequisites

Before you begin, ensure you have the following installed:
- Docker and Docker Compose (recommended for easy setup)
- Python 3.9+ (if running locally without Docker)
- Node.js 18+ (if running locally without Docker)
- MySQL 8.0 (if running locally without Docker)

## Installation

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PokeVerse.git
cd PokeVerse
```

2. Build and start all services:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8001`
- Database: `localhost:3307`

### Option 2: Local Development Setup

#### Backend Setup
```bash
cd FastApi
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `FastApi` directory:
```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/pokedb
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
```

Run the backend:
```bash
python main.py
```

#### Frontend Setup
```bash
cd PokeApi/client
npm install
npm run dev
```

## Running the Application

### With Docker Compose
```bash
docker-compose up
```

### Locally (Development Mode)

Terminal 1 - Start Backend:
```bash
cd FastApi
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

Terminal 2 - Start Frontend:
```bash
cd PokeApi/client
npm run dev
```

## Project Structure

```
PokeVerse/
├── FastApi/                    # Backend application
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database configuration
│   ├── seed.py                 # Database seeding script
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Docker configuration
│   ├── auth/
│   │   └── token.py            # JWT token management
│   ├── models/
│   │   └── models.py           # SQLAlchemy models
│   ├── routers/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── battle.py           # Battle endpoints
│   │   ├── explore.py          # Explore endpoints
│   │   ├── pokedex.py          # Pokédex endpoints
│   │   └── shop.py             # Shop endpoints
│   └── schemas/
│       └── User.py             # Pydantic schemas
│
├── PokeApi/
│   └── client/                 # React frontend application
│       ├── package.json        # Node dependencies
│       ├── vite.config.js      # Vite configuration
│       ├── eslint.config.js    # ESLint configuration
│       ├── index.html          # HTML entry point
│       ├── src/
│       │   ├── main.jsx        # React entry point
│       │   ├── App.jsx         # Root component
│       │   ├── Home.jsx        # Home page
│       │   ├── LoginPage.jsx   # Login page
│       │   ├── Register.jsx    # Registration page
│       │   ├── Explore.jsx     # Explore page
│       │   ├── PokeDex.jsx     # Pokédex page
│       │   ├── PokemonDetail.jsx # Pokemon details
│       │   ├── Shop.jsx        # Shop page
│       │   ├── Profile.jsx     # User profile page
│       │   ├── NavBar.jsx      # Navigation component
│       │   ├── index.css       # Global styles
│       │   ├── components/
│       │   │   ├── Battle.jsx  # Battle component
│       │   │   ├── BattleBag.jsx # Battle inventory
│       │   │   ├── ProtectedRoute.jsx # Auth guard
│       │   ├── hooks/
│       │   │   └── useFetch.jsx # Custom fetch hook
│       │   ├── store/
│       │   │   └── authStore.jsx # Auth state management
│       │   └── public/
│       │       └── images/     # Static assets
│       └── Dockerfile         # Docker configuration
│
└── docker-compose.yml         # Docker Compose configuration
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create a new user account
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Explore
- `GET /explore` - Get random Pokémon encounter
- `POST /explore/catch` - Attempt to catch a Pokémon

### Pokédex
- `GET /pokedex` - Get user's collected Pokémon
- `GET /pokedex/{pokemon_id}` - Get specific Pokémon details
- `POST /pokedex/add` - Add Pokémon to collection

### Battle
- `GET /battle` - Get available opponents
- `POST /battle/start` - Initiate a battle
- `POST /battle/attack` - Perform attack during battle
- `POST /battle/end` - End battle session

### Shop
- `GET /shop/items` - Get available items
- `POST /shop/purchase` - Purchase an item
- `GET /shop/inventory` - Get user's inventory

## Database Setup

The application uses MySQL 8.0 with the following default configuration:
- Database: `pokedb`
- Root user: `root`
- Password: `password`
- Port: `3307` (mapped from internal 3306)

To seed the database with initial Pokémon data:
```bash
python FastApi/seed.py
```

## Development

### Running Linter
```bash
cd PokeApi/client
npm run lint
```

### Building for Production
```bash
# Frontend
cd PokeApi/client
npm run build

# Backend
cd FastApi
# Build Docker image: docker build -t pokeverse-backend .
```

## Deployment

The application is deployed on Oracle Cloud servers with the following configuration:
- **Server Address**: `193.123.191.146`
- **Frontend Port**: `5173`
- **Backend Port**: `8001`
- **Database Port**: `3307`

### Deployment Steps
1. Push code to repository
2. SSH into Oracle instance
3. Pull latest changes
4. Run `docker-compose up -d`
5. Monitor logs with `docker-compose logs -f`

## Environment Variables

### Backend (.env file)
```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/pokedb
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env file - if needed)
```
VITE_API_URL=http://localhost:8001
```

## Troubleshooting

### Docker Issues
If containers fail to start:
```bash
docker-compose down -v
docker-compose up --build
```

### Port Already in Use
If ports are already in use, modify the `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:INTERNAL_PORT"
```

### Database Connection Issues
Ensure MySQL is running and the credentials in `.env` match the docker-compose configuration.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Built with FastAPI and React
- Pokémon data and resources from the Pokémon community
- Hosted on Oracle Cloud Infrastructure

---

**Last Updated**: April 2026
