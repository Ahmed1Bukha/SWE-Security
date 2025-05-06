
import { createClient } from "@/utils/supabase/server";

// Function to get a user's role by ID
export async function getUserRole(userId: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/GetUserRole?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user role: ${response.status}`);
      }
      
      const data = await response.json();
      return data.role || null;
    } catch (error) {
      console.error("Error in getUserRole:", error);
      return null;
    }
  }
  

