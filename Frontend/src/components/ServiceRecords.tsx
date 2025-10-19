import React, { useState } from 'react';
import { 
  Calendar, 
  Gauge, 
  MapPin, 
  Wrench, 
  FileText, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Activity,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react';

interface ServiceRecord {
  id: string;
  date: string;
  odometer: number;
  serviceCenter: string;
  workDone: string;
  invoiceCID: string;
  expanded?: boolean;
}

interface ServiceRecordsProps {
  userType: 'user' | 'dealer';
  selectedVehicle?: string;
}

const ServiceRecords: React.FC<ServiceRecordsProps> = ({ userType, selectedVehicle }) => {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      odometer: 23500,
      serviceCenter: 'Mahindra Service Noida',
      workDone: 'Engine oil change, brake pads replaced, air filter cleaning',
      invoiceCID: 'Qm12345abcdef678901234567890'
    },
    {
      id: '2',
      date: '2024-07-02', 
      odometer: 33200,
      serviceCenter: 'Tata Motors Gurgaon',
      workDone: 'Battery replacement, electrical system check, coolant refill',
      invoiceCID: 'Qm67890xyz123456789abcdef012'
    },
    {
      id: '3',
      date: '2024-11-20',
      odometer: 41800,
      serviceCenter: 'Hyundai Service Center Delhi',
      workDone: 'Transmission service, tire rotation, brake fluid change',
      invoiceCID: 'Qm98765pqr987654321fedcba543'
    }
  ]);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: '',
    odometer: '',
    serviceCenter: '',
    workDone: ''
  });

  // Calculate health score based on service frequency and odometer
  const calculateHealthScore = () => {
    const latestOdometer = Math.max(...serviceRecords.map(r => r.odometer));
    const lastService = serviceRecords.reduce((latest, record) => 
      new Date(record.date) > new Date(latest.date) ? record : latest
    );
    
    const daysSinceLastService = Math.floor((Date.now() - new Date(lastService.date).getTime()) / (1000 * 60 * 60 * 24));
    const kmSinceLastService = latestOdometer - lastService.odometer;
    
    let score = 100;
    if (daysSinceLastService > 180) score -= 30;
    if (kmSinceLastService > 8000) score -= 25;
    if (serviceRecords.length < 2) score -= 20;
    
    return Math.max(20, score);
  };

  const healthScore = calculateHealthScore();
  
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-400';
    if (score >= 60) return 'from-yellow-500 to-yellow-400'; 
    return 'from-red-500 to-red-400';
  };

  const generateFakeIPFS = () => {
    const chars = 'abcdef0123456789';
    let result = 'Qm';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const record: ServiceRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      odometer: parseInt(newRecord.odometer),
      serviceCenter: newRecord.serviceCenter,
      workDone: newRecord.workDone,
      invoiceCID: generateFakeIPFS()
    };
    
    setServiceRecords(prev => [record, ...prev]);
    setNewRecord({ date: '', odometer: '', serviceCenter: '', workDone: '' });
    setIsSubmitting(false);
    setShowAddForm(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getNextServiceDue = () => {
    const latestRecord = serviceRecords.reduce((latest, record) => 
      record.odometer > latest.odometer ? record : latest
    );
    return latestRecord.odometer + 10000;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] to-[#1a202c] text-white relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 transform transition-all duration-500">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 rounded-lg shadow-2xl border border-green-400/30 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-white animate-pulse" />
              <span className="text-white font-medium">Service record added successfully!</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#00FFC2] bg-clip-text text-transparent">
              Vehicle Service Records
            </h1>
            <p className="text-[#E5E7EB] text-lg font-light tracking-wider">
              Trusted history, powered by blockchain
            </p>
          </div>

          {/* Health Score Bar */}
          <div className="mb-8">
            <div className="bg-[#1e2837] rounded-2xl p-6 border border-[#E5E7EB]/20 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#E5E7EB] flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-[#00FFC2]" />
                  Vehicle Health Score
                </h3>
                <span className="text-3xl font-bold text-[#FFD700]">{healthScore}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getHealthColor(healthScore)} transition-all duration-1000 relative`}
                  style={{ width: `${healthScore}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-[#E5E7EB]/70 mt-2">
                Based on service frequency, maintenance history, and vehicle condition
              </p>
            </div>
          </div>

          {/* User Reminders */}
          {userType === 'user' && (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center mb-2">
                  <Gauge className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-300 font-medium">Next Service Due</span>
                </div>
                <p className="text-white text-lg font-bold">{getNextServiceDue().toLocaleString()} km</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 rounded-xl p-4 border border-orange-500/30">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="text-orange-300 font-medium">Insurance Renewal</span>
                </div>
                <p className="text-white text-lg font-bold">Mar 15, 2025</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-300 font-medium">PUC Certificate</span>
                </div>
                <p className="text-white text-lg font-bold">Valid until Jun 2025</p>
              </div>
            </div>
          )}

          {/* Add Record Button (Dealer Only) */}
          {userType === 'dealer' && (
            <div className="mb-8 text-center">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-[#FFD700]/50"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Add New Service Record
              </button>
            </div>
          )}

          {/* Add Record Form */}
          {showAddForm && userType === 'dealer' && (
            <div className="mb-8 bg-[#1e2837] rounded-2xl p-8 border border-[#E5E7EB]/20 backdrop-blur-xl shadow-2xl">
              <h3 className="text-2xl font-bold text-[#E5E7EB] mb-6 flex items-center">
                <Wrench className="w-6 h-6 mr-3 text-[#00FFC2]" />
                Add Service Record
              </h3>
              
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#E5E7EB] font-medium mb-2">Service Date</label>
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-[#101828] border border-[#E5E7EB]/30 rounded-lg px-4 py-3 text-white focus:border-[#00FFC2] focus:ring-2 focus:ring-[#00FFC2]/20 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[#E5E7EB] font-medium mb-2">Odometer Reading (km)</label>
                  <input
                    type="number"
                    value={newRecord.odometer}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, odometer: e.target.value }))}
                    className="w-full bg-[#101828] border border-[#E5E7EB]/30 rounded-lg px-4 py-3 text-white focus:border-[#00FFC2] focus:ring-2 focus:ring-[#00FFC2]/20 transition-all duration-200"
                    placeholder="e.g. 45000"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[#E5E7EB] font-medium mb-2">Service Center Name</label>
                  <input
                    type="text"
                    value={newRecord.serviceCenter}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, serviceCenter: e.target.value }))}
                    className="w-full bg-[#101828] border border-[#E5E7EB]/30 rounded-lg px-4 py-3 text-white focus:border-[#00FFC2] focus:ring-2 focus:ring-[#00FFC2]/20 transition-all duration-200"
                    placeholder="e.g. Honda Service Center Delhi"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[#E5E7EB] font-medium mb-2">Work Done / Parts Replaced</label>
                  <textarea
                    value={newRecord.workDone}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, workDone: e.target.value }))}
                    className="w-full bg-[#101828] border border-[#E5E7EB]/30 rounded-lg px-4 py-3 text-white focus:border-[#00FFC2] focus:ring-2 focus:ring-[#00FFC2]/20 transition-all duration-200 min-h-[100px]"
                    placeholder="Describe the work performed, parts replaced, etc."
                    required
                  />
                </div>
                
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#00FFC2] to-[#00D4AA] hover:from-[#00D4AA] hover:to-[#00FFC2] text-black px-6 py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Record
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-4 border-2 border-[#E5E7EB]/30 text-[#E5E7EB] rounded-xl font-medium hover:border-red-500 hover:text-red-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Service Records Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] via-[#00FFC2] to-[#E5E7EB] opacity-60"></div>
            
            <div className="space-y-8">
              {serviceRecords.map((record, index) => (
                <div
                  key={record.id}
                  className="relative group"
                  onClick={() => setExpandedCard(expandedCard === record.id ? null : record.id)}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-[#FFD700] to-[#00FFC2] rounded-full border-4 border-[#101828] shadow-lg group-hover:scale-125 transition-transform duration-300 z-10"></div>
                  
                  {/* Service Card */}
                  <div className="ml-20 bg-gradient-to-br from-[#1e2837] to-[#2a3441] rounded-2xl p-6 border border-[#E5E7EB]/20 backdrop-blur-xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">{record.serviceCenter}</h3>
                        <div className="flex items-center space-x-6 text-[#E5E7EB]/80">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-[#00FFC2]" />
                            <span>{formatDate(record.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Gauge className="w-4 h-4 mr-2 text-[#00FFC2]" />
                            <span>{record.odometer.toLocaleString()} km</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-gradient-to-r from-[#00FFC2]/20 to-[#FFD700]/20 text-[#E5E7EB] px-3 py-1 rounded-full text-sm border border-[#00FFC2]/30">
                          Service #{serviceRecords.length - index}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#E5E7EB]/20 pt-4">
                      <div className="flex items-start mb-3">
                        <Wrench className="w-5 h-5 text-[#FFD700] mr-3 mt-1 flex-shrink-0" />
                        <p className="text-[#E5E7EB] leading-relaxed">{record.workDone}</p>
                      </div>
                      
                      {expandedCard === record.id && (
                        <div className="mt-6 animate-fadeIn">
                          <div className="bg-[#101828] rounded-xl p-4 border border-[#E5E7EB]/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-[#00FFC2] mr-3" />
                                <span className="text-[#E5E7EB] font-medium">Invoice Document</span>
                              </div>
                              <a
                                href={`https://ipfs.io/ipfs/${record.invoiceCID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-2 rounded-lg font-medium hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-200 flex items-center"
                              >
                                <span className="mr-2">View Invoice</span>
                                <Zap className="w-4 h-4" />
                              </a>
                            </div>
                            <p className="text-[#E5E7EB]/60 text-sm mt-2 font-mono break-all">
                              IPFS: {record.invoiceCID}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {serviceRecords.length === 0 && (
            <div className="text-center py-16">
              <AlertTriangle className="w-16 h-16 text-[#E5E7EB]/40 mx-auto mb-4" />
              <p className="text-[#E5E7EB]/60 text-xl">No service records found</p>
              <p className="text-[#E5E7EB]/40 text-sm mt-2">
                {userType === 'dealer' ? 'Add the first service record to get started' : 'Service history will appear here once available'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style >{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ServiceRecords;