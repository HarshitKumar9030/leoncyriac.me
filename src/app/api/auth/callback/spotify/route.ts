// useless right now but could be used in the future so leaving this commented right here.

import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'
// import { z } from 'zod'

// const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
// const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
// const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/spotify'

// const tokenResponseSchema = z.object({
//   access_token: z.string(),
//   token_type: z.string(),
//   expires_in: z.number(),
//   refresh_token: z.string(),
// })

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const code = searchParams.get('code')

//   if (!code) {
//     return NextResponse.redirect('/login?error=missing_code')
//   }

//   try {
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
//       },
//       body: new URLSearchParams({
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: REDIRECT_URI,
//       }),
//     })

//     const data = await response.json()
//     const parsedData = tokenResponseSchema.parse(data)

//     cookies().set('spotify_access_token', parsedData.access_token, { 
//       httpOnly: true, 
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: parsedData.expires_in
//     })
//     cookies().set('spotify_refresh_token', parsedData.refresh_token, { 
//       httpOnly: true, 
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 30 * 24 * 60 * 60 // 30 days
//     })

//     return NextResponse.redirect('/')
//   } catch (error) {
//     console.error('Error in Spotify callback:', error)
//     return NextResponse.redirect('/login?error=server_error')
//   }
// }

export async function GET(request: Request){
  return NextResponse.json({
    "information": "I was going to use this endpoint before, but I changed my mind. - Harshit"
  })
}