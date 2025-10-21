# E.AT Admin Dashboard

<div align="center">
  <img src="./public/logo.svg" alt="E.AT Logo" width="120" />
  <p><strong>A Comprehensive Restaurant Management & Voucher System</strong></p>
</div>

## 📋 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Modules](#core-modules)
- [Firebase Integration](#firebase-integration)
- [Contributing](#contributing)

---

## 🎯 About the Project

**E.AT (Eat Amazing Treats)** is a comprehensive admin dashboard for managing a restaurant voucher and loyalty program platform. This web application enables restaurant administrators to manage restaurants, vouchers, customers, and analyze business performance through real-time analytics.

The platform serves as a central hub for:
- **Restaurant Management** - Onboard, manage, and monitor partner restaurants
- **Voucher Distribution** - Create, distribute, and track promotional vouchers
- **Customer Engagement** - Manage member profiles, track loyalty, and analyze behavior
- **Business Analytics** - Monitor revenue, customer growth, and marketing performance
- **Loyalty Programs** - Manage bowl-based loyalty systems and referral programs
- **Communication** - Send broadcasts and notifications to users

### Use Case
This system is designed for restaurant aggregator platforms, food service marketplaces, or restaurant groups that want to:
- Manage multiple restaurant locations from a single dashboard
- Run promotional campaigns with discount vouchers
- Track customer engagement and spending patterns
- Analyze business metrics and revenue streams
- Implement loyalty and referral programs

---

## ✨ Key Features

### 🏪 Restaurant Management
- Complete CRUD operations for restaurant profiles
- Track restaurant ratings, reviews, and performance
- Manage restaurant facilities and payment options
- Monitor popular vouchers by restaurant
- View restaurant social media and contact information

### 🎫 Voucher System
- Create and manage promotional vouchers (percentage off, fixed discount, cash vouchers)
- Track voucher redemptions and usage statistics
- Monitor active, expired, and under-review vouchers
- Generate voucher performance reports
- Carousel view for featured vouchers

### 👥 Member Management
- Complete customer database with profile management
- Track customer spending and voucher usage
- Identify most frequent users and top spenders
- View individual member transaction history
- Customer activity tracking

### 📊 Analytics Dashboard
- **Real-time metrics** powered by Firebase
- **Revenue Analytics**: Total revenue, profit margins, monthly trends
- **Customer Analytics**: Active/inactive status, growth over time
- **Voucher Performance**: Redemption rates, earned vouchers
- **Top Customers**: Spending leaderboard
- **Monthly Reports**: Revenue charts, expense tracking
- **Recent Activity**: Live feed of voucher redemptions

### 🎁 Loyalty Programs
- **Bowl System**: Track user bowl balances and transactions
- **Referral Program**: Monitor referral metrics and referred users
- View monthly referral charts and customer acquisition

### 📢 Broadcast Communications
- Send targeted notifications to user segments
- View recent broadcast history
- Manage broadcast campaigns with tabs and filters

### 🍽️ Cuisine Management
- Add, edit, and delete cuisine categories
- Organize restaurants by cuisine type
- Streamline restaurant categorization

### 💰 Discount Management
- Create and manage discount campaigns
- Track discount performance
- Apply discounts to specific restaurants or vouchers

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 19** - Latest React with modern features
- **Tailwind CSS 4.1.8** - Utility-first CSS framework

### UI Library
- **Material-UI (MUI) 6.1.6** - Comprehensive component library
- **@mui/icons-material** - Icon set
- **Emotion** - CSS-in-JS styling solution
- **Lucide React** - Additional icon library

### Backend & Database
- **Firebase** - Backend as a Service
  - **Firestore** - NoSQL database for real-time data
  - **Firebase Auth** - User authentication
  - **Firebase Storage** - File storage (implied)

### Data Visualization
- **Recharts 2.15.3** - Charting library for analytics visualizations

### Utilities
- **date-fns 4.1.0** - Modern date utility library
- **class-variance-authority** - CSS class composition
- **clsx** - Conditional class names

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Firebase account** with Firestore database configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EatOut-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Firebase**
   - Update `firebaseConfig.js` with your Firebase project credentials
   - Ensure Firestore database is set up with the required collections (see [Firebase Integration](#firebase-integration))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
EatOut-Frontend/
├── app/                          # Next.js App Router directory
│   ├── Analytics/                # Analytics dashboard
│   │   ├── components/           # Analytics-specific components
│   │   └── utils/                # Analytics utility functions
│   ├── Bowls/                    # Bowl loyalty system
│   ├── Broadcast/                # Broadcast notifications
│   ├── components/               # Shared layout components
│   │   ├── AppLayout.jsx         # Main app layout wrapper
│   │   ├── Header.jsx            # Top navigation header
│   │   └── SideNavbar.jsx        # Sidebar navigation
│   ├── context/                  # React Context providers
│   │   └── AuthContext.jsx       # Authentication context
│   ├── cuisines/                 # Cuisine management
│   ├── dashboard/                # Main dashboard
│   ├── Discount/                 # Discount management
│   ├── hooks/                    # Custom React hooks
│   ├── login/                    # Authentication page
│   ├── members/                  # Customer management
│   ├── Referrals/                # Referral program
│   ├── Restaurants/              # Restaurant management
│   │   ├── components/           # Restaurant components
│   │   └── resturant-sub/        # Restaurant detail pages
│   ├── vouchers/                 # Voucher management
│   │   ├── _components/          # Voucher components
│   │   └── sub/                  # Voucher subpages
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Home page
│   ├── providers.jsx             # App providers wrapper
│   └── Theme.js                  # MUI theme configuration
├── Assets/                       # Static assets
├── public/                       # Public static files
├── firebaseConfig.js             # Firebase configuration
├── jsconfig.json                 # JavaScript configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🔧 Core Modules

### 1. **Analytics Module** (`/app/Analytics`)
Provides comprehensive business intelligence and metrics:
- Total revenue, profit, and expense tracking
- Monthly revenue charts with 10-month history
- Customer growth analytics
- Active vs. inactive customer segmentation
- Top customer leaderboard by spending
- Recent voucher redemptions feed
- Voucher redemption trends

**Key Files:**
- `analyticsUtils.js` - Data fetching and calculation logic
- `page.js` - Main analytics dashboard page

### 2. **Restaurant Module** (`/app/Restaurants`)
Complete restaurant lifecycle management:
- Restaurant listings with filters
- Individual restaurant profiles
- Rating and review aggregation
- Popular voucher tracking per restaurant
- Restaurant facilities and payment options
- Social media integration

### 3. **Voucher Module** (`/app/vouchers`)
Full voucher lifecycle management:
- Create/edit/delete vouchers
- View active, expired, and pending vouchers
- Voucher redemption reports
- Voucher carousel for featured promotions
- Search and filter functionality

### 4. **Members Module** (`/app/members`)
Customer relationship management:
- Member directory with search
- Individual member profiles
- Transaction history
- Spending analytics
- Most frequent users
- Top spenders dashboard

### 5. **Bowl System** (`/app/Bowls`)
Loyalty currency management:
- Track user bowl balances
- Bowl transaction history
- Bowl metrics and analytics

### 6. **Referral Program** (`/app/Referrals`)
Track customer acquisition:
- Monthly referral metrics
- Referred user listings
- Referral performance charts
- Customer growth from referrals

### 7. **Broadcast Module** (`/app/Broadcast`)
Communication management:
- Send targeted broadcasts
- View broadcast history
- Segment user audiences
- Track broadcast engagement

### 8. **Dashboard** (`/app/dashboard`)
Executive summary view:
- Overview cards with key metrics
- Peak hours analysis
- Recent voucher redemptions
- Voucher breakdown and performance
- Quick access to critical data

---

## 🔥 Firebase Integration

### Firestore Collections

The application uses the following Firestore collections:

1. **`voucher`** - All voucher information
   - Subcollection: `redeemedUsers` - Tracks individual redemptions

2. **`registeredRestaurants`** - Restaurant profiles and details

3. **`members`** - Customer/user profiles and registration data

4. **`referrals`** - Referral program data and referred users

5. **`cuisines`** - Cuisine categories

### Authentication
- Firebase Authentication handles admin login
- Protected routes via `AuthContext`
- Session management

### Real-time Data
- Analytics dashboard fetches real-time data from Firebase
- Automatic calculation of metrics from Firestore documents
- No hardcoded data - all metrics are live

### Data Flow
1. User actions trigger Firestore writes
2. Components fetch data on mount or via real-time listeners
3. Utility functions aggregate and calculate metrics
4. UI updates with processed data

For detailed information about Analytics implementation, see [ANALYTICS_FIREBASE_IMPLEMENTATION.md](./ANALYTICS_FIREBASE_IMPLEMENTATION.md).

---

## 🎨 UI/UX Features

- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Material Design** - Consistent MUI component library
- **Dark Mode Ready** - Theme infrastructure in place
- **Interactive Charts** - Recharts visualizations for data insights
- **Modern Aesthetics** - Clean, professional dashboard design
- **Smooth Navigation** - Side navigation with route highlighting
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - User-friendly error messages

---

## 📈 Analytics & Metrics

### Revenue Calculation
- **Average Order Value**: $85 (configurable)
- **Discount Types**: Percentage, fixed amount, cash voucher
- **Expense Estimation**: 30% of revenue (configurable)

### Customer Segmentation
- **Active**: Redeemed voucher in last 30 days
- **Inactive**: No redemptions in 30+ days

### Trend Analysis
- **7-day comparison** for short-term trends
- **Monthly comparison** for long-term patterns
- **10-month historical** data visualization

### Customization
Modify `app/Analytics/utils/analyticsUtils.js` to adjust:
- Average order value
- Expense percentage
- Time periods for trends
- Calculation logic

---

## 🔐 Security Considerations

- Firebase Authentication for secure access
- Admin-only dashboard (no public access)
- Firestore security rules should be configured server-side
- Environment variables for sensitive configuration (recommended)
- API keys should be moved to environment variables in production

---

## 🚧 Future Enhancements

Potential features and improvements:
- [ ] Add real transactions/orders collection for accurate revenue
- [ ] Implement real-time listeners for live data updates
- [ ] Add date range filters for custom analytics periods
- [ ] Implement data caching to reduce Firebase reads
- [ ] Export functionality for reports (CSV, PDF)
- [ ] Email notification system
- [ ] Advanced filtering and search
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Advanced role-based access control
- [ ] Inventory management module
- [ ] Customer feedback and reviews management
- [ ] Integration with payment gateways
- [ ] Automated marketing campaigns

---

## 📝 License

This project is private and proprietary.

---

## 👥 Contributing

This is a private project. For authorized contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with detailed description

---

## 📞 Support

For questions or support, please contact the development team.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Material-UI](https://mui.com/)
- Backend by [Firebase](https://firebase.google.com/)
- Charts by [Recharts](https://recharts.org/)

---

<div align="center">
  <p>Made with ❤️ for restaurant businesses</p>
  <p><strong>E.AT - Eat Amazing Treats</strong></p>
</div>
