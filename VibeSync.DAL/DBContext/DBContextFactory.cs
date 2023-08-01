namespace VibeSync.DAL.DBContext
{
    public class DBContextFactory : IDBContextFactory
    {
        public VibeSyncContext GetDBContext()
        {
            return new VibeSyncContext();
        }
    }
}
