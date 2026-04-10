import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Main.css';

import Archive from '../assets/Archive.svg';
import editLabelsIcon from '../assets/EditLabels.svg';
import menuIcon from '../assets/menu.svg';
import trashIcon from '../assets/trash.svg';
import imageIcon from '../assets/image.svg';
import drawingIcon from '../assets/drawing.svg';
import checkbox from '../assets/checkbox.svg';
import addAlertIcon from '../assets/addAlert.svg';
import palette from '../assets/palette.svg';
import more from '../assets/more.svg';
import collab from '../assets/collab.svg';
import textformat from '../assets/textformat.svg';



// ============================== MANUAL CUSTOM FEATURE COLOR CODING NOTES =====================================
const KEEP_COLORS = [
  { name: 'default', hex: 'transparent' },
  { name: 'red', hex: '#f28b82' },
  { name: 'orange', hex: '#fbbc04' },
  { name: 'yellow', hex: '#fff475' },
  { name: 'green', hex: '#ccff90' },
  { name: 'teal', hex: '#a7ffeb' },
  { name: 'blue', hex: '#cbf0f8' },
  { name: 'darkblue', hex: '#aecbfa' },
  { name: 'purple', hex: '#d7aefb' },
  { name: 'pink', hex: '#fdcfe8' },
  { name: 'brown', hex: '#e6c9a8' },
  { name: 'grey', hex: '#e8eaed' }
];





// === COLOR CODING FEATURE.   COMPONENT ===
const ColorPicker = ({ onSelectColor }) => {
  return (
    <div className="color-picker-popover">
      {KEEP_COLORS.map(c => (
        <button
          key={c.name}
          type="button"
          className={`color-swatch-btn ${c.name === 'default' ? 'color-swatch-default' : ''}`}
          style={{ backgroundColor: c.name === 'default' ? 'transparent' : c.hex }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectColor(c.hex);
          }}
          title={c.name}
        />
      ))}
    </div>
  );
};

// ==============================================================================================

