import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  const steps = [
    { label: 'Preparing metadata', duration: 10 },
    { label: 'Connecting to blockchain', duration: 15 },
    { label: 'Creating NFT token', duration: 30 },
    { label: 'Confirming transaction', duration: 25 },
    { label: 'Finalizing ownership records', duration: 20 }
  ];
  
  const [currentStep, setCurrentStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // 3 seconds for demo (would be 1800 for 3 min)
    
    return () => clearInterval(timer);
  }, []);
  
  React.useEffect(() => {
    // Calculate current step based on progress
    let accumulatedPercentage = 0;
    for (let i = 0; i < steps.length; i++) {
      accumulatedPercentage += steps[i].duration;
      if (progress <= accumulatedPercentage) {
        setCurrentStep(i);
        break;
      }
    }
  }, [progress]);
  
  return (
    <div className="py-8 flex flex-col items-center">
      <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
      
      <div className="w-full bg-primary rounded-full h-2 mb-6 mt-2">
        <div 
          className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="space-y-3 w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 transition-colors duration-300
              ${index < currentStep ? 'bg-success text-primary' : 
                index === currentStep ? 'bg-neon-blue animate-pulse' : 'bg-primary-light border border-metallic/30'}`}>
              {index < currentStep && <span className="text-xs">✓</span>}
            </div>
            <span className={`text-sm ${index === currentStep ? 'text-white' : 'text-metallic'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};