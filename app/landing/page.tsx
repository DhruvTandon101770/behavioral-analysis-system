import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Activity, Brain, MousePointer, Keyboard } from "lucide-react"

export default function Landing() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
          Advanced Behavioral Analysis System
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-8">
          Secure your application with next-generation behavioral biometrics and anomaly detection
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card p-6 rounded-lg shadow">
            <CardContent className="p-0 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Behavioral Biometrics</h3>
              <p className="text-muted-foreground">
                Analyze typing patterns, mouse movements, and interaction behaviors to create a unique user profile.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow">
            <CardContent className="p-0 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Anomaly Detection</h3>
              <p className="text-muted-foreground">
                Real-time monitoring of user behavior to detect suspicious activities and potential account takeovers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card p-6 rounded-lg shadow">
            <CardContent className="p-0 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Advanced CAPTCHA</h3>
              <p className="text-muted-foreground">
                Sentence-based CAPTCHA that not only verifies humanity but also captures behavioral fingerprints.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24 bg-muted/30 rounded-lg my-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create an account and complete the CAPTCHA challenge</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Behavioral Profile</h3>
              <p className="text-muted-foreground">The system analyzes your typing and mouse patterns</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Login Verification</h3>
              <p className="text-muted-foreground">Your behavior is verified each time you log in</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Continuous Monitoring</h3>
              <p className="text-muted-foreground">Ongoing analysis to detect suspicious behavior</p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Behavioral Metrics We Track</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg shadow flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Typing Patterns</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Typing speed and rhythm</li>
                <li>Key press duration</li>
                <li>Time between keystrokes</li>
                <li>Common typing errors</li>
              </ul>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MousePointer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Mouse Behavior</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Movement patterns and speed</li>
                <li>Click frequency and timing</li>
                <li>Cursor hover patterns</li>
                <li>Scrolling behavior</li>
              </ul>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Authentication Behavior</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Login time patterns</li>
                <li>CAPTCHA solving approach</li>
                <li>Form filling patterns</li>
                <li>Error correction behavior</li>
              </ul>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Anomaly Indicators</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Sudden behavior changes</li>
                <li>Unusual access patterns</li>
                <li>Inconsistent interaction styles</li>
                <li>Suspicious activity timing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-primary text-primary-foreground rounded-lg my-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Application?</h2>
          <p className="text-xl mb-8 max-w-[600px] mx-auto opacity-90">
            Join thousands of organizations using behavioral biometrics to enhance security beyond passwords.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
