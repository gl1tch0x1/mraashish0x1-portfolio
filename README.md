# 🚀 MrAashish0x1 - Cybersecurity Portfolio

A professional, production-ready full-stack portfolio application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application features a modern cybersecurity-themed design with advanced animations, a complete admin CMS, CV upload/download system, and a fully functional backend API with email notifications.

## ✨ Features

### 🎨 Frontend (React 18 + Vite)
- ✅ **Modern Tech Stack:** React 18, Vite 5, TailwindCSS 3
- ✅ **Advanced Animations:**
  - Matrix Rain background effect (Canvas API, 60 FPS)
  - Glitch text effects on logo and navigation
  - TypeWriter animation with configurable cursor
  - Text Scramble loader
  - Mouse glow effect
  - Scanline overlay (CRT monitor effect)
  - Custom context menu
  - Page transitions with Framer Motion
- ✅ **Interactive UI:**
  - Animated cards with glow and 3D tilt effects
  - Scroll-triggered fade-in animations
  - Responsive navigation with mobile menu
  - Custom scrollbar with accent color glow
  - Scroll progress indicator
- ✅ **State Management:**
  - React Query (TanStack Query) for server state
  - Optimistic updates and cache invalidation
  - React Hook Form for form validation
  - React Hot Toast for notifications
- ✅ **Performance:**
  - Lazy loading for all pages
  - Code splitting by route
  - React.memo for expensive components
  - Optimized bundle sizes (< 100 kB gzipped)

### 🔧 Backend (Node.js + Express)
- ✅ **RESTful API:**
  - 8 resource endpoints (Projects, Skills, Services, Timeline, About, Contact, Auth, CV)
  - Proper routing with Express Router
  - Controller-based architecture
  - Async/await error handling
- ✅ **Database (MongoDB + Mongoose):**
  - 8 models with validation
  - Compound indexes for performance
  - Optimized queries (single DB calls)
  - Pagination support
- ✅ **Authentication & Security:**
  - JWT-based authentication
  - Role-based access control (Admin)
  - Helmet for security headers
  - CORS configuration
  - Rate limiting (100 req/15min general, 5 req/hour contact form)
  - XSS protection
  - NoSQL injection prevention
  - Input validation and sanitization
- ✅ **Email System:**
  - Contact form with Nodemailer
  - Admin notifications
  - Auto-reply to users
  - HTML email templates
- ✅ **File Upload:**
  - CV upload/download system
  - Multer middleware
  - PDF validation (max 10 MB)
  - Download count tracking
  - Active CV management

### 🎛️ Admin Dashboard (CMS)
- ✅ **Full CRUD Operations:**
  - About section management
  - Skills management (with categories and proficiency)
  - Services management
  - Projects management (with pagination)
  - Timeline management
  - Contact messages management
  - CV upload/download/delete
- ✅ **Dashboard Features:**
  - Statistics overview
  - Recent activity log
  - Content summary
  - Responsive design with Matrix Rain background
  - Secure login with JWT
  - Session persistence

### 🎯 Advanced Features
- ✅ **CV System:**
  - Admin can upload CV (PDF only)
  - Public download button on homepage
  - Download count tracking
  - Active CV management
  - Automatic file cleanup on delete
- ✅ **Contact Form:**
  - Email notifications to admin
  - Auto-reply to user
  - IP address and user agent tracking
  - Status management (new, read, replied)
  - Rate limiting protection
- ✅ **Dynamic Content:**
  - All content editable from admin dashboard
  - Real-time updates with React Query
  - No hardcoded content
  - Optimistic UI updates
- ✅ **Production Ready:**
  - Environment variable configuration
  - Error logging
  - Compression middleware
  - Database seeder for initial data
  - Comprehensive error handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd portfolio
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# IMPORTANT: Update the following variables:
# - MONGODB_URI (already set to your provided URI)
# - JWT_SECRET (generate a strong random string)
# - EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD (for contact form emails)
# Note: Contact form emails are sent to mraashish0x1@duck.com (hardcoded)
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default API URL is http://localhost:5000/api
# Update if your backend runs on a different port
```

### 4. Seed the Database (Optional but Recommended)

```bash
cd ../backend

