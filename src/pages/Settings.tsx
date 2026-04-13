import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useCouple } from '../hooks/useCouple';
import { formatCLP } from '../lib/utils';
import { updateProfileSettings } from '../lib/db';

export const SettingsPage: React.FC = () => {
  const { users, activeRole } = useCouple();
  const [editingRole, setEditingRole] = useState<'jose' | 'anto'>(activeRole);

  const activeUser = users[editingRole]?.user;

  const [calorieTarget, setCalorieTarget] = useState('');
  const [proteinTarget, setProteinTarget] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Sync state when active user changes
  useEffect(() => {
    if (activeUser) {
      setCalorieTarget(activeUser.calorieTarget?.toString() || '2000');
      setProteinTarget(activeUser.proteinTarget?.toString() || '150');
      setMonthlyBudget(activeUser.monthlyBudgetCLP?.toString() || '500000');
      setError('');
    }
  }, [activeUser, editingRole]);

  const handleSave = async () => {
    if (!activeUser?.id) return;
    
    setSaving(true);
    setError('');
    try {
      await updateProfileSettings(activeUser.id, {
        calorie_target: parseInt(calorieTarget),
        protein_target_g: parseInt(proteinTarget),
        monthly_budget_clp: parseInt(monthlyBudget),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      setError('No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  const currentProfileColor = activeUser?.color || '#c1603a';

  return (
    <PageWrapper>
      <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '32px', color: '#c1603a', margin: '0 0 24px 0' }}>
        Configuración
      </h1>
      
      {/* Active user section */}
      <div 
        className="lux-item"
        style={{ 
          background: 'rgba(255,255,255,0.85)', 
          backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(255,255,255,0.4)', 
          boxShadow: '0 8px 32px rgba(176,136,120,0.08)',
          borderRadius: '24px',
          padding: '20px', 
          marginBottom: '20px' 
        }}>
        <p style={{ fontSize: '13px', color: '#b08878', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Estás editando el perfil de:
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px',
              border: editingRole === 'jose' ? `2px solid ${users.jose?.user?.color}` : '2px solid transparent',
              background: editingRole === 'jose' ? `${users.jose?.user?.color}15` : 'rgba(0,0,0,0.03)',
              color: editingRole === 'jose' ? users.jose?.user?.color : '#b08878',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: '"Outfit", sans-serif'
            }}
            onClick={() => setEditingRole('jose')}
          >
            Jose
          </button>
          <button 
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px',
              border: editingRole === 'anto' ? `2px solid ${users.anto?.user?.color}` : '2px solid transparent',
              background: editingRole === 'anto' ? `${users.anto?.user?.color}15` : 'rgba(0,0,0,0.03)',
              color: editingRole === 'anto' ? users.anto?.user?.color : '#b08878',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: '"Outfit", sans-serif'
            }}
            onClick={() => setEditingRole('anto')}
          >
            Anto
          </button>
        </div>
      </div>

      {/* Nutrition targets */}
      <div style={{ 
          background: 'rgba(255,255,255,0.85)', 
          backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(255,255,255,0.4)', 
          boxShadow: '0 8px 32px rgba(176,136,120,0.08)',
          borderRadius: '24px',
          padding: '20px', 
          marginBottom: '16px' 
        }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>
          Objetivos de nutrición
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#b08878', marginBottom: '8px', fontWeight: 600 }}>Meta calórica diaria</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="number" 
              value={calorieTarget} 
              onChange={e => setCalorieTarget(e.target.value)} 
              placeholder="2000" 
              style={{
                width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px', border: '1px solid rgba(193,96,58,0.2)',
                background: 'rgba(255,255,255,0.5)', fontFamily: '"Outfit", sans-serif', fontSize: '16px', color: '#2d1a0e', outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', right: '16px', color: '#b08878', fontSize: '14px', fontWeight: 600 }}>kcal</span>
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#b08878', marginBottom: '8px', fontWeight: 600 }}>Meta de proteína diaria</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="number" 
              value={proteinTarget}
              onChange={e => setProteinTarget(e.target.value)} 
              placeholder="150" 
              style={{
                width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px', border: '1px solid rgba(193,96,58,0.2)',
                background: 'rgba(255,255,255,0.5)', fontFamily: '"Outfit", sans-serif', fontSize: '16px', color: '#2d1a0e', outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', right: '16px', color: '#b08878', fontSize: '14px', fontWeight: 600 }}>g</span>
          </div>
        </div>
      </div>

      {/* Finance targets */}
      <div style={{ 
          background: 'rgba(255,255,255,0.85)', 
          backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(255,255,255,0.4)', 
          boxShadow: '0 8px 32px rgba(176,136,120,0.08)',
          borderRadius: '24px',
          padding: '20px', 
          marginBottom: '24px' 
        }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>
          Presupuesto mensual
        </h3>
        
        <label style={{ display: 'block', fontSize: '13px', color: '#b08878', marginBottom: '8px', fontWeight: 600 }}>Presupuesto total en CLP</label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ position: 'absolute', left: '16px', color: '#b08878', fontSize: '16px', fontWeight: 600 }}>$</span>
          <input 
            type="number" 
            value={monthlyBudget}
            onChange={e => setMonthlyBudget(e.target.value)} 
            placeholder="500000" 
            style={{
              width: '100%', padding: '12px 16px 12px 32px', borderRadius: '12px', border: '1px solid rgba(193,96,58,0.2)',
              background: 'rgba(255,255,255,0.5)', fontFamily: '"Outfit", sans-serif', fontSize: '16px', color: '#2d1a0e', outline: 'none'
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#b08878', fontWeight: 600 }}>
          {formatCLP(parseInt(monthlyBudget) || 0)} por mes
        </p>
      </div>

      {error && (
        <p style={{ color: '#c94040', fontSize: '14px', textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}>
          {error}
        </p>
      )}

      {/* Save button */}
      <button 
        className="btn-gold" 
        onClick={handleSave}
        disabled={saving}
        style={{ width: '100%', background: currentProfileColor, border: 'none', padding: '16px', borderRadius: '16px', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"Outfit", sans-serif', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
      
      {saved && (
        <p style={{ margin: '12px 0 0 0', color: '#4a9068', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>
          ✓ Cambios guardados
        </p>
      )}
    </PageWrapper>
  );
};
