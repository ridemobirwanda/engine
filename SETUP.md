# EngineCore E-commerce Setup Guide

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Run the database migration**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the migration

### 2. Environment Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update your environment variables** in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8081`

### 5. Create Admin User

1. **Navigate to admin setup**: `http://localhost:8081/admin/setup`
2. **Choose one of the options**:
   - **Option 1**: If you already have a user account, enter your email and click "Setup Admin"
   - **Option 2**: Create a new user account and admin access in one step

## 🏗️ System Architecture

### Database Schema

The system uses a comprehensive PostgreSQL schema with the following main tables:

- **admin_users**: Admin user management
- **profiles**: User profiles
- **categories**: Product categories
- **products**: Product catalog
- **cart_items**: Shopping cart
- **orders**: Order management
- **order_items**: Order line items
- **product_reviews**: Product reviews
- **wishlists**: User wishlists
- **contact_inquiries**: Contact form submissions
- **newsletter_subscriptions**: Newsletter management
- **support_tickets**: Customer support
- **support_messages**: Support conversations
- **website_settings**: Site configuration

### Key Features

#### 🛒 E-commerce Core
- **Product Catalog**: Complete product management with categories, variants, and inventory
- **Shopping Cart**: Persistent cart with guest and authenticated user support
- **Order Management**: Full order lifecycle from creation to fulfillment
- **Payment Integration**: Ready for Stripe, PayPal, and other payment providers
- **User Accounts**: Registration, authentication, and profile management

#### 👨‍💼 Admin Panel
- **Dashboard**: Analytics and key metrics
- **Product Management**: CRUD operations for products and categories
- **Order Management**: Order processing and status updates
- **Customer Management**: User account administration
- **Media Library**: File upload and management
- **Analytics**: Sales and performance insights
- **Settings**: Site configuration

#### 🔧 Technical Features
- **TypeScript**: Full type safety
- **React 18**: Modern React with hooks
- **Supabase**: Backend-as-a-Service
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Recharts**: Data visualization
- **React Router**: Client-side routing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── pages/              # Page components
│   ├── admin/          # Admin panel pages
│   └── ...             # Public pages
├── services/           # Business logic services
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🔐 Authentication & Authorization

### User Authentication
- **Supabase Auth**: Handles user registration, login, and session management
- **Row Level Security (RLS)**: Database-level security policies
- **JWT Tokens**: Secure token-based authentication

### Admin Authorization
- **Role-based Access**: Different admin roles (admin, super_admin)
- **Permission System**: Granular permission control
- **Admin Setup**: Easy admin user creation

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Database Configuration

The system uses Supabase with the following key configurations:
- **Row Level Security**: Enabled on all tables
- **Real-time subscriptions**: Available for live updates
- **Storage**: File uploads and media management
- **Edge Functions**: Serverless functions for complex operations

## 📊 Analytics & Monitoring

### Built-in Analytics
- **Sales Analytics**: Revenue, orders, and growth metrics
- **Product Analytics**: Top-selling products and performance
- **Customer Analytics**: User behavior and engagement
- **Order Analytics**: Order trends and fulfillment

### External Integrations
- **Google Analytics**: Web analytics (optional)
- **Stripe Dashboard**: Payment analytics
- **Supabase Dashboard**: Database and performance metrics

## 🐛 Troubleshooting

### Common Issues

1. **Admin Access Denied**
   - Ensure you've run the database migration
   - Create an admin user via `/admin/setup`
   - Check Supabase RLS policies

2. **Cart Not Working**
   - Verify Supabase connection
   - Check browser console for errors
   - Ensure cart_items table exists

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run build`
   - Verify environment variables are set

4. **Database Connection Issues**
   - Verify Supabase URL and API key
   - Check Supabase project status
   - Ensure RLS policies are correctly configured

### Getting Help

1. **Check the console** for error messages
2. **Review the logs** in Supabase dashboard
3. **Verify environment variables** are correctly set
4. **Check database schema** matches the migration

## 🔄 Updates & Maintenance

### Regular Maintenance
- **Database backups**: Supabase handles automatic backups
- **Security updates**: Keep dependencies updated
- **Performance monitoring**: Use Supabase dashboard
- **User feedback**: Monitor support tickets and reviews

### Scaling Considerations
- **Database**: Supabase scales automatically
- **CDN**: Consider adding a CDN for media files
- **Caching**: Implement Redis for frequently accessed data
- **Monitoring**: Add application performance monitoring

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- **Documentation**: Check this README and code comments
- **Issues**: Create a GitHub issue
- **Community**: Join our Discord server (if available)

---

**Happy coding! 🚀**


