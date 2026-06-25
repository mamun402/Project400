import { useContext, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";

import AddAlumni from "./AddAlumni";
import AddBlog from "./AddBlog";
import AddEvent from "./AddEvent";
import AddExecutiveCouncil from "./AddExecutiveCouncil";
import AddGalleryImage from "./AddImage";
import AddNotice from "./AddNotice";
import ApproveUser from "./ApproveUser";
import Blogs from "./BlogSection";
import ExecutiveCommittee from "./ExecutiveCommittee";
import ViewGallery from "./GallerySection";
import ManageUsers from "./ManageUsers";
import Notice from "./Notices";
import StudentList from "./StudentList";
import EventSection from "./ViewEvent";
// import About from "./AboutSection";
// import Gallery from "./GallerySection";
// import OurTeam from "./OurTeam";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("About"); // Default subtab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let navigate = useNavigate();
  const [login, setLogin, checkadminlogin, setCheckAdminLogin] =
    useContext(userContext);

  const tabs = [
    { name: "User Approval", icon: "✅" },
    { name: "Executive Committee", icon: "🧑‍🤝‍🧑" },
    { name: "Member List", icon: "	🏛️" },
    { name: "Event", icon: "📅" },
    { name: "Blogs", icon: "📝" },
    { name: "Notice", icon: "📢" },
    { name: "Gallery", icon: "🖼️" },
    { name: "Add Alumni", icon: "➕🎓" },
    { name: "Add Blogs", icon: "➕📝" },
    { name: "Add Notices", icon: "➕📜" },
    { name: "Add Events", icon: "➕ 📅" },
    { name: "Add Executive Council", icon: "➕🧑‍🤝‍🧑" },

    { name: "Add Gallery Image", icon: "➕🖼️" },
    { name: "Manage Users", icon: "⚙️" },
  ];

  const aboutSubTabs = [
    // { name: "About", component: <About /> },
    // ,
    // // { name: "Mission", component: <AddMission /> },
    // { name: "Our Team", component: <OurTeam /> },
  ];

  const logout = () => {
    localStorage.clear();
    setCheckAdminLogin(false);
    setLogin(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "absolute inset-0 z-50 bg-gray-800" : "hidden"
        } md:block md:relative md:w-64 bg-gray-800 text-gray-100 h-screen overflow-y-auto`}
      >
        <div className="p-6 text-xl font-bold text-center border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="mt-4">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.name}>
                <div
                  className={`p-4 cursor-pointer hover:bg-gray-700 ${
                    activeTab === tab.name ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setIsSidebarOpen(false);
                    if (tab.hasSubTabs) setActiveSubTab("About"); // Reset to first subtab
                  }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </div>
                {tab.hasSubTabs && activeTab === "Library Overview" && (
                  <ul className="ml-6 mt-2 border-l border-gray-600">
                    {aboutSubTabs.map((subTab) => (
                      <li
                        key={subTab.name}
                        className={`p-3 cursor-pointer hover:bg-gray-700 ${
                          activeSubTab === subTab.name ? "bg-gray-700" : ""
                        }`}
                        onClick={() => setActiveSubTab(subTab.name)}
                      >
                        {subTab.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 w-full mt-24"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar (Mobile) */}
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          <button
            className="text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="text-lg font-semibold">{activeTab}</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {activeTab}{" "}
              {activeTab === "Library Overview" ? ` - ${activeSubTab}` : ""}{" "}
              Section
            </h2>
          </div>
          <div>
            {/* Main Sections */}
            {/* {activeTab === "Dashboard" && <AdminDashboard />}
            {activeTab === "Users" && <ViewUser />}
            {activeTab === "Borrowed Books" && <BorrowedBooks />}
            {activeTab === "Received Books" && <Received />}
            {activeTab === "Receive Donation" && <ReciveDonation />}
            {activeTab === "User Approval" && <UserApproval />}
            {activeTab === "Book Request" && <ApproveUser />}
            {activeTab === "Accepted Payment" && <AcceptedPayment />}
            {activeTab === "Books" && <Books />}
           
            {activeTab === "Setting" && <Setting />}
        
        
            {activeTab === "Add Books" && <AddBook />}
         
          
           
         
           
            {activeTab === "Mission" && <AddMission />} */}
            {activeTab === "Add Notices" && <AddNotice />}
            {activeTab === "Add Events" && <AddEvent />}
            {activeTab === "Add Blogs" && <AddBlog />}
            {activeTab === "Add Gallery Image" && <AddGalleryImage />}
            {activeTab === "Event" && <EventSection />}
            {activeTab === "Add Alumni" && <AddAlumni />}
            {activeTab === "Blogs" && <Blogs />}
            {activeTab === "Notice" && <Notice />}
            {activeTab === "Gallery" && <ViewGallery />}
            {activeTab === "Member List" && <StudentList />}
            {activeTab === "Executive Committee" && <ExecutiveCommittee />}
            {activeTab === "Add Executive Council" && <AddExecutiveCouncil />}
            {activeTab === "User Approval" && <ApproveUser />}
            {activeTab === "Manage Users" && <ManageUsers />}
            {/* Library Overview with Subtabs */}
            {activeTab === "Library Overview" &&
              aboutSubTabs.find((subTab) => subTab.name === activeSubTab)
                ?.component}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
