# ISP Management System

A comprehensive full-stack ISP (Internet Service Provider) management system built with Laravel 10 and React 18, featuring real-time network monitoring, customer management, and MikroTik integration.

## 🚀 Features

### Core Functionality
- **Real-time Dashboard** - Live network statistics and monitoring
- **Customer Management** - Complete customer lifecycle management
- **Package Management** - ISP service plans and pricing
- **ODP Management** - Optical Distribution Point tracking
- **Payment System** - Invoice and payment tracking
- **MikroTik Integration** - Real PPP session monitoring
- **Authentication** - Secure token-based authentication

### Dashboard Features
- 📊 Real-time network statistics (online/offline customers)
- 📈 Bandwidth usage monitoring with charts
- 👥 Active PPP sessions display
- 💰 Monthly revenue tracking
- 🚨 Unpaid invoices alerts
- 🔄 Auto-refresh every 10-30 seconds

### Technical Highlights
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live data with React Query polling
- **Modern UI** - Clean, professional interface with TailwindCSS
- **Type Safety** - Full TypeScript implementation
- **API Documentation** - RESTful endpoints with proper validation

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 10
- **Database**: MySQL
- **Authentication**: Laravel Sanctum (token-based)
- **API**: RESTful with comprehensive validation
- **External Integration**: MikroTik RouterOS API

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query (server state) + Zustand (client state)
- **Routing**: React Router
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet for location tracking
- **HTTP Client**: Axios with interceptors

## 📋 Requirements

### Backend Requirements
- PHP 8.2+
- MySQL 8.0+
- Composer
- Laravel 10

### Frontend Requirements
- Node.js 18+
- npm or yarn
- Modern web browser

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Byy1107/web_Gtech.git
cd web_Gtech
```

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=UserSeeder
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Environment Configuration

#### Backend (.env)
```env
APP_NAME="ISP Management System"
APP_ENV=local
APP_KEY=your_generated_key_here
APP_DEBUG=true
APP_URL=http://localhost:8000

FRONTEND_URL=http://localhost:5175

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=isp_management
DB_USERNAME=root
DB_PASSWORD=

# MikroTik Settings (optional)
MIKROTIK_HOST=192.168.1.1
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=password
MIKROTIK_PORT=8728
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### 5. Run the Application

#### Start Backend Server
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
# Runs on http://localhost:5175
```

## 📡 API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user info

### Dashboard
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/dashboard/traffic` - Traffic data

### MikroTik Integration
- `GET /api/mikrotik/active` - Active PPP sessions
- `GET /api/mikrotik/traffic` - Network traffic
- `GET /api/mikrotik/secrets` - PPP secrets
- `POST /api/mikrotik/disconnect` - Disconnect user

### CRUD Operations
- `GET/POST/PUT/DELETE /api/customers` - Customer management
- `GET/POST/PUT/DELETE /api/packages` - Package management
- `GET/POST/PUT/DELETE /api/odps` - ODP management
- `GET/POST/PUT/DELETE /api/invoices` - Invoice management
- `GET/POST/PUT/DELETE /api/payments` - Payment management

## 🔐 Default Login Credentials

- **Email**: admin@example.com
- **Password**: password

## 📱 Screenshots & Demo

### Dashboard Overview
- Real-time network monitoring
- Customer statistics
- Bandwidth usage charts
- Active PPP sessions

### Management Features
- Customer management with search and filtering
- Package configuration and pricing
- ODP location tracking
- Payment and invoice management

## 🔄 Development Workflow

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Git Hooks**: Pre-commit validation
- **Modular Architecture**: Clean separation of concerns

### Testing & Deployment
- **Build Process**: Optimized production builds
- **Environment Management**: Separate dev/prod configs
- **API Testing**: Comprehensive endpoint validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

## 🌟 Acknowledgments

- Laravel Framework for robust backend architecture
- React ecosystem for modern frontend development
- TailwindCSS for utility-first styling
- Recharts for beautiful data visualization
- MikroTik for network equipment integration

---

**Built with ❤️ for ISP management professionals**
