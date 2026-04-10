import React from 'react';
import Button from './Button';
import '../styles/Aside.css';

import notesIcon from '../assets/Notes.svg';
import remindersIcon from '../assets/remainder.svg';
import editLabelsIcon from '../assets/EditLabels.svg';
import archiveIcon from '../assets/Archive.svg';
import trashIcon from '../assets/trash.svg';

const Aside = ({ activeTab, onTabChange, isCollapsed }) => {
    const navItems = [
        { name: "Notes", icon: notesIcon },
        { name: "Reminders", icon: remindersIcon },
        { name: "Edit labels", icon: editLabelsIcon },
        { name: "Archive", icon: archiveIcon },
        { name: "Trash", icon: trashIcon },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="nav-items-container">
                {navItems.map((item, index) => (
                    <Button
                        key={index}
                        name={item.name}
                        icon={item.icon}
                        isActive={activeTab === item.name}
                        onClick={() => onTabChange(item.name)}
                    />
                ))}
            </div>
            <div className="sidebar-footer">
                <a href="#">Open-source licenses</a>
            </div>
        </aside>
    );
};

export default Aside;