import { useContext } from "react";
import { Navigate} from "react-router-dom";
import UserContext from "../context/UserContext";


function Home() {

    const { user,loading} = useContext(UserContext);
    
    console.log("data from home",user)
      if (!user) {
      return <Navigate to="/" />;
      }


  if(loading){
    return <>
    <h1>Loading...</h1>
    </>
  }


  return (
    
    <div className="flex h-screen bg-gray-50 text-gray-900">
      
      {/* Sidebar - Collapsible on Mobile */}
      

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        
        {/* Top Header */}
        

        {/* Dashboard Body Metrics Container */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-md md:p-8">
            <h2 className="text-2xl font-bold md:text-3xl">Welcome back to Btwits! {user?.username}</h2>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              Your platform metrics are stable. You have 4 pending design reviews and 2 API deployment notifications waiting.
            </p>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Revenue</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">$24,500</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">+12%</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Sessions</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">1,482</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">+4%</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Conversion Rate</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">2.84%</span>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md">-0.5%</span>
              </div>
            </div>

          </div>

          {/* Recent Activity Table Asset */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="font-bold">Recent Workspace Updates</h3>
            </div>
            <div className="p-6 text-center text-sm text-gray-500">
              No recent critical system log events to show. Everything is running smoothly.
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
export default Home