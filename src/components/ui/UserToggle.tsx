import { useCouple } from '../../hooks/useCouple';

/**
 * PURE CSS USER TOGGLE
 * Implements the pill design via index.css and high-end inline animations.
 */
export const UserToggle = () => {
  const { activeUserId, setActiveUserId } = useCouple();

  return (
    <div className="user-toggle">
      {(['jose', 'anto'] as const).map((id) => {
        const isActive = activeUserId === id;
        const activeColor = id === 'jose' ? '#4a90d9' : '#e879a0';
        
        return (
          <button
            key={id}
            className="user-toggle-btn"
            onClick={() => setActiveUserId(id)}
            aria-pressed={isActive}
            style={{
              background: isActive ? activeColor : 'transparent',
              color: isActive ? '#060d1f' : 'rgba(255,255,255,0.4)',
              boxShadow: isActive ? `0 0 14px ${activeColor}60` : 'none',
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {id === 'jose' ? 'Jose' : 'Anto'}
          </button>
        );
      })}
    </div>
  );
};
