import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  X,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ModuleHeader } from '../components/layout/ModuleHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { AddEventModal } from '../components/modules/calendar/AddEventModal';
import { useCouple } from '../hooks/useCouple';
import { useActiveUser } from '../hooks/useActiveUser';
import { getActivityForDateRange, deleteCalendarEvent } from '../lib/db';
import { 
  CalendarEvent, 
  EventType, 
  EVENT_TYPE_CONFIG, 
  transformActivityToEvents, 
  groupEventsByDate,
  getWeekDates,
  getMonthDates
} from '../lib/calendarUtils';
import { getTodayChile } from '../lib/utils';

const EventRow = ({ event, onDelete }: { 
  event: CalendarEvent; 
  onDelete?: () => void;
}) => {
  const config = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.otro;
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', 
      gap: '12px', padding: '12px', 
      background: config.bg, borderRadius: '12px',
      border: `1px solid ${config.color}20`,
      transition: 'transform 0.2s',
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>
        {config.emoji}
      </span>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ 
          margin: 0, fontSize: '14px', fontWeight: 700, 
          color: '#2d1a0e', overflow: 'hidden', 
          textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
        }}>
          {event.title}
        </p>
        <div style={{ 
          display: 'flex', gap: '8px', 
          alignItems: 'center', marginTop: '2px',
          flexWrap: 'wrap'
        }}>
          {event.time && (
            <span style={{ fontSize: '11px', color: '#b08878', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={10} /> {event.time}
            </span>
          )}
          {event.userName && (
            <span style={{ 
              fontSize: '11px', fontWeight: 800, 
              color: event.userColor, textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {event.userName}
            </span>
          )}
          {event.description && (
            <span style={{ fontSize: '11px', color: '#b08878' }}>
              · {event.description}
            </span>
          )}
          {event.location && (
            <span style={{ fontSize: '11px', color: '#b08878', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={10} /> {event.location}
            </span>
          )}
          {event.visibility === 'personal' && (
            <span style={{ 
              fontSize: '10px', color: '#b08878', 
              background: 'rgba(0,0,0,0.06)', padding: '1px 6px', 
              borderRadius: '100px', fontWeight: 700
            }}>
              PRIVADO
            </span>
          )}
        </div>
      </div>
      
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ 
            background: 'transparent', border: 'none', 
            cursor: 'pointer', color: 'rgba(193,96,58,0.4)',
            padding: '4px', flexShrink: 0, transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#c94040'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(193,96,58,0.4)'}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

const EventCard = ({ event, onDelete }: {
  event: CalendarEvent;
  onDelete?: () => void;
}) => {
  const config = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.otro;
  return (
    <div style={{ 
      padding: '6px 8px',
      background: config.bg,
      borderLeft: `3px solid ${event.userColor || config.color}`,
      borderRadius: '0 8px 8px 0',
      marginBottom: '4px', position: 'relative',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <p style={{ 
        margin: 0, fontSize: '11px', fontWeight: 700, 
        color: '#2d1a0e', overflow: 'hidden',
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', lineHeight: 1.2
      }}>
        {config.emoji} {event.title}
      </p>
      
      {(event.time || event.description) && (
        <p style={{ 
          margin: '2px 0 0', fontSize: '9px', 
          color: '#b08878', fontWeight: 600
        }}>
          {event.time}
          {event.time && event.description && ' · '}
          {event.description}
        </p>
      )}
      
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ 
            position: 'absolute', top: '2px', right: '2px',
            background: 'transparent', border: 'none', 
            cursor: 'pointer', color: 'rgba(193,96,58,0.3)',
            padding: '2px' 
          }}
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  const { isMobile, users } = useCouple();
  const activeUser = useActiveUser();
  const [view, setView] = useState<'month' | 'week'>(isMobile ? 'week' : 'month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayChile());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filterUser, setFilterUser] = useState<'all' | 'jose' | 'anto'>('all');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');

  const todayChile = getTodayChile();

  const monthDates = useMemo(() => {
    return getMonthDates(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const weekDates = useMemo(() => {
    return getWeekDates(currentDate);
  }, [currentDate]);

  const fetchEvents = async () => {
    if (!users.jose?.user?.id || !users.anto?.user?.id) return;
    
    setLoading(true);
    try {
      let startDate, endDate;
      if (view === 'month') {
        startDate = monthDates[0].date;
        endDate = monthDates[monthDates.length - 1].date;
      } else {
        startDate = weekDates[0];
        endDate = weekDates[6];
      }

      const activity = await getActivityForDateRange(
        users.jose.user.id,
        users.anto.user.id,
        startDate,
        endDate
      );

      const allEvents = transformActivityToEvents(
        activity,
        users.jose.user,
        users.anto.user
      );

      setEvents(allEvents);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, view, refreshKey, users.jose, users.anto]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    
    if (filterUser !== 'all') {
      result = result.filter(e => 
        e.userName?.toLowerCase() === filterUser || 
        !e.userName // Custom shared events have no fixed userName in transformation yet, but visibility handles it
      );
    }
    
    if (filterType !== 'all') {
      result = result.filter(e => e.type === filterType);
    }
    
    return groupEventsByDate(result);
  }, [events, filterUser, filterType]);

  const goToPrev = () => {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(next.getMonth() - 1);
    else next.setDate(next.getDate() - 7);
    setCurrentDate(next);
  };

  const goToNext = () => {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(next.getMonth() + 1);
    else next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteCalendarEvent(id);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const navBtnStyle: React.CSSProperties = {
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#fff', border: '1.5px solid #e8d5c8',
    color: '#c1603a', cursor: 'pointer', transition: 'all 0.2s',
  };

  return (
    <PageWrapper>
      <ModuleHeader
        title="Agenda"
        subtitle="Actividad y eventos compartidos"
        badge="Planning"
        icon={<CalendarIcon size={18} />}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Header Controls */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', flexWrap: 'wrap', gap: '16px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={goToPrev} style={navBtnStyle}><ChevronLeft size={18} /></button>
            <h2 style={{ 
              fontFamily: '"Outfit", sans-serif', fontWeight: 800,
              fontSize: '20px', color: '#2d1a0e', margin: 0, minWidth: '150px' 
            }}>
              {view === 'month' 
                ? currentDate.toLocaleDateString('es-CL', { 
                    month: 'long', year: 'numeric'
                  })
                : `Semana ${weekDates[0].split('-')[2]} - ${weekDates[6].split('-')[2]} ${currentDate.toLocaleDateString('es-CL', { month: 'short' })}`
              }
            </h2>
            <button onClick={goToNext} style={navBtnStyle}><ChevronRight size={18} /></button>
            <button 
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDate(todayChile);
              }}
              style={{
                padding: '6px 14px', borderRadius: '100px',
                border: '1px solid rgba(193,96,58,0.3)',
                background: 'transparent', color: '#c1603a',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                fontFamily: '"Outfit", sans-serif'
              }}
            >
              Hoy
            </button>
          </div>

          <div style={{ 
            display: 'flex', background: 'rgba(193,96,58,0.08)',
            borderRadius: '100px', padding: '3px', gap: '2px' 
          }}>
            {(['month', 'week'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '6px 16px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                fontFamily: '"Outfit", sans-serif', fontSize: '13px',
                fontWeight: 700,
                background: view === v ? '#c1603a' : 'transparent',
                color: view === v ? '#fff' : '#7a4a36',
                transition: 'all 0.2s',
              }}>
                {v === 'month' ? 'Mes' : 'Semana'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', gap: '8px', overflowX: 'auto', 
          paddingBottom: '4px', alignItems: 'center' 
        }} className="no-scrollbar">
          <Filter size={14} color="#b08878" style={{ flexShrink: 0 }} />
          
          {(['all', 'jose', 'anto'] as const).map(u => (
            <button key={u} onClick={() => setFilterUser(u)}
              style={{
                padding: '6px 14px', borderRadius: '100px',
                border: `1.5px solid ${filterUser === u 
                  ? (u === 'jose' ? '#c1603a' : u === 'anto' ? '#d4849e' : '#2d1a0e')
                  : '#e8d5c8'}`,
                background: filterUser === u ? (
                  u === 'jose' ? 'rgba(193,96,58,0.1)' :
                  u === 'anto' ? 'rgba(212,132,158,0.1)' :
                  'rgba(45,26,14,0.08)'
                ) : '#fff',
                color: filterUser === u ? (
                  u === 'jose' ? '#c1603a' :
                  u === 'anto' ? '#d4849e' : '#2d1a0e'
                ) : '#b08878',
                fontFamily: '"Outfit", sans-serif',
                fontSize: '11px', fontWeight: 800,
                cursor: 'pointer', whiteSpace: 'nowrap',
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
              {u === 'all' ? 'Todos' : u}
            </button>
          ))}

          <div style={{ width: '1px', height: '20px', background: '#e8d5c8', flexShrink: 0, margin: '0 4px' }} />

          {(['nutrition', 'fitness', 'learning', 'reunion', 'cita'] as const).map(t => {
            const config = EVENT_TYPE_CONFIG[t];
            const isSelected = filterType === t;
            return (
              <button key={t} onClick={() => setFilterType(isSelected ? 'all' : t)}
                style={{
                  padding: '6px 14px', borderRadius: '100px',
                  border: `1.5px solid ${isSelected ? config.color : '#e8d5c8'}`,
                  background: isSelected ? config.bg : '#fff',
                  color: isSelected ? config.color : '#b08878',
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '11px', fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                {config.emoji} {config.label}
              </button>
            );
          })}
        </div>

        {/* Content View */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#b08878' }}>
            <CalendarIcon size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontWeight: 600 }}>Cargando agenda...</p>
          </div>
        ) : view === 'month' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <GlassCard style={{ padding: '16px' }}>
              {/* Day headers */}
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px', marginBottom: '8px' 
              }}>
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
                  <div key={i} style={{ 
                    textAlign: 'center', fontSize: '10px',
                    fontWeight: 800, color: '#b08878',
                    textTransform: 'uppercase', letterSpacing: '0.08em' 
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px' 
              }}>
                {monthDates.map(({ date, isCurrentMonth }) => {
                  const dayEvents = filteredEvents[date] || [];
                  const isToday = date === todayChile;
                  const isSelected = date === selectedDate;
                  
                  return (
                    <div key={date}
                      onClick={() => setSelectedDate(isSelected ? null : date)}
                      style={{
                        minHeight: isMobile ? '50px' : '80px',
                        borderRadius: '12px',
                        padding: '6px',
                        background: isSelected ? 'rgba(193,96,58,0.08)'
                          : isToday ? 'rgba(193,96,58,0.04)' : '#fff',
                        border: isSelected ? '1.5px solid #c1603a'
                          : isToday ? '1.5px solid rgba(193,96,58,0.3)'
                          : '1px solid rgba(232, 213, 200, 0.4)',
                        cursor: 'pointer',
                        opacity: isCurrentMonth ? 1 : 0.3,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                      
                      <p style={{ 
                        margin: '0 0 4px',
                        fontSize: '12px', fontWeight: isToday ? 800 : 600,
                        color: isToday ? '#c1603a' : '#2d1a0e',
                        textAlign: 'right' 
                      }}>
                        {parseInt(date.split('-')[2])}
                      </p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'flex-end' }}>
                        {dayEvents.slice(0, 4).map((ev, i) => (
                          <div key={i} style={{
                            width: '5px', height: '5px',
                            borderRadius: '50%',
                            background: ev.userColor || ev.typeColor,
                          }}/>
                        ))}
                        {dayEvents.length > 4 && (
                          <span style={{ fontSize: '8px', color: '#b08878', fontWeight: 800 }}>
                            +{dayEvents.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Selected Day Panel */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <GlassCard style={{ padding: '20px' }}>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '16px' 
                    }}>
                      <h3 style={{ 
                        margin: 0, fontSize: '18px', fontWeight: 800,
                        color: '#2d1a0e', textTransform: 'capitalize'
                      }}>
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CL', {
                          weekday: 'long', day: 'numeric', month: 'long'
                        })}
                      </h3>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                          padding: '8px 16px', borderRadius: '100px',
                          background: '#c1603a', color: '#fff',
                          border: 'none', fontSize: '12px', fontWeight: 800,
                          cursor: 'pointer', fontFamily: '"Outfit", sans-serif',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          boxShadow: '0 4px 12px rgba(193, 96, 58, 0.2)'
                        }}
                      >
                        <Plus size={14} /> Agregar
                      </button>
                    </div>
                    
                    {(filteredEvents[selectedDate] || []).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <p style={{ color: '#b08878', fontSize: '14px', fontWeight: 500 }}>
                          Sin actividad para este día
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(filteredEvents[selectedDate] || [])
                          .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'))
                          .map(event => (
                            <EventRow 
                              key={event.id} 
                              event={event}
                              onDelete={event.canDelete ? () => handleDeleteEvent(event.id) : undefined}
                            />
                          ))
                        }
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? 'repeat(7, 120px)' : 'repeat(7, 1fr)',
            gap: '12px', overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: '20px'
          }} className="lux-scroll">
            {weekDates.map(date => {
              const dayEvents = filteredEvents[date] || [];
              const isToday = date === todayChile;
              const d = new Date(date + 'T12:00:00');
              const dayName = d.toLocaleDateString('es-CL', { weekday: 'short' });
              const dayNum = d.getDate();
              
              return (
                <div key={date} style={{ 
                  minHeight: '400px',
                  display: 'flex', flexDirection: 'column', gap: '8px' 
                }}>
                  {/* Header */}
                  <div style={{ 
                    textAlign: 'center', padding: '12px 8px', borderRadius: '16px',
                    background: isToday ? 'rgba(193, 96, 58, 0.1)' : 'rgba(255,255,255,0.4)',
                    border: isToday ? '1px solid rgba(193, 96, 58, 0.3)' : '1px solid rgba(232, 213, 200, 0.4)',
                    boxShadow: isToday ? '0 4px 12px rgba(193, 96, 58, 0.1)' : 'none'
                  }}>
                    <p style={{ 
                      fontSize: '10px', color: '#b08878',
                      fontWeight: 800, textTransform: 'uppercase',
                      margin: '0 0 4px', letterSpacing: '0.1em' 
                    }}>
                      {dayName}
                    </p>
                    <p style={{ 
                      fontSize: '24px', fontWeight: 800,
                      color: isToday ? '#c1603a' : '#2d1a0e', margin: 0 
                    }}>
                      {dayNum}
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedDate(date);
                      setIsAddModalOpen(true);
                    }}
                    style={{
                      width: '100%', padding: '8px',
                      border: '1.5px dashed #e8d5c8',
                      borderRadius: '12px', background: 'transparent',
                      color: '#b08878', fontSize: '11px', fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#c1603a'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d5c8'}
                  >
                    + Agregar
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayEvents
                      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'))
                      .map(event => (
                        <EventCard 
                          key={event.id} 
                          event={event}
                          onDelete={event.canDelete ? () => handleDeleteEvent(event.id) : undefined} 
                        />
                      ))
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddModalOpen(true)}
        style={{
          position: 'fixed', bottom: isMobile ? '90px' : '30px', right: '30px',
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#c1603a', color: '#fff', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(193, 96, 58, 0.4)',
          cursor: 'pointer', zIndex: 900,
        }}
      >
        <Plus size={28} />
      </motion.button>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setRefreshKey(k => k + 1);
        }}
        selectedDate={selectedDate || todayChile}
        color={activeUser.user.color}
      />
    </PageWrapper>
  );
};
