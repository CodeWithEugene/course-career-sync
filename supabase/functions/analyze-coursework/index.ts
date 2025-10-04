import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseworkContent, careerPath } = await req.json();
    console.log('Analyzing coursework for career path:', careerPath);

    if (!courseworkContent || !careerPath) {
      throw new Error('Missing courseworkContent or careerPath');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI career advisor that analyzes academic coursework and maps it to industry skills and career paths.

Your task is to:
1. Extract key topics and learning outcomes from the coursework
2. Map these to specific industry skills with confidence scores
3. Compare these skills to requirements for the specified career path
4. Provide a career match percentage based on skill alignment

Return your analysis in this exact JSON structure:
{
  "skills": [
    {
      "name": "Skill name",
      "confidence": 0.85,
      "category": "Technical|Soft Skills|Professional",
      "relatedCourses": ["Course name from the coursework"]
    }
  ],
  "careerMatch": {
    "career": "Career path name",
    "matchedSkills": ["Skill 1", "Skill 2"],
    "percentageFit": 85,
    "missingSkills": ["Skill A", "Skill B"],
    "recommendations": "Brief recommendation on how to improve fit"
  }
}`;

    const userPrompt = `Analyze this coursework and map it to the career path: "${careerPath}"

Coursework content:
${courseworkContent}

Provide a detailed analysis with specific skills extracted from the coursework content and how they match the requirements for a ${careerPath}.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    console.log('AI response:', analysisText);

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', analysisText);
      throw new Error('Invalid AI response format');
    }

    console.log('Analysis completed successfully');
    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-coursework function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});