import React from 'react';

function NavLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="cyber-nav-link group">
      {React.cloneElement(icon as React.ReactElement, {
        className: 'w-4 h-4 mr-2 group-hover:text-cyber-neon-yellow transition-colors duration-200',
      })}
      <span className="cyber-nav-text">{text}</span>
    </div>
  );
}

export default NavLink;
