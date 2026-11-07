import React, { useState, useEffect, useMemo, useContext, createContext, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';




/* =========================================================
   1. CONSTANTS, DATE HELPERS, STORAGE
   ========================================================= */
const KEY = 'grantly.v4'; // v4 starts with a clean, student-owned profile
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);
const TEXT = {
  en: { how:'How it works', explore:'Explore scholarships', about:'About', signin:'Sign in', start:'Get started',
    badge:'Verified academic directory', hero:'Your next opportunity deserves to be found.',
    lead:'Discover scholarships that match your academic journey, understand what you qualify for, and navigate every application with confidence.',
    find:'Find my scholarships', opportunities:'Explore opportunities', dashboard:'Overview / Dashboard', discover:'Discover Scholarships',
    matches:'Smart Scholarship Match', simulator:'What-If Simulator', documents:'Document Readiness Scanner', applications:'My Applications', radar:'Opportunity Radar & Shortlist', ask:'Ask GRANTLY', profile:'Edit student profile' },
  ta: { how:'எப்படி செயல்படுகிறது', explore:'உதவித்தொகைகளை ஆராயுங்கள்', about:'எங்களைப் பற்றி', signin:'உள்நுழைக', start:'தொடங்குங்கள்',
    badge:'சரிபார்க்கப்பட்ட கல்வி அடைவு', hero:'உங்கள் அடுத்த வாய்ப்பு கண்டறியப்பட வேண்டியது.',
    lead:'உங்கள் கல்விப் பயணத்திற்குப் பொருந்தும் உதவித்தொகைகளை கண்டறிந்து, தகுதியை புரிந்து கொண்டு, நம்பிக்கையுடன் விண்ணப்பிக்க GRANTLY உதவுகிறது.',
    find:'உதவித்தொகைகளை கண்டறி', opportunities:'வாய்ப்புகளை ஆராய்', dashboard:'முகப்பு', discover:'உதவித்தொகைகளை கண்டறி',
    matches:'பொருத்தமான உதவித்தொகைகள்', simulator:'என்ன ஆகும்? கணிப்பான்', documents:'ஆவணத் தயார்நிலை', applications:'எனது விண்ணப்பங்கள்', radar:'காலக்கெடு கண்காணிப்பு', ask:'GRANTLY-யிடம் கேளுங்கள்', profile:'மாணவர் விவரத்தைத் திருத்து', matchTitle:'பொருத்தமான உதவித்தொகைகள்', simTitle:'என்ன ஆகும்? கணிப்பான்', docsTitle:'ஆவணத் தயார்நிலை சரிபார்ப்பு', appsTitle:'எனது விண்ணப்பப் பயணம்', radarTitle:'உதவித்தொகை காலக்கெடு கண்காணிப்பு' }
};
const tr = (lang, key) => TEXT[lang]?.[key] || TEXT.en[key] || key;

