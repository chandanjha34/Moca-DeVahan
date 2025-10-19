import React from 'react';

function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="cyber-feature-card">
      <div className="cyber-icon-container">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 cyber-text-glow">{title}</h3>
      <p className="text-cyber-muted leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
