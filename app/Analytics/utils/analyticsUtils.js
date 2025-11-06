import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

/**
 * Fetch all analytics data from Firebase
 * This includes vouchers, restaurants, members, redemptions, and purchases
 */
export async function fetchAnalyticsData() {
  try {
    console.log("Starting Firebase data fetch...")
    
    // Fetch all necessary collections in parallel
    const [vouchersSnap, restaurantsSnap, membersSnap, referralsSnap, purchasesSnap] = await Promise.all([
      getDocs(collection(db, "voucher")),
      getDocs(collection(db, "registeredRestaurants")),
      getDocs(collection(db, "members")),
      getDocs(collection(db, "referrals")),
      getDocs(collection(db, "purchases")),
    ])
    
    console.log("Firebase collections fetched:")
    console.log("- Vouchers:", vouchersSnap.size)
    console.log("- Restaurants:", restaurantsSnap.size)
    console.log("- Members:", membersSnap.size)
    console.log("- Referrals:", referralsSnap.size)
    console.log("- Purchases:", purchasesSnap.size)

    // Process vouchers and their redemptions
    const vouchers = []
    const allRedemptions = []
    const avgOrderValue = 85 // Average order value for calculations

    for (const vDoc of vouchersSnap.docs) {
      const vData = vDoc.data() || {}
      vouchers.push({
        id: vDoc.id,
        ...vData,
      })

      // Fetch redemptions for this voucher
      try {
        const redeemedSnap = await getDocs(
          collection(db, "voucher", vDoc.id, "redeemedUsers")
        )
        console.log(`Voucher ${vDoc.id} has ${redeemedSnap.size} redemptions`)
        redeemedSnap.forEach((rDoc) => {
          const rData = rDoc.data() || {}
          console.log(`Redemption data for ${vDoc.id}:`, rData)
          
          // Check if redemption is used (default to true if not specified)
          const used = rData.used !== false // Changed logic: default to true unless explicitly false
          console.log(`Redemption used status: ${used}`)
          
          if (used) {
            const redemption = {
              voucherId: vDoc.id,
              voucherData: vData,
              redemptionData: rData,
              userEmail: rData.userEmail || rData.email,
              redeemedAt:
                typeof rData.redeemedAt === "number"
                  ? new Date(rData.redeemedAt)
                  : vData.createdAt?.seconds
                  ? new Date(vData.createdAt.seconds * 1000)
                  : new Date(),
            }
            console.log(`Adding redemption:`, redemption)
            allRedemptions.push(redemption)
          }
        })
      } catch (error) {
        console.error(`Error fetching redemptions for voucher ${vDoc.id}:`, error)
      }
    }

    // Process purchases collection
    const purchases = []
    purchasesSnap.forEach((pDoc) => {
      const pData = pDoc.data() || {}
      console.log(`Purchase data for ${pDoc.id}:`, pData)
      
      // Convert purchaseDate to JavaScript Date
      let purchaseDate = new Date()
      if (pData.purchaseDate) {
        if (pData.purchaseDate.toDate) {
          purchaseDate = pData.purchaseDate.toDate()
        } else if (typeof pData.purchaseDate === 'number') {
          purchaseDate = new Date(pData.purchaseDate)
        } else if (pData.purchaseDate.seconds) {
          purchaseDate = new Date(pData.purchaseDate.seconds * 1000)
        }
      }

      purchases.push({
        id: pDoc.id,
        transactionId: pData.transactionId || pDoc.id,
        email: pData.email || '',
        amountPaid: Number(pData.amountPaid) || 0,
        couponUsed: pData.couponUsed || '',
        subscriptionType: pData.subscriptionType || '',
        purchaseDate: purchaseDate,
      })
    })

    console.log(`Processed ${purchases.length} purchases`)

    // Process restaurants
    const restaurants = []
    restaurantsSnap.forEach((doc) => {
      restaurants.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    // Process members
    const members = []
    const emailToName = {}
    membersSnap.forEach((doc) => {
      const data = doc.data() || {}
      members.push({
        id: doc.id,
        ...data,
      })
      if (data.email) {
        emailToName[data.email] = data.name || data.email
      }
    })

    // Process referrals
    const referrals = []
    referralsSnap.forEach((doc) => {
      referrals.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    console.log("Analytics data summary:")
    console.log("- Total vouchers:", vouchers.length)
    console.log("- Total redemptions:", allRedemptions.length)
    console.log("- Total restaurants:", restaurants.length)
    console.log("- Total members:", members.length)
    console.log("- Total referrals:", referrals.length)
    console.log("- Total purchases:", purchases.length)

    return {
      vouchers,
      allRedemptions,
      restaurants,
      members,
      referrals,
      purchases,
      emailToName,
      avgOrderValue,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    throw error
  }
}

/**
 * Calculate revenue from a redemption
 */
function calculateRedemptionRevenue(redemption, avgOrderValue) {
  const voucherType = redemption.voucherData.voucherType || ""
  const value = redemption.voucherData.valueOfSavings ?? 0

  let discount = 0
  if (voucherType === "Percentage Discount") {
    discount = (avgOrderValue * value) / 100
  } else if (
    voucherType === "Fixed Amount Discount" ||
    voucherType === "Cash Voucher"
  ) {
    discount = Number(value) || 0
  }

  // Revenue = Order value (discount represents what customer saved)
  // Profit = Revenue - expenses (we'll estimate expenses as 30% of revenue)
  const revenue = avgOrderValue
  const expense = revenue * 0.3
  const profit = revenue - expense

  return {
    revenue,
    expense,
    profit,
    discount,
  }
}

/**
 * Calculate revenue from a purchase
 */
function calculatePurchaseRevenue(purchase) {
  // Use the actual amountPaid from the purchase
  const revenue = purchase.amountPaid || 0
  const expense = revenue * 0.3 // Estimate expenses as 30% of revenue
  const profit = revenue - expense

  return {
    revenue,
    expense,
    profit,
  }
}

/**
 * Calculate total metrics
 */
export function calculateTotalMetrics(data) {
  const { allRedemptions, restaurants, members, purchases, avgOrderValue } = data

  let totalRevenue = 0
  let totalExpense = 0
  let totalProfit = 0

  // Add revenue from redemptions
  allRedemptions.forEach((redemption) => {
    const calc = calculateRedemptionRevenue(redemption, avgOrderValue)
    totalRevenue += calc.revenue
    totalExpense += calc.expense
    totalProfit += calc.profit
  })

  // Add revenue from purchases
  purchases.forEach((purchase) => {
    const calc = calculatePurchaseRevenue(purchase)
    totalRevenue += calc.revenue
    totalExpense += calc.expense
    totalProfit += calc.profit
  })

  // Calculate weekly trends (compare last 7 days vs previous 7 days)
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const lastWeekRedemptions = allRedemptions.filter(
    (r) => r.redeemedAt >= sevenDaysAgo
  )
  const previousWeekRedemptions = allRedemptions.filter(
    (r) => r.redeemedAt >= fourteenDaysAgo && r.redeemedAt < sevenDaysAgo
  )

  // Include purchases in trend calculation
  const lastWeekPurchases = purchases.filter(
    (p) => p.purchaseDate >= sevenDaysAgo
  )
  const previousWeekPurchases = purchases.filter(
    (p) => p.purchaseDate >= fourteenDaysAgo && p.purchaseDate < sevenDaysAgo
  )

  let lastWeekRevenue = 0
  let previousWeekRevenue = 0

  lastWeekRedemptions.forEach((r) => {
    lastWeekRevenue += calculateRedemptionRevenue(r, avgOrderValue).revenue
  })
  previousWeekRedemptions.forEach((r) => {
    previousWeekRevenue += calculateRedemptionRevenue(r, avgOrderValue).revenue
  })

  // Add purchase revenue
  lastWeekPurchases.forEach((p) => {
    lastWeekRevenue += calculatePurchaseRevenue(p).revenue
  })
  previousWeekPurchases.forEach((p) => {
    previousWeekRevenue += calculatePurchaseRevenue(p).revenue
  })

  const revenueTrend =
    previousWeekRevenue > 0
      ? ((lastWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100
      : 0

  const profitTrend = revenueTrend // Simplified: profit trend follows revenue trend

  return {
    totalRevenue: totalRevenue.toFixed(2),
    totalProfit: totalProfit.toFixed(2),
    totalRestaurants: restaurants.length,
    totalMembers: members.length,
    revenueTrend: revenueTrend.toFixed(2),
    profitTrend: profitTrend.toFixed(2),
    totalExpense: totalExpense.toFixed(2),
  }
}

/**
 * Calculate monthly revenue data for the chart
 */
export function calculateMonthlyRevenue(data) {
  const { allRedemptions, purchases, avgOrderValue } = data

  // Group redemptions by month
  const monthlyData = {}
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Add revenue from redemptions
  allRedemptions.forEach((redemption) => {
    const date = redemption.redeemedAt
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthName = monthNames[date.getMonth()]

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthName,
        year: date.getFullYear(),
        revenue: 0,
        count: 0,
      }
    }

    const calc = calculateRedemptionRevenue(redemption, avgOrderValue)
    monthlyData[monthKey].revenue += calc.revenue
    monthlyData[monthKey].count += 1
  })

  // Add revenue from purchases
  purchases.forEach((purchase) => {
    const date = purchase.purchaseDate
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthName = monthNames[date.getMonth()]

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthName,
        year: date.getFullYear(),
        revenue: 0,
        count: 0,
      }
    }

    const calc = calculatePurchaseRevenue(purchase)
    monthlyData[monthKey].revenue += calc.revenue
    monthlyData[monthKey].count += 1
  })

  // Convert to array and sort by date
  const chartData = Object.entries(monthlyData)
    .map(([key, value]) => ({
      ...value,
      revenue: Math.round(value.revenue),
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    })

  // Get last 10 months
  return chartData.slice(-10)
}

/**
 * Calculate monthly expense, income, and profit
 */
export function calculateMonthlyMetrics(data) {
  const { allRedemptions, purchases, avgOrderValue } = data

  // Get current month's data
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthRedemptions = allRedemptions.filter((r) => {
    const date = r.redeemedAt
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  // Include current month purchases
  const currentMonthPurchases = purchases.filter((p) => {
    const date = p.purchaseDate
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  let monthlyRevenue = 0
  let monthlyExpense = 0
  let monthlyProfit = 0

  currentMonthRedemptions.forEach((redemption) => {
    const calc = calculateRedemptionRevenue(redemption, avgOrderValue)
    monthlyRevenue += calc.revenue
    monthlyExpense += calc.expense
    monthlyProfit += calc.profit
  })

  // Add purchase revenue
  currentMonthPurchases.forEach((purchase) => {
    const calc = calculatePurchaseRevenue(purchase)
    monthlyRevenue += calc.revenue
    monthlyExpense += calc.expense
    monthlyProfit += calc.profit
  })

  // Calculate average revenue
  const monthlyData = calculateMonthlyRevenue(data)
  const avgRevenue =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, m) => sum + m.revenue, 0) / monthlyData.length
      : 0

  // Calculate trends (compare with last month)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const lastMonthRedemptions = allRedemptions.filter((r) => {
    const date = r.redeemedAt
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
  })

  let lastMonthRevenue = 0
  lastMonthRedemptions.forEach((r) => {
    lastMonthRevenue += calculateRedemptionRevenue(r, avgOrderValue).revenue
  })

  const monthlyTrend =
    lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

  console.log("Monthly metrics calculation:")
  console.log("- Current month redemptions:", currentMonthRedemptions.length)
  console.log("- Last month redemptions:", lastMonthRedemptions.length)
  console.log("- Monthly revenue:", monthlyRevenue)
  console.log("- Last month revenue:", lastMonthRevenue)
  console.log("- Monthly trend:", monthlyTrend)

  return {
    averageRevenue: avgRevenue.toFixed(2),
    monthlyExpense: monthlyExpense.toFixed(2),
    monthlyIncome: monthlyRevenue.toFixed(2),
    monthlyProfit: monthlyProfit.toFixed(2),
    monthlyTrend: monthlyTrend.toFixed(2),
  }
}

/**
 * Calculate earned vouchers data
 */
export function calculateEarnedVouchers(data) {
  const { allRedemptions } = data

  // Group by period (last 5 months)
  const now = new Date()
  const monthlyEarned = {}

  for (let i = 4; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    monthlyEarned[key] = {
      period: 5 - i,
      earned: 0,
    }
  }

  allRedemptions.forEach((redemption) => {
    const date = redemption.redeemedAt
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (monthlyEarned[key]) {
      monthlyEarned[key].earned += 1
    }
  })

  const chartData = Object.values(monthlyEarned)
  const totalEarned = allRedemptions.length

  // Calculate growth
  const currentMonth = chartData[chartData.length - 1]?.earned || 0
  const previousMonth = chartData[chartData.length - 2]?.earned || 0
  const changeAmount = currentMonth - previousMonth
  const changePercentage =
    previousMonth > 0 ? Math.abs((changeAmount / previousMonth) * 100) : 0
  const growthPercentage =
    chartData.length > 1
      ? ((currentMonth - chartData[0].earned) / (chartData[0].earned || 1)) * 100
      : 0

  return {
    data: chartData,
    totalEarned,
    growthPercentage: Math.round(growthPercentage),
    changeAmount: Math.abs(changeAmount),
    changePercentage: Math.round(changePercentage),
  }
}

/**
 * Get top customers by spending
 */
export function getTopCustomers(data) {
  const { allRedemptions, purchases, emailToName, avgOrderValue } = data

  // Aggregate by user
  const userStats = {}

  // Add redemption spending
  allRedemptions.forEach((redemption) => {
    const email = redemption.userEmail
    if (!email) return

    if (!userStats[email]) {
      userStats[email] = {
        email,
        name: emailToName[email] || email.split("@")[0],
        orders: 0,
        totalSpent: 0,
        totalDiscount: 0,
      }
    }

    const calc = calculateRedemptionRevenue(redemption, avgOrderValue)
    userStats[email].orders += 1
    userStats[email].totalSpent += calc.revenue
    userStats[email].totalDiscount += calc.discount
  })

  // Add purchase spending
  purchases.forEach((purchase) => {
    const email = purchase.email
    if (!email) return

    if (!userStats[email]) {
      userStats[email] = {
        email,
        name: emailToName[email] || email.split("@")[0],
        orders: 0,
        totalSpent: 0,
        totalDiscount: 0,
      }
    }

    const calc = calculatePurchaseRevenue(purchase)
    userStats[email].orders += 1
    userStats[email].totalSpent += calc.revenue
  })

  // Convert to array and sort by total spent
  const customers = Object.values(userStats)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map((customer, index) => ({
      rank: index + 1,
      name: customer.name,
      email: customer.email,
      totalSpent: `$${customer.totalSpent.toFixed(2)}`,
      orders: customer.orders,
    }))

  return customers
}

/**
 * Get recent voucher redemptions and purchases
 */
export function getRecentRedemptions(data) {
  const { allRedemptions, purchases, emailToName } = data

  // Map redemptions to display format
  const redemptionItems = allRedemptions.map((redemption) => ({
    type: 'redemption',
    id: redemption.voucherId || 'unknown',
    voucherCode: redemption.voucherData.voucherId || redemption.voucherId || 'N/A',
    title: redemption.voucherData.title || "Unknown Voucher",
    restaurant: redemption.voucherData.restaurantEmail || "Unknown Restaurant",
    user: emailToName[redemption.userEmail] || redemption.userEmail || "Unknown User",
    userEmail: redemption.userEmail,
    date: redemption.redeemedAt,
    amount: 0,
    subscriptionType: null,
  }))

  // Map purchases to display format
  const purchaseItems = purchases.map((purchase) => ({
    type: 'purchase',
    id: purchase.id || purchase.transactionId,
    voucherCode: purchase.couponUsed || 'Direct Purchase',
    title: `Subscription: ${purchase.subscriptionType || 'Unknown'}`,
    restaurant: 'N/A',
    user: emailToName[purchase.email] || purchase.email || "Unknown User",
    userEmail: purchase.email,
    date: purchase.purchaseDate,
    amount: purchase.amountPaid || 0,
    subscriptionType: purchase.subscriptionType,
  }))

  // Combine and sort by date
  const allItems = [...redemptionItems, ...purchaseItems]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5)
    .map((item) => ({
      voucherCode: item.voucherCode,
      title: item.title,
      restaurant: item.restaurant,
      user: item.user,
      redeemedAt: item.date,
      amount: item.amount,
      type: item.type,
    }))

  return allItems
}

/**
 * Calculate customer status (active vs inactive)
 */
export function calculateCustomerStatus(data) {
  const { members, allRedemptions, purchases } = data

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Get emails of users who redeemed in last 30 days
  const activeEmails = new Set()
  allRedemptions.forEach((r) => {
    if (r.redeemedAt >= thirtyDaysAgo && r.userEmail) {
      activeEmails.add(r.userEmail)
    }
  })

  // Get emails of users who made purchases in last 30 days
  purchases.forEach((p) => {
    if (p.purchaseDate >= thirtyDaysAgo && p.email) {
      activeEmails.add(p.email)
    }
  })

  const activeCount = activeEmails.size
  const inactiveCount = members.length - activeCount

  return {
    active: activeCount,
    inactive: Math.max(0, inactiveCount),
  }
}

/**
 * Calculate total customers growth over time
 */
export function calculateCustomersGrowth(data) {
  const { members } = data

  // Group members by month of joining
  const monthlyGrowth = {}
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  members.forEach((member) => {
    let joinDate
    if (member.timestamp?.toDate) {
      joinDate = member.timestamp.toDate()
    } else if (member.createdAt?.seconds) {
      joinDate = new Date(member.createdAt.seconds * 1000)
    } else {
      joinDate = new Date() // Default to now if no date available
    }

    const monthKey = `${joinDate.getFullYear()}-${joinDate.getMonth()}`
    const monthName = monthNames[joinDate.getMonth()]

    if (!monthlyGrowth[monthKey]) {
      monthlyGrowth[monthKey] = {
        month: monthName,
        year: joinDate.getFullYear(),
        customers: 0,
      }
    }

    monthlyGrowth[monthKey].customers += 1
  })

  // Convert to array and sort
  let chartData = Object.entries(monthlyGrowth)
    .map(([key, value]) => value)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    })

  // Calculate cumulative total
  let cumulative = 0
  chartData = chartData.map((item) => {
    cumulative += item.customers
    return {
      month: item.month,
      customers: cumulative,
    }
  })

  // Get last 10 months
  return chartData.slice(-10)
}

