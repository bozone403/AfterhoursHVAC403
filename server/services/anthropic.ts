import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
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
  if (!anthropic) {
    return "Earl is offline (no ANTHROPIC_API_KEY). Please set the key to enable AI responses.";
  }
  try {
    const contextualPrompt = isProLevel 
      ? `${EARL_SYSTEM_PROMPT}\n\nThis is a professional technician asking for advanced technical guidance. Provide detailed diagnostic procedures, specific measurements, code references, and professional-level troubleshooting steps.`
      : `${EARL_SYSTEM_PROMPT}\n\nThis is a homeowner asking for help. Provide clear, safe guidance they can understand and act on. Focus on what they can safely check themselves and when to call a professional.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: contextualPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    throw new Error('Unexpected response format from Anthropic');
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to get response from Earl');
  }
}

export async function analyzeHVACSymptoms(symptoms: string): Promise<{
  diagnosis: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  safetyNotes: string[];
}> {
  if (!anthropic) {
    return {
      diagnosis: 'AI analyzer offline',
      severity: 'medium',
      recommendations: ['Set ANTHROPIC_API_KEY to enable analysis'],
      safetyNotes: ['Do not attempt unsafe repairs; call a professional']
    };
  }
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: `${EARL_SYSTEM_PROMPT}\n\nAnalyze HVAC symptoms and provide a structured diagnostic response. Return a JSON object with:
- diagnosis: your professional assessment
- severity: "low", "medium", or "high" 
- recommendations: array of specific action items
- safetyNotes: array of safety warnings if applicable

Focus on practical, accurate diagnostics based on the symptoms described.`,
      messages: [
        {
          role: 'user',
          content: `Analyze these HVAC symptoms: ${symptoms}`
        }
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        return JSON.parse(content.text);
      } catch {
        // If JSON parsing fails, create a structured response from the text
        return {
          diagnosis: content.text,
          severity: 'medium' as const,
          recommendations: ['Contact a professional for detailed diagnosis'],
          safetyNotes: ['Always ensure safety when working with HVAC systems']
        };
      }
    }
    
    throw new Error('Unexpected response format from Anthropic');
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze HVAC symptoms');
  }
}