const Main = ({ activeTab }) => {
  const [notes, setNotes] = useState([
    { id: 1, title: '', text: 'Note 1', color: 'transparent', hasReminder: false, reminderAt: '', reminderTriggered: false },

  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  // === COLOR CODING FEATURE STATE ===
  const [noteColor, setNoteColor] = useState('transparent');
  const [showColorPickerFor, setShowColorPickerFor] = useState(null);


  // === REMINDERS FEATURE STATE ===
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderAt, setReminderAt] = useState('');

  // === DRAG AND DROP FUNCTIONALITY STATE ===
  const [draggedNoteId, setDraggedNoteId] = useState(null);

  const containerRef = useRef(null);

  // === REMINDERS FEATURE: PERMISSION ENFORCEMENT & DEFAULTS ===
  const requestNotificationPermission = () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getDefaultReminderIso = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleAddNote = useCallback(() => {
    if (title.trim() || text.trim() || (hasReminder && reminderAt)) {
      setNotes(prevNotes => [{
        id: Date.now(),
        title,
        text,
        color: noteColor,
        hasReminder,
        reminderAt,
        reminderTriggered: false
      }, ...prevNotes]);
      setTitle('');
      setText('');
      setHasReminder(false);
      setReminderAt('');
      setNoteColor('transparent');
    }
    setIsExpanded(false);
  }, [title, text, hasReminder, reminderAt, noteColor]);

  useEffect(() => {
    // === COLOR CODING FEATURE: GLOBAL CLICK DISMISS ===
    const handleGlobalClick = (event) => {
      if (!event.target.closest('.color-picker-wrapper')) {
        setShowColorPickerFor(null);
      }
    };
    if (showColorPickerFor) {
      document.addEventListener('mousedown', handleGlobalClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [showColorPickerFor]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(event.target)) {
        handleAddNote();
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, handleAddNote]);

  // FOR DELETING A NOTE
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // === REMINDERS FEATURE: TOGGLING & FORMATTING ===
  const toggleNoteReminder = (id) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id !== id) return note;
        if (!note.hasReminder) {
          return { ...note, hasReminder: true, reminderAt: note.reminderAt || getDefaultReminderIso(), reminderTriggered: false };
        }
        return { ...note, hasReminder: false, reminderAt: '', reminderTriggered: false };
      })
    );
  };

  // === REMINDERS FEATURE: FORMATTING ===
  const formatReminder = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const sameDay =
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();

    if (sameDay) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }

    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // === DRAG AND DROP FUNCTIONALITY: MOVEMENT HANDLERS ===
  const handleDragStart = (id) => {
    setDraggedNoteId(id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (draggedNoteId === null || draggedNoteId === targetId) return;

    setNotes(prev => {
      const draggedIndex = prev.findIndex(note => note.id === draggedNoteId);
      const targetIndex = prev.findIndex(note => note.id === targetId);
      if (draggedIndex < 0 || targetIndex < 0) return prev;

      const next = [...prev];
      const [movedNote] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, movedNote);
      return next;
    });
    setDraggedNoteId(null);
  };

  const handleDragEnd = () => {
    setDraggedNoteId(null);
  };

  // === REMINDERS FEATURE: BACKGROUND POLLING SYSTEM ===
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = Date.now();
      setNotes(prev =>
        prev.map(note => {
          if (!note.hasReminder || !note.reminderAt || note.reminderTriggered) {
            return note;
          }
          const reminderTime = new Date(note.reminderAt).getTime();
          if (Number.isNaN(reminderTime) || reminderTime > now) {
            return note;
          }

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(note.title || 'Google Keep reminder', {
              body: note.text || 'You have a reminder due now.'
            });
          }

          return { ...note, reminderTriggered: true };
        })
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const dueReminders = notes.filter(note => note.reminderTriggered);
  const visibleNotes =
    activeTab === 'Reminders' ? notes.filter(note => note.hasReminder)
      : activeTab === 'Notes' ? notes
        : [];

  return (
    <main className="main-content">
      {!isExpanded ? (
        <div className="note-input-container" onClick={() => setIsExpanded(true)}>
          <input
            type="text"
            className="note-input-text"
            placeholder="Take a note..."
            readOnly
          />
          <div className="note-input-icons">

            <button className="note-icon-btn" aria-label="Reminders" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
              <img src={checkbox} alt="Reminders" />
            </button>
            <button className="note-icon-btn" aria-label="Labels" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
              <img src={drawingIcon} alt="Labels" />
            </button>
            <button className="note-icon-btn" aria-label="Image" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
              <img src={imageIcon} alt="Image" />
            </button>
          </div>
        </div>
      ) : (
        <div className="note-expanded-container" ref={containerRef} style={{ backgroundColor: noteColor }}>
          <input
            type="text"
            className="note-title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="note-textarea"
            placeholder="Take a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {hasReminder && (
            <div className="note-reminder-chip">
              <img src={addAlertIcon} alt="Reminder" />
              <span>{formatReminder(reminderAt)}</span>
            </div>
          )}

          {/* The expansion of the note intput bar */}
          <div className="note-toolbar">
            <div className="note-input-icons">

              {/* Buttons for the note */}
              <button className="note-icon-btn" aria-label="Image">
                <img src={textformat} alt="Image" />
              </button>

              <button
                className="note-icon-btn"
                aria-label="Palette"
                onClick={(e) => { e.stopPropagation(); setShowColorPickerFor(showColorPickerFor === 'new' ? null : 'new'); }}
              >
                <img src={palette} alt="Palette" />
              </button>

              <button
                className={`note-icon-btn ${hasReminder ? 'active' : ''}`}
                aria-label="Remind me"
                title="Remind me"
                onClick={() => {
                  if (!hasReminder) {
                    requestNotificationPermission();
                    setReminderAt(getDefaultReminderIso());
                    setHasReminder(true);
                    return;
                  }
                  setHasReminder(false);
                  setReminderAt('');
                }}
              >
                <img src={addAlertIcon} alt="Reminder" />
              </button>


              {/* === COLOR CODING FEATURE, NEW NOTE POPOVER === */}
              <div className="color-picker-wrapper">

                {showColorPickerFor === 'new' && (
                  <ColorPicker onSelectColor={(hex) => { setNoteColor(hex); setShowColorPickerFor(null); }} />
                )}
              </div>
              <button className="note-icon-btn" aria-label="Image">
                <img src={collab} alt="Image" />
              </button>
              <button className="note-icon-btn" aria-label="Image">
                <img src={imageIcon} alt="Image" />
              </button>
              <button className="note-icon-btn" aria-label="Archive">
                <img src={Archive} alt="Archive" />
              </button>
              <button className="note-icon-btn" aria-label="Menu">
                <img src={more} alt="Menu" />
              </button>
            </div>
            <button className="close-btn" onClick={handleAddNote}>Close</button>
          </div>
        </div>
      )}

      <div className="notes-grid">
        {visibleNotes.map(note => (
          <div
            key={note.id}
            className={`note-card ${draggedNoteId === note.id ? 'dragging' : ''}`}
            style={{ backgroundColor: note.color }}


            /* === DRAG AND DROP FUNCTIONALITY: CARD TRIGGERS === */
            draggable
            onDragStart={() => handleDragStart(note.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(note.id)}
            onDragEnd={handleDragEnd}
          >
            {note.title && <div className="note-card-title">{note.title}</div>}
            {note.text}
            {note.hasReminder && (
              <div className={`note-reminder-chip ${note.reminderTriggered ? 'due' : ''}`}>
                <img src={addAlertIcon} alt="Reminder" />
                <span>{note.reminderTriggered ? 'Reminder due' : formatReminder(note.reminderAt)}</span>
              </div>
            )}
            <div className="note-card-actions">
              {/* === COLOR CODING FEATURE: EXISTING NOTE POPOVER === */}
              <div className="color-picker-wrapper">
                <button
                  className="note-icon-btn"
                  title="Background options"
                  onClick={(e) => { e.stopPropagation(); setShowColorPickerFor(showColorPickerFor === note.id ? null : note.id); }}
                >
                  <img src={palette} alt="Palette" />
                </button>
                {showColorPickerFor === note.id && (
                  <ColorPicker onSelectColor={(hex) => {
                    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, color: hex } : n));
                    setShowColorPickerFor(null);
                  }} />
                )}
              </div>

              <button className="note-icon-btn" title="Remind me" onClick={() => { if (!note.hasReminder) requestNotificationPermission(); toggleNoteReminder(note.id); }}>
                <img src={addAlertIcon} alt="Reminder" />
              </button>

              <button className="note-icon-btn" title="Collaborator">
                <img src={collab} alt="Collaborator" />
              </button>
              <button className="note-icon-btn" title="Add image">
                <img src={imageIcon} alt="Image" />
              </button>
              <button className="note-icon-btn" title="Archive">
                <img src={Archive} alt="Archive" />
              </button>
              <button className="note-icon-btn" title="Delete note" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>
                <img src={trashIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {dueReminders.length > 0 && <div className="reminder-live-region" aria-live="polite">{dueReminders.length} reminder(s) due</div>}
    </main>
  );
};

export default Main;