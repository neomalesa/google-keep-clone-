import Navigation from "./containers/Navigation";
import Aside from "./containers/Aside";
import Main from "./containers/Main";
import { useState } from "react";
import './styles/HomePage.css';

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('Notes');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className="homepage-wrapper">
            <Navigation toggleSidebar={toggleSidebar} />
            <div className="content-wrapper">
                <Aside activeTab={activeTab} onTabChange={setActiveTab} isCollapsed={isSidebarCollapsed} />
                <Main activeTab={activeTab} />
            </div>
        </div>
    )
}
export default HomePage;