const UI_TRANSLATIONS = {
  ta: {
    'How it works':'எப்படி செயல்படுகிறது','Explore scholarships':'உதவித்தொகைகளை ஆராயுங்கள்','About':'பற்றி','Sign in':'உள்நுழைக','Get started':'தொடங்குங்கள்',
    'Verified academic directory':'சரிபார்க்கப்பட்ட கல்வி உதவித்தொகைத் தொகுப்பு','Your next opportunity deserves to be found.':'உங்களுக்கான அடுத்த வாய்ப்பை கண்டறியுங்கள்.',
    'Discover scholarships that match your academic journey, understand what you qualify for, and navigate every application with confidence.':'உங்கள் கல்விப் பயணத்திற்குப் பொருந்தும் உதவித்தொகைகளை கண்டறிந்து, உங்கள் தகுதியை அறிந்து, நம்பிக்கையுடன் விண்ணப்பிக்க GRANTLY உதவுகிறது.',
    'Find my scholarships':'எனக்கான உதவித்தொகைகளை கண்டறி','Explore opportunities':'வாய்ப்புகளை ஆராய்','A clearer path from discovery to application readiness.':'வாய்ப்புகளை கண்டறிவதிலிருந்து விண்ணப்பத்திற்குத் தயாராகும் வரை தெளிவான வழிகாட்டுதல்.',
    'How GRANTLY works':'GRANTLY எவ்வாறு செயல்படுகிறது','Three simple steps to find and secure financial aid.':'கல்வி உதவித்தொகையை கண்டறிய மூன்று எளிய படிகள்.',
    'Build your student profile':'மாணவர் சுயவிவரத்தை உருவாக்குங்கள்','Tell us about your education and background so we can find scholarships relevant to you.':'உங்களுக்குப் பொருத்தமான உதவித்தொகைகளை கண்டறிய உங்கள் கல்வி விவரங்களை உள்ளிடுங்கள்.',
    'Discover your opportunities':'உங்களுக்கான வாய்ப்புகளை கண்டறியுங்கள்','See which scholarships you qualify for, and what you are missing for the rest.':'எந்த உதவித்தொகைகளுக்கு நீங்கள் தகுதியானவர், எவற்றுக்கு கூடுதல் விவரங்கள் தேவை என்பதை அறியுங்கள்.',
    'Apply with confidence':'நம்பிக்கையுடன் விண்ணப்பியுங்கள்','Upload documents, track their expiry dates, and follow every application step.':'ஆவணங்களை பதிவேற்றி, காலாவதி தேதிகளை கண்காணித்து, விண்ணப்பத்தின் ஒவ்வொரு படியையும் தொடருங்கள்.',
    'Built for applicant trust and clarity':'நம்பிக்கையும் தெளிவும் கொண்ட விண்ணப்ப அனுபவம்','A student-first approach to guidance without paywalls or misleading promotions.':'மாணவர்களை முன்னிலைப்படுத்தும், மறைமுகக் கட்டணங்களும் தவறான விளம்பரங்களும் இல்லாத வழிகாட்டுதல்.',
    'Transparent eligibility':'தெளிவான தகுதி விவரங்கள்','See exactly which criteria you meet and which you do not.':'நீங்கள் பூர்த்தி செய்த மற்றும் பூர்த்தி செய்யாத நிபந்தனைகளை தெளிவாக அறியுங்கள்.',
    'Document readiness':'ஆவணத் தயார்நிலை','Check format, size and validity before you submit anywhere.':'சமர்ப்பிப்பதற்கு முன் கோப்பு வடிவம், அளவு மற்றும் செல்லுபடியாகும் காலத்தை சரிபாருங்கள்.',
    'Application guidance':'விண்ணப்ப வழிகாட்டுதல்','Step-by-step instructions to apply on official portals.':'அதிகாரப்பூர்வ இணையதளங்களில் விண்ணப்பிக்க படிப்படியான வழிமுறைகள்.',
    'Student privacy':'மாணவர் தனியுரிமை','Your documents stay in your browser. Nothing is sold or shared.':'உங்கள் ஆவணங்கள் உங்கள் உலாவியிலேயே இருக்கும். அவை விற்கப்படவோ பகிரப்படவோ மாட்டாது.',
    'Your scholarship journey starts here.':'உங்கள் உதவித்தொகைப் பயணம் இங்கே தொடங்குகிறது.','Create your student profile and discover opportunities that match your goals.':'மாணவர் சுயவிவரத்தை உருவாக்கி உங்கள் இலக்குகளுக்குப் பொருந்தும் வாய்ப்புகளை கண்டறியுங்கள்.',
    'Start my scholarship search':'உதவித்தொகை தேடலைத் தொடங்கு','GRANTLY is an independent scholarship guidance tool. Official applications are completed on the respective provider portals.':'GRANTLY ஒரு சுயாதீன உதவித்தொகை வழிகாட்டி தளம். அதிகாரப்பூர்வ விண்ணப்பங்கள் சம்பந்தப்பட்ட நிறுவன இணையதளங்களில் சமர்ப்பிக்கப்பட வேண்டும்.',
    'Overview / Dashboard':'கண்ணோட்டம் / முகப்பு','Discover Scholarships':'உதவித்தொகைகளை கண்டறி','Smart Scholarship Match':'சிறந்த உதவித்தொகைப் பொருத்தம்','What-If Simulator':'என்ன ஆகும்? சோதனை','Document Readiness Scanner':'ஆவணத் தயார்நிலை சரிபார்ப்பு','My Applications':'எனது விண்ணப்பங்கள்','Opportunity Radar & Shortlist':'வாய்ப்பு கண்காணிப்பு மற்றும் சேமிப்பு','Ask GRANTLY':'GRANTLY-யிடம் கேளுங்கள்','Edit student profile':'மாணவர் விவரத்தைத் திருத்து','Dossier & Exploration':'சுயவிவரம் மற்றும் தேடல்','Operational Pipeline':'விண்ணப்ப செயல்முறை','Advisory Intelligence':'வழிகாட்டுதல்','Your account':'உங்கள் கணக்கு','Active dossier':'செயலில் உள்ள சுயவிவரம்','New student':'புதிய மாணவர்','Study year not added':'படிக்கும் ஆண்டு சேர்க்கப்படவில்லை','Course not added':'பாடநெறி சேர்க்கப்படவில்லை','Search scholarships…':'உதவித்தொகைகளைத் தேடுங்கள்…','Profile:':'சுயவிவரம்:','Complete profile':'சுயவிவரத்தை நிறைவு செய்','Student':'மாணவர்','Back to top':'மேலே செல்லுங்கள்',
    'Personal details':'தனிப்பட்ட விவரங்கள்','Academic details':'கல்வி விவரங்கள்','Financial details':'நிதி விவரங்கள்','Review your information':'உங்கள் விவரங்களை சரிபாருங்கள்','Full name':'முழுப் பெயர்','Email address':'மின்னஞ்சல் முகவரி','Phone number':'தொலைபேசி எண்','State':'மாநிலம்','District':'மாவட்டம்','Education level':'கல்வி நிலை','Course / Stream':'பாடநெறி / பிரிவு','Institution name':'கல்வி நிறுவனத்தின் பெயர்','Current year of study':'தற்போதைய படிப்பு ஆண்டு','Annual family income (₹)':'குடும்பத்தின் ஆண்டு வருமானம் (₹)','Current CGPA':'தற்போதைய CGPA','Community category':'சமூகப் பிரிவு','Save profile':'சுயவிவரத்தைச் சேமி','Continue':'தொடரவும்','Back':'பின்னால்','Next':'அடுத்து','Cancel':'ரத்து செய்','Save changes':'மாற்றங்களைச் சேமி','Edit profile':'சுயவிவரத்தைத் திருத்து',
    'Search':'தேடு','Filters':'வடிகட்டிகள்','All scholarships':'அனைத்து உதவித்தொகைகளும்','Sort by':'வரிசைப்படுத்து','Deadline':'கடைசி தேதி','Provider':'வழங்கும் நிறுவனம்','Award amount':'வழங்கப்படும் தொகை','Eligibility':'தகுதி','Matched':'பொருந்துகிறது','Not matched':'பொருந்தவில்லை','Missing':'விடுபட்டது','Required':'தேவை','Optional':'விருப்பத்தேர்வு','View details':'விவரங்களைப் பார்க்க','Save scholarship':'உதவித்தொகையைச் சேமி','Remove from shortlist':'சேமித்த பட்டியலிலிருந்து நீக்கு','No scholarships found':'உதவித்தொகைகள் எதுவும் கிடைக்கவில்லை','Try changing your filters.':'வடிகட்டிகளை மாற்றிப் பாருங்கள்.',
    'Explore possibilities safely':'பாதுகாப்பாக மாற்று நிலைகளை ஆராயுங்கள்','Try different study or income scenarios to understand how requirements may change. Your saved student profile will not be edited.':'தேவைகள் எவ்வாறு மாறுகின்றன என்பதைப் புரிந்துகொள்ள கல்வி அல்லது வருமான நிலைகளை மாற்றிப் பாருங்கள். உங்கள் உண்மையான சுயவிவரம் மாற்றப்படாது.',
    'Explore a scenario':'ஒரு நிலையைச் சோதியுங்கள்','Scenario result':'சோதனை முடிவு','Scholarship':'உதவித்தொகை','Study stream':'படிப்புப் பிரிவு','Reset to my profile':'எனது சுயவிவரத்திற்கு மீட்டமை','HYPOTHETICAL SCREENING':'கற்பனை அடிப்படையிலான சரிபார்ப்பு','All listed checks met':'குறிப்பிட்ட நிபந்தனைகள் அனைத்தும் பூர்த்தி','Some requirements need review':'சில நிபந்தனைகளை மீண்டும் சரிபார்க்க வேண்டும்','Compare other scholarships':'மற்ற உதவித்தொகைகளுடன் ஒப்பிடுங்கள்',
    'Document Readiness':'ஆவணத் தயார்நிலை','Upload document':'ஆவணத்தைப் பதிவேற்று','Replace':'மாற்று','Remove':'நீக்கு','Preview':'முன்னோட்டம்','Uploaded':'பதிவேற்றப்பட்டது','Not uploaded':'பதிவேற்றப்படவில்லை','Expired':'காலாவதியானது','Expiring soon':'விரைவில் காலாவதியாகும்','Ready':'தயார்','Incomplete':'முழுமையில்லை','Application progress':'விண்ணப்ப முன்னேற்றம்','Discovered':'கண்டறியப்பட்டது','Eligibility checked':'தகுதி சரிபார்க்கப்பட்டது','Documents prepared':'ஆவணங்கள் தயாரிக்கப்பட்டன','Application submitted':'விண்ணப்பம் சமர்ப்பிக்கப்பட்டது','Awaiting update':'புதுப்பிப்புக்காக காத்திருக்கிறது','In progress':'செயல்பாட்டில் உள்ளது','Not started':'தொடங்கவில்லை','Completed':'நிறைவு பெற்றது','Closing soon':'விரைவில் முடிவடைகிறது','Upcoming':'வரவிருக்கும்','Saved':'சேமிக்கப்பட்டது','Remind me':'எனக்கு நினைவூட்டு','Export calendar':'நாட்காட்டிக்கு ஏற்றுமதி செய்',
    'Ask a question':'கேள்வி கேளுங்கள்','Send':'அனுப்பு','Type your question…':'உங்கள் கேள்வியை எழுதுங்கள்…','Page not found':'பக்கம் கிடைக்கவில்லை','The page you are looking for does not exist.':'நீங்கள் தேடும் பக்கம் இல்லை.','Go to dashboard':'முகப்புக்குச் செல்லுங்கள்','This is a hypothetical comparison only. Never change or misrepresent official application information.':'இது கற்பனை அடிப்படையிலான ஒப்பீடு மட்டுமே. அதிகாரப்பூர்வ விண்ணப்ப விவரங்களை மாற்றவோ தவறாகக் குறிப்பிடவோ வேண்டாம்.'
  },
  hi: {
    'How it works':'यह कैसे काम करता है','Explore scholarships':'छात्रवृत्तियाँ देखें','About':'परिचय','Sign in':'साइन इन','Get started':'शुरू करें',
    'Verified academic directory':'सत्यापित छात्रवृत्ति निर्देशिका','Your next opportunity deserves to be found.':'आपका अगला अवसर खोजे जाने योग्य है।',
    'Discover scholarships that match your academic journey, understand what you qualify for, and navigate every application with confidence.':'अपनी पढ़ाई के अनुरूप छात्रवृत्तियाँ खोजें, अपनी पात्रता समझें और हर आवेदन को आत्मविश्वास से पूरा करें।',
    'Find my scholarships':'मेरी छात्रवृत्तियाँ खोजें','Explore opportunities':'अवसर देखें','A clearer path from discovery to application readiness.':'अवसर खोजने से आवेदन की तैयारी तक एक स्पष्ट रास्ता।',
    'How GRANTLY works':'GRANTLY कैसे काम करता है','Three simple steps to find and secure financial aid.':'शैक्षिक सहायता पाने के लिए तीन आसान चरण।',
    'Build your student profile':'अपनी छात्र प्रोफ़ाइल बनाएँ','Tell us about your education and background so we can find scholarships relevant to you.':'अपनी शिक्षा और पृष्ठभूमि की जानकारी दें ताकि आपके लिए उपयुक्त छात्रवृत्तियाँ मिल सकें।',
    'Discover your opportunities':'अपने अवसर खोजें','See which scholarships you qualify for, and what you are missing for the rest.':'जानें कि आप किन छात्रवृत्तियों के पात्र हैं और बाकी के लिए क्या आवश्यक है।',
    'Apply with confidence':'आत्मविश्वास से आवेदन करें','Upload documents, track their expiry dates, and follow every application step.':'दस्तावेज़ अपलोड करें, उनकी समाप्ति तिथि देखें और आवेदन के हर चरण पर नज़र रखें।',
    'Built for applicant trust and clarity':'विश्वास और स्पष्टता के लिए बनाया गया','A student-first approach to guidance without paywalls or misleading promotions.':'बिना छिपे शुल्क या भ्रामक प्रचार के, छात्रों को प्राथमिकता देने वाला मार्गदर्शन।',
    'Transparent eligibility':'पात्रता में पारदर्शिता','See exactly which criteria you meet and which you do not.':'स्पष्ट रूप से देखें कि कौन-सी शर्तें पूरी हैं और कौन-सी नहीं।',
    'Document readiness':'दस्तावेज़ की तैयारी','Check format, size and validity before you submit anywhere.':'कहीं भी जमा करने से पहले फ़ाइल का प्रारूप, आकार और वैधता जाँचें।',
    'Application guidance':'आवेदन मार्गदर्शन','Step-by-step instructions to apply on official portals.':'आधिकारिक पोर्टल पर आवेदन करने के चरण-दर-चरण निर्देश।',
    'Student privacy':'छात्र गोपनीयता','Your documents stay in your browser. Nothing is sold or shared.':'आपके दस्तावेज़ आपके ब्राउज़र में रहते हैं। उन्हें बेचा या साझा नहीं किया जाता।',
    'Your scholarship journey starts here.':'आपकी छात्रवृत्ति यात्रा यहाँ से शुरू होती है।','Create your student profile and discover opportunities that match your goals.':'अपनी छात्र प्रोफ़ाइल बनाएँ और अपने लक्ष्यों के अनुरूप अवसर खोजें।',
    'Start my scholarship search':'छात्रवृत्ति खोज शुरू करें','GRANTLY is an independent scholarship guidance tool. Official applications are completed on the respective provider portals.':'GRANTLY एक स्वतंत्र छात्रवृत्ति मार्गदर्शन मंच है। आधिकारिक आवेदन संबंधित प्रदाता पोर्टल पर ही पूरे किए जाते हैं।',
    'Overview / Dashboard':'अवलोकन / डैशबोर्ड','Discover Scholarships':'छात्रवृत्तियाँ खोजें','Smart Scholarship Match':'स्मार्ट छात्रवृत्ति मिलान','What-If Simulator':'क्या हो अगर? सिम्युलेटर','Document Readiness Scanner':'दस्तावेज़ तैयारी जाँच','My Applications':'मेरे आवेदन','Opportunity Radar & Shortlist':'अवसर रडार और शॉर्टलिस्ट','Ask GRANTLY':'GRANTLY से पूछें','Edit student profile':'छात्र प्रोफ़ाइल संपादित करें','Dossier & Exploration':'प्रोफ़ाइल और खोज','Operational Pipeline':'आवेदन प्रक्रिया','Advisory Intelligence':'मार्गदर्शन','Your account':'आपका खाता','Active dossier':'सक्रिय प्रोफ़ाइल','New student':'नया छात्र','Study year not added':'अध्ययन वर्ष नहीं जोड़ा गया','Course not added':'पाठ्यक्रम नहीं जोड़ा गया','Search scholarships…':'छात्रवृत्तियाँ खोजें…','Profile:':'प्रोफ़ाइल:','Complete profile':'प्रोफ़ाइल पूरी करें','Student':'छात्र','Back to top':'ऊपर जाएँ',
    'Personal details':'व्यक्तिगत विवरण','Academic details':'शैक्षणिक विवरण','Financial details':'वित्तीय विवरण','Review your information':'अपनी जानकारी जाँचें','Full name':'पूरा नाम','Email address':'ईमेल पता','Phone number':'फ़ोन नंबर','State':'राज्य','District':'ज़िला','Education level':'शिक्षा स्तर','Course / Stream':'पाठ्यक्रम / विषय','Institution name':'संस्थान का नाम','Current year of study':'वर्तमान अध्ययन वर्ष','Annual family income (₹)':'परिवार की वार्षिक आय (₹)','Current CGPA':'वर्तमान CGPA','Community category':'सामुदायिक श्रेणी','Save profile':'प्रोफ़ाइल सहेजें','Continue':'जारी रखें','Back':'वापस','Next':'आगे','Cancel':'रद्द करें','Save changes':'बदलाव सहेजें','Edit profile':'प्रोफ़ाइल संपादित करें',
    'Search':'खोजें','Filters':'फ़िल्टर','All scholarships':'सभी छात्रवृत्तियाँ','Sort by':'क्रमबद्ध करें','Deadline':'अंतिम तिथि','Provider':'प्रदाता','Award amount':'पुरस्कार राशि','Eligibility':'पात्रता','Matched':'मेल खाता है','Not matched':'मेल नहीं खाता','Missing':'अनुपलब्ध','Required':'आवश्यक','Optional':'वैकल्पिक','View details':'विवरण देखें','Save scholarship':'छात्रवृत्ति सहेजें','Remove from shortlist':'शॉर्टलिस्ट से हटाएँ','No scholarships found':'कोई छात्रवृत्ति नहीं मिली','Try changing your filters.':'अपने फ़िल्टर बदलकर देखें.',
    'Explore possibilities safely':'सुरक्षित रूप से संभावनाएँ देखें','Try different study or income scenarios to understand how requirements may change. Your saved student profile will not be edited.':'आवश्यकताएँ कैसे बदल सकती हैं, यह समझने के लिए पढ़ाई या आय की अलग-अलग स्थितियाँ आज़माएँ। आपकी सहेजी गई प्रोफ़ाइल नहीं बदलेगी।',
    'Explore a scenario':'एक स्थिति आज़माएँ','Scenario result':'स्थिति का परिणाम','Scholarship':'छात्रवृत्ति','Reset to my profile':'मेरी प्रोफ़ाइल पर रीसेट करें','HYPOTHETICAL SCREENING':'काल्पनिक जाँच','All listed checks met':'सभी सूचीबद्ध शर्तें पूरी','Some requirements need review':'कुछ आवश्यकताओं की समीक्षा ज़रूरी है','Compare other scholarships':'अन्य छात्रवृत्तियों से तुलना करें',
    'Upload document':'दस्तावेज़ अपलोड करें','Replace':'बदलें','Remove':'हटाएँ','Preview':'पूर्वावलोकन','Uploaded':'अपलोड किया गया','Not uploaded':'अपलोड नहीं किया गया','Expired':'समाप्त हो चुका','Expiring soon':'जल्द समाप्त होगा','Ready':'तैयार','Incomplete':'अधूरा','Application progress':'आवेदन की प्रगति','Discovered':'खोजा गया','Eligibility checked':'पात्रता जाँची गई','Documents prepared':'दस्तावेज़ तैयार','Application submitted':'आवेदन जमा किया गया','Awaiting update':'अपडेट की प्रतीक्षा','In progress':'प्रगति पर','Not started':'शुरू नहीं हुआ','Completed':'पूरा हुआ','Closing soon':'जल्द बंद होगा','Upcoming':'आगामी','Saved':'सहेजा गया','Remind me':'मुझे याद दिलाएँ','Export calendar':'कैलेंडर में जोड़ें',
    'Ask a question':'प्रश्न पूछें','Send':'भेजें','Type your question…':'अपना प्रश्न लिखें…','Page not found':'पृष्ठ नहीं मिला','The page you are looking for does not exist.':'आप जो पृष्ठ खोज रहे हैं, वह उपलब्ध नहीं है।','Go to dashboard':'डैशबोर्ड पर जाएँ','This is a hypothetical comparison only. Never change or misrepresent official application information.':'यह केवल काल्पनिक तुलना है। आधिकारिक आवेदन की जानकारी कभी न बदलें और न ही गलत बताएँ।'
  }
};
const translationOriginals = new WeakMap();
function translateUiNode(node, lang) {
  if (node.nodeType === Node.TEXT_NODE) {
    const current = node.nodeValue;
    let state = translationOriginals.get(node);
    if (!state || current !== state.last) state = { original: current, last: current };
    const raw = state.original;
    const trimmed = raw.trim();
    const dict = UI_TRANSLATIONS[lang] || {};
    const translated = dict[trimmed];
    const left = raw.match(/^\s*/)?.[0] || '';
    const right = raw.match(/\s*$/)?.[0] || '';
    const nextValue = translated ? left + translated + right : raw;
    // Avoid writing an unchanged value: the MutationObserver watches characterData.
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    state.last = nextValue;
    translationOriginals.set(node, state);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (const attr of ['placeholder','title','aria-label']) {
      if (!node.hasAttribute(attr)) continue;
      const key = '__'+attr;
      let state = node[key];
      const current = node.getAttribute(attr);
      if (!state || current !== state.last) state = { original: current, last: current };
      const translated = (UI_TRANSLATIONS[lang] || {})[state.original];
      const nextValue = translated || state.original;
      // Avoid unchanged attribute writes: the MutationObserver watches these attributes.
      if (current !== nextValue) node.setAttribute(attr, nextValue);
      state.last = nextValue;
      node[key] = state;
    }
  }
}
function translateUiTree(root, lang) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = root;
  translateUiNode(node, lang);
  while ((node = walker.nextNode())) translateUiNode(node, lang);
}


