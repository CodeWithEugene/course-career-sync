import { Loader2 } from 'lucide-react'

const AuthCallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Completing your Google sign-in...</p>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your credentials.
        </p>
      </div>
    </div>
  )
}

export default AuthCallback