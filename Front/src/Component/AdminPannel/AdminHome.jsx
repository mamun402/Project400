import { useContext, useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaBlog,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
  FaHome,
  FaImage,
  FaTimes,
  FaUserCheck,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";

import AddAlumni from "./AddAlumni";
import AlumniManagement from "./AlumniManagement";
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

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "Dashboard";
    return window.localStorage.getItem("adminActiveTab") || "Dashboard";
  });
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === "undefined") return "Overview";
    return window.localStorage.getItem("adminActiveSection") || "Overview";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContentModal, setActiveContentModal] = useState(null);
  const navigate = useNavigate();
  const { setLogin, setCheckAdminLogin } = useContext(userContext);

  const tabs = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      description: "Overview and quick actions",
      sections: [{ name: "Overview" }],
    },
    {
      name: "Users",
      icon: <FaUsers />,
      description: "Approvals, members and roles",
      sections: [
        { name: "Approvals" },
        { name: "Members" },
        { name: "Permissions" },
      ],
    },
    {
      name: "Alumni",
      icon: <FaGraduationCap />,
      description: "Manage and add alumni",
      sections: [{ name: "Manage Alumni" }, { name: "Add Alumni" }],
    },
    {
      name: "Content",
      icon: <FaBlog />,
      description: "Blogs, notices, events, gallery and committee",
      sections: [
        { name: "Blogs" },
        { name: "Notices" },
        { name: "Events" },
        { name: "Gallery" },
        { name: "Executive Committee" },
      ],
    },
  ];

  const quickActions = [
    {
      title: "User Approvals",
      description: "Review pending member requests",
      tab: "Users",
      section: "Approvals",
      icon: <FaUserCheck className="text-indigo-600" />,
    },
    {
      title: "Add Alumni",
      description: "Add a new alumni profile",
      tab: "Alumni",
      section: "Add Alumni",
      icon: <FaGraduationCap className="text-emerald-600" />,
    },
    {
      title: "Manage Content",
      description: "Create and update site updates",
      tab: "Content",
      section: "Blogs",
      icon: <FaBook className="text-amber-600" />,
    },
  ];

  const handleTabChange = (tabName, sectionName = null) => {
    setActiveTab(tabName);
    setActiveSection(sectionName || tabs.find((tab) => tab.name === tabName)?.sections?.[0]?.name || "Overview");
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("adminActiveTab", activeTab);
      window.localStorage.setItem("adminActiveSection", activeSection);
    }
  }, [activeTab, activeSection]);

  const logout = () => {
    localStorage.clear();
    setCheckAdminLogin(false);
    setLogin(false);
    navigate("/", { replace: true });
  };

  const renderContentSection = ({ title, description, sectionName, listComponent, formComponent, buttonLabel }) => (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setActiveContentModal(sectionName)}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          {buttonLabel}
        </button>
      </div>

      <div>{listComponent}</div>

      {activeContentModal === sectionName ? (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/50 p-3 sm:p-6">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveContentModal(null)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-800"
              aria-label="Close form"
            >
              <FaTimes />
            </button>
            <div className="p-4 sm:p-6">{formComponent}</div>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderModule = () => {
    if (activeTab === "Users") {
      if (activeSection === "Approvals") return <ApproveUser />;
      if (activeSection === "Members") return <StudentList />;
      return <ManageUsers />;
    }

    if (activeTab === "Alumni") {
      if (activeSection === "Add Alumni") return <AddAlumni />;
      return <AlumniManagement />;
    }

    if (activeTab === "Content") {
      switch (activeSection) {
        case "Blogs":
          return renderContentSection({
            title: "Blog Management",
            description: "Review existing posts and add a new blog entry.",
            sectionName: "blogs",
            buttonLabel: "Add Blog",
            listComponent: <Blogs />,
            formComponent: <AddBlog />,
          });
        case "Notices":
          return renderContentSection({
            title: "Notice Management",
            description: "Browse current notices and add a new announcement.",
            sectionName: "notices",
            buttonLabel: "Add Notice",
            listComponent: <Notice />,
            formComponent: <AddNotice />,
          });
        case "Events":
          return renderContentSection({
            title: "Event Management",
            description: "Manage upcoming events and add new ones quickly.",
            sectionName: "events",
            buttonLabel: "Add Event",
            listComponent: <EventSection />,
            formComponent: <AddEvent />,
          });
        case "Gallery":
          return renderContentSection({
            title: "Gallery Management",
            description: "View uploaded photos and add fresh gallery items.",
            sectionName: "gallery",
            buttonLabel: "Add Gallery Image",
            listComponent: <ViewGallery />,
            formComponent: <AddGalleryImage />,
          });
        case "Executive Committee":
          return renderContentSection({
            title: "Executive Committee",
            description: "Manage members and add a new executive committee profile.",
            sectionName: "executive",
            buttonLabel: "Add Member",
            listComponent: <ExecutiveCommittee />,
            formComponent: <AddExecutiveCouncil />,
          });
        default:
          return renderContentSection({
            title: "Blog Management",
            description: "Review existing posts and add a new blog entry.",
            sectionName: "blogs",
            buttonLabel: "Add Blog",
            listComponent: <Blogs />,
            formComponent: <AddBlog />,
          });
      }
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={() => handleTabChange(action.tab, action.section)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{action.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside
          className={`${
            isSidebarOpen ? "fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-sm md:static" : "hidden"
          } md:flex md:w-72 md:flex-col`}
        >
          <div className="h-full w-full bg-slate-900 p-6 text-slate-100 md:rounded-r-3xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-5">
              <div>
                <h2 className="text-xl font-semibold">Admin Panel</h2>
              </div>
              <button className="md:hidden" type="button" onClick={() => setIsSidebarOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <nav className="mt-6 space-y-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <div key={tab.name}>
                    <button
                      type="button"
                      onClick={() => handleTabChange(tab.name)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                        isActive ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-800/70 text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{tab.icon}</span>
                        <div>
                          <p className="font-medium">{tab.name}</p>
                          <p className={`text-xs ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </button>

                    {isActive && tab.sections.length > 1 && (
                      <div className="mt-2 ml-3 space-y-1">
                        {tab.sections.map((section) => {
                          const selected = activeSection === section.name;
                          return (
                            <button
                              key={section.name}
                              type="button"
                              onClick={() => handleTabChange(tab.name, section.name)}
                              className={`flex w-full items-center rounded-xl px-3 py-2 text-sm transition ${
                                selected ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {section.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="mt-8 w-full rounded-2xl bg-rose-600 px-4 py-3 font-medium text-white transition hover:bg-rose-500"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden" type="button" onClick={() => setIsSidebarOpen(true)}>
                  {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{activeTab}</p>
                  <h1 className="text-xl font-semibold text-slate-900">{activeSection}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <FaBell />
                <span>Admin</span>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{activeTab}</h2>
                <p className="text-sm text-slate-500">{tabs.find((tab) => tab.name === activeTab)?.description}</p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                {activeSection}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
              {renderModule()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
