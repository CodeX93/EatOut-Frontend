// Test Firebase connection
import { db } from "../../../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"

export async function testFirebaseConnection() {
  try {
    console.log("Testing Firebase connection...")
    
    // Test each collection
    const collections = ["voucher", "registeredRestaurants", "members", "referrals"]
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName))
        console.log(`✓ ${collectionName}: ${snapshot.size} documents`)
        
        // Show first document structure if available
        if (snapshot.size > 0) {
          const firstDoc = snapshot.docs[0]
          console.log(`  Sample document from ${collectionName}:`, {
            id: firstDoc.id,
            data: firstDoc.data()
          })
        }
      } catch (error) {
        console.error(`✗ Error accessing ${collectionName}:`, error)
      }
    }
    
    return true
  } catch (error) {
    console.error("Firebase connection test failed:", error)
    return false
  }
}
