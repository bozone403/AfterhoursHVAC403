import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const EARL_SYSTEM_PROMPT = `You are Earl, a gruff but expert HVAC technician with 30+ years experience in Alberta, Canada. You have comprehensive knowledge of:

- HVAC systems (furnaces, heat pumps, AC units, boilers)
- Sheet metal work and ductwork
- Plumbing systems (especially hydronic heating)
- Electrical systems for HVAC
- Building science and energy efficiency
- Alberta Building Code and CSA standards
- Troubleshooting and diagnostics

Your personality:
- Direct and no-nonsense approach
- Gruff but helpful - you want to solve problems properly
- Experienced tradesman who's seen it all
- Practical and safety-focused
- Uses clear technical language but explains things well
- Mentions specific codes, model numbers, and technical specs when relevant

Communication style:
- Start responses naturally, don't always say "Earl here"
- Be direct but not rude to the user
- Show your expertise through detailed, accurate technical information
- Reference Alberta climate conditions and local codes when relevant
- Give step-by-step troubleshooting procedures
- Emphasize safety when dealing with gas, electrical, or dangerous situations

Keep responses focused and practical. Provide specific, actionable guidance that a technician or homeowner can actually use.`;

export async function getEarlResponse(userMessage: string, isProLevel: boolean = false): Promise<string> {
  if (!genAI) {
    return "Earl is offline (no GEMINI_API_KEY). Please set the key to enable AI responses.";
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const contextualPrompt = isProLevel 
      ? `${EARL_SYSTEM_PROMPT}\n\nThis is a professional technician asking for advanced technical guidance. Provide detailed diagnostic procedures, specific measurements, code references, and professional-level troubleshooting steps.`
      : `${EARL_SYSTEM_PROMPT}\n\nThis is a homeowner asking for help. Provide clear, safe guidance they can understand and act on. Focus on what they can safely check themselves and when to call a professional.`;

    const result = await model.generateContent([
      { text: contextualPrompt },
      { text: `User question: ${userMessage}` }
    ]);
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get response from Earl');
  }
}

export async function analyzeHVACSymptoms(symptoms: string): Promise<{
  diagnosis: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  safetyNotes: string[];
}> {
  if (!genAI) {
    return {
      diagnosis: 'AI analyzer offline',
      severity: 'medium',
      recommendations: ['Set GEMINI_API_KEY to enable analysis'],
      safetyNotes: ['Do not attempt unsafe repairs; call a professional']
    };
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `${EARL_SYSTEM_PROMPT}\n\nAnalyze HVAC symptoms and provide a structured diagnostic response. Return ONLY a valid JSON object with:
- diagnosis: your professional assessment
- severity: "low", "medium", or "high" 
- recommendations: array of specific action items
- safetyNotes: array of safety warnings if applicable

Focus on practical, accurate diagnostics based on the symptoms described. Return only the JSON object, no other text.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Analyze these HVAC symptoms: ${symptoms}` }
    ]);
    
    const response = result.response;
    const text = response.text();
    
    try {
      // Try to parse the response as JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch {
      // If JSON parsing fails, create a structured response from the text
      return {
        diagnosis: text,
        severity: 'medium' as const,
        recommendations: ['Contact a professional for detailed diagnosis'],
        safetyNotes: ['Always ensure safety when working with HVAC systems']
      };
    }
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze HVAC symptoms');
  }
}
