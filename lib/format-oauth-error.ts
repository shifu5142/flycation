export function formatOAuthError(message: string) {
  if (message.includes("Unable to exchange external code")) {
    return (
      "Google/GitHub OAuth failed inside Supabase (not your callback page). " +
      "Open Supabase Dashboard → Authentication → Providers → Google and paste the SAME " +
      "Client ID + Secret from Google Cloud (your .env is not used automatically). " +
      "In Google Cloud → Credentials → your Web client, the ONLY redirect URI must be: " +
      "https://yvhnlhqfvwyptdcylday.supabase.co/auth/v1/callback — not localhost. " +
      "Then add http://localhost:3000/auth/callback under Supabase → URL Configuration → Redirect URLs."
    )
  }

  if (message.includes("code verifier")) {
    return "Sign-in session expired. Please try Google or GitHub login again."
  }

  return message
}