const uid = () => Math.random().toString(36).slice(2, 9);
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const todayISO = () => toISO(new Date());
const addDays = (n) => { const d = startOfToday(); d.setDate(d.getDate() + n); return toISO(d); };
const parseDate = (s) => (s ? new Date(s + 'T00:00:00') : null);
const daysUntil = (s) => Math.ceil((parseDate(s) - startOfToday()) / 86400000);
const fmt = (s) => (s ? parseDate(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const acStartYear = () => { const d = new Date(); return d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1; };
const acStart = () => `${acStartYear()}-07-01`;
const acLabel = () => `${acStartYear()}–${String(acStartYear() + 1).slice(2)}`;

const DOC_TYPES = {
  aadhaar: {
    label: 'Aadhaar Card', issuer: 'UIDAI', validityDays: null,
    why: 'Identity is verified against your Aadhaar for NSP and most government portals.',
    next: 'Keep a clear, complete scan ready. Link your mobile number to Aadhaar for OTP verification.'
  },
  marksheet: {
    label: 'Class 10 & 12 Marksheets', issuer: 'Board of Education', validityDays: null,
    why: 'Academic eligibility (board percentile or class-12 score) is checked from these marks.',
    next: 'Upload a grayscale PDF scan with the original roll numbers visible.'
  },
  income: {
    label: 'Income Certificate', issuer: 'Tahsildar / SDM', validityDays: 365,
    why: 'Family income must fall under the scheme ceiling. Most states treat this as valid for one year.',
    next: 'Apply to your Tahsildar office for a fresh certificate if the current one is outdated.'
  },
  domicile: {
    label: 'Domicile Certificate', issuer: 'District Collectorate', validityDays: 1825,
    why: 'Some state and central schemes need proof of residence in the state.',
    next: 'Check your state’s validity rule and renew before the expiry date.'
  },
  bonafide: {
    label: 'College Bonafide Certificate', issuer: 'College Registrar / Dean', validityDays: 365, mustBeCurrentAY: true,
    why: 'Proves current enrollment. Trusts usually want a certificate for the current academic year, with the college seal.',
    next: 'Download the pre-filled format, get the Registrar’s signature and seal, then upload the scanned PDF.'
  },
  bank: {
    label: 'Bank Passbook / Cancelled Cheque', issuer: 'Bank', validityDays: null,
    why: 'Scholarship amounts are paid by direct bank transfer to an account in your own name.',
    next: 'Upload a page showing IFSC, account number and your full name matching Aadhaar.'
  },
  photo: {
    label: 'Passport-size Photograph', issuer: 'Self', validityDays: null,
    formats: ['jpg', 'png'], maxKB: 50,
    why: 'Portals require a recent, clear photo for identity matching.',
    next: 'Use a neutral background, 35×45 mm, JPG or PNG under 50 KB.'
  }
};

const RAW_SCHEMES = [
  {
    id: 'reliance', name: 'Reliance Foundation Undergraduate Scholarship', provider: 'Reliance Foundation',
    amount: 200000, amountLabel: '₹2,00,000 total', type: 'Private · Merit-cum-means', level: 'Undergraduate',
    maxIncome: 250000, minCgpa: 7.5, stream: ['Engineering', 'Science'], deadlineOffset: 18,
    docs: ['aadhaar', 'marksheet', 'income', 'bonafide', 'photo'],
    summary: 'Merit-cum-means support for full-time undergraduate students across India, including academic resources and mentorship.',
    steps: ['Check eligibility', 'Prepare documents', 'Submit on portal', 'College verification', 'Grant disbursed']
  },
  {
    id: 'aicte', name: 'AICTE Pragati Scholarship for Girls', provider: 'AICTE & Ministry of Education',
    amount: 50000, amountLabel: '₹50,000 / year', type: 'Central · Girls', level: 'Undergraduate',
    maxIncome: 800000, minCgpa: 0, stream: ['Engineering'], deadlineOffset: 25,
    docs: ['aadhaar', 'marksheet', 'income', 'bonafide', 'bank'],
    summary: 'Supports female students pursuing technical degrees in AICTE-approved institutions.',
    steps: ['Check eligibility', 'Prepare documents', 'Submit on portal', 'Institutional verification', 'Disbursed via DBT']
  },
  {
    id: 'tata', name: 'Tata Trusts Medical & Engineering Grant', provider: 'Sir Ratan Tata Trust',
    amount: 75000, amountLabel: 'Up to ₹75,000 / year', type: 'Trust · Merit & need', level: 'Undergraduate',
    maxIncome: 250000, minCgpa: 0, stream: ['Engineering', 'Medical'], deadlineOffset: 31,
    docs: ['aadhaar', 'marksheet', 'income', 'bonafide', 'bank'],
    summary: 'Requires verification of first-attempt marksheets and the fee receipt.',
    steps: ['Check eligibility', 'Prepare documents', 'Submit draft', 'Trust review', 'Disbursed']
  },
  {
    id: 'nsp', name: 'Central Sector Scheme of Scholarship (NSP CSSS)', provider: 'Department of Higher Education',
    amount: 20000, amountLabel: '₹12,000 – ₹20,000 / year', type: 'Government · NSP', level: 'Undergraduate',
    maxIncome: 450000, minCgpa: 0, stream: ['Engineering', 'Science', 'Arts'], deadlineOffset: 45,
    docs: ['aadhaar', 'marksheet', 'income', 'domicile', 'bonafide', 'bank'],
    summary: 'Central scheme for students who scored well in class 12 board examinations and come from families under the income ceiling.',
    steps: ['Check eligibility', 'Prepare documents', 'Submit on NSP', 'District Nodal Officer review', 'DBT credit']
  },
  {
    id: 'infosys', name: 'Infosys Foundation STEM Stars Scholarship', provider: 'Infosys Foundation',
    amount: 100000, amountLabel: 'Up to ₹1,00,000 / year', type: 'CSR · STEM', level: 'Undergraduate',
    maxIncome: 1000000, minCgpa: 8.5, stream: ['Engineering', 'Science'], deadlineOffset: 25,
    docs: ['aadhaar', 'marksheet', 'bonafide', 'photo'],
    summary: 'Supports women in STEM with a class 12 score of at least 85 percent.',
    steps: ['Check eligibility', 'Prepare documents', 'Submit on portal', 'Aptitude test', 'Award decision']
  }
];
const SCHEMES = RAW_SCHEMES.map(s => ({ ...s, deadline: addDays(s.deadlineOffset) }));
const schemeById = (id) => SCHEMES.find(s => s.id === id);
const APP_STAGES = ['Eligibility checked', 'Documents prepared', 'Application submitted', 'Institutional verification', 'Grant disbursed'];
const STREAM_OPTIONS = ['Engineering', 'Science', 'Medical', 'Arts', 'Commerce'];
const STATES = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana', 'Other'];

const seedData = () => ({
  profile: {
    name: '', level: '', degree: '', year: '', college: '',
    cgpa: '', income: '', state: '', category: '', stream: ''
  },
  certs: [],
  apps: [],
  shortlist: [],
  chat: []
});

function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall back to seed */ }
  return seedData();
}

/* =========================================================
   2. DOMAIN LOGIC
   ========================================================= */
function eligibility(s, p) {
  const checks = [
    { label: 'Academic level', need: s.level, have: p.level, ok: p.level === s.level },
    { label: 'Academic standing', need: s.minCgpa ? `CGPA ≥ ${s.minCgpa}` : 'No minimum', have: `CGPA ${p.cgpa}`, ok: p.cgpa >= (s.minCgpa || 0) },
    { label: 'Family income', need: `≤ ${inr(s.maxIncome)} / yr`, have: inr(p.income), ok: p.income <= s.maxIncome },
    { label: 'Stream', need: s.stream.join(' / '), have: p.stream, ok: s.stream.includes(p.stream) }
  ];
  return { checks, ok: checks.every(c => c.ok), metCount: checks.filter(c => c.ok).length };
}

function certStatus(c) {
  if (!c) return 'missing';
  if (!c.expiryDate) return 'valid';
  const d = daysUntil(c.expiryDate);
  if (d < 0) return 'expired';
  if (d <= 30) return 'expiring';
  return 'valid';
}

function latestCert(certs, type) {
  return certs.filter(c => c.type === type)
    .sort((a, b) => (b.issueDate || '').localeCompare(a.issueDate || ''))[0];
}

function diagnose(s, p, certs) {
  const el = eligibility(s, p);
  const docs = s.docs.map(type => {
    const c = latestCert(certs, type);
    let status = 'missing';
    let reason = 'Not uploaded yet.';
    if (c) {
      const st = certStatus(c);
      if (st === 'expired') { status = 'expired'; reason = `Expired on ${fmt(c.expiryDate)}.`; }
      else if (st === 'expiring') { status = 'expiring'; reason = `Expires in ${daysUntil(c.expiryDate)} days.`; }
      else { status = 'valid'; reason = 'Uploaded and within validity.'; }
      if (type === 'bonafide' && c.issueDate < acStart()) {
        status = 'expired';
        reason = `Issued for an earlier academic year (${fmt(c.issueDate)}).`;
      }
    }
    return { type, status, reason, cert: c };
  });
  const missing = docs.filter(d => d.status === 'missing' || d.status === 'expired');
  const ready = docs.filter(d => d.status === 'valid' || d.status === 'expiring').length;
  return { el, docs, missing, ready, total: docs.length };
}

function docReadiness(types, certs) {
  const ready = types.filter(t => {
    const c = latestCert(certs, t);
    if (!c) return false;
    if (t === 'bonafide' && c.issueDate < acStart()) return false;
    return certStatus(c) !== 'expired';
  }).length;
  return { ready, total: types.length };
}

function validateUpload(file, type, issueDate, expiryDate) {
  const errs = [];
  const warns = [];
  const cfg = DOC_TYPES[type];
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const normalized = ext === 'jpeg' ? 'jpg' : ext;
  const allowed = cfg.formats || ['pdf', 'jpg', 'png'];
  if (!allowed.includes(normalized)) errs.push(`.${ext || 'unknown'} is not accepted. Use ${allowed.join(', ').toUpperCase()}.`);
  const maxBytes = cfg.maxKB ? cfg.maxKB * 1024 : 2 * 1024 * 1024;
  if (file.size > maxBytes) errs.push(`File is ${(file.size / 1024).toFixed(0)} KB. The limit for this document is ${cfg.maxKB ? cfg.maxKB + ' KB' : '2 MB'}.`);
  if (!issueDate) errs.push('Enter the issue date printed on the certificate.');
  else if (issueDate > todayISO()) errs.push('The issue date cannot be in the future.');
  if (cfg.validityDays && !expiryDate) errs.push('Enter the valid-till (expiry) date.');
  if (issueDate && expiryDate && expiryDate <= issueDate) errs.push('The expiry date must be after the issue date.');
  if (cfg.mustBeCurrentAY && issueDate && issueDate < acStart()) errs.push(`A bonafide must be issued for the current academic year (from ${fmt(acStart())}).`);
  if (expiryDate && daysUntil(expiryDate) < 0) warns.push('This certificate has already expired. Upload a renewed copy.');
  else if (expiryDate && daysUntil(expiryDate) <= 30) warns.push(`This certificate expires in ${daysUntil(expiryDate)} days. Plan a renewal.`);
  return { errs, warns };
}

const readAsDataURL = (f) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(f);
});

function downloadBlob(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadICS(items) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GRANTLY//EN', 'CALSCALE:GREGORIAN'];
  items.forEach(s => {
    const d = s.deadline.replace(/-/g, '');
    lines.push('BEGIN:VEVENT', `UID:${s.id}-${d}@grantly`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d}`,
      `SUMMARY:${s.name} — application deadline`, 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  downloadBlob(lines.join('\r\n'), 'grantly-deadlines.ics', 'text/calendar');
}

function counselorReply(text, p) {
  const t = text.toLowerCase();
  if (/bonafide|bona fide/.test(t)) return `A bonafide certificate must be issued for the current academic year (${acLabel()}), with the Registrar’s or Dean’s signature and the college seal.\n\n1. Download the pre-filled format from the Document Readiness Centre.\n2. Visit the college academic section and request the signature and seal (usually 15–20 minutes).\n3. Upload the scanned PDF well before the portal closes, so OCR checks have time to pass.`;
  if (/income|tahsil/.test(t)) return `Most state income certificates are valid for one year from the issue date. Your certificate for ${inr(p.income)} per year is in your vault. If it expires before a scholarship review ends, apply to the Tahsildar office early, because processing can take 2–4 weeks.`;
  if (/expir|valid/.test(t)) return 'Open the Document Readiness Centre to see every expiry date. Anything expiring within 30 days is flagged “Expiring soon”. Renew before the next portal submission, because portals usually reject expired documents.';
  if (/deadline|close|last date|when/.test(t)) return 'The Opportunity Radar lists your shortlisted deadlines in order of urgency. You can download them as a calendar file (.ics) and add them to your phone calendar.';
  if (/aptitude|test|exam/.test(t)) return 'Some schemes, such as the Reliance Foundation UG scholarship, include a 60-minute online aptitude assessment. Book a slot from the scheme’s details page. Questions usually cover quantitative reasoning, logical reasoning and English comprehension.';
  if (/photo|photograph/.test(t)) return 'Passport photos should be 35×45 mm with a neutral background, in JPG or PNG, and under 50 KB for most portals. Good lighting matters more than the camera.';
  if (/aadhaar|aadhar/.test(t)) return 'Your Aadhaar must have your mobile number linked for OTP verification. Make sure the name on your bank passbook matches your Aadhaar exactly.';
  return 'I can help with bonafide and income certificates, expiry dates, deadlines, the aptitude test and photo specifications. Try one of the popular questions on the left. This is general guidance, so confirm final rules on each official portal.';
}

/* =========================================================
   3. UI PRIMITIVES
   ========================================================= */
const Logo = () => (
  <a href="#/" className="logo">
    <span className="logo-mark">G</span>
    <span className="logo-text">GRANTLY<i>•</i></span>
  </a>
);

const Card = ({ className = '', children, ...rest }) => (
  <div className={`card ${className}`} {...rest}>{children}</div>
);

const Badge = ({ tone = 'neutral', children }) => (
  <span className={`badge badge-${tone}`}>{children}</span>
);

const STATUS_TONE = { valid: 'ok', expiring: 'warn', expired: 'bad', missing: 'bad' };
const STATUS_LABEL = { valid: 'Ready', expiring: 'Expiring soon', expired: 'Expired', missing: 'Missing' };

const Btn = ({ variant = 'primary', size, className = '', ...props }) => (
  <button className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${size === 'lg' ? 'btn-lg' : ''} ${className}`} {...props} />
);

const LinkBtn = ({ href, variant = 'primary', size, className = '', children }) => (
  <a href={href} className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${size === 'lg' ? 'btn-lg' : ''} ${className}`}>{children}</a>
);

const Field = ({ label, hint, required, children }) => (
  <label className="field">
    <span className="field-label">
      <span>{label}</span>
      {required && <span className="field-req">Required</span>}
    </span>
    {children}
    {hint && <span className="field-hint">{hint}</span>}
  </label>
);

const Progress = ({ value, tone }) => (
  <div className={`progress ${tone && tone !== 'ok' ? tone : ''}`}>
    <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

const PAGE_TITLE_TA = {
  'Smart Scholarship Match':'matchTitle',
  'What-If Scholarship Simulator':'simTitle',
  'Document Readiness Centre':'docsTitle',
  'Document Readiness Scanner':'docsTitle',
  'My Applications':'appsTitle',
  'Opportunity Radar & Shortlist':'radarTitle'
};
const PageHead = ({ eyebrow, title, subtitle, actions }) => {
  const { lang } = useApp();
  const displayTitle = lang === 'ta' && PAGE_TITLE_TA[title] ? tr(lang, PAGE_TITLE_TA[title]) : title;
  return <div className="pagehead">
    <div style={{ minWidth: 0 }}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{displayTitle}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div className="actions">{actions}</div>}
  </div>;
};

const Empty = ({ title, text, action }) => (
  <div className="empty">
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {action}
  </div>
);

/* =========================================================
   4. APP SHELL
   ========================================================= */
const NAV = [
  { group: 'Dossier & Exploration', items: [['/dashboard', 'Overview / Dashboard'], ['/discover', 'Discover Scholarships'], ['/matches', 'Smart Scholarship Match'], ['/simulator', 'What-If Simulator'], ['/scheme/reliance', 'Scholarship Details']] },
  { group: 'Operational Pipeline', items: [['/documents', 'Document Readiness Scanner'], ['/applications', 'My Applications'], ['/radar', 'Opportunity Radar & Shortlist']] },
  { group: 'Advisory Intelligence', items: [['/ask', 'Ask GRANTLY']] }
];

function Shell({ path, children }) {
  const { data, lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const p = data.profile;
  const initials = (p.name || 'Student').trim().split(/\s+/).map(s => s[0]).join('').slice(0, 2).toUpperCase();
  const isActive = (to) => path === to || (to.startsWith('/scheme') && path.startsWith('/scheme'));
  const crumb = NAV.flatMap(g => g.items).find(([to]) => isActive(to));

  return (
    <div className="app">
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sb-brand">
          <Logo />
          <p className="sb-tag">Scholarships shouldn’t be difficult to find.</p>
        </div>
        <nav className="sb-nav">
          {NAV.map(g => (
            <div key={g.group}>
              <p className="sb-group">{g.group}</p>
              {g.items.map(([to, label]) => (
                <a key={to} href={`#${to}`} onClick={() => setOpen(false)}
                   className={`sb-link ${isActive(to) ? 'active' : ''}`}>{tr(lang, ({'/dashboard':'dashboard','/discover':'discover','/matches':'matches','/simulator':'simulator','/documents':'documents','/applications':'applications','/radar':'radar','/ask':'ask'}[to]) || label)}</a>
              ))}
            </div>
          ))}
          <div><p className="sb-group">Your account</p><a href="#/onboarding" className={`sb-link ${path === '/onboarding' ? 'active' : ''}`} onClick={() => setOpen(false)}>{tr(lang, 'profile')}</a></div>
        </nav>
        <div className="sb-dossier">
          <p className="k">Active dossier</p>
          <p style={{ fontWeight: 500, marginTop: 4 }}>{p.name || 'New student'}</p>
          <p className="xs muted">{p.year || 'Study year not added'} · {p.degree || 'Course not added'}</p>
          <a href="#/onboarding" className="link xs">Edit student profile →</a>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <p className="crumb">GRANTLY Central / <b>{crumb ? crumb[1] : 'Dashboard'}</b></p>
          <form className="search" onSubmit={(e) => { e.preventDefault(); window.location.hash = `#/discover?q=${encodeURIComponent(q)}`; setQ(''); }}>
            <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search scholarships…" />
          </form>
          <label className="language-control" aria-label="Choose language"><span className="sr-only">Language</span><select className="language-select" value={lang} onChange={e => setLang(e.target.value)}><option value="en">English</option><option value="ta">தமிழ்</option><option value="hi">हिन्दी</option></select></label>
          <div className="profile-chip">
            <span className="muted">Profile:</span>
            <strong>{p.name ? p.name.split(' ')[0] : 'Complete profile'} — {p.level || 'Student'}</strong>
          </div>
          <span className="avatar">{initials}</span>
        </header>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}

