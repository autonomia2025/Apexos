import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, AlignLeft, Shield, Users } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { createCalendarEvent } from '../../../lib/db';
import { useActiveUser } from '../../../hooks/useActiveUser';
import { EVENT_TYPE_CONFIG, EventType } from '../../../lib/calendarUtils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  color: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  color,
}) => {
  const activeUser = useActiveUser();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('reunion');
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [visibility, setVisibility] = useState<'personal' | 'shared'>('shared');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      await createCalendarEvent({
        created_by: activeUser.user.id,
        title,
        description: description || undefined,
        event_type: type,
        start_date: date,
        start_time: allDay ? undefined : startTime,
        end_time: allDay ? undefined : endTime,
        all_day: allDay,
        visibility,
        location: location || undefined,
      });
      onClose();
      // Reset form
      setTitle('');
      setType('reunion');
      setAllDay(true);
      setLocation('');
      setDescription('');
    } catch (err) {
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backgroundColor: 'rgba(45, 26, 14, 0.4)',
          backdropFilter: 'blur(8px)',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            <GlassCard style={{ padding: '24px', position: 'relative' }}>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#b08878', transition: 'color 0.2s',
                }}
              >
                <X size={24} />
              </button>

              <h2 style={{
                fontFamily: '"Outfit", sans-serif', fontSize: '24px',
                fontWeight: 800, color: '#2d1a0e', margin: '0 0 24px',
              }}>
                Nuevo Evento
              </h2>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Title */}
                <div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Título del evento"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '1.5px solid #e8d5c8', background: '#fdf6f0',
                      fontFamily: '"Outfit", sans-serif', fontSize: '18px',
                      fontWeight: 600, color: '#2d1a0e', outline: 'none',
                    }}
                  />
                </div>

                {/* Event Types */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                  {(['reunion', 'recordatorio', 'examen', 'cita', 'viaje', 'otro'] as EventType[]).map((t) => {
                    const config = EVENT_TYPE_CONFIG[t];
                    const isSelected = type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        style={{
                          padding: '8px 14px', borderRadius: '100px',
                          border: `1.5px solid ${isSelected ? config.color : '#e8d5c8'}`,
                          background: isSelected ? config.bg : '#fff',
                          color: isSelected ? config.color : '#b08878',
                          fontFamily: '"Outfit", sans-serif', fontSize: '13px',
                          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {config.emoji} {config.label}
                      </button>
                    );
                  })}
                </div>

                {/* Date & Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={18} color="#b08878" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: '10px',
                        border: '1px solid #e8d5c8', background: '#fff',
                        fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                        color: '#2d1a0e', outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '30px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={allDay}
                        onChange={(e) => setAllDay(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: color }}
                      />
                      <span style={{ fontSize: '14px', color: '#7a4a36', fontWeight: 600 }}>Todo el día</span>
                    </label>
                  </div>

                  {!allDay && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '30px' }}>
                      <Clock size={16} color="#b08878" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{
                          width: '100px', padding: '8px 12px', borderRadius: '10px',
                          border: '1px solid #e8d5c8', background: '#fff',
                          fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                        }}
                      />
                      <span style={{ color: '#b08878' }}>-</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{
                          width: '100px', padding: '8px 12px', borderRadius: '10px',
                          border: '1px solid #e8d5c8', background: '#fff',
                          fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Visibility */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setVisibility('personal')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px',
                      border: `1.5px solid ${visibility === 'personal' ? color : '#e8d5c8'}`,
                      background: visibility === 'personal' ? `${color}10` : '#fff',
                      color: visibility === 'personal' ? color : '#b08878',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Shield size={16} /> Solo yo
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('shared')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px',
                      border: `1.5px solid ${visibility === 'shared' ? color : '#e8d5c8'}`,
                      background: visibility === 'shared' ? `${color}10` : '#fff',
                      color: visibility === 'shared' ? color : '#b08878',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Users size={16} /> Compartido
                  </button>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} color="#b08878" />
                  <input
                    type="text"
                    placeholder="Ubicación"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: '10px',
                      border: '1px solid #e8d5c8', background: '#fff',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: '#2d1a0e', outline: 'none',
                    }}
                  />
                </div>

                {/* Description */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlignLeft size={18} color="#b08878" style={{ marginTop: '10px' }} />
                  <textarea
                    placeholder="Notas o descripción..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: '10px',
                      border: '1px solid #e8d5c8', background: '#fff',
                      fontFamily: '"Outfit", sans-serif', fontSize: '14px',
                      color: '#2d1a0e', outline: 'none', resize: 'none',
                    }}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={loading || !title}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '14px',
                    background: color, color: '#fff', border: 'none',
                    fontFamily: '"Outfit", sans-serif', fontSize: '16px',
                    fontWeight: 800, cursor: title ? 'pointer' : 'not-allowed',
                    opacity: title ? 1 : 0.6, marginTop: '12px',
                    boxShadow: `0 8px 20px ${color}33`,
                  }}
                >
                  {loading ? 'Guardando...' : 'Crear Evento'}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
