namespace VibeSync.DAL.DBContext
{
    public interface IDBContextFactory
    {
        VibeSyncContext GetDBContext();
    }
}
