import { useCouple } from '../../hooks/useCouple';

/**
 * PURE CSS USER TOGGLE
 * Implements the pill design via index.css and high-end inline animations.
 */
export const UserToggle = () => {
  const { activeRole, setActiveRole } = useCouple();

  return (
    <div className="user-toggle">
      {(['jose', 'anto'] as const).map((id) => {
        const isActive = activeRole === id;
        const activeColor = id === 'jose' ? '#c1603a' : '#d4849e';
        
        return (
          <button
            key={id}
            className="user-toggle-btn"
            onClick={() => setActiveRole(id)}
            aria-pressed={isActive}
            style={{
              background: isActive ? activeColor : 'transparent',
              color: isActive ? '#fdf6f0' : '#b08878',
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
