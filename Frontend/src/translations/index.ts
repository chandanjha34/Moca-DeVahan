export type LanguageKey = 'en' | 'hi' | 'es';

type TranslationObject = {
  [key: string]: string;
};

type TranslationsType = {
  [key in LanguageKey]: TranslationObject;
};

export const translations: TranslationsType = {
  en: {
    // Navigation
    'nav.myVehicles': 'My Vehicles',
    'nav.mintNFT': 'Mint NFT',
    'nav.transfer': 'Transfer',
    'nav.history': 'History',
    'nav.signIn': 'Sign In / Sign Up',
    'nav.signOut': 'Sign Out',
    
    // Home Page
    'home.title1': 'The Future of',
    'home.title2': 'Vehicle Ownership',
    'home.subtitle': 'Secure, transparent, and efficient vehicle ownership management powered by blockchain technology.',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    
    // Features
    'feature.secureOwnership.title': 'Secure Ownership',
    'feature.secureOwnership.desc': 'Blockchain-backed vehicle ownership records that cannot be tampered with.',
    'feature.instantTransfers.title': 'Instant Transfers',
    'feature.instantTransfers.desc': 'Transfer vehicle ownership securely and instantly with smart contracts.',
    'feature.completeHistory.title': 'Complete History',
    'feature.completeHistory.desc': 'Access the complete ownership and maintenance history of any vehicle.',
    
    // Auth Modal
    'auth.user': 'User',
    'auth.dealer': 'Dealer',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.name': 'Name',
    'auth.phone': 'Phone Number',
    'auth.address': 'Home Address',
    'auth.email': 'Email',
    'auth.walletPin': 'Wallet Pin',
    'auth.dealerId': 'Dealer ID',
    'auth.registerAsDealer': 'Register as Dealer',
    'auth.demoDealer': 'Demo Dealer: wallet 678',
    'auth.demoUser': 'Demo User: wallet 123',
    'auth.connectWallet': 'Connect MetaMask',
    'auth.walletConnected': 'Wallet Connected',
    'auth.connectingWallet': 'Connecting...',
    'auth.walletError': 'Error connecting wallet',
    
    // Vehicles Page
    'vehicles.title': 'My Vehicles',
    'vehicles.noVehicles': 'No vehicles available. All vehicles have been transferred.',
    'vehicles.plateNumber': 'Plate Number:',
    'vehicles.wallet': 'Wallet:',
    'vehicles.tokenId': 'Token ID:',
    'vehicles.transfer': 'Transfer',
    
    // Chatbot
    'chatbot.title': 'DeVahan Assistant',
    'chatbot.placeholder': 'Type your question here...',
    'chatbot.send': 'Send',
    'chatbot.welcome': 'Hello! I\'m your DeVahan assistant. How can I help you today?',
    
    // FAQ Questions
    'faq.q1': 'What is DeVahan?',
    'faq.q2': 'How does blockchain ensure vehicle ownership?',
    'faq.q3': 'What is an NFT vehicle title?',
    'faq.q4': 'How do I transfer my vehicle to someone else?',
    'faq.q5': 'Is my vehicle data secure?',
    'faq.q6': 'What happens if I lose my wallet credentials?',
    'faq.q7': 'How do I mint a new vehicle NFT?',
    'faq.q8': 'Can I see the history of my vehicle?',
    'faq.q9': 'Who can mint vehicle NFTs?',
    'faq.q10': 'What information is stored in the vehicle NFT?',
    'faq.q11': 'How is this different from traditional vehicle registration?',
    'faq.q12': 'Do I need technical knowledge to use DeVahan?',
    'faq.q13': 'What happens during a vehicle transfer?',
    'faq.q14': 'Can I use DeVahan on mobile devices?',
    'faq.q15': 'Is DeVahan available in my country?',
    'faq.q16': 'What fees are associated with transfers?',
    'faq.q17': 'How do I get started with DeVahan?',
    'faq.q18': 'Can I update my vehicle information?',
    'faq.q19': 'How do I connect my MetaMask wallet?',
    'faq.q20': 'What do I do if my transaction fails?',
    
    // FAQ Answers
    'faq.a1': 'DeVahan is a blockchain-based platform for secure and transparent vehicle ownership management. It uses NFTs to represent vehicle titles, ensuring tamper-proof records and easy transfers.',
    'faq.a2': 'Blockchain technology creates an immutable record of ownership that cannot be altered or tampered with. Each transaction is verified by a network of computers and permanently recorded, providing a transparent and secure chain of ownership.',
    'faq.a3': 'An NFT (Non-Fungible Token) vehicle title is a digital certificate of ownership stored on the blockchain. It contains all the vehicle\'s information and ownership history, making it unique and impossible to replicate.',
    'faq.a4': 'You can transfer your vehicle by selecting it from your inventory, clicking the Transfer button, entering the recipient\'s wallet address, and confirming the transaction. The transfer is instant and secure.',
    'faq.a5': 'Yes, all vehicle data is securely stored on the blockchain. Only you can access and transfer your vehicle information using your private keys. The data is encrypted and cannot be altered without authorization.',
    'faq.a6': 'If you lose your wallet credentials, you can use your recovery phrase to restore access. It\'s important to keep your recovery phrase in a safe place. Without it, you may lose access to your digital assets permanently.',
    'faq.a7': 'Only authorized dealers can mint new vehicle NFTs. If you\'re a dealer, you can click on "Mint NFT" in the navigation bar, fill in the vehicle details, and mint a new NFT for the vehicle.',
    'faq.a8': 'Yes, the complete history of your vehicle is accessible on the blockchain, including all previous owners, maintenance records, and transfers. You can view this history directly in the DeVahan application.',
    'faq.a9': 'Only authorized dealers and manufacturers can mint vehicle NFTs. This ensures that all vehicles on the platform are legitimate and properly registered.',
    'faq.a10': 'A vehicle NFT stores information such as the VIN, make, model, year, color, initial registration date, owner\'s wallet address, and a complete ownership history.',
    'faq.a11': 'Unlike traditional vehicle registration which relies on centralized databases and paper documents, DeVahan uses blockchain to create immutable, secure, and easily transferable digital ownership records that cannot be lost, damaged, or forged.',
    'faq.a12': 'No, DeVahan is designed to be user-friendly. You\'ll need a digital wallet like MetaMask, but the interface is intuitive and similar to other online services you\'re familiar with.',
    'faq.a13': 'During a vehicle transfer, the ownership record on the blockchain is updated. The NFT moves from your wallet to the recipient\'s wallet, with all vehicle history intact. This creates a permanent record of the transfer transaction.',
    'faq.a14': 'Yes, DeVahan is fully responsive and works on smartphones, tablets, and desktop computers. You can manage your vehicle ownership from anywhere.',
    'faq.a15': 'DeVahan is being rolled out globally. Check our website for the most up-to-date information about availability in your country.',
    'faq.a16': 'There is a small network fee (gas fee) for processing the transfer on the blockchain. The exact amount varies depending on network congestion but is typically minimal compared to traditional transfer costs.',
    'faq.a17': 'To get started, create an account, connect your MetaMask wallet, and either purchase a vehicle with an NFT title or have your existing vehicle added to the system by an authorized dealer.',
    'faq.a18': 'Yes, certain vehicle information can be updated by authorized parties. For example, service records can be added by authorized service centers. However, core details like the VIN cannot be altered.',
    'faq.a19': 'Click on "Sign In / Sign Up", select the "Connect MetaMask" option, and follow the prompts in the MetaMask extension. Once connected, your wallet address will be associated with your DeVahan account.',
    'faq.a20': 'If your transaction fails, check your wallet balance to ensure you have enough funds for the gas fee. If the problem persists, try again later when network congestion is lower, or contact our support team for assistance.'
  },
  hi: {
    // Navigation
    'nav.myVehicles': 'मेरे वाहन',
    'nav.mintNFT': 'NFT मिंट करें',
    'nav.transfer': 'ट्रांसफर',
    'nav.history': 'इतिहास',
    'nav.signIn': 'साइन इन / साइन अप',
    'nav.signOut': 'साइन आउट',
    
    // Home Page
    'home.title1': 'वाहन स्वामित्व का',
    'home.title2': 'भविष्य',
    'home.subtitle': 'ब्लॉकचेन तकनीक द्वारा संचालित सुरक्षित, पारदर्शी और कुशल वाहन स्वामित्व प्रबंधन।',
    'home.getStarted': 'शुरू करें',
    'home.learnMore': 'और जानें',
    
    // Features
    'feature.secureOwnership.title': 'सुरक्षित स्वामित्व',
    'feature.secureOwnership.desc': 'ब्लॉकचेन-समर्थित वाहन स्वामित्व रिकॉर्ड जिनके साथ छेड़छाड़ नहीं की जा सकती।',
    'feature.instantTransfers.title': 'तत्काल ट्रांसफर',
    'feature.instantTransfers.desc': 'स्मार्ट कॉन्ट्रैक्ट्स के साथ सुरक्षित और तत्काल वाहन स्वामित्व हस्तांतरण।',
    'feature.completeHistory.title': 'पूर्ण इतिहास',
    'feature.completeHistory.desc': 'किसी भी वाहन के पूर्ण स्वामित्व और रखरखाव इतिहास तक पहुंच।',
    
    // Auth Modal
    'auth.user': 'उपयोगकर्ता',
    'auth.dealer': 'डीलर',
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.name': 'नाम',
    'auth.phone': 'फोन नंबर',
    'auth.address': 'घर का पता',
    'auth.email': 'ईमेल',
    'auth.walletPin': 'वॉलेट पिन',
    'auth.dealerId': 'डीलर आईडी',
    'auth.registerAsDealer': 'डीलर के रूप में रजिस्टर करें',
    'auth.demoDealer': 'डेमो डीलर: वॉलेट 678',
    'auth.demoUser': 'डेमो उपयोगकर्ता: वॉलेट 123',
    'auth.connectWallet': 'मेटामास्क कनेक्ट करें',
    'auth.walletConnected': 'वॉलेट कनेक्ट हो गया',
    'auth.connectingWallet': 'कनेक्ट हो रहा है...',
    'auth.walletError': 'वॉलेट कनेक्ट करने में त्रुटि',
    
    // Vehicles Page
    'vehicles.title': 'मेरे वाहन',
    'vehicles.noVehicles': 'कोई वाहन उपलब्ध नहीं है। सभी वाहन ट्रांसफर कर दिए गए हैं।',
    'vehicles.plateNumber': 'प्लेट नंबर:',
    'vehicles.wallet': 'वॉलेट:',
    'vehicles.tokenId': 'टोकन आईडी:',
    'vehicles.transfer': 'ट्रांसफर',
    
    // Chatbot
    'chatbot.title': 'देवाहन सहायक',
    'chatbot.placeholder': 'अपना प्रश्न यहां टाइप करें...',
    'chatbot.send': 'भेजें',
    'chatbot.welcome': 'नमस्ते! मैं आपका देवाहन सहायक हूं। मैं आज आपकी कैसे मदद कर सकता हूं?',
    
    // Some FAQ Questions in Hindi (not all for brevity)
    'faq.q1': 'देवाहन क्या है?',
    'faq.q2': 'ब्लॉकचेन कैसे वाहन स्वामित्व सुनिश्चित करता है?',
    'faq.q3': 'NFT वाहन शीर्षक क्या है?',
    'faq.q4': 'मैं अपना वाहन किसी और को कैसे ट्रांसफर करूं?',
    'faq.q5': 'क्या मेरा वाहन डेटा सुरक्षित है?',
    'faq.q6': 'अगर मैं अपने वॉलेट क्रेडेंशियल्स खो दूं तो क्या होगा?',
    
    // Some FAQ Answers in Hindi (not all for brevity)
    'faq.a1': 'देवाहन एक ब्लॉकचेन-आधारित प्लेटफॉर्म है जो सुरक्षित और पारदर्शी वाहन स्वामित्व प्रबंधन के लिए है। यह वाहन शीर्षकों का प्रतिनिधित्व करने के लिए NFT का उपयोग करता है, जो छेड़छाड़-प्रूफ रिकॉर्ड और आसान ट्रांसफर सुनिश्चित करता है।',
    'faq.a2': 'ब्लॉकचेन तकनीक स्वामित्व का एक अपरिवर्तनीय रिकॉर्ड बनाती है जिसे बदला या छेड़छाड़ नहीं किया जा सकता। प्रत्येक लेनदेन कंप्यूटरों के नेटवर्क द्वारा सत्यापित किया जाता है और स्थायी रूप से रिकॉर्ड किया जाता है, जो स्वामित्व की एक पारदर्शी और सुरक्षित श्रृंखला प्रदान करता है।'
  },
 "es": {
    // Navigation
    "nav.myVehicles": "ਮੇਰੇ ਵਾਹਨ",
    "nav.mintNFT": "NFT ਬਣਾਓ",
    "nav.transfer": "ਟ੍ਰਾਂਸਫਰ",
    "nav.history": "ਇਤਿਹਾਸ",
    "nav.signIn": "ਲੌਗਿਨ / ਰਜਿਸਟਰ",
    "nav.signOut": "ਲੌਗਆਉਟ",
    
    // Home Page
    "home.title1": "ਭਵਿੱਖ ਵਾਹਨ",
    "home.title2": "ਮਲਕੀਅਤ ਦਾ",
    "home.subtitle": "ਬਲਾਕਚੇਨ ਤਕਨਾਲੋਜੀ ਨਾਲ ਚਲਾਏ ਜਾ ਰਹੇ ਸੁਰੱਖਿਅਤ, ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਵਾਹਨ ਮਲਕੀਅਤ ਪ੍ਰਬੰਧਨ।",
    "home.getStarted": "ਸ਼ੁਰੂ ਕਰੋ",
    "home.learnMore": "ਹੋਰ ਜਾਣੋ",
    
    // Features
    "feature.secureOwnership.title": "ਸੁਰੱਖਿਅਤ ਮਲਕੀਅਤ",
    "feature.secureOwnership.desc": "ਬਲਾਕਚੇਨ ਨਾਲ ਬੈਕਡ ਵਾਹਨ ਮਲਕੀਅਤ ਰਿਕਾਰਡ ਜੋ ਬਦਲਣਯੋਗ ਨਹੀਂ ਹਨ।",
    "feature.instantTransfers.title": "ਤੁਰੰਤ ਟ੍ਰਾਂਸਫਰ",
    "feature.instantTransfers.desc": "ਸਮਾਰਟ ਕਾਨਟ੍ਰੈਕਟਾਂ ਨਾਲ ਵਾਹਨ ਮਲਕੀਅਤ ਸੁਰੱਖਿਅਤ ਅਤੇ ਤੁਰੰਤ ਟ੍ਰਾਂਸਫਰ ਕਰੋ।",
    "feature.completeHistory.title": "ਪੂਰਾ ਇਤਿਹਾਸ",
    "feature.completeHistory.desc": "ਕਿਸੇ ਵੀ ਵਾਹਨ ਦੇ ਪੂਰੇ ਮਲਕੀਅਤ ਅਤੇ ਰਖ-ਰਖਾਵ ਦੇ ਇਤਿਹਾਸ ਤੱਕ ਪਹੁੰਚ।",
    
    // Auth Modal
    "auth.user": "ਯੂਜ਼ਰ",
    "auth.dealer": "ਡਿਲਰ",
    "auth.signIn": "ਲੌਗਿਨ",
    "auth.signUp": "ਰਜਿਸਟਰ",
    "auth.name": "ਨਾਂ",
    "auth.phone": "ਫੋਨ ਨੰਬਰ",
    "auth.address": "ਪਤਾ",
    "auth.email": "ਈਮੇਲ",
    "auth.walletPin": "ਵਾਲਟ ਪਿਨ",
    "auth.dealerId": "ਡਿਲਰ ਆਈਡੀ",
    "auth.registerAsDealer": "ਡਿਲਰ ਵਜੋਂ ਰਜਿਸਟਰ ਕਰੋ",
    "auth.demoDealer": "ਡੈਮੋ ਡਿਲਰ: ਵਾਲਟ 678",
    "auth.demoUser": "ਡੈਮੋ ਯੂਜ਼ਰ: ਵਾਲਟ 123",
    "auth.connectWallet": "ਮੈਟਾਮਾਸਕ ਨਾਲ ਜੁੜੋ",
    "auth.walletConnected": "ਵਾਲਟ ਜੁੜਿਆ",
    "auth.connectingWallet": "ਜੁੜ ਰਿਹਾ ਹੈ...",
    "auth.walletError": "ਵਾਲਟ ਨਾਲ ਜੁੜਨ ਵਿੱਚ ਗਲਤੀ",
    
    // Vehicles Page
    "vehicles.title": "ਮੇਰੇ ਵਾਹਨ",
    "vehicles.noVehicles": "ਕੋਈ ਵਾਹਨ ਉਪਲਬਧ ਨਹੀਂ। ਸਾਰੇ ਵਾਹਨ ਟ੍ਰਾਂਸਫਰ ਕਰ ਦਿੱਤੇ ਗਏ ਹਨ।",
    "vehicles.plateNumber": "ਪਲੇਟ ਨੰਬਰ:",
    "vehicles.wallet": "ਵਾਲਟ:",
    "vehicles.tokenId": "ਟੋਕਨ ਆਈਡੀ:",
    "vehicles.transfer": "ਟ੍ਰਾਂਸਫਰ ਕਰੋ",
    
    // Chatbot
    "chatbot.title": "ਦੇਵਾਹਨ ਸਹਾਇਕ",
    "chatbot.placeholder": "ਇਥੇ ਆਪਣਾ ਪ੍ਰਸ਼ਨ ਲਿਖੋ...",
    "chatbot.send": "ਭੇਜੋ",
    "chatbot.welcome": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਦੇਵਾਹਨ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਸ ਤਰ੍ਹਾਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    
    // Some FAQ Questions in Punjabi (not all for brevity)
    "faq.q1": "ਦੇਵਾਹਨ ਕੀ ਹੈ?",
    "faq.q2": "ਬਲਾਕਚੇਨ ਵਾਹਨ ਦੀ ਮਲਕੀਅਤ ਨੂੰ ਕਿਵੇਂ ਯਕੀਨੀ ਬਨਾਉਂਦਾ ਹੈ?",
    "faq.q3": "ਵਾਹਨ NFT ਟਾਈਟਲ ਕੀ ਹੈ?",
    "faq.q4": "ਮੈਂ ਆਪਣੇ ਵਾਹਨ ਨੂੰ ਦੂਜੇ ਵਿਅਕਤੀ ਨੂੰ ਕਿਵੇਂ ਟ੍ਰਾਂਸਫਰ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "faq.q5": "ਮੇਰੇ ਵਾਹਨ ਡੇਟਾ ਸੁਰੱਖਿਅਤ ਹਨ?",
    "faq.q6": "ਜੇ ਮੈਂ ਆਪਣੀਆਂ ਵਾਲਟ ਕ੍ਰਿਡੇੰਸ਼ੀਅਲ ਗੁਆ ਲਵਾਂ ਤਾਂ ਕੀ ਹੁੰਦਾ ਹੈ?",
    
    // Some FAQ Answers in Punjabi (not all for brevity)
    "faq.a1": "ਦੇਵਾਹਨ ਇੱਕ ਬਲਾਕਚੇਨ ਅਧਾਰਤ ਪਲੇਟਫਾਰਮ ਹੈ ਜੋ ਵਾਹਨ ਮਲਕੀਅਤ ਦੇ ਸੁਰੱਖਿਅਤ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਪ੍ਰਬੰਧਨ ਲਈ ਹੈ। ਇਹ NFT ਨੂੰ ਵਰਤਦਾ ਹੈ ਵਾਹਨ ਦੇ ਟਾਈਟਲਾਂ ਦਾ ਪ੍ਰਤੀਨਿਧਿਤ ਕਰਨ ਲਈ, ਬਦਲਾਅ-ਪ੍ਰਤੀਰੋਧਕ ਰਿਕਾਰਡ ਅਤੇ ਆਸਾਨ ਟ੍ਰਾਂਸਫਰਾਂ ਦੀ ਗਰੰਟੀ ਦਿੰਦਾ ਹੈ।",
    "faq.a2": "ਬਲਾਕਚੇਨ ਤਕਨਾਲੋਜੀ ਇੱਕ ਅਪਰਿਵਰਤਨਸ਼ੀਲ ਮਲਕੀਅਤ ਰਿਕਾਰਡ ਬਣਾਉਂਦੀ ਹੈ ਜਿਸ ਨੂੰ ਬਦਲਿਆ ਜਾਂ ਸੰਸ਼ੋਧਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ। ਹਰੇਕ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਨੂੰ ਕੰਪਿਊਟਰਾਂ ਦੇ ਨੈਟਵਰਕ ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਸਥਾਈ ਤੌਰ 'ਤੇ ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਜੋ ਇੱਕ ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਮਲਕੀਅਤ ਦੀ ਲੜੀ ਮੁਹੱਈਆ ਕਰਦਾ ਹੈ।"
  }
};