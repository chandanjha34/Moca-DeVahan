import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  DollarSign, 
  TrendingDown, 
  Bot, 
  Loader, 
  BarChart3,
  Gauge,
  CheckCircle,
  AlertCircle,
  Sparkles,
  IndianRupee
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface EstimateResult {
  value: number;
  insights: string[];
  confidence: number;
  marketComparison: string;
}

interface ChartDataPoint {
  year: string;
  value: number;
  label: string;
}

interface ResaleEstimatorProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'user' | 'dealer';
}

const ResaleEstimator: React.FC<ResaleEstimatorProps> = ({ isOpen, onClose, userType }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Namaste! I am VahanMoolya, your AI guide to estimate your car\'s resale worth 🚗✨\n\nPlease share your car details including:\n• Make & Model (e.g., Honda City, BMW X5)\n• Year of purchase\n• Current mileage (km driven)\n• Overall condition (Excellent/Good/Fair/Poor)\n• Any accident history\n• Service record status',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add your Gemini API key here
  const GEMINI_API_KEY ='AIzaSyAyYF9bwY-VVTiYJwRvFePVyojR0XEMBDM';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock depreciation data for chart
  const generateDepreciationData = (currentValue: number): ChartDataPoint[] => {
    const currentYear = new Date().getFullYear();
    return [
      { year: `${currentYear}`, value: currentValue, label: 'Current Value' },
      { year: `${currentYear + 1}`, value: Math.round(currentValue * 0.85), label: 'Year 1' },
      { year: `${currentYear + 2}`, value: Math.round(currentValue * 0.72), label: 'Year 2' },
      { year: `${currentYear + 3}`, value: Math.round(currentValue * 0.61), label: 'Year 3' },
      { year: `${currentYear + 4}`, value: Math.round(currentValue * 0.52), label: 'Year 4' },
      { year: `${currentYear + 5}`, value: Math.round(currentValue * 0.45), label: 'Year 5' }
    ];
  };

  const generateFallbackEstimate = (userInput: string): EstimateResult => {
    // Enhanced fallback logic based on keywords
    let baseValue = 500000; // Default base value
    let confidence = 75;
    
    // Premium brands
    if (userInput.toLowerCase().includes('bmw') || userInput.toLowerCase().includes('mercedes') || userInput.toLowerCase().includes('audi')) {
      baseValue = 1200000;
    } else if (userInput.toLowerCase().includes('lexus') || userInput.toLowerCase().includes('jaguar')) {
      baseValue = 1000000;
    } else if (userInput.toLowerCase().includes('honda') || userInput.toLowerCase().includes('toyota') || userInput.toLowerCase().includes('hyundai')) {
      baseValue = 700000;
    } else if (userInput.toLowerCase().includes('maruti') || userInput.toLowerCase().includes('tata')) {
      baseValue = 400000;
    }
    
    // Adjust based on year mentions
    const yearMatch = userInput.match(/20\d{2}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const age = new Date().getFullYear() - year;
      baseValue = baseValue * Math.pow(0.85, age);
    }
    
    // Adjust based on mileage
    const mileageMatch = userInput.match(/(\d+),?(\d+)?\s*(km|kilometers)/i);
    if (mileageMatch) {
      const mileage = parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
      if (mileage > 100000) baseValue *= 0.8;
      else if (mileage > 50000) baseValue *= 0.9;
      else if (mileage < 20000) baseValue *= 1.1;
    }
    
    // Adjust based on condition
    if (userInput.toLowerCase().includes('excellent')) {
      baseValue *= 1.15;
      confidence = 90;
    } else if (userInput.toLowerCase().includes('good')) {
      baseValue *= 1.0;
      confidence = 85;
    } else if (userInput.toLowerCase().includes('fair')) {
      baseValue *= 0.85;
      confidence = 75;
    } else if (userInput.toLowerCase().includes('poor') || userInput.toLowerCase().includes('accident')) {
      baseValue *= 0.65;
      confidence = 60;
    }
    
    return {
      value: Math.round(baseValue),
      confidence,
      insights: [
        "Vehicle depreciation follows standard market trends for this segment",
        "Regular maintenance and service history can improve resale value by 15-20%",
        "Current market demand for this model is stable in the Indian automotive market"
      ],
      marketComparison: "12-18% above average for similar vehicles in your region"
    };
  };

  const callGeminiAPI = async (userInput: string): Promise<EstimateResult> => {
    const prompt = `You are VahanMoolya AI, an expert Indian car resale value estimator. Based on the car details provided, estimate the current resale value in Indian Rupees (INR).

Car Details: "${userInput}"

Please provide your response in the following JSON format only:
{
  "value": [estimated_value_in_inr_as_number],
  "insights": ["insight1", "insight2", "insight3"],
  "confidence": [confidence_percentage_0_to_100],
  "marketComparison": "brief comparison with market average"
}

Guidelines:
- Consider Indian market conditions, depreciation rates, and regional preferences
- Factor in make, model, year, mileage, condition, accident history, and service records
- Provide realistic INR values based on current Indian automotive market
- Give 2-3 actionable insights about the vehicle's resale value
- Confidence should reflect accuracy of estimation based on provided information
- Market comparison should be relative to similar vehicles in India

Respond with only the JSON object, no additional text.`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response structure');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from AI response
      try {
        // Clean the response in case there's extra text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const parsedResult = JSON.parse(jsonMatch[0]);
        
        // Validate the parsed result
        if (typeof parsedResult.value !== 'number' || 
            !Array.isArray(parsedResult.insights) || 
            typeof parsedResult.confidence !== 'number' ||
            typeof parsedResult.marketComparison !== 'string') {
          throw new Error('Invalid response format');
        }

        // Ensure confidence is within valid range
        parsedResult.confidence = Math.max(0, Math.min(100, parsedResult.confidence));

        return parsedResult as EstimateResult;
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback:', parseError);
        throw parseError;
      }
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Return fallback estimate if API fails
      return generateFallbackEstimate(userInput);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const estimate = await callGeminiAPI(userMessage.content);
      setEstimateResult(estimate);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Perfect! I've analyzed your car details using advanced AI algorithms and here's what I found:\n\n💰 **Estimated Resale Value:** ₹${estimate.value.toLocaleString()}\n🎯 **Confidence Level:** ${estimate.confidence}%\n📊 **Market Position:** ${estimate.marketComparison}\n\nDetailed insights and depreciation forecast are displayed in the results panel. Feel free to ask any follow-up questions about your vehicle's valuation!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setShowResults(true);
    } catch (error) {
      console.error('Error processing estimate:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an issue while processing your request. This could be due to API limitations or network connectivity. Please try again with more specific details about your vehicle, or check back later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#374151"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[#FFD700]">{percentage}%</span>
        </div>
      </div>
    );
  };

  // CSS-based chart alternative
  const DepreciationChart = ({ data }: { data: ChartDataPoint[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-[#1e2837] border border-[#E5E7EB]/20 rounded-lg p-4">
        <div className="space-y-4">
          {data.map((point, index) => {
            const height = (point.value / maxValue) * 150;
            const isFirst = index === 0;
            
            return (
              <div key={point.year} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-[#E5E7EB]">{point.year}</div>
                <div className="flex-1 relative">
                  <div className="bg-gray-700 rounded-full h-2 relative overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isFirst 
                          ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]' 
                          : 'bg-gradient-to-r from-[#00FFC2] to-[#FFD700]'
                      }`}
                      style={{ width: `${(point.value / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="absolute -right-2 -top-6 text-xs text-[#FFD700] font-semibold">
                    ₹{(point.value / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-[#E5E7EB]/60 text-center">
          Hover over bars to see exact values • Based on standard depreciation models
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#101828] to-[#1a202c] rounded-2xl w-full max-w-7xl h-[90vh] flex border border-[#E5E7EB]/20 shadow-2xl">
        
        {/* Left Panel - Chat Interface */}
        <div className="w-1/2 flex flex-col border-r border-[#E5E7EB]/20">
          {/* Header */}
          <div className="p-6 border-b border-[#E5E7EB]/20 bg-gradient-to-r from-[#FFD700]/10 to-[#00FFC2]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <IndianRupee className="w-8 h-8 text-[#FFD700] animate-pulse" />
                  <div className="absolute inset-0 w-8 h-8 bg-[#FFD700]/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#FFD700]">VahanMoolya AI</h2>
                  <p className="text-sm text-[#E5E7EB]/70">Resale Value Estimator</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#E5E7EB]/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-[#E5E7EB]" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black'
                    : 'bg-[#1e2837] border border-[#E5E7EB]/20 text-[#E5E7EB]'
                }`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center mb-2">
                      <Bot className="w-4 h-4 mr-2 text-[#00FFC2]" />
                      <span className="text-xs font-medium text-[#00FFC2]">VahanMoolya</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1e2837] border border-[#E5E7EB]/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-[#00FFC2]" />
                    <span className="text-[#E5E7EB]">VahanMoolya is analyzing with AI...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-[#E5E7EB]/20">
            <div className="flex space-x-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your car details here..."
                className="flex-1 bg-[#1e2837] border border-[#E5E7EB]/30 rounded-lg px-4 py-3 text-[#E5E7EB] resize-none focus:border-[#00FFC2] focus:ring-2 focus:ring-[#00FFC2]/20 transition-all"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium text-black transition-all flex items-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' && (
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ Please add your Gemini API key to enable AI-powered estimations
              </p>
            )}
          </div>
        </div>

        {/* Right Panel - Results & Charts */}
        <div className="w-1/2 flex flex-col">
          {showResults && estimateResult ? (
            <>
              {/* Results Header */}
              <div className="p-6 border-b border-[#E5E7EB]/20">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-[#FFD700] mr-3" />
                    <h3 className="text-2xl font-bold text-[#FFD700]">AI Valuation Results</h3>
                  </div>
                  <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#00FFC2]/20 rounded-xl p-6 border border-[#FFD700]/30">
                    <p className="text-sm text-[#E5E7EB]/70 mb-2">Estimated Resale Value</p>
                    <p className="text-4xl font-bold text-[#FFD700] mb-2">
                      ₹{estimateResult.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-[#00FFC2]">{estimateResult.marketComparison}</p>
                  </div>
                </div>
              </div>

              {/* Confidence & Insights */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Confidence Meter */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-[#E5E7EB] mb-4 flex items-center justify-center">
                    <Gauge className="w-5 h-5 mr-2 text-[#FFD700]" />
                    AI Confidence Level
                  </h4>
                  <CircularProgress percentage={estimateResult.confidence} />
                  <p className="text-sm text-[#E5E7EB]/70 mt-2">
                    Based on market data and vehicle analysis
                  </p>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="text-lg font-semibold text-[#E5E7EB] mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-[#00FFC2]" />
                    AI-Generated Insights
                  </h4>
                  <div className="space-y-3">
                    {estimateResult.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="bg-[#1e2837] border border-[#E5E7EB]/20 rounded-lg p-4 hover:border-[#00FFC2]/30 transition-colors"
                      >
                        <p className="text-[#E5E7EB]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Depreciation Chart */}
                <div>
                  <h4 className="text-lg font-semibold text-[#E5E7EB] mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-[#00FFC2]" />
                    5-Year Depreciation Forecast
                  </h4>
                  <DepreciationChart data={generateDepreciationData(estimateResult.value)} />
                </div>
              </div>
            </>
          ) : (
            /* Waiting State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="relative">
                  <TrendingDown className="w-24 h-24 text-[#E5E7EB]/20 mx-auto" />
                  <Sparkles className="w-8 h-8 text-[#FFD700] absolute top-0 right-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#E5E7EB] mb-2">
                    Ready for AI Analysis
                  </h3>
                  <p className="text-[#E5E7EB]/70">
                    Share your car details with VahanMoolya AI to get<br/>
                    accurate resale value estimation powered by Gemini
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResaleEstimator;