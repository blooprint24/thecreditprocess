import Link from 'next/link'
import { ShieldCheckIcon, DocumentTextIcon, LockClosedIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Credit Repair Workflow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-white/80 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Take Control of Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Credit Report
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Upload your credit reports, get AI-powered analysis, and generate professional dispute letters—all in one secure, privacy-first platform.
          </p>

          {/* Disclaimer Badge */}
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-3 mb-8">
            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-yellow-200 font-medium">Educational Tool Only • Not Legal Advice</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
            >
              Start Free Analysis
            </Link>
            <Link
              href="#features"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm border border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DocumentTextIcon className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Upload Reports</h3>
            <p className="text-white/70">
              Securely upload up to 3 credit bureau reports (PDF, images, or HTML).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
            <p className="text-white/70">
              Our engine detects potential issues like duplicates, inconsistencies, and errors.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DocumentTextIcon className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Generate Letters</h3>
            <p className="text-white/70">
              Create professional dispute letters customized to your findings.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="bg-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <LockClosedIcon className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Export & Send</h3>
            <p className="text-white/70">
              Download as PDF or DOCX, then mail to bureaus via certified mail.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-6">
            <LockClosedIcon className="h-12 w-12 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Privacy-First & Secure
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Encrypted Storage</h3>
              <p className="text-white/70">All files encrypted at rest and in transit</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">PII Redaction</h3>
              <p className="text-white/70">SSN and sensitive data automatically masked</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Auto-Delete</h3>
              <p className="text-white/70">Files auto-deleted after 30 days (configurable)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Important Disclaimers
          </h2>
          <ul className="space-y-3 text-yellow-100">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Not Legal Advice:</strong> This tool provides educational information only. It does not constitute legal advice.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>No Guarantees:</strong> We make no guarantees about dispute outcomes or credit score improvements.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Your Responsibility:</strong> You are responsible for the accuracy of all information and letters sent to bureaus.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Authorization Required:</strong> Only upload reports you own or are authorized to use.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Create your free account and upload your first report today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 mb-4 md:mb-0">
              © 2026 Credit Repair Workflow. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
