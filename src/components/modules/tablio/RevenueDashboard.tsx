import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { getTablioclients } from '../../../lib/db';
import { ClientCard } from './ClientCard';
import { AddClientModal } from './AddClientModal';
import { AddPaymentModal } from './AddPaymentModal';
import { Plus } from 'lucide-react';
import { formatCLP } from '../../../lib/utils';

export const RevenueDashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [paymentModalState, setPaymentModalState] = useState<{isOpen: boolean, client?: any}>({ isOpen: false });

  const loadClients = async () => {
    try {
      const data = await getTablioclients();
      setClients(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const activeClients = clients.filter(c => c.status === 'activo');
  const mrrTotalUSD = activeClients.reduce((sum, c) => sum + (c.mrr_usd || 0), 0);
  const mrrTotalCLP = activeClients.reduce((sum, c) => sum + (c.mrr_clp || 0), 0);

  // Process payments
  const allPayments = useMemo(() => {
    const list: any[] = [];
    clients.forEach(c => {
      if (c.tablio_payments) {
        c.tablio_payments.forEach((p: any) => {
          list.push({ ...p, client_name: c.name });
        });
      }
    });
    return list.sort((a,b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }, [clients]);

  const currentMonthStr = new Date().toLocaleString('es-ES', { month: 'short' });
  const currentYear = new Date().getFullYear();
  const collectedThisMonth = allPayments
    .filter(p => p.month.toLowerCase() === currentMonthStr.toLowerCase() && p.year === currentYear && p.status === 'pagado')
    .reduce((sum, p) => sum + p.amount_usd, 0);

  // Last 6 months for chart
  const chartData = useMemo(() => {
    const months: any = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mLabel = d.toLocaleString('es-ES', { month: 'short' });
      months[`${mLabel} ${d.getFullYear()}`] = { label: mLabel, val: 0 };
    }
    
    allPayments.forEach(p => {
       const k = `${p.month.toLowerCase()} ${p.year}`;
       // Match dynamically
       const targetKey = Object.keys(months).find(key => key.toLowerCase() === k.toLowerCase());
       if (targetKey && p.status === 'pagado') {
         months[targetKey].val += p.amount_usd;
       }
    });
    
    return Object.values(months) as {label: string, val: number}[];
  }, [allPayments]);

  const maxChartVal = Math.max(...chartData.map(d => d.val), 1);

  if (loading) return null;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h2 style={{ fontSize: '24px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2d1a0e', margin: 0 }}>Negocio MRR</h2>
         <button onClick={() => setIsClientModalOpen(true)} style={{ background: 'transparent', border: '1.5px solid #c1603a', color: '#c1603a', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
           <Plus size={16} /> Nuevo Cliente
         </button>
       </div>

       {/* Top Metrics Row */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
         <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', borderColor: 'rgba(193,96,58,0.2)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>MRR Total</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#c1603a', fontFamily: '"Outfit", sans-serif' }}>${mrrTotalUSD} USD</span>
            <span style={{ fontSize: '12px', color: '#b08878' }}>{formatCLP(mrrTotalCLP)} / mes</span>
         </GlassCard>

         <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', borderColor: 'rgba(193,96,58,0.2)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Clientes activos</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>{activeClients.length}</span>
            <span style={{ fontSize: '12px', color: '#b08878' }}>Retención estable</span>
         </GlassCard>

         <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', borderColor: 'rgba(193,96,58,0.2)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Cobrado este mes</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#4a9068', fontFamily: '"Outfit", sans-serif' }}>${collectedThisMonth} USD</span>
            <span style={{ fontSize: '12px', color: '#b08878' }}>Flujo de caja actual</span>
         </GlassCard>
       </div>

       {/* Clients List */}
       <div>
         <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2d1a0e', marginBottom: '16px' }}>Clientes ({clients.length})</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           {clients.map(c => (
              <ClientCard key={c.id} client={c} onAddPayment={(client) => setPaymentModalState({ isOpen: true, client })} />
           ))}
         </div>
       </div>

       {/* Monthly Chart */}
       <GlassCard style={{ padding: '24px', borderColor: 'rgba(193,96,58,0.2)' }}>
         <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#2d1a0e', marginBottom: '16px' }}>Flujo de Pagos (6 meses)</h3>
         <div style={{ paddingTop: '16px', height: '160px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
            {chartData.map((pt, i) => {
               const height = (pt.val / maxChartVal) * 100;
               return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
                  <div style={{ position: 'relative', width: '100%', margin: '0 4px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100%' }}>
                     <div style={{ position: 'absolute', top: '-24px', fontSize: '10px', fontWeight: 700, color: '#c1603a' }}>${pt.val}</div>
                     <motion.div 
                       style={{ width: '100%', maxWidth: '2rem', background: '#c1603a', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', opacity: pt.val > 0 ? 1 : 0.1 }}
                       initial={{ height: 0 }}
                       animate={{ height: `${Math.max(height, 5)}%` }}
                       transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                     />
                  </div>
                  <span style={{ color: '#b08878', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '8px' }}>
                    {pt.label}
                  </span>
                </div>
              )
            })}
         </div>
       </GlassCard>

       {/* Last 10 Payments */}
       <GlassCard style={{ padding: '24px', borderColor: 'rgba(193,96,58,0.2)' }}>
         <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#2d1a0e', marginBottom: '16px' }}>Últimos Pagos</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           {allPayments.slice(0, 10).map((p, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: i < 9 ? '1px solid rgba(193,96,58,0.08)' : 'none' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                 <span style={{ fontSize: '13px', fontWeight: 700, color: '#c1603a' }}>{p.client_name}</span>
                 <span style={{ fontSize: '11px', color: '#b08878' }}>
                   {new Date(p.payment_date).toLocaleDateString()}
                 </span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <span style={{ fontSize: '14px', fontWeight: 800, color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>
                   ${p.amount_usd} USD
                 </span>
                 <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: p.status === 'pagado' ? 'rgba(74,144,104,0.1)' : 'rgba(212,146,42,0.1)', color: p.status === 'pagado' ? '#4a9068' : '#d4922a', textTransform: 'uppercase', fontWeight: 700 }}>
                   {p.status}
                 </span>
               </div>
             </div>
           ))}
           {allPayments.length === 0 && (
             <p style={{ fontSize: '13px', color: '#b08878', textAlign: 'center', margin: 0 }}>No hay pagos registrados</p>
           )}
         </div>
       </GlassCard>

       <AddClientModal 
         isOpen={isClientModalOpen}
         onClose={() => setIsClientModalOpen(false)}
         onSuccess={loadClients}
       />
       
       <AddPaymentModal
         isOpen={paymentModalState.isOpen}
         clients={clients}
         prefilledClient={paymentModalState.client}
         onClose={() => setPaymentModalState({ isOpen: false })}
         onSuccess={loadClients}
       />
    </section>
  );
};
