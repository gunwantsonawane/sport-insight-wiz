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
    const { frames } = await req.json();
    
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Video frames are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing video with AI using ${frames.length} frames...`);

    // Build content array with text and all frames
    const content: any[] = [
      {
        type: 'text',
        text: `Analyze the following sports video as a coach with a focus on technique and performance. Provide a comprehensive and detailed feedback report in JSON format, including the following sections:

{
  "sport": "Name of the sport being played in the video",
  "confidence": 0.95,
  
  "technique_analysis": [
    "A detailed, point-by-point breakdown of the player's technique and form, highlighting strengths and weaknesses.",
    "Consider positioning, body movements, coordination, and any sport-specific techniques relevant to the video."
  ],

  "improvement_suggestions": [
    "Specific actionable feedback on how the player can improve their technique, form, or approach during the activity.",
    "Suggestions should be clear, practical, and aimed at enhancing overall performance."
  ],

  "positive_highlights": [
    "Notable strengths in the player's performance, such as effective movement, precision, or technique that stands out positively.",
    "Focus on moments where the player demonstrated superior skills or decision-making."
  ],

  "areas_of_concern": [
    "Potential issues or areas that need attention, such as improper form, risky movements, or missed opportunities for improvement.",
    "Be specific about what went wrong and how it might impact performance or safety."
  ]
}

Make sure to provide your analysis in a structured and well-organized manner, adhering to the provided JSON format.`
      }
    ];

    // Add all frames as images
    frames.forEach((frame: string, index: number) => {
      content.push({
        type: 'image_url',
        image_url: {
          url: frame
        }
      });
    });

    // Call Lovable AI Gateway with vision model (with retry on transient errors)
    const makeAiRequest = async () => {
      return await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'You are an expert sports coach and biomechanics analyst. Analyze sports performance and provide detailed, actionable coaching feedback. Focus on technique, form, strengths, and areas for improvement.'
            },
            {
              role: 'user',
              content: content
            }
          ]
        }),
      });
    };

    let response;
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        response = await makeAiRequest();
        // Retry on 5xx
        if (response && (response.status >= 500)) {
          const text = await response.text();
          console.error('AI gateway error:', response.status, text);
          if (attempt < maxAttempts) {
            const delay = 300 * attempt;
            await new Promise((res) => setTimeout(res, delay));
            continue;
          }
        }
        break;
      } catch (err) {
        console.error('AI gateway fetch failed (network):', err);
        if (attempt < maxAttempts) {
          const delay = 300 * attempt;
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }
        // Final failure: return 503
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unreachable. Please retry shortly.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 503;
      let errorText = '';
      try { errorText = await response!.text(); } catch {}
      console.error('AI gateway error:', status, errorText);

      if (status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (status === 503 || status >= 500) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable. Please retry shortly.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to analyze video' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response from AI');
      return new Response(
        JSON.stringify({ error: 'No analysis generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Response:', aiResponse);

    // Try to parse JSON from the response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || 
                       aiResponse.match(/```\n?([\s\S]*?)\n?```/) ||
                       [null, aiResponse];
      
      analysis = JSON.parse(jsonMatch[1] || aiResponse);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      // Fallback: create structured response from text
      analysis = {
        sport: 'Unknown',
        confidence: 0.5,
        technique_analysis: ['Analysis could not be parsed correctly'],
        improvement_suggestions: ['Please try again'],
        positive_highlights: ['Unable to analyze'],
        areas_of_concern: ['Analysis parsing failed']
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-video function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