/* =========================================================
   5. LANDING
   ========================================================= */
function Landing() {
  const { lang, setLang } = useApp();
  const jump = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <div>
      <header className="lp-header">
        <div className="wrap">
          <Logo />
          <nav className="lp-nav">
            <button onClick={jump('how')}>{tr(lang, 'how')}</button>
            <a href="#/discover">{tr(lang, 'explore')}</a>
            <button onClick={jump('trust')}>{tr(lang, 'about')}</button>
          </nav>
          <div className="lp-actions">
            <label className="language-control" aria-label="Choose language"><span className="sr-only">Language</span><select className="language-select" value={lang} onChange={e => setLang(e.target.value)}><option value="en">English</option><option value="ta">தமிழ்</option><option value="hi">हिन्दी</option></select></label>
            <a href="#/dashboard" className="lp-signin">{tr(lang, 'signin')}</a>
            <LinkBtn href="#/onboarding" variant="dark" size="sm">{tr(lang, 'start')}</LinkBtn>
          </div>
        </div>
      </header>

      <section className="hero-banner">
        <div className="hero">
        <div>
          <span className="pill">{tr(lang, 'badge')}</span>
          <h1>{tr(lang, 'hero')}</h1>
          <p className="lead">{tr(lang, 'lead')}</p>
          <div className="ctas">
            <LinkBtn href="#/onboarding" size="lg">{tr(lang, 'find')}</LinkBtn>
            <LinkBtn href="#/discover" variant="ghost" size="lg">{tr(lang, 'opportunities')}</LinkBtn>
          </div>
          <p className="hero-trust">A clearer path from discovery to application readiness.</p>
        </div>
        </div>
      </section>

      <section id="how" className="section alt">
        <div className="wrap">
          <h2>How GRANTLY works</h2>
          <p className="sub">Three simple steps to find and secure financial aid.</p>
          <div className="grid g3 lead-grid">
            {[
              ['01', 'Build your student profile', 'Tell us about your education and background so we can find scholarships relevant to you.'],
              ['02', 'Discover your opportunities', 'See which scholarships you qualify for, and what you are missing for the rest.'],
              ['03', 'Apply with confidence', 'Upload documents, track their expiry dates, and follow every application step.']
            ].map(([n, t, d]) => (
              <Card key={n} className="step-card"><p className="n">{n}</p><h3>{t}</h3><p>{d}</p></Card>
            ))}
          </div>
        </div>
      </section>

      

      

      <section id="trust" className="section alt">
        <div className="wrap">
          <h2>Built for applicant trust and clarity</h2>
          <p className="sub">A student-first approach to guidance without paywalls or misleading promotions.</p>
          <div className="grid g4 lead-grid">
            {[
              ['Transparent eligibility', 'See exactly which criteria you meet and which you do not.'],
              ['Document readiness', 'Check format, size and validity before you submit anywhere.'],
              ['Application guidance', 'Step-by-step instructions to apply on official portals.'],
              ['Student privacy', 'Your documents stay in your browser. Nothing is sold or shared.']
            ].map(([t, d]) => (
              <Card key={t} className="trust-card"><h3>{t}</h3><p>{d}</p></Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h2>Your scholarship journey starts here.</h2>
              <p>Create your student profile and discover opportunities that match your goals.</p>
            </div>
            <LinkBtn href="#/onboarding" size="lg" className="shrink">Start my scholarship search</LinkBtn>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="wrap">
          <Logo />
          <p>GRANTLY is an independent scholarship guidance tool. Official applications are completed on the respective provider portals.</p>
          <p>© {new Date().getFullYear()} GRANTLY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   6. ONBOARDING
   ========================================================= */
function Onboarding() {
  const { data, set, notify } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...data.profile });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const steps = ['Academic Profile', 'Financial Background', 'Category & Eligibility', 'Review & Finish'];
  const live = SCHEMES.filter(s => eligibility(s, form).ok);
  const yearOptions = form.level === 'Higher Secondary'
    ? ['Class 11', 'Class 12']
    : form.level === 'Postgraduate'
      ? ['1st Year', '2nd Year']
      : ['1st Year', '2nd Year', '3rd Year', '4th / Final Year'];

  const continueStep = () => {
    if (step === 1 && (!form.name.trim() || !form.level || !form.degree.trim() || !form.year || !form.college.trim() || !form.stream)) {
      notify('Please complete the required academic details.', 'warn'); return;
    }
    if (step === 2 && !form.income) { notify('Please select your annual household income.', 'warn'); return; }
    setStep(n => n + 1);
  };

  const finish = () => {
    if (!form.category || !form.state) { notify('Please select your category and domicile state.', 'warn'); setStep(3); return; }
    set(d => ({ ...d, profile: { ...form } }));
    notify('Profile saved. Your matches are updated.');
    window.location.hash = '#/dashboard';
  };

  const incomeBands = [
    { label: 'Up to ₹1L', value: 100000 },
    { label: '₹1L – ₹2.5L', value: 240000 },
    { label: '₹2.5L – ₹8L', value: 700000 },
    { label: 'Above ₹8L', value: 1000000 }
  ];

  return (
    <div>
      <header className="ob-header">
        <div className="row" style={{ gap: 14 }}>
          <Logo />
          <span className="tag">/ Registration dossier · Candidate profiling</span>
        </div>
        <a href="#/" className="muted sm">Save & exit</a>
      </header>

      <div className="ob-wrap">
        <Card>
          <div className="onb-steps">
            {steps.map((label, i) => {
              const n = i + 1;
              const cls = step === n ? 'on' : step > n ? 'done' : '';
              return (
                <button key={label} className={`onb-tab ${cls}`} onClick={() => n < step && setStep(n)}>
                  <span className="circle">{step > n ? '✓' : n}</span>
                  <span className="label">{label}</span>
                  <div className="bar" />
                </button>
              );
            })}
          </div>
        </Card>

        <div className="ob-grid">
          <Card style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
            <p className="eyebrow">Step 0{step} of 4</p>

            {step === 1 && (
              <div className="ob-body">
                <h1>Build your academic profile</h1>
                <p className="lead">Tell us about yourself and your current studies so we can find relevant scholarships.</p>
                <Field label="Full name" required>
                  <input className="input" type="text" placeholder="Enter your full name" value={form.name || ''} onChange={e => upd('name', e.target.value)} />
                </Field>
                <Field label="Current education level" required>
                  <div className="choices">
                    {[['Higher Secondary', 'Class 11 – 12'], ['Undergraduate', 'Graduate degree'], ['Postgraduate', 'Master’s / Ph.D.']].map(([val, sub]) => (
                      <button type="button" key={val} className={`choice ${form.level === val ? 'on' : ''}`} onClick={() => { upd('level', val); upd('year', ''); }}>
                        <span className="xs" style={{ display: 'block', opacity: .8 }}>{sub}</span>
                        <span className="serif" style={{ fontSize: 16 }}>{val}</span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={form.level === 'Higher Secondary' ? 'School group / subjects' : 'Degree & specialization'} hint="Enter your course or subjects as they appear in your academic records." required>
                  <input className="input" placeholder={form.level === 'Higher Secondary' ? 'e.g. Science with Mathematics' : 'e.g. B.Tech Computer Science'} value={form.degree || ''} onChange={e => upd('degree', e.target.value)} />
                </Field>
                <div className="grid g2">
                  <Field label={form.level === 'Higher Secondary' ? 'Current class' : 'Current year of study'} required>
                    <select className="input" value={form.year || ''} onChange={e => upd('year', e.target.value)}>
                      <option value="">Select {form.level === 'Higher Secondary' ? 'class' : 'year'}</option>
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>
                  <Field label="Stream">
                    <select className="input" value={form.stream || ''} onChange={e => upd('stream', e.target.value)}>
                      <option value="">Select stream</option>{STREAM_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label={form.level === 'Higher Secondary' ? 'School name' : 'College / university'} required>
                  <input className="input" placeholder="Enter your institution name" value={form.college || ''} onChange={e => upd('college', e.target.value)} />
                </Field>
                <Field label="Most recent CGPA (out of 10)" hint="Optional for now. Enter your latest cumulative result if available.">
                  <input type="number" step="0.01" min="0" max="10" className="input" placeholder="e.g. 8.2" value={form.cgpa ?? ''} onChange={e => upd('cgpa', e.target.value === '' ? '' : Number(e.target.value))} />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="ob-body">
                <h1>Financial background</h1>
                <p className="lead">Choose the band that matches your household’s gross annual income. Scholarships use this to decide eligibility.</p>
                <Field label="Annual household income band" required>
                  <div className="choices two">
                    {incomeBands.map(b => (
                      <button key={b.label} className={`choice ${form.income === b.value ? 'on' : ''}`} onClick={() => upd('income', b.value)}>{b.label}</button>
                    ))}
                  </div>
                </Field>
                <p className="note">Current selection: <strong>{inr(form.income)}</strong> per year. Your Tahsildar income certificate should match this figure.</p>
              </div>
            )}

            {step === 3 && (
              <div className="ob-body">
                <h1>Category & eligibility</h1>
                <p className="lead">Social and regional criteria are used by several government schemes.</p>
                <div className="grid g2">
                  <Field label="Social category">
                    <select className="input" value={form.category || ''} onChange={e => upd('category', e.target.value)}>
                      <option value="">Select category</option>{['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="State of domicile">
                    <select className="input" value={form.state || ''} onChange={e => upd('state', e.target.value)}>
                      <option value="">Select state</option>{STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="ob-body">
                <h1>Review & finish</h1>
                <dl className="dl">
                  {[['Name', form.name], ['Level', form.level], ['Year / Class', form.year], ['Degree / Subjects', form.degree], ['Stream', form.stream],
                    ['College / School', form.college], ['CGPA', form.cgpa || 'Not provided'], ['Income', inr(form.income) + ' / yr'], ['Category', form.category], ['State', form.state]
                  ].map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>))}
                </dl>
                <p className="muted sm">Your information is used only to match scholarships and check eligibility. It is never sold or shared.</p>
              </div>
            )}

            <div className="ob-actions">
              <Btn variant="ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>← Back</Btn>
              {step < 4
                ? <Btn variant="dark" onClick={continueStep}>Continue →</Btn>
                : <Btn variant="primary" onClick={finish}>Save profile & see matches</Btn>}
            </div>
          </Card>

          <aside className="stack">
            <Card>
              <p className="stat-label">Live match preview</p>
              <p className="big-num" style={{ marginTop: 10 }}>{live.length}<small>matching scholarships</small></p>
              <p className="sm muted" style={{ marginTop: 8 }}>Based on your {form.year} {form.stream} profile and a CGPA of {form.cgpa}.</p>
              <div className="stack" style={{ marginTop: 16, '--gap': '8px' }}>
                {live.slice(0, 3).map(s => (
                  <div key={s.id} className="mini-match"><span style={{ minWidth: 0 }}>{s.name}</span><span className="amt">{s.amountLabel}</span></div>
                ))}
                {live.length === 0 && <p className="sm muted">No matches yet. Adjust your income or CGPA to see more.</p>}
              </div>
            </Card>
            <Card>
              <p className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Why we ask for this</p>
              <ul className="ul-plain mt">
                <li><strong>Course details:</strong> many CSR funds are reserved for specific degree fields.</li>
                <li><strong>Grades & CGPA:</strong> merit-based awards usually set a minimum threshold.</li>
                <li><strong>Income:</strong> need-based schemes use a household income ceiling.</li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   7. DASHBOARD
   ========================================================= */
function Dashboard() {
  const { data } = useApp();
  const p = data.profile;
  const eligible = SCHEMES.filter(s => eligibility(s, p).ok);
  const featured = eligible[0] || SCHEMES[0];
  const fd = diagnose(featured, p, data.certs);
  const shortlisted = SCHEMES.filter(s => data.shortlist.includes(s.id));
  const reqTypes = [...new Set(shortlisted.flatMap(s => s.docs))];
  const readiness = docReadiness(reqTypes, data.certs);
  const alerts = data.certs.map(c => ({ c, st: certStatus(c) })).filter(x => x.st === 'expired' || x.st === 'expiring');
  const upcoming = [...SCHEMES].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = p.name ? p.name.split(' ')[0] : 'there';
  const readyPct = readiness.total ? (readiness.ready / readiness.total) * 100 : 0;

  return (
    <div>
      <PageHead
        eyebrow={`Autumn term · ${new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`}
        title={`${greet}, ${firstName}.`}
        subtitle={`${(p.degree || 'Your course').split(' in ')[0]} · ${p.year} · ${p.stream}. Here is your scholarship activity and new recommendations.`}
        actions={<LinkBtn href="#/discover" variant="ghost">Explore directory</LinkBtn>}
      />

      <div className="stat-grid">
        <Card>
          <p className="stat-label">Matched scholarships</p>
          <p className="stat-value">{eligible.length}</p>
          <a href="#/discover" className="link" style={{ display: 'inline-block', marginTop: 12 }}>Explore directory →</a>
        </Card>
        <Card>
          <p className="stat-label">Applications in progress</p>
          <p className="stat-value">{data.apps.length}</p>
          <a href="#/applications" className="link" style={{ display: 'inline-block', marginTop: 12 }}>Track progress →</a>
        </Card>
        <Card>
          <p className="stat-label">Document readiness</p>
          <p className="stat-value">{readiness.ready} <span style={{ fontSize: 16, fontFamily: 'Inter, sans-serif', color: 'var(--cocoa)', fontWeight: 400 }}>of {readiness.total} ready</span></p>
          <div style={{ marginTop: 12 }}><Progress value={readyPct} /></div>
          <a href="#/documents" className="link" style={{ display: 'inline-block', marginTop: 12 }}>Open Document Centre →</a>
        </Card>
        <Card>
          <p className="stat-label">Certificate alerts</p>
          <p className="stat-value">{alerts.length}</p>
          <p className="stat-note">{alerts.length ? 'Need renewal soon' : 'All certificates are current'}</p>
        </Card>
      </div>

      <div className="split mt-lg">
        <Card className="flush">
          <div className="feature">
            <div className="feature-left">
              <div>
                <span className="pill-light">Top match for your profile</span>
                <p className="serif" style={{ fontSize: 20, fontWeight: 600, marginTop: 22 }}>{featured.provider}</p>
                <p className="sub">{featured.name}</p>
              </div>
              <p className="xs" style={{ color: 'rgba(255,255,255,.65)' }}>{featured.type}</p>
            </div>
            <div className="feature-right">
              <p className="k">Award endowment</p>
              <p className="v">{featured.amountLabel}</p>
              <p className="k" style={{ marginTop: 16 }}>Application deadline</p>
              <p style={{ fontWeight: 500 }}>{fmt(featured.deadline)} <span className="accent">({daysUntil(featured.deadline)} days left)</span></p>
              <div className="feature-note">
                <p style={{ fontWeight: 500 }}>Eligibility: {fd.el.ok ? 'You meet all criteria' : `${fd.el.metCount} of ${fd.el.checks.length} criteria met`}</p>
                <p className="muted" style={{ marginTop: 4 }}>
                  {fd.missing.length
                    ? `${fd.missing.length} missing document${fd.missing.length > 1 ? 's' : ''}: ${fd.missing.map(m => DOC_TYPES[m.type].label).join(', ')}`
                    : 'All required documents are ready.'}
                </p>
              </div>
              <div className="row" style={{ marginTop: 18 }}>
                <LinkBtn href={`#/scheme/${featured.id}`}>View details & missing piece</LinkBtn>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Upcoming deadlines</p>
          <p className="xs muted" style={{ marginTop: 4 }}>Sorted by closing date</p>
          <ul className="list-rows" style={{ listStyle: 'none', margin: '16px 0 0', padding: 0 }}>
            {upcoming.map(s => {
              const d = daysUntil(s.deadline);
              return (
                <li key={s.id} className="between row" style={{ alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</p>
                    <p className="xs muted">{fmt(s.deadline)}</p>
                  </div>
                  <Badge tone={d <= 7 ? 'bad' : d <= 20 ? 'warn' : 'neutral'}>{d} days</Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="split mt">
        <Card>
          <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Your active applications</p>
          <div className="mt">
            {data.apps.length === 0 && <Empty title="No applications yet" text="Open a scholarship and start tracking it." />}
            {data.apps.map(a => {
              const s = schemeById(a.schemeId);
              if (!s) return null;
              return (
                <div key={a.id} className="app-card">
                  <div className="between row">
                    <p style={{ fontWeight: 500 }}>{s.name}</p>
                    <Badge tone="neutral">Stage {Math.min(a.stage + 1, APP_STAGES.length)} of {APP_STAGES.length}</Badge>
                  </div>
                  <div style={{ marginTop: 12 }}><Progress value={(a.stage / APP_STAGES.length) * 100} tone="terra" /></div>
                  <p className="xs muted" style={{ marginTop: 8 }}>{a.stage >= APP_STAGES.length ? 'Completed' : `Next: ${APP_STAGES[a.stage]}`}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Certificate alerts</p>
          <div className="stack mt" style={{ '--gap': '10px' }}>
            {alerts.length === 0 && <p className="sm muted">No certificates are expired or expiring within 30 days.</p>}
            {alerts.map(({ c, st }) => (
              <div key={c.id} className={`alert-card ${st === 'expired' ? 'bad' : 'warn'}`}>
                <p style={{ fontWeight: 500 }}>{DOC_TYPES[c.type].label}</p>
                <p className="xs muted" style={{ marginTop: 2 }}>{st === 'expired' ? `Expired ${fmt(c.expiryDate)}` : `Expires ${fmt(c.expiryDate)} (${daysUntil(c.expiryDate)} days)`}</p>
              </div>
            ))}
            <LinkBtn href="#/documents" variant="ghost" className="btn-block">Manage documents</LinkBtn>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Progress sub-component used above */
const Progress2 = Progress;

/* =========================================================
   8. DISCOVER
   ========================================================= */
function Discover({ params }) {
  const { data, set, notify } = useApp();
  const p = data.profile;
  const [query, setQuery] = useState(params.get('q') || '');
  const [level, setLevel] = useState('All');
  const [type, setType] = useState('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [sort, setSort] = useState('match');
  const types = ['All', ...new Set(SCHEMES.map(s => s.type.split(' · ')[0]))];

  const rows = useMemo(() => {
    let list = SCHEMES.map(s => ({ ...s, el: eligibility(s, p) }));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(s => (s.name + ' ' + s.provider + ' ' + s.stream.join(' ')).toLowerCase().includes(q));
    }
    if (level !== 'All') list = list.filter(s => s.level === level);
    if (type !== 'All') list = list.filter(s => s.type.startsWith(type));
    if (onlyEligible) list = list.filter(s => s.el.ok);
    if (sort === 'deadline') list.sort((a, b) => a.deadline.localeCompare(b.deadline));
    if (sort === 'amount') list.sort((a, b) => b.amount - a.amount);
    if (sort === 'match') list.sort((a, b) => b.el.metCount - a.el.metCount);
    return list;
  }, [query, level, type, onlyEligible, sort, p]);

  const toggleShortlist = (id) => {
    const on = data.shortlist.includes(id);
    set(d => ({ ...d, shortlist: on ? d.shortlist.filter(x => x !== id) : [...d.shortlist, id] }));
    notify(on ? 'Removed from shortlist.' : 'Saved to your shortlist.');
  };

  return (
    <div>
      <div className="banner">
        Showing scholarships for <strong>{p.name}</strong> · {(p.degree || 'Your course').split(' in ')[0]} ({p.year}) · {p.state} · Family income ≤ {inr(p.income)}
        <a href="#/onboarding" className="link" style={{ marginLeft: 8 }}>Edit profile →</a>
      </div>

      <div className="mt-lg">
        <PageHead eyebrow="Curated & calibrated" title="Discover Scholarships" subtitle="Matched against your academic profile and eligibility criteria." />
      </div>

      <Card>
        <div className="filters">
          <Field label="Search">
            <input className="input" placeholder="Name, provider or stream…" value={query} onChange={e => setQuery(e.target.value)} />
          </Field>
          <Field label="Level">
            <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
              <option>All</option><option>Undergraduate</option>
            </select>
          </Field>
          <Field label="Scheme type">
            <select className="input" value={type} onChange={e => setType(e.target.value)}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Sort by">
            <select className="input" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="match">Best match</option>
              <option value="deadline">Deadline (earliest)</option>
              <option value="amount">Award (highest)</option>
            </select>
          </Field>
          <label className="check" style={{ minHeight: 44 }}>
            <input type="checkbox" checked={onlyEligible} onChange={e => setOnlyEligible(e.target.checked)} />
            Only eligible
          </label>
        </div>
      </Card>

      <p className="sm muted mt">{rows.length} scholarship{rows.length !== 1 ? 's' : ''} found</p>
      {rows.length === 0 && <div className="mt"><Empty title="No scholarships match these filters" text="Clear the search or change a filter to see more." /></div>}

      <div className="stack mt" style={{ '--gap': '18px' }}>
        {rows.map(s => {
          const saved = data.shortlist.includes(s.id);
          return (
            <Card key={s.id} className="hover">
              <div className="scheme-top">
                <div style={{ minWidth: 0, flex: '1 1 320px' }}>
                  <div className="tag-row">
                    <Badge tone={s.el.ok ? 'ok' : 'warn'}>{s.el.ok ? 'Good match' : `${s.el.metCount}/${s.el.checks.length} criteria met`}</Badge>
                    <Badge tone="neutral">{s.type}</Badge>
                  </div>
                  <h3 className="scheme-name">{s.name}</h3>
                  <p className="scheme-prov">{s.provider}</p>
                </div>
                <div>
                  <p className="amt">{s.amountLabel}</p>
                  <p className="dl2">Deadline: {fmt(s.deadline)}</p>
                </div>
              </div>
              <p className="note">
                {s.el.ok
                  ? `Matches your ${p.level.toLowerCase()} ${p.stream.toLowerCase()} enrollment and income ceiling of ${inr(s.maxIncome)}.`
                  : s.el.checks.filter(c => !c.ok).map(c => `${c.label}: needs ${c.need}.`).join(' ')}
              </p>
              <div className="scheme-actions">
                <Btn variant="ghost" size="sm" onClick={() => toggleShortlist(s.id)} aria-pressed={saved}>
                  {saved ? '★ Saved' : '☆ Save scholarship'}
                </Btn>
                <LinkBtn href={`#/scheme/${s.id}`} variant="dark" size="sm">View details →</LinkBtn>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="hint-foot mt-lg" style={{ borderRadius: 8 }}>Demo directory with illustrative criteria. Check official portals for final guidelines.</p>
    </div>
  );
}

/* =========================================================
   9. SCHEME DETAILS + MISSING PIECE ENGINE
   ========================================================= */
function SchemeDetail({ id }) {
  const { data, set, notify } = useApp();
  const s = schemeById(id);
  const p = data.profile;
  if (!s) return <Empty title="Scholarship not found" text="It may have been removed from the directory." action={<LinkBtn href="#/discover">Back to discover</LinkBtn>} />;

  const dg = diagnose(s, p, data.certs);
  const firstMissing = dg.missing[0];
  const saved = data.shortlist.includes(s.id);
  const tracked = data.apps.find(a => a.schemeId === s.id);
  const rdy = dg.total ? Math.round((dg.ready / dg.total) * 100) : 0;

  const startApp = () => {
    if (!tracked) {
      set(d => ({ ...d, apps: [...d.apps, { id: uid(), schemeId: s.id, stage: 1, startedOn: todayISO(), note: 'Started from scheme details.' }] }));
      notify('Application tracking started.');
    }
    window.location.hash = '#/applications';
  };

  const toggleSave = () => {
    set(d => ({ ...d, shortlist: saved ? d.shortlist.filter(x => x !== s.id) : [...d.shortlist, s.id] }));
    notify(saved ? 'Removed from shortlist.' : 'Saved to shortlist.');
  };

  const downloadTemplate = () => {
    const text = [
      'COLLEGE BONAFIDE CERTIFICATE — PRE-FILLED REQUEST FORMAT', '',
      `Student name   : ${p.name}`,
      `Degree         : ${p.degree}`,
      `Year of study  : ${p.year}`,
      `College        : ${p.college}`,
      `Academic year  : ${acLabel()}`, '',
      'To be completed by the college:',
      'The above student is currently enrolled in this institution for the academic year stated.', '',
      'Registrar / Dean signature: ____________________',
      'Official college seal     : ____________________',
      'Date                      : ____________________'
    ].join('\n');
    downloadBlob(text, 'bonafide_prefilled_format.txt', 'text/plain');
    notify('Pre-filled format downloaded.');
  };

  const cur = tracked ? tracked.stage : (dg.el.ok && !firstMissing ? 2 : 1);

  return (
    <div>
      <nav className="crumbs">
        <a href="#/discover">Discover Scholarships</a> <span style={{ margin: '0 6px' }}>/</span> <span style={{ color: 'var(--espresso)' }}>{s.name}</span>
      </nav>

      <div className="detail-head">
        <div style={{ minWidth: 0, flex: '1 1 480px' }}>
          <h1 className="detail-title">{s.name}</h1>
          <p className="detail-meta">Provider: <strong>{s.provider}</strong> · Award: <span className="amt">{s.amountLabel}</span> · Deadline: <strong>{fmt(s.deadline)}</strong></p>
          <p className="lead muted" style={{ marginTop: 16, maxWidth: 680 }}>{s.summary}</p>
        </div>
        <div className="detail-actions">
          <Btn variant="primary" onClick={startApp}>{tracked ? 'View in My Applications' : 'Start tracking application'}</Btn>
          <Btn variant="ghost" onClick={toggleSave}>{saved ? '★ Saved to shortlist' : '☆ Save scholarship'}</Btn>
        </div>
      </div>

      <div className="split mt-lg">
        <div className="stack" style={{ '--gap': '24px' }}>
          <div className="engine">
            <span className="engine-title">! Missing Piece Engine</span>
            <p className="sm muted" style={{ marginTop: 12 }}>
              {!firstMissing
                ? (dg.el.ok ? 'You have all required documents for this scholarship. Submit on the official portal before the deadline.' : 'Your documents are complete, but your academic profile does not meet every criterion.')
                : `You are ${dg.missing.length} document${dg.missing.length > 1 ? 's' : ''} away from complete readiness.`}
            </p>

            {firstMissing && (
              <div className="engine-cells">
                <div className="engine-cell">
                  <p className="h bad-text">What is missing?</p>
                  <p className="b" style={{ fontWeight: 500 }}>{DOC_TYPES[firstMissing.type].label} {firstMissing.status === 'expired' ? 'is outdated or expired' : 'has not been uploaded'}.</p>
                  <p className="f">{firstMissing.reason}</p>
                </div>
                <div className="engine-cell">
                  <p className="h" style={{ color: 'var(--forest)' }}>Why is it needed?</p>
                  <p className="b">{DOC_TYPES[firstMissing.type].why}</p>
                </div>
                <div className="engine-cell">
                  <p className="h accent">What should you do next?</p>
                  <p className="b">{DOC_TYPES[firstMissing.type].next}</p>
                  <p className="f">Estimated completion: about 10 minutes.</p>
                </div>
              </div>
            )}

            <div className="engine-actions">
              {firstMissing && <LinkBtn href="#/documents">Upload document</LinkBtn>}
              {firstMissing?.type === 'bonafide' && <Btn variant="ghost" onClick={downloadTemplate}>↓ Download pre-filled bonafide format (.txt)</Btn>}
            </div>
          </div>

          <Card className="flush">
            <div style={{ padding: 20, borderBottom: '1px solid var(--line)' }}>
              <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Eligibility breakdown</p>
              <p className="sm muted" style={{ marginTop: 4 }}>{dg.el.metCount} of {dg.el.checks.length} eligibility requirements met.</p>
            </div>
            <div className="table-wrap">
              <table className="t" style={{ minWidth: 560 }}>
                <thead><tr><th>Requirement</th><th>Criteria</th><th>Your profile</th><th>Status</th></tr></thead>
                <tbody>
                  {dg.el.checks.map(c => (
                    <tr key={c.label}>
                      <td style={{ fontWeight: 500 }}>{c.label}</td>
                      <td className="muted">{c.need}</td>
                      <td className="muted">{c.have}</td>
                      <td><Badge tone={c.ok ? 'ok' : 'bad'}>{c.ok ? '✓ Met' : '✕ Not met'}</Badge></td>
                    </tr>
                  ))}
                  {dg.docs.map(d => (
                    <tr key={d.type}>
                      <td style={{ fontWeight: 500 }}>{DOC_TYPES[d.type].label}</td>
                      <td className="muted">Required document</td>
                      <td className="muted">{d.reason}</td>
                      <td><Badge tone={STATUS_TONE[d.status] || 'neutral'}>{STATUS_LABEL[d.status]}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Application roadmap</p>
            <p className="sm muted" style={{ marginTop: 4, marginBottom: 16 }}>Five steps to complete your application.</p>
            <ol className="steps five">
              {s.steps.map((label, i) => {
                const done = i < cur;
                const active = i === cur;
                return (
                  <li key={label} className={`step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                    <div className="step-top">
                      <span className="dot">{done ? '✓' : i + 1}</span>
                      <span className="step-state">{done ? 'Completed' : active ? 'In progress' : 'Upcoming'}</span>
                    </div>
                    <p className="step-title">{label}</p>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        <aside className="stack" style={{ '--gap': '20px' }}>
          <Card>
            <div className="between row">
              <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Document readiness</p>
              <Badge tone={rdy === 100 ? 'ok' : 'warn'}>{dg.ready} / {dg.total} ready</Badge>
            </div>
            <div style={{ marginTop: 12 }}><Progress value={rdy} tone={rdy === 100 ? 'ok' : 'terra'} /></div>
            <div style={{ marginTop: 16 }}>
              {dg.docs.map(d => (
                <div key={d.type} className="ring-row">
                  <span>{DOC_TYPES[d.type].label}</span>
                  <Badge tone={STATUS_TONE[d.status] || 'neutral'}>{STATUS_LABEL[d.status]}</Badge>
                </div>
              ))}
            </div>
            <p className="xs muted" style={{ marginTop: 14 }}>GRANTLY checks completeness, format and dates. It does not verify official authenticity.</p>
          </Card>

          <Card>
            <p className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Apply on the official portal</p>
            <p className="sm muted" style={{ marginTop: 8 }}>Applications are always completed on the provider’s own portal. Use “Start tracking” to log your progress here.</p>
            <p className="xs muted" style={{ marginTop: 12 }}>Deadline: <strong style={{ color: 'var(--espresso)' }}>{fmt(s.deadline)}</strong> · {daysUntil(s.deadline)} days left</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   10. DOCUMENT READINESS CENTRE (upload + date tracking)
   ========================================================= */
function Documents() {
  const { data, set, notify } = useApp();
  const [type, setType] = useState('income');
  const [file, setFile] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitErrors, setSubmitErrors] = useState([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');
  const inputRef = useRef(null);

  const cfg = DOC_TYPES[type];
  const suggestExpiry = (t, issue) => {
    const days = DOC_TYPES[t].validityDays;
    if (!days || !issue) return '';
    const d = parseDate(issue);
    d.setDate(d.getDate() + days);
    return toISO(d);
  };

  const chooseFile = (f) => { if (f) { setFile(f); setSubmitErrors([]); } };
  const onType = (t) => { setType(t); setExpiryDate(suggestExpiry(t, issueDate)); setSubmitErrors([]); };
  const onIssue = (v) => { setIssueDate(v); setExpiryDate(suggestExpiry(type, v)); };

  const preview = file ? validateUpload(file, type, issueDate, expiryDate) : null;

  const save = async () => {
    if (!file) { setSubmitErrors(['Choose a file to upload.']); return; }
    const { errs, warns } = validateUpload(file, type, issueDate, expiryDate);
    if (errs.length) { setSubmitErrors(errs); return; }
    setSubmitErrors([]);
    setBusy(true);
    let dataUrl = null;
    try { dataUrl = await readAsDataURL(file); } catch (e) { dataUrl = null; }
    const cert = {
      id: uid(), type, fileName: file.name, fileType: file.type, size: file.size,
      issueDate, expiryDate: expiryDate || '', uploadedAt: todayISO(), dataUrl, sample: false
    };
    let stored = true;
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...data, certs: [...data.certs, cert] }));
    } catch (e) {
      stored = false;
      cert.dataUrl = null;
    }
    set(d => ({ ...d, certs: [...d.certs, cert] }));
    notify(
      stored ? `${cfg.label} saved.` : 'Dates saved. The file was too large for browser storage, so only the details were kept.',
      stored ? 'ok' : 'warn'
    );
    if (warns.length) setTimeout(() => notify(warns[0], 'warn'), 3500);
    setBusy(false);
    setFile(null); setIssueDate(''); setExpiryDate('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const clearFile = () => {
    setFile(null); setSubmitErrors([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeCert = (id) => {
    set(d => ({ ...d, certs: d.certs.filter(c => c.id !== id) }));
    notify('Certificate removed.');
  };

  const updateExpiry = (id, value) => {
    set(d => ({ ...d, certs: d.certs.map(c => (c.id === id ? { ...c, expiryDate: value } : c)) }));
  };

  const openFile = async (c) => {
    if (!c.dataUrl) { notify('No file is stored for this record. Upload it again to view.', 'warn'); return; }
    const blob = await (await fetch(c.dataUrl)).blob();
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const certs = data.certs
    .map(c => ({ ...c, st: certStatus(c) }))
    .sort((a, b) => (a.expiryDate || '9999').localeCompare(b.expiryDate || '9999'));
  const requiredTypes = [...new Set(SCHEMES.flatMap(s => s.docs))];
  const latestRows = requiredTypes.map(t => {
    const c = latestCert(data.certs, t);
    let status = c ? certStatus(c) : 'missing';
    if (t === 'bonafide' && c && c.issueDate < acStart()) status = 'expired';
    return { type: t, cert: c, status };
  });
  const counts = {
    all: certs.length,
    ready: certs.filter(c => c.st === 'valid').length,
    attention: certs.filter(c => c.st === 'expiring' || c.st === 'expired').length,
    missing: latestRows.filter(r => r.status === 'missing').length
  };
  const shown = certs.filter(c => filter === 'all' ? true : filter === 'ready' ? c.st === 'valid' : (c.st === 'expiring' || c.st === 'expired'));
  const readyPct = Math.round((latestRows.filter(r => r.status === 'valid' || r.status === 'expiring').length / latestRows.length) * 100);

  return (
    <div>
      <PageHead
        eyebrow={`Pre-audit clearance · AY ${acLabel()}`}
        title="Document Readiness Scanner"
        subtitle="Upload certificates, track expiry dates, and see which documents are ready, missing or need attention before you apply."
      />

      <div className="doc-stats">
        <Card>
          <p className="stat-label">Readiness score</p>
          <p className="stat-value">{readyPct}%</p>
          <div style={{ marginTop: 12 }}><Progress value={readyPct} /></div>
        </Card>
        <Card><p className="stat-label">Ready</p><p className="stat-value ok-text">{counts.ready}</p></Card>
        <Card><p className="stat-label">Needs attention</p><p className="stat-value warn-text">{counts.attention}</p></Card>
        <Card><p className="stat-label">Missing (required)</p><p className="stat-value bad-text">{counts.missing}</p></Card>
      </div>

      <div className="banner mt">Your checklist compares uploaded files with the document requirements in GRANTLY’s sample scholarship catalogue. It checks file details and dates only — it does not verify document authenticity.</div>

      <div className="split mt-lg">
        <Card>
          <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Upload a certificate</p>
          <p className="sm muted" style={{ marginTop: 4 }}>Enter the dates printed on the certificate. GRANTLY tracks them and warns you before anything expires.</p>

          <div
            className={`dropzone mt ${drag ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); chooseFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
          >
            <p className="t">{file ? file.name : 'Drag & drop a file here, or click to browse'}</p>
            <p className="s">{file ? `${(file.size / 1024).toFixed(0)} KB selected` : 'PDF, JPG or PNG up to 2 MB · Passport photo up to 50 KB'}</p>
            <input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png" style={{ display: 'none' }} onChange={(e) => chooseFile(e.target.files[0])} />
          </div>

          <div className="upload-grid">
            <Field label="Document type" required>
              <select className="input" value={type} onChange={e => onType(e.target.value)}>
                {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="Issue date" required hint={cfg.mustBeCurrentAY ? `Must be on or after ${fmt(acStart())}` : 'Date printed on the certificate'}>
              <input type="date" className="input" max={todayISO()} value={issueDate} onChange={e => onIssue(e.target.value)} />
            </Field>
            <Field label="Valid till / expiry" required={!!cfg.validityDays} hint={cfg.validityDays ? `Suggested: issue date + ${cfg.validityDays} days. Check your state rule.` : 'Leave blank if it does not expire.'}>
              <input type="date" className="input" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </Field>
          </div>
          <p className="xs muted" style={{ marginTop: 12 }}>{cfg.hint || `Issued by: ${cfg.issuer}`}</p>

          {submitErrors.length > 0 && (
            <div className="stack mt" style={{ '--gap': '8px' }}>
              {submitErrors.map(e => <p key={e} className="alert-row alert-bad">✕ {e}</p>)}
            </div>
          )}
          {!submitErrors.length && preview && (
            <div className="stack mt" style={{ '--gap': '8px' }}>
              {preview.errs.map(e => <p key={e} className="alert-row alert-bad">✕ {e}</p>)}
              {preview.warns.map(w => <p key={w} className="alert-row alert-warn">! {w}</p>)}
            </div>
          )}

          <div className="divider row between">
            <Btn variant="ghost" disabled={!file} onClick={clearFile}>Clear file</Btn>
            <Btn variant="primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save certificate'}</Btn>
          </div>
        </Card>

        <Card>
          <p className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Accepted formats</p>
          <ul className="side-list mt" style={{ listStyle: 'none', padding: 0 }}>
            <li>✓ PDF (recommended) or JPG / PNG</li>
            <li>✓ Maximum 2 MB per document</li>
            <li>✓ Passport photos under 50 KB</li>
            <li>✓ Bank passbooks must show IFSC, account number and name</li>
          </ul>
          <p className="serif mt-lg" style={{ fontSize: 16, fontWeight: 600 }}>Common mistakes to avoid</p>
          <ol className="side-list mt" style={{ paddingLeft: 0, listStyle: 'none' }}>
            <li><strong>1. Outdated bonafide.</strong> Using last year’s certificate. Portals usually reject prior academic years.</li>
            <li><strong>2. Blurry snapshots.</strong> Use a flat scanner app at about 200 DPI.</li>
            <li><strong>3. Missing seal or signature.</strong> Certificates without the registrar’s signature and stamp fail audits.</li>
          </ol>
        </Card>
      </div>

      <Card className="mt-lg">
        <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Your document readiness checklist</p>
        <div className="mini-cards mt">
          {latestRows.map(r => (
            <div key={r.type} className="mini-card">
              <div className="top">
                <span className="n">{DOC_TYPES[r.type].label}</span>
                <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{STATUS_LABEL[r.status]}</Badge>
              </div>
              <p className="d">{r.cert ? `Issued ${fmt(r.cert.issueDate)}${r.cert.expiryDate ? ` · Valid till ${fmt(r.cert.expiryDate)}` : ''}` : 'No certificate uploaded yet.'}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-lg">
        <div className="between row" style={{ alignItems: 'flex-start' }}>
          <div>
            <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Document vault & date tracker</p>
            <p className="sm muted" style={{ marginTop: 4 }}>Every uploaded certificate, with issue date, expiry date and time remaining.</p>
          </div>
          <div className="seg">
            {[['all', `All (${counts.all})`], ['ready', `Ready (${counts.ready})`], ['attention', `Attention (${counts.attention})`]].map(([k, label]) => (
              <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="mt">
          {shown.length === 0 && <Empty title="No certificates here yet" text="Upload a certificate above and its dates will be tracked automatically." />}
          {shown.map(c => {
            const total = c.expiryDate ? Math.max(1, (parseDate(c.expiryDate) - parseDate(c.issueDate)) / 86400000) : 0;
            const elapsed = c.expiryDate ? Math.min(100, Math.max(0, ((startOfToday() - parseDate(c.issueDate)) / 86400000 / total) * 100)) : 0;
            const days = c.expiryDate ? daysUntil(c.expiryDate) : null;
            const tone = STATUS_TONE[c.st];
            const toneText = c.st === 'expired' ? 'bad' : c.st === 'expiring' ? 'warn' : 'ok';
            return (
              <div key={c.id} className="vault-item">
                <div className="vault-body">
                  <div className="vault-main">
                    <div className="vault-title">
                      <span className="n">{DOC_TYPES[c.type].label}</span>
                      <Badge tone={tone}>{STATUS_LABEL[c.st]}</Badge>
                      {c.sample && <Badge tone="neutral">Sample record</Badge>}
                    </div>
                    <p className="vault-file">{c.fileName} · {(c.size / 1024).toFixed(0)} KB · Uploaded {fmt(c.uploadedAt)}</p>
                    <div className="vault-dates">
                      <div><p className="k">Issued</p><p className="v">{fmt(c.issueDate)}</p></div>
                      <div><p className="k">Valid till</p><p className="v">{c.expiryDate ? fmt(c.expiryDate) : 'No expiry'}</p></div>
                      <div>
                        <p className="k">Time remaining</p>
                        <p className={`v ${toneText}`}>{days === null ? '—' : days < 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days left`}</p>
                      </div>
                    </div>
                    {c.expiryDate && (
                      <div className="vault-bar">
                        <Progress value={elapsed} tone={toneText} />
                        <p className="vault-bar p">{Math.round(elapsed)}% of validity period used</p>
                      </div>
                    )}
                  </div>
                  <div className="vault-side">
                    <label className="field">
                      <span className="field-label">Update expiry date</span>
                      <input type="date" className="input" value={c.expiryDate || ''} onChange={e => updateExpiry(c.id, e.target.value)} />
                    </label>
                    <div className="vault-side btn-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <Btn variant="ghost" size="sm" onClick={() => openFile(c)}>View file</Btn>
                      <Btn variant="danger" size="sm" onClick={() => removeCert(c.id)}>Delete</Btn>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   11. MY APPLICATIONS
   ========================================================= */
function Applications() {
  const { data, set, notify } = useApp();
  const apps = data.apps;

  const advance = (id) => {
    set(d => ({ ...d, apps: d.apps.map(a => (a.id === id && a.stage < APP_STAGES.length ? { ...a, stage: a.stage + 1 } : a)) }));
    notify('Stage marked complete.');
  };
  const remove = (id) => {
    set(d => ({ ...d, apps: d.apps.filter(a => a.id !== id) }));
    notify('Application removed from tracking.');
  };
  const exportCSV = () => {
    const rows = [['Scholarship', 'Provider', 'Stage', 'Started', 'Deadline', 'Award']];
    apps.forEach(a => {
      const s = schemeById(a.schemeId);
      if (s) rows.push([s.name, s.provider, a.stage >= APP_STAGES.length ? 'Completed' : APP_STAGES[a.stage], a.startedOn, s.deadline, s.amountLabel]);
    });
    downloadBlob(rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'), 'grantly-applications.csv', 'text/csv');
    notify('Ledger exported as CSV.');
  };

  const totalAid = apps.reduce((sum, a) => sum + (schemeById(a.schemeId)?.amount || 0), 0);
  const action = apps.filter(a => a.stage < 3).length;

  return (
    <div>
      <PageHead
        eyebrow="Scholarship dossier · Lifecycle tracker"
        title="My Applications"
        subtitle="Track each scholarship from eligibility check to disbursement."
        actions={<Btn variant="ghost" onClick={exportCSV} disabled={!apps.length}>Export ledger (CSV)</Btn>}
      />

      <div className="stat-trio">
        <Card><p className="stat-label">Total tracked</p><p className="stat-value">{apps.length}</p><p className="stat-note">Active academic year</p></Card>
        <Card><p className="stat-label">Action required</p><p className="stat-value warn-text">{action}</p><p className="stat-note">Applications before verification stage</p></Card>
        <Card><p className="stat-label">Potential aid</p><p className="stat-value accent">{inr(totalAid)}</p><p className="stat-note">Combined award value</p></Card>
      </div>

      <div className="mt-lg">
        {apps.length === 0 && <Empty title="No applications tracked" text="Open a scholarship and choose “Start tracking application”." action={<LinkBtn href="#/discover" variant="dark">Discover scholarships</LinkBtn>} />}
        {apps.map(a => {
          const s = schemeById(a.schemeId);
          if (!s) return null;
          const done = a.stage >= APP_STAGES.length;
          return (
            <Card key={a.id} className="app-block" style={{ marginBottom: 18 }}>
              <div className="app-head">
                <div style={{ minWidth: 0 }}>
                  <p className="eyebrow-sm">{s.provider}</p>
                  <h3>{s.name}</h3>
                  <p className="xs muted" style={{ marginTop: 6 }}>Started {fmt(a.startedOn)} · Deadline {fmt(s.deadline)} ({daysUntil(s.deadline)} days) · {s.amountLabel}</p>
                </div>
                <Badge tone={done ? 'ok' : 'warn'}>{done ? 'Completed' : `Current: ${APP_STAGES[a.stage]}`}</Badge>
              </div>

              <div style={{ marginTop: 18 }}><Progress value={(a.stage / APP_STAGES.length) * 100} tone="terra" /></div>
              <ol className="steps five" style={{ marginTop: 18 }}>
                {APP_STAGES.map((label, i) => {
                  const isDone = i < a.stage;
                  const isCurrent = i === a.stage && !done;
                  return (
                    <li key={label} className={`step ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`}>
                      <div className="step-top">
                        <span className="dot">{isDone ? '✓' : i + 1}</span>
                        <span className="step-state">{isDone ? 'Done' : isCurrent ? 'Now' : 'Next'}</span>
                      </div>
                      <p className="step-title">{label}</p>
                    </li>
                  );
                })}
              </ol>

              <div className="app-foot">
                <p className="sm muted">{a.note || 'No notes yet.'}</p>
                <div className="row" style={{ gap: 8 }}>
                  <Btn variant="danger" size="sm" onClick={() => remove(a.id)}>Stop tracking</Btn>
                  <Btn variant="primary" size="sm" disabled={done} onClick={() => advance(a.id)}>{done ? 'Completed ✓' : 'Mark current stage complete'}</Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-lg">
        <p className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Delays at college or district office?</p>
        <p className="sm muted" style={{ marginTop: 8 }}>Ask your college to fast-track the bonafide. If verification stays stuck, contact the District Nodal Officer (DNO) for the scheme and request a written status update. Keep a copy of every application ID.</p>
      </Card>
    </div>
  );
}

/* =========================================================
   12. OPPORTUNITY RADAR & SHORTLIST
   ========================================================= */
function Radar() {
  const { data, set, notify } = useApp();
  const [sort, setSort] = useState('deadline');
  const shortlisted = SCHEMES.filter(s => data.shortlist.includes(s.id));
  const others = SCHEMES.filter(s => !data.shortlist.includes(s.id));
  const closingWeek = shortlisted.filter(s => daysUntil(s.deadline) <= 7).length;
  const urgent = [...shortlisted].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 3);
  const sorted = [...shortlisted].sort((a, b) => sort === 'amount' ? b.amount - a.amount : a.deadline.localeCompare(b.deadline));
  const totalValue = shortlisted.reduce((s, x) => s + x.amount, 0);

  const toggle = (id) => {
    const on = data.shortlist.includes(id);
    set(d => ({ ...d, shortlist: on ? d.shortlist.filter(x => x !== id) : [...d.shortlist, id] }));
    notify(on ? 'Removed from shortlist.' : 'Added to shortlist.');
  };

  return (
    <div>
      <PageHead
        eyebrow="Personalized academic radar"
        title="Opportunity Radar & Shortlist"
        subtitle="Stay on top of upcoming deadlines and saved scholarships."
        actions={<>
          <Btn variant="ghost" disabled={!shortlisted.length} onClick={() => { downloadICS(shortlisted); notify('Calendar file downloaded.'); }}>Export deadlines (.ics)</Btn>
          <LinkBtn href="#/discover" variant="dark">+ Track new opportunity</LinkBtn>
        </>}
      />

      <div className="stat-trio">
        <Card><p className="stat-label">Shortlisted</p><p className="stat-value">{shortlisted.length}</p></Card>
        <Card><p className="stat-label">Closing this week</p><p className="stat-value bad-text">{closingWeek}</p></Card>
        <Card><p className="stat-label">Potential aid</p><p className="stat-value accent">{inr(totalValue)}</p></Card>
      </div>

      <div className="mt-lg">
        <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Urgent closing deadlines</p>
        <p className="sm muted" style={{ marginTop: 4 }}>Prioritize applications closing soonest to avoid portal lockouts.</p>
        <div className="urgent-grid">
          {urgent.length === 0 && <div style={{ gridColumn: '1 / -1' }}><Empty title="Your shortlist is empty" text="Save scholarships from Discover to see their deadlines here." /></div>}
          {urgent.map(s => {
            const d = daysUntil(s.deadline);
            return (
              <Card key={s.id} className={`urgent-card ${d <= 7 ? 'alert' : ''}`}>
                <div className="between row">
                  <Badge tone={d <= 7 ? 'bad' : d <= 20 ? 'warn' : 'neutral'}>Closes in {d} days</Badge>
                  <span className="xs muted">{fmt(s.deadline)}</span>
                </div>
                <h3>{s.name}</h3>
                <p className="prov">{s.provider}</p>
                <p className="amt">{s.amountLabel}</p>
                <LinkBtn href={`#/scheme/${s.id}`} variant="ghost">Check missing pieces</LinkBtn>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="flush mt-lg">
        <div className="table-head">
          <div>
            <h3>Your shortlisted scholarships ({shortlisted.length})</h3>
            <p>Curated from your profile and eligibility.</p>
          </div>
          <label className="row" style={{ gap: 8, fontSize: 14 }}>
            <span className="muted">Sort by</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="deadline">Deadline (earliest)</option>
              <option value="amount">Award (highest)</option>
            </select>
          </label>
        </div>
        {sorted.length === 0
          ? <div style={{ padding: 20 }}><Empty title="Nothing shortlisted" text="Save scholarships from the Discover page to build your shortlist." /></div>
          : (
            <div className="table-wrap">
              <table className="t wide">
                <thead>
                  <tr><th>Scholarship & provider</th><th>Award</th><th>Deadline & countdown</th><th>Eligibility</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                </thead>
                <tbody>
                  {sorted.map(s => {
                    const el = eligibility(s, data.profile);
                    const d = daysUntil(s.deadline);
                    return (
                      <tr key={s.id}>
                        <td>
                          <p className="serif" style={{ fontWeight: 600 }}>{s.name}</p>
                          <p className="xs muted">{s.provider}</p>
                        </td>
                        <td className="accent">{s.amountLabel}</td>
                        <td className="num">
                          <p>{fmt(s.deadline)}</p>
                          <p className={`xs ${d <= 7 ? 'bad-text' : 'muted'}`}>{d} days left</p>
                        </td>
                        <td><Badge tone={el.ok ? 'ok' : 'warn'}>{el.ok ? 'Good match' : `${el.metCount}/${el.checks.length} met`}</Badge></td>
                        <td>
                          <div className="row end" style={{ gap: 8 }}>
                            <a href={`#/scheme/${s.id}`} className="btn btn-ghost btn-sm">View</a>
                            <Btn variant="danger" size="sm" onClick={() => toggle(s.id)}>Remove</Btn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </Card>

      <div className="split mt-lg">
        <Card>
          <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Future opportunity pipeline</p>
          <p className="sm muted" style={{ marginTop: 4 }}>Schemes you have not saved yet. Add them to track their deadlines.</p>
          <ul className="pipe-list">
            {others.length === 0 && <li className="sm muted">You have saved every scheme in the directory.</li>}
            {others.map(s => (
              <li key={s.id}>
                <div style={{ minWidth: 0 }}>
                  <p className="n">{s.name}</p>
                  <p className="d">Deadline {fmt(s.deadline)} · {s.amountLabel}</p>
                </div>
                <Btn variant="ghost" size="sm" onClick={() => toggle(s.id)}>+ Save</Btn>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Next 60 days</p>
          <p className="sm muted" style={{ marginTop: 4 }}>Shortlisted deadlines in order.</p>
          <ul className="cal-list">
            {[...shortlisted].filter(s => daysUntil(s.deadline) <= 60).sort((a, b) => a.deadline.localeCompare(b.deadline)).map(s => (
              <li key={s.id}>
                <span className="d">{fmt(s.deadline)}</span>
                <span className="dot2" />
                <span className="n">{s.name}</span>
              </li>
            ))}
            {shortlisted.filter(s => daysUntil(s.deadline) <= 60).length === 0 && <li className="sm muted">No shortlisted deadlines in the next 60 days.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   13. ASK GRANTLY
   ========================================================= */
function Ask() {
  const { data, set } = useApp();
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const chat = data.chat;
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [chat.length]);

  const send = (msg) => {
    const q = (msg ?? text).trim();
    if (!q) return;
    const reply = counselorReply(q, data.profile);
    set(d => ({ ...d, chat: [...d.chat, { role: 'user', text: q }, { role: 'bot', text: reply }] }));
    setText('');
  };

  const suggestions = [
    'Why is my bonafide certificate marked incomplete?',
    'How do I get a bonafide letter from my college?',
    'What happens if my income certificate expires during review?',
    'What kind of questions are in the aptitude test?',
    'Are the photo requirements strict?'
  ];

  const dg = diagnose(SCHEMES[0], data.profile, data.certs);
  const pct = Math.round((dg.ready / dg.total) * 100);

  return (
    <div>
      <PageHead eyebrow="Personal scholarship advisor" title="Ask GRANTLY" subtitle="Clear, personalized answers about scholarship criteria, required documents and application steps." />

      <div className="split-wide">
        <div className="stack ask-side" style={{ '--gap': '20px' }}>
          <Card>
            <p className="stat-label">Dossier health</p>
            <p className="stat-value">{pct}%</p>
            <p className="xs muted" style={{ marginTop: 4 }}>Verified for {SCHEMES[0].name.split(' Undergraduate')[0]}</p>
            <div style={{ marginTop: 12 }}><Progress value={pct} /></div>
            <p className="sm muted" style={{ marginTop: 12 }}>{dg.missing.length ? `${dg.missing.length} item${dg.missing.length > 1 ? 's' : ''} need action.` : 'Nothing needs action.'}</p>
          </Card>
          <Card>
            <p className="serif" style={{ fontSize: 16, fontWeight: 600 }}>Popular questions</p>
            <div className="suggest">
              {suggestions.map(s => <button key={s} onClick={() => send(s)}>{s}</button>)}
            </div>
          </Card>
        </div>

        <Card className="chat-card">
          <div className="chat-head">
            <div>
              <p className="n">GRANTLY Counselor</p>
              <p className="s">Calibrated to your active dossier · {(data.profile.college || 'your institution').split(' (')[0]}</p>
            </div>
            {chat.length > 0 && <Btn variant="ghost" size="sm" onClick={() => set(d => ({ ...d, chat: [] }))}>Clear chat</Btn>}
          </div>

          <div className="chat-log">
            {chat.length === 0 && (
              <div className="chat-welcome">
                <p><strong>Hello, {(data.profile.name || 'there').split(' ')[0]}.</strong></p>
                <p style={{ marginTop: 6 }}>Ask about a rejected document, a deadline, the aptitude test, or what to do next. Choose a question on the left or type your own below.</p>
              </div>
            )}
            {chat.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}
            <div ref={endRef} />
          </div>

          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input className="input" placeholder="Ask about a scholarship, document or deadline…" value={text} onChange={e => setText(e.target.value)} />
            <Btn variant="primary" type="submit" disabled={!text.trim()}>Send</Btn>
          </form>
          <p className="chat-foot">General guidance only. Confirm final rules on each official portal. Your uploaded records stay in this browser.</p>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   14. REACT INTELLIGENCE FEATURES
   ========================================================= */
function SmartMatchCenter() {
  const { data } = useApp();
  const p = data.profile;
  const rows = SCHEMES.map(s => ({ scheme:s, result:eligibility(s,p), diagnosis:diagnose(s,p,data.certs) }))
    .sort((a,b) => b.result.metCount-a.result.metCount || a.scheme.deadline.localeCompare(b.scheme.deadline));
  return <div>
    <PageHead eyebrow="Personalized scholarship intelligence" title="Smart Scholarship Match" subtitle="See which published sample opportunities align with the details in your student profile — and understand every requirement." actions={<LinkBtn href="#/onboarding" variant="ghost">Update profile</LinkBtn>} />
    <div className="banner">Matching uses your saved profile. A match is a screening aid, not a guarantee of selection. Always confirm current rules with the official provider.</div>
    <div className="stack mt-lg" style={{'--gap':'16px'}}>
      {rows.map(({scheme:s,result:r,diagnosis:d}) => <Card key={s.id}>
        <div className="between row" style={{alignItems:'flex-start',gap:18}}>
          <div style={{minWidth:0}}><div className="tag-row"><Badge tone={r.metCount===r.checks.length?'ok':'warn'}>{r.metCount===r.checks.length?'All listed checks met':`${r.metCount} of ${r.checks.length} checks met`}</Badge><Badge>{s.type}</Badge></div><h3 className="scheme-name">{s.name}</h3><p className="scheme-prov">{s.provider}</p></div>
          <div style={{textAlign:'right',flexShrink:0}}><p className="amt">{s.amountLabel}</p><p className="xs muted">Deadline {fmt(s.deadline)}</p></div>
        </div>
        <div className="criteria-list">{r.checks.map((c,i)=><div className="criteria-item" key={i}><div><strong>{c.label}</strong><div className="xs muted">Required: {c.need} · Your profile: {c.have || 'Not provided'}</div></div><Badge tone={c.ok?'ok':'warn'}>{c.ok?'Matched':'Review'}</Badge></div>)}</div>
        {d.missing.length>0 && <p className="sm muted" style={{marginTop:12}}>Documents to prepare: {d.missing.map(x=>DOC_TYPES[x.type]?.label || x.type).join(', ')}.</p>}
        <div className="row mt" style={{gap:10,flexWrap:'wrap'}}><LinkBtn href={`#/scheme/${s.id}`} size="sm">View scholarship details</LinkBtn><LinkBtn href={`#/simulator?scheme=${s.id}`} variant="outline" size="sm">Explore what-if changes</LinkBtn></div>
      </Card>)}
    </div>
  </div>;
}

function WhatIfSimulator() {
  const { data } = useApp();
  const p = data.profile;
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const initial = schemeById(params.get('scheme')) || SCHEMES[0];
  const [schemeId,setSchemeId] = useState(initial.id);
  const [income,setIncome] = useState(String(p.income || ''));
  const [cgpa,setCgpa] = useState(String(p.cgpa || ''));
  const [stream,setStream] = useState(p.stream || 'Engineering');
  const [level,setLevel] = useState(p.level || 'Undergraduate');
  const scheme = schemeById(schemeId) || SCHEMES[0];
  const simulated = {...p,income:income===''?NaN:Number(income),cgpa:cgpa===''?NaN:Number(cgpa),stream,level};
  const actual = eligibility(scheme,p);
  const trial = eligibility(scheme,simulated);
  const complete = income!=='' && cgpa!=='' && !!stream && !!level;
  const changed = ['income','cgpa','stream','level'].some(k=>String(simulated[k]??'')!==String(p[k]??''));
  return <div>
    <PageHead eyebrow="Explore possibilities safely" title="What-If Scholarship Simulator" subtitle="Try different study or income scenarios to understand how requirements may change. Your saved student profile will not be edited." actions={<Btn variant="ghost" onClick={()=>{setIncome(String(p.income||''));setCgpa(String(p.cgpa||''));setStream(p.stream||'Engineering');setLevel(p.level||'Undergraduate');}}>Reset to my profile</Btn>} />
    <div className="insight-grid mt-lg">
      <Card>
        <p className="serif" style={{fontSize:18,fontWeight:600}}>Explore a scenario</p>
        <p className="xs muted" style={{margin:'6px 0 18px'}}>Change the values below to see how this sample scheme's screening criteria respond.</p>
        <div className="stack" style={{'--gap':'14px'}}>
          <Field label="Scholarship"><select className="input" value={schemeId} onChange={e=>setSchemeId(e.target.value)}>{SCHEMES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <div className="sim-controls">
            <Field label="Annual family income (₹)"><input className="input" type="number" min="0" value={income} onChange={e=>setIncome(e.target.value)} placeholder="e.g. 250000" /></Field>
            <Field label="Current CGPA"><input className="input" type="number" min="0" max="10" step="0.1" value={cgpa} onChange={e=>setCgpa(e.target.value)} placeholder="e.g. 8.0" /></Field>
            <Field label="Education level"><select className="input" value={level} onChange={e=>setLevel(e.target.value)}><option>Undergraduate</option><option>Postgraduate</option><option>Higher Secondary</option></select></Field>
            <Field label="Study stream"><select className="input" value={stream} onChange={e=>setStream(e.target.value)}>{STREAM_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></Field>
          </div>
        </div>
        <p className="xs muted" style={{marginTop:16}}>This is a hypothetical comparison only. Never change or misrepresent official application information.</p>
      </Card>
      <Card>
        <p className="serif" style={{fontSize:18,fontWeight:600}}>Scenario result</p>
        <p className="sm muted" style={{marginTop:6}}>{scheme.name}</p>
        {!complete ? <div className="empty mt"><h3>Add your scenario details</h3><p>Enter income and CGPA to calculate the comparison.</p></div> : <>
          <div className="sim-result"><p className="xs muted">HYPOTHETICAL SCREENING</p><h2 style={{fontFamily:'Domine,Georgia,serif',fontSize:26,margin:'4px 0'}}>{trial.metCount} of {trial.checks.length} checks matched</h2><Badge tone={trial.ok?'ok':'warn'}>{trial.ok?'All listed checks met':'Some requirements need review'}</Badge></div>
          <div className="criteria-list">{trial.checks.map((c,i)=><div className="criteria-item" key={i}><span>{c.label}</span><Badge tone={c.ok?'ok':'warn'}>{c.ok?'Matched':'Not matched'}</Badge></div>)}</div>
          <p className="sm" style={{marginTop:14}}><strong>Compared with your saved profile:</strong> {changed?'You are viewing a changed hypothetical scenario.':'These values currently match your saved profile.'}</p>
          <p className="xs muted" style={{marginTop:8}}>The result only checks the limited criteria represented in this demo dataset. It is not an approval prediction or an official eligibility decision.</p>
        </>}
      </Card>
    </div>
    <Card className="mt-lg"><p className="serif" style={{fontSize:17,fontWeight:600}}>If this opportunity isn't a match</p><p className="sm muted" style={{marginTop:6}}>Explore other listed scholarships rather than changing your real details to fit a scheme.</p><LinkBtn href="#/matches" className="mt" size="sm">Compare other scholarships</LinkBtn></Card>
  </div>;
}


function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const check = () => setVisible(window.scrollY > 280);
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);
  if (!visible) return null;
  return <button type="button" className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑ <span>{'Back to top'}</span></button>;
}

/* =========================================================
   14. ROOT: ROUTER, STATE, TOAST
   ========================================================= */
function useRoute() {
  const parse = () => {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    return { path: path || '/', params: new URLSearchParams(qs || ''), raw };
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

function Root() {
  const route = useRoute();
  const [data, setData] = useState(loadData);
  const [lang, setLangState] = useState(() => localStorage.getItem('grantly.language') || 'en');
  const setLang = (next) => { setLangState(next); try { localStorage.setItem('grantly.language', next); } catch (e) {} };
  useEffect(() => {
    document.documentElement.lang = lang;
    // Translate only after React has rendered the current route. A MutationObserver
    // that edits React-owned text nodes while React is reconciling can make the UI
    // unstable and interfere with navigation. Re-run this effect on route changes.
    const root = document.getElementById('root');
    translateUiTree(root, lang);
  }, [lang, route.raw]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage full: keep in memory */ }
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const ctx = { data, set: setData, lang, setLang, notify: (msg, tone = 'ok') => setToast({ msg, tone, id: Date.now() }) };
  const { path, params, raw } = route;

  let page;
  if (path === '/onboarding') page = <Onboarding key={raw} />;
  else if (path === '/' || path === '') page = <Landing key={raw} />;
  else {
    let view;
    if (path === '/dashboard') view = <Dashboard key={raw} />;
    else if (path === '/discover') view = <Discover key={raw} params={params} />;
    else if (path === '/matches') view = <SmartMatchCenter key={raw} />;
    else if (path === '/simulator') view = <WhatIfSimulator key={raw} />;
    else if (path.startsWith('/scheme/')) view = <SchemeDetail key={raw} id={path.split('/')[2]} />;
    else if (path === '/documents') view = <Documents key={raw} />;
    else if (path === '/applications') view = <Applications key={raw} />;
    else if (path === '/radar') view = <Radar key={raw} />;
    else if (path === '/ask') view = <Ask key={raw} />;
    else view = <Empty title="Page not found" text="The page you are looking for does not exist." action={<LinkBtn href="#/dashboard">Go to dashboard</LinkBtn>} />;
    page = <Shell path={path}>{view}</Shell>;
  }

  return (
    <AppCtx.Provider value={ctx}>
      {page}
      <BackToTop />
      {toast && (
        <div key={toast.id} role="status" className={`toast ${toast.tone === 'warn' ? 'warn' : ''}`}>{toast.msg}</div>
      )}
    </AppCtx.Provider>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