# Import sample data
npm run seeder -i

# To delete all data (use with caution)
npm run seeder -d
```

## 🚀 Running the Application

### Development Mode

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/
│   │   ├── aboutController.js         # About CRUD
│   │   ├── authController.js          # Authentication (login/logout)
│   │   ├── contactController.js       # Contact form + emails
│   │   ├── cvController.js            # CV upload/download
│   │   ├── dashboardController.js     # Dashboard stats
│   │   ├── projectController.js       # Projects CRUD
│   │   ├── serviceController.js       # Services CRUD
│   │   ├── skillController.js         # Skills CRUD
│   │   └── timelineController.js      # Timeline CRUD
│   ├── middleware/
│   │   ├── asyncHandler.js            # Async error wrapper
│   │   ├── auth.js                    # JWT authentication
│   │   ├── errorHandler.js            # Global error handler
│   │   ├── upload.js                  # Multer file upload
│   │   └── validator.js               # Input validation
│   ├── models/
│   │   ├── About.js                   # About schema
│   │   ├── Contact.js                 # Contact schema
│   │   ├── CV.js                      # CV schema
│   │   ├── Project.js                 # Project schema
│   │   ├── Service.js                 # Service schema
│   │   ├── Skill.js                   # Skill schema
│   │   ├── Timeline.js                # Timeline schema
│   │   └── User.js                    # User/Admin schema
│   ├── routes/
│   │   ├── about.js                   # About routes
│   │   ├── auth.js                    # Auth routes
│   │   ├── contact.js                 # Contact routes
│   │   ├── cv.js                      # CV routes
│   │   ├── dashboard.js               # Dashboard routes
│   │   ├── projects.js                # Project routes
│   │   ├── services.js                # Service routes
│   │   ├── skills.js                  # Skill routes
│   │   └── timeline.js                # Timeline routes
│   ├── seeders/
│   │   └── createAdmin.js             # Admin user creation
│   ├── uploads/
│   │   └── cv/                        # CV file storage
│   ├── utils/
│   │   ├── errorResponse.js           # Error response utility
│   │   └── sendEmail.js               # Email utility
│   ├── .env.example                   # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   ├── seeder.js                      # Database seeder
│   └── server.js                      # Express server
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AnimatedCard.jsx       # Card with glow/tilt
│   │   │   │   ├── CustomContextMenu.jsx  # Right-click menu
│   │   │   │   ├── FadeInSection.jsx      # Scroll animations
│   │   │   │   ├── Loader.jsx             # Text scramble loader
│   │   │   │   ├── PageTransition.jsx     # Page transitions
│   │   │   │   └── ScrollProgress.jsx     # Scroll indicator
│   │   │   ├── effects/
│   │   │   │   ├── GlitchText.jsx         # Glitch animation
│   │   │   │   ├── MatrixRain.jsx         # Matrix background
│   │   │   │   ├── MouseGlow.jsx          # Mouse glow effect
│   │   │   │   ├── ScanlineOverlay.jsx    # CRT scanlines
│   │   │   │   ├── TextScramble.jsx       # Text scramble
│   │   │   │   └── TypeWriter.jsx         # Typewriter effect
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx             # Footer component
│   │   │   │   └── Header.jsx             # Header/Navigation
│   │   │   └── projects/
│   │   │       └── ProjectModal.jsx       # Project details modal
│   │   ├── hooks/
│   │   │   ├── useCountUp.js              # Counter animation
│   │   │   ├── useIntersectionObserver.js # Scroll detection
│   │   │   └── useMousePosition.js        # Mouse tracking
│   │   ├── pages/
│   │   │   ├── About.jsx                  # About page
│   │   │   ├── AdminDashboard.jsx         # Admin CMS
│   │   │   ├── AdminLogin.jsx             # Admin login
│   │   │   ├── Contact.jsx                # Contact page
│   │   │   ├── Home.jsx                   # Homepage
│   │   │   ├── Projects.jsx               # Projects page
│   │   │   ├── Services.jsx               # Services page
│   │   │   └── Skills.jsx                 # Skills page
│   │   ├── services/
│   │   │   └── api.js                     # API service layer
│   │   ├── App.jsx                        # Main app component
│   │   ├── index.css                      # Global styles
│   │   └── main.jsx                       # React entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── index.html                         # Original static HTML (preserved)
└── README.md                          # This file
```

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - Get all projects (with pagination, filtering)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (🔒 Admin)
- `PUT /api/projects/:id` - Update project (🔒 Admin)
- `DELETE /api/projects/:id` - Delete project (🔒 Admin)

