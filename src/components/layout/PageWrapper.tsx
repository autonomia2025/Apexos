import React from 'react';

/**
 * PURE CSS PAGE WRAPPER
 * Defines the main application structure and responsive constraints.
 */
export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-root">
      <div className="page-shell">
        <main className="page page-enter">
          {children}
        </main>
      </div>
    </div>
  );
};
