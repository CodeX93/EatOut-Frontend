# Analytics Firebase Implementation

## Overview
The Analytics page has been successfully migrated from hardcoded data to real-time Firebase data fetching.

## What Was Changed

### 1. Created Analytics Utility Functions (`app/Analytics/utils/analyticsUtils.js`)
This new file contains all the data fetching and calculation logic:

- **`fetchAnalyticsData()`** - Fetches all necessary data from Firebase collections:
  - `voucher` collection
  - `registeredRestaurants` collection
  - `members` collection
  - `referrals` collection
  - Voucher redemptions from subcollections

- **Calculation Functions:**
  - `calculateTotalMetrics()` - Total Revenue, Total Profit, Total Restaurants, Total Members
  - `calculateMonthlyMetrics()` - Average Revenue, Monthly Expense, Monthly Income, Monthly Profit
  - `calculateMonthlyRevenue()` - Monthly revenue data for charts
  - `calculateEarnedVouchers()` - Voucher redemption statistics
  - `getTopCustomers()` - Top 5 customers by spending
  - `getRecentRedemptions()` - Recent voucher redemptions
  - `calculateCustomerStatus()` - Active vs Inactive customers
  - `calculateCustomersGrowth()` - Customer growth over time

### 2. Updated Analytics Page (`app/Analytics/page.js`)
- Added Firebase data fetching on component mount
- Replaced hardcoded metrics with calculated Firebase data
- Added loading state with spinner
- Passes real data to all child components

### 3. Updated Components

#### **TopCustomersTable.jsx**
- Now accepts `customers` prop with real customer data
- Displays top 5 customers by total spending
- Shows customer name, total spent, and number of orders

#### **CustomerStatusCards.jsx**
- Accepts `activeCount` and `inactiveCount` props
- Automatically calculates percentages
- Shows active vs inactive customer distribution

#### **TotalCustomersChart.jsx**
- Accepts `data` prop with cumulative customer growth
- Displays customer growth over the last 10 months

#### **RecentVouchersTable.jsx**
- Accepts `redemptions` prop
- Shows recent voucher redemptions with user, restaurant, and timestamp
- Displays last 5 redemptions

#### **MonthlyRevenueChart.jsx** & **EarnedVouchersChart.jsx**
- Already had support for data props
- Now receive real Firebase data instead of using defaults

## Data Sources

### Total Revenue & Total Profit
**Source:** Calculated from voucher redemptions
- Revenue = Sum of all order values from redemptions (using avg order value of $85)
- Profit = Revenue - Expenses (expenses estimated at 30% of revenue)
- Trends calculated by comparing last 7 days vs previous 7 days

### Monthly Revenue
**Source:** Aggregated from voucher redemptions grouped by month
- Shows last 10 months of data
- Each redemption contributes the average order value ($85)

### Average Revenue
**Source:** Average of monthly revenues over available months

### Monthly Expense, Income, Profit
**Source:** Current month's redemptions
- Expense: 30% of income
- Income: Sum of all order values in current month
- Profit: Income - Expense
- Trends: Comparison with previous month

### Earned Vouchers
**Source:** Total count of voucher redemptions
- Groups redemptions by last 5 months
- Shows growth trend and change from previous month

### Top Customers
**Source:** Aggregated from voucher redemptions by user email
- Calculates total spending per user
- Shows top 5 by total amount spent

### Customer Status (Active/Inactive)
**Source:** Members collection + redemption activity
- Active: Users who redeemed a voucher in last 30 days
- Inactive: All other registered members

### Total Customers Growth
**Source:** Members collection join dates
- Cumulative count of members over time
- Shows last 10 months

### Recent Redemptions
**Source:** Voucher redemptions sorted by date
- Shows last 5 redemptions
- Includes voucher code, title, user, restaurant, and timestamp

## Firebase Collections Used

1. **`voucher`** - Contains all voucher information
2. **`voucher/{voucherId}/redeemedUsers`** - Subcollection with redemption records
3. **`registeredRestaurants`** - Restaurant information
4. **`members`** - User/customer information
5. **`referrals`** - Referral program data

## How Revenue is Calculated

Since there's no explicit transaction/order collection with prices, the system uses:
- **Average Order Value:** $85 (configurable in analyticsUtils.js)
- **Discount Calculation:**
  - Percentage Discount: (Order Value × Percentage) / 100
  - Fixed Amount Discount: Direct discount value
  - Cash Voucher: Direct voucher value
- **Expense Estimation:** 30% of revenue (configurable)

## Customization

To adjust calculations:
1. Open `app/Analytics/utils/analyticsUtils.js`
2. Modify:
   - `avgOrderValue` (currently 85)
   - Expense percentage (currently 0.3 or 30%)
   - Time periods for trends (currently 7 days, 30 days)

## Testing

To test with real data:
1. Ensure Firebase is properly configured in `firebaseConfig.js`
2. Navigate to the Analytics page
3. Data will automatically load from Firebase
4. Check browser console for any errors

## Future Enhancements

Potential improvements:
1. Add a separate transactions/orders collection for accurate revenue tracking
2. Implement real-time updates using Firebase listeners
3. Add date range filters for custom analytics periods
4. Cache data to reduce Firebase reads
5. Add export functionality for reports
6. Implement historical trend comparisons

