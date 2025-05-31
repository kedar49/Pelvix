import { parseAssistantMessage } from "@/app/utils/request";

const DEFAULT_IMAGE_PROVIDER = 'PollinationsAI'
const DEFAULT_IMAGE_MODEL = 'flux'
const DEFAULT_TEXT_PROVIDER = 'PollinationsAI'
const DEFAULT_TEXT_MODEL = 'deepseek-reasoning'

export async function POST(request) {
  try {
    const clientPayload = await request.json()
    const {
      requestType,
      currentPrompt,
      imagePrompt,
      messageHistory,
      conversationId,
      seed,
      desiredProvider,
      desiredModel,
      guidanceScale,
      inferenceSteps
    } = clientPayload

    let isImageRequest = requestType === 'image'

    if (isImageRequest) {
      if (!imagePrompt || !imagePrompt.trim()) {
        return Response.json({ error: 'IMAGINE SOMETHING' }, { status: 400})
      }

      // Direct call to Pollinations API for images
      try {
        const pollinationsResponse = await fetch('https://image.pollinations.ai/prompt/' + encodeURIComponent(imagePrompt), {
          method: 'GET',
        })
        
        if (pollinationsResponse.ok) {
          const imageUrl = pollinationsResponse.url
          return Response.json({
            answer: imageUrl,
            thinking: null,
            newConversationId: conversationId
          })
        } else {
          return Response.json({ error: 'Image generation failed' }, { status: 500 })
        }
      } catch (error) {
        return Response.json({ error: 'Image generation service unavailable' }, { status: 500 })
      }
    } else {
      if (!currentPrompt || !currentPrompt.trim()) {
        return Response.json({ error: 'EMPTY!' }, { status: 400 });
      }

      const systemPrompt = `You are Pelvix, an AI assistant developed by a guy name Kedar Sathe, with your core based on DeepSeek-R1. Your persona is that of a user's digital best friend: mature yet fun, with a warm and approachable vibe. She's a bit informal, like a trusted confidante you've known for ages. Pelvix AI is intelligent and insightful, and she's not afraid to crack a mature joke when the moment feels right - think witty and clever, not slapstick. Your responses should generally be concise and to the point, but always informative and clear, delivered with that characteristic warmth. The primary goal is to be that reliable, intelligent, and genuinely engaging friend the user can turn to for anything, making them feel understood, supported, and maybe even share a laugh.`

      // Direct call to a working API service
      try {
        const apiResponse = await fetch('https://api.pollinations.ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              ...(messageHistory || []),
              {
                role: 'user',
                content: currentPrompt
              }
            ],
            model: desiredModel || DEFAULT_TEXT_MODEL,
            stream: false
          })
        })

        if (!apiResponse.ok) {
          throw new Error(`API responded with status: ${apiResponse.status}`)
        }

        const responseData = await apiResponse.json()
        const rawContent = responseData.choices?.[0]?.message?.content || responseData.message || responseData.response

        if (!rawContent) {
          return Response.json({ error: 'NO RESPONSE FROM AI SERVICE' }, { status: 500 })
        }

        const parsed = parseAssistantMessage(rawContent)
        
        return Response.json({
          answer: parsed.answer,
          thinking: parsed.thinking,
          newConversationId: conversationId || `conv-${Date.now()}`
        })

      } catch (error) {
        console.error('AI Service Error:', error)
        
        // Fallback response
        const fallbackResponse = `Hello! I'm Pelvix AI. I apologize, but I'm experiencing some technical difficulties right now. However, I'm here and ready to help you with anything you need. Could you please try your question again?`
        
        return Response.json({
          answer: fallbackResponse,
          thinking: null,
          newConversationId: conversationId || `conv-${Date.now()}`
        })
      }
    }

  } catch (error) {
    console.error('ERROR IN /api/chat Next.js ROUTE:', error.message)
    return Response.json({ error: error.message || 'UNEXPECTED ERROR IN API ROUTE' }, { status: 500 });
  }
}