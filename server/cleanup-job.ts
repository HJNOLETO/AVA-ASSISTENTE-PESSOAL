import { cleanupExpiredDocuments, cleanupOldMemories, cleanupCompletedTasks, getAllUsers } from "./db";

const CLEANUP_INTERVAL_HOURS = 24;

export function startCleanupJob() {
  console.log(`[CleanupJob] Starting cleanup job (interval: ${CLEANUP_INTERVAL_HOURS}h)`);
  
  const runCleanup = async () => {
    try {
      console.log("[CleanupJob] Running cleanup...");
      
      const users = await getAllUsers();
      
      for (const user of users) {
        try {
          const expiredDocs = await cleanupExpiredDocuments(user.id);
          const oldMemories = await cleanupOldMemories(user.id);
          const oldTasks = await cleanupCompletedTasks(user.id, 30);
          
          const total = expiredDocs.deleted + oldMemories.archived + oldTasks.deleted;
          if (total > 0) {
            console.log(`[CleanupJob] User ${user.id}: ${expiredDocs.deleted} docs, ${oldMemories.archived} memories, ${oldTasks.deleted} tasks cleaned`);
          }
        } catch (userError) {
          console.warn(`[CleanupJob] Error cleaning user ${user.id}:`, userError);
        }
      }
      
      console.log("[CleanupJob] Cleanup completed");
    } catch (error) {
      console.error("[CleanupJob] Cleanup failed:", error);
    }
  };
  
  runCleanup();
  
  setInterval(runCleanup, CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);
}