### Skills
- `GET /api/skills` - Get all skills (with category filtering)
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create skill (🔒 Admin)
- `PUT /api/skills/:id` - Update skill (🔒 Admin)
- `DELETE /api/skills/:id` - Delete skill (🔒 Admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (🔒 Admin)
- `PUT /api/services/:id` - Update service (🔒 Admin)
- `DELETE /api/services/:id` - Delete service (🔒 Admin)

### Timeline
- `GET /api/timeline` - Get all timeline items
- `GET /api/timeline/:id` - Get single timeline item
- `POST /api/timeline` - Create timeline item (🔒 Admin)
- `PUT /api/timeline/:id` - Update timeline item (🔒 Admin)
- `DELETE /api/timeline/:id` - Delete timeline item (🔒 Admin)

### About
- `GET /api/about` - Get about information
- `PUT /api/about` - Update about information (🔒 Admin)

### Contact
- `POST /api/contact` - Submit contact form (⏱️ Rate limited: 5/hour)
- `GET /api/contact` - Get all contact messages (🔒 Admin)
- `GET /api/contact/:id` - Get single contact message (🔒 Admin)
- `PUT /api/contact/:id` - Update contact status (🔒 Admin)
- `DELETE /api/contact/:id` - Delete contact message (🔒 Admin)

### CV (Resume)
- `GET /api/cv` - Get active CV info (Google Drive link)
- `GET /api/cv/download` - Get CV Google Drive link
- `POST /api/cv/upload` - Save CV Google Drive link (🔒 Admin)
- `GET /api/cv/all` - Get all CVs (🔒 Admin)
- `DELETE /api/cv/:id` - Delete CV (🔒 Admin)
- `PUT /api/cv/:id/activate` - Set CV as active (🔒 Admin)

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT)
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin user (🔒 Admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (🔒 Admin)
- `GET /api/dashboard/summary` - Get content summary (🔒 Admin)
- `GET /api/dashboard/activity` - Get recent activity (🔒 Admin)

## 📧 Email Configuration

To enable the contact form email functionality:

1. For Gmail, enable 2-factor authentication and create an App Password
2. Update your `.env` file in the backend:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   EMAIL_FROM=noreply@portfolio.com
   # Note: Recipient email is hardcoded to mraashish0x1@duck.com in contactController.js
   ```

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes for API, 5 per hour for contact form)
- Input validation and sanitization
- XSS protection
- NoSQL injection prevention
- JWT authentication ready for admin routes

## 🎨 Customization

### Changing Colors
Edit `frontend/src/index.css` and `frontend/tailwind.config.js` to customize the color scheme.

### Adding New Content
Use the API endpoints or the database seeder to add/update content.

### Modifying Animations
Edit the respective component files in `frontend/src/components/effects/`

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@portfolio.com
# Note: Recipient email is hardcoded to mraashish0x1@duck.com in contactController.js
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Portfolio
```

## 🚢 Deployment

### Backend Deployment (Heroku, Railway, Render, etc.)
1. Set environment variables in your hosting platform
2. Ensure MongoDB URI is set correctly
3. Deploy the backend folder

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set the `VITE_API_URL` environment variable to your backend URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎯 Admin Dashboard Access

### Creating the Admin User

The system supports **only ONE admin user**. To create/reset the admin user:

```bash
cd backend
npm run create-admin
```

This will:
- Delete all existing users
- Create a single admin user with these credentials:
  - **Email:** `admin@mraashish0x1.com`
  - **Password:** `#H3ll0th3r3!`

### Accessing the Dashboard

1. Navigate to `http://localhost:3000/sec/admin`
2. Login with the admin credentials above
3. You'll be redirected to the dashboard at `/sec/admin/dashboard`

### Dashboard Features

- **Statistics:** View total projects, skills, services, and contact messages
- **Content Management:** Full CRUD operations for all content types
- **CV Management:** Add/update Google Drive link for CV
- **Contact Messages:** View and manage contact form submissions
- **Activity Log:** See recent updates across all content types

## 🎨 Customization

### Color Scheme

The application uses a cybersecurity-themed color palette defined in `frontend/src/index.css`:

```css
:root {
  --primary-bg: #0a0f18;        /* Dark blue-black */
  --secondary-bg: #101827;      /* Slightly lighter */
  --accent-color: #00ff9c;      /* Cybersecurity green */
  --text-color: #cdd6f4;        /* Light blue-gray */
  --text-secondary-color: #a6adc8;
  --border-color: #313a50;
}
```

### Fonts

- **Roboto** - Primary body text
- **Source Code Pro** - Monospace/code elements
- **VT323** - Terminal-style titles
- **Ubuntu Mono Bold** - Paragraphs

### Animations

All animations are defined in `frontend/src/index.css` and can be customized:
- Matrix Rain opacity: Adjust in `MatrixRain.jsx`
- Glitch effect: Modify `@keyframes glitch` in CSS
- Page transitions: Edit `PageTransition.jsx`

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all environment variables are set

### Frontend can't connect to backend
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running on the correct port
- Check CORS configuration in `backend/server.js`

### Email not sending
- Verify Gmail App Password is correct
- Check EMAIL_* variables in backend `.env`
- Ensure 2FA is enabled on Gmail account
- Note: Contact form emails are sent to `mraashish0x1@duck.com` (hardcoded)

### CV not working
- Ensure Google Drive link is publicly accessible
- Verify link format is correct (starts with https://)
- Check that sharing is set to "Anyone with the link can view"

## 📊 Technology Stack

### Frontend
- **React** 18.2.0 - UI library
- **Vite** 5.0.8 - Build tool
- **TailwindCSS** 3.4.0 - Styling
- **React Router** 6.20.1 - Routing
- **TanStack Query** 5.14.2 - Server state management
- **Axios** 1.6.2 - HTTP client
- **Framer Motion** 10.16.16 - Animations
- **React Hook Form** 7.49.2 - Form handling
- **React Hot Toast** 2.4.1 - Notifications

### Backend
- **Node.js** 18+ - Runtime
- **Express** 4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.0.3 - ODM
- **JWT** 9.0.2 - Authentication
- **Bcrypt** 2.4.3 - Password hashing
- **Nodemailer** 6.9.7 - Email
- **Multer** 1.4.5 - File upload
- **Helmet** 7.1.0 - Security
- **Express Rate Limit** 7.1.5 - Rate limiting

## 👤 Author

**MrAashish0x1**
- Portfolio: [https://mraashish0x1.com](https://mraashish0x1.com)
- GitHub: [@MrAashish0x1](https://github.com/MrAashish0x1)

## 🙏 Acknowledgments

- Original static HTML portfolio design
- React and the amazing React ecosystem
- MongoDB for the flexible database solution
- All open-source contributors

## 📄 License

This project is licensed under the MIT License - feel free to use it for your own portfolio!

---

**⚠️ Important:** This is a production-ready application. Make sure to:
- Update all placeholder values (emails, URLs, credentials)
- Change default JWT secret to a strong random string
- Configure proper CORS origins for production
- Set up proper error logging and monitoring
- Enable SSL/HTTPS in production
- Regularly backup your MongoDB database

**🚀 Ready to deploy!** Follow the deployment section above to get your portfolio live.

