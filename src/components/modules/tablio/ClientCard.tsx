import React from 'react';
import { formatCLP } from '../../../lib/utils';
import { DollarSign } from 'lucide-react';

interface ClientCardProps {
  client: any;
  onAddPayment: (client: any) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onAddPayment }) => {
  const currentYear = new Date().getFullYear();
  const yearlyPayments = client.tablio_payments?.filter((p: any) => p.year === currentYear) || [];
  const totalReceivedUSD = yearlyPayments.reduce((sum: number, p: any) => sum + p.amount_usd, 0);

  let statusColor = '#c1603a';
  let statusBg = 'rgba(193,96,58,0.08)';
  if (client.status === 'activo') {
    statusColor = '#4a9068';
    statusBg = 'rgba(74,144,104,0.1)';
  } else if (client.status === 'pausado') {
    statusColor = '#d4922a';
    statusBg = 'rgba(212,146,42,0.1)';
  } else if (client.status === 'cancelado') {
    statusColor = '#c94040';
    statusBg = 'rgba(201,64,64,0.1)';
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #e8d5c8', borderRadius: '16px', padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>
              {client.name}
            </h3>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'rgba(45,26,14,0.05)', color: '#7a4a36', textTransform: 'uppercase' }}>
              {client.venture}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#c1603a', fontFamily: '"Outfit", sans-serif' }}>
            ${client.mrr_usd} USD <span style={{ fontSize: '12px', color: '#b08878', marginLeft: '4px' }}>/ {formatCLP(client.mrr_clp)}</span>
          </p>
        </div>
        <div style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: statusColor, background: statusBg }}>
          {client.status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#fdf6f0', padding: '12px', borderRadius: '12px', border: '1px solid rgba(193,96,58,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <span style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Cobrado este año</span>
           <span style={{ fontSize: '15px', fontWeight: 800, color: '#2d1a0e', fontFamily: '"Outfit", sans-serif' }}>${totalReceivedUSD} USD</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <span style={{ fontSize: '10px', fontWeight: 700, color: '#b08878', textTransform: 'uppercase' }}>Último pago</span>
           <span style={{ fontSize: '13px', fontWeight: 600, color: '#7a4a36' }}>
             {yearlyPayments.length > 0 
                ? new Date(yearlyPayments.sort((a: any, b: any) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0].payment_date).toLocaleDateString() 
                : 'Ninguno'}
           </span>
        </div>
      </div>

      <button
        onClick={() => onAddPayment(client)}
        style={{
          width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #c1603a',
          background: 'transparent', color: '#c1603a', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(193,96,58,0.05)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <DollarSign size={14} /> Registrar pago
      </button>
    </div>
  );
};
