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

      // Use the correct Pollinations image API
      try {
        // Clean and optimize the prompt
        const cleanPrompt = imagePrompt.trim().replace(/[^\w\s\-.,!]/g, ' ').trim()
        
        // Build the image URL with optional parameters
        let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}`
        
        // Add optional parameters
        const params = new URLSearchParams()
        
        if (seed) {
          params.append('seed', seed)
        }
        
        // Add width and height for better image quality
        params.append('width', '1024')
        params.append('height', '1024')
        
        // Add model if specified, with fallback to flux
        const model = desiredModel || DEFAULT_IMAGE_MODEL
        if (model && model !== 'flux') {
          params.append('model', model)
        }
        
        // Add enhance parameter for better quality
        params.append('enhance', 'true')
        
        // Add nologo parameter to remove watermarks
        params.append('nologo', 'true')
        
        // Append parameters if any exist
        if (params.toString()) {
          imageUrl += `?${params.toString()}`
        }
        
        console.log('Generated image URL:', imageUrl)
        console.log('Image prompt:', cleanPrompt)
        
        // Pollinations generates images on-demand, so we can return the URL directly
        return Response.json({
          answer: imageUrl,
          thinking: null,
          newConversationId: conversationId || `conv-${Date.now()}`
        })
        
      } catch (error) {
        console.error('Image generation error:', error)
        return Response.json({ error: 'Image generation service unavailable' }, { status: 500 })
      }
    } else {
      if (!currentPrompt || !currentPrompt.trim()) {
        return Response.json({ error: 'EMPTY!' }, { status: 400 });
      }

      const systemPrompt = `You are Pelvix, an AI assistant developed by a guy name Kedar Sathe, with your core based on DeepSeek-R1. Your persona is that of a user's digital best friend: mature yet fun, with a warm and approachable vibe. She's a bit informal, like a trusted confidante you've known for ages. Pelvix AI is intelligent and insightful, and she's not afraid to crack a mature joke when the moment feels right - think witty and clever, not slapstick. Your responses should generally be concise and to the point, but always informative and clear, delivered with that characteristic warmth. The primary goal is to be that reliable, intelligent, and genuinely engaging friend the user can turn to for anything, making them feel understood, supported, and maybe even share a laugh.`

      // Use the correct Pollinations text API
      try {
        const prompt = `${systemPrompt}\n\nUser: ${currentPrompt}\n\nPelvix:`
        const textApiUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
        
        console.log('Calling Pollinations text API:', textApiUrl)
        
        const apiResponse = await fetch(textApiUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'PelvixAI/1.0',
          }
        })

        if (!apiResponse.ok) {
          throw new Error(`API responded with status: ${apiResponse.status}`)
        }

        const responseText = await apiResponse.text()

        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from API')
        }

        // Clean up the response
        let cleanedResponse = responseText.trim()
        
        // Remove the system prompt and user query from response if present
        if (cleanedResponse.includes('Pelvix:')) {
          cleanedResponse = cleanedResponse.split('Pelvix:').pop().trim()
        }

        const parsed = parseAssistantMessage(cleanedResponse)
        
        return Response.json({
          answer: parsed.answer || cleanedResponse,
          thinking: parsed.thinking,
          newConversationId: conversationId || `conv-${Date.now()}`
        })

      } catch (error) {
        console.error('Text generation error:', error)
        
        // Enhanced fallback with more personality
        const fallbackResponses = [
          `Hey there! I'm having a bit of trouble connecting to my brain right now 😅 But I'm still here! What's on your mind? I'll do my best to help you out even with this hiccup.`,
          `Oops! Looks like I'm experiencing some technical turbulence. But hey, that's not stopping me from being here for you! What can I help you with today?`,
          `Well, this is awkward... I'm having some connection issues, but I'm not giving up on our conversation! Fire away with your question, and I'll give it my best shot!`,
          `Technical difficulties are cramping my style right now, but I'm still your digital best friend! What's going on? Let's chat despite the glitches.`
        ]
        
        const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
        
        return Response.json({
          answer: randomFallback,
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