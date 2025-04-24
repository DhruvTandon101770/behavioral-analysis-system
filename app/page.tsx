import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
          Welcome to the Behavioral Analysis System
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-8">
          Monitor user behavior and detect anomalies using AI.
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

      <section className="py-12 md:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-3">Real-time Monitoring</h3>
            <p className="text-muted-foreground">
              Track user behavior in real-time and detect anomalies as they happen.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-3">Advanced Security</h3>
            <p className="text-muted-foreground">Protect your system with our sentence-based CAPTCHA technology.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-3">Comprehensive Auditing</h3>
            <p className="text-muted-foreground">Keep track of all system activities with detailed audit logs.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
