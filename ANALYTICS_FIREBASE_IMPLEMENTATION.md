# Analytics Firebase Implementation

## 🎯 LATEST UPDATE: Real Data Implementation (Nov 7, 2025)

### Key Improvements Made:
1. ✅ **Removed ALL Fake/Estimated Data:**
   - Eliminated hardcoded $85 average order value
   - Removed estimated 30% expense ratio
   - Removed fake profit calculations

2. ✅ **Now Using Real Transaction Data:**
   - Purchase revenue uses actual `amountPaid` from `purchases` collection
   - Voucher redemptions use each voucher's `minSpending` requirement (more realistic)
   - All metrics clearly indicate if they're "Real Data" vs "Estimated"

3. ✅ **Removed Misleading Metrics:**
   - ❌ Deleted "Total Profit" (no real expense data)
   - ❌ Deleted "Monthly Expense" (was fake 30% estimate)
   - ❌ Deleted "Monthly Profit" (no real expense data)

4. ✅ **Added New Meaningful Metrics:**
   - ✨ "Purchase Revenue" - 100% real subscription transaction data
   - ✨ "Total Redemptions" - accurate count of vouchers redeemed
   - ✨ "Monthly Purchases" - real revenue with transaction count

### Data Accuracy Summary:
- **🟢 Real Data:** Purchase revenue (from `purchases.amountPaid`)
- **🟡 Estimated Data:** Redemption revenue (uses voucher's `minSpending`)
- **🟢 Count Data:** Restaurants, members, redemptions (accurate)

---

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

## Data Sources (UPDATED - Now Using Real Data)

### Total Revenue
**Source:** Combination of real purchases and estimated redemptions
- **Real Revenue from Purchases:** Actual `amountPaid` from `purchases` collection
- **Estimated Revenue from Redemptions:** Based on voucher's `minSpending` requirement
- Trends calculated by comparing last 7 days vs previous 7 days

### Purchase Revenue (NEW - Real Data)
**Source:** `purchases` collection
- Uses actual transaction amounts (`amountPaid` field)
- 100% real transaction data from subscription purchases
- No estimates or assumptions

### Total Redemptions (REPLACED Total Profit)
**Source:** Count of voucher redemptions
- Simple count of all vouchers redeemed
- No fake profit calculations

### Monthly Revenue
**Source:** Aggregated from purchases and redemptions grouped by month
- Shows last 10 months of data
- **Purchases:** Uses actual `amountPaid` (real data)
- **Redemptions:** Uses voucher's `minSpending` (estimated, more realistic than fixed $85)

### Average Revenue
**Source:** Average of monthly revenues over available months
- Historical average calculated from real monthly data

### Monthly Purchases (NEW - Real Data)
**Source:** Current month's purchases from `purchases` collection
- Shows actual revenue from subscription purchases
- Displays transaction count

### REMOVED METRICS (Were Fake/Estimated):
- ❌ **Total Profit** - Removed (no real expense data)
- ❌ **Monthly Expense** - Removed (was estimated at 30%, not real)
- ❌ **Monthly Profit** - Removed (no real expense data)

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

