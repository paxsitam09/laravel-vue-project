# Project Name
-Laravel-vue-project

A web application built with Laravel backend and Vue.js frontend.

## Tech Stack

### Frontend
- Vue.js
- Vue Router
- Piana
- Axios

### Backend
- Laravel
- MySQL
- PHP
- JWT

## Installation

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 16
- npm
- MySQL

### Backend Setup (Laravel)

1. Clone the repository
```bash
git clone https://github.com/paxsitam09/laravel-vue-project.git
cd laravel-vue-project
```

2. Navigate to backend directory and install dependencies
```bash
cd backend
composer install
```

3. Create and setup .env file
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure your database in .env file
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

5. Run migrations and seeders (if any)
```bash
php artisan migrate
php artisan db:seed
```

6. Start the Laravel development server
```bash
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Frontend Setup (Vue.js)

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create and setup .env file
```bash
cp .env.example .env
```

4. Configure your API URL in .env file
```env
VITE_API_URL=http://localhost:8000
```

5. Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure
```
project-root/
│
├── frontend/              # Vue.js frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   └── App.vue
│   ├── public/
│   └── package.json
│
└── backend/              # Laravel backend
    ├── app/
    ├── config/
    ├── database/
    ├── routes/
    ├── storage/
    └── composer.json
```

## Development

### Backend
- API routes are defined in `backend/routes/api.php`
- Controllers are in `backend/app/Http/Controllers`
- Models are in `backend/app/Models`

### Frontend
- Components are in `frontend/src/components`
- Views/Pages are in `frontend/src/views`
- Router configuration is in `frontend/src/router`
- Store (Piana) is in `frontend/src/store`

## Additional Commands

### Backend
```bash
# Generate new migration
php artisan make:migration create_table_name

# Generate new controller
php artisan make:controller ControllerName

# Clear cache
php artisan cache:clear
```

### Frontend
```bash
# Build for production
npm run build

# Lint and fix files
npm run lint
```

## Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
[MIT License](https://choosealicense.com/licenses/mit/)
```
