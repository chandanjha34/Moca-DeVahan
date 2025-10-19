import React from 'react';
import { Car, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function VehicleCard({ vehicle, onTransfer }: {
  vehicle: any;
  onTransfer: (tokenId: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="cyber-vehicle-card">
      <div className="cyber-vehicle-image">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="cyber-vehicle-info">
        <div className="flex items-center mb-4">
          <Car className="w-6 h-6 text-cyber-accent mr-3" />
          <h3 className="text-xl font-semibold cyber-text-glow">{vehicle.name}</h3>
        </div>

        <div className="space-y-3">
          <div className="cyber-vehicle-detail">
            <span className="text-cyber-muted">{t('vehicles.plateNumber')}</span>
            <span className="text-white font-mono">{vehicle.plate}</span>
          </div>
          <div className="cyber-vehicle-detail">
            <span className="text-cyber-muted">{t('vehicles.wallet')}</span>
            <span className="text-white font-mono text-sm">{vehicle.wallet}</span>
          </div>
          <div className="cyber-vehicle-detail">
            <span className="text-cyber-muted">{t('vehicles.tokenId')}</span>
            <span className="text-cyber-accent font-mono">{vehicle.tokenId}</span>
          </div>
        </div>

        <button
          onClick={() => onTransfer(vehicle.tokenId)}
          className="cyber-btn-transfer w-full mt-6 group"
        >
          <span>{t('vehicles.transfer')}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

export default VehicleCard;
