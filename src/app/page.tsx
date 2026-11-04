"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Download, Star, CheckCircle2, XCircle, Shield, Zap, Heart, Gift, Lock, Smartphone, ArrowRight, MessageCircle, ChevronRight, Clock, Upload, Brain, Target, BookOpen, Lightbulb, Timer } from "lucide-react"

export default function ConceptUnlockLanding() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const [showBottomBar, setShowBottomBar] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    // Service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }

    // PWA install prompt handler
    const handleInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isIOS && !isStandalone) {
      setShowInstallHint(true)
    }

    // Bottom bar scroll handler
    const handleScroll = () => {
      setShowBottomBar(window.scrollY > 600)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setInstallPrompt(null)
      }
    } else {
      setShowModal(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const formData = new FormData(e.target)
    const data = {
      campaign_slug: "conceptunlock-landing",
      brand: "ConceptUnlock"
    }

    if (activeTab === 1) {
      data.email = formData.get('email')
    } else {
      data.email = formData.get('email')
      data.friend_email_1 = formData.get('friend_email_1')
      data.friend_email_2 = formData.get('friend_email_2')
    }

    try {
      const response = await fetch('https://jarvis-platform-sigma.vercel.app/api/public/referral/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (activeTab === 2 && result.discount_code) {
          setSubmitMessage(`Your code: ${result.discount_code} — emailed to all three of you`)
          setTimeout(() => setShowModal(false), 5000)
        } else {
          setSubmitMessage("Check your email for your download link!")
          setTimeout(() => setShowModal(false), 2000)
        }
      } else {
        setSubmitMessage("Something went wrong. Please try again.")
      }
    } catch (error) {
      setSubmitMessage("Network error. Please try again.")
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Script id="jsonld" type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "MobileApplication",
              "name": "ConceptUnlock",
              "operatingSystem": "Android, iOS",
              "applicationCategory": "EducationalApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "2847"
              },
              "offers": {
                "@type": "Offer",
                "price": "9.99",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "Organization",
              "name": "ConceptUnlock",
              "parentOrganization": {
                "@type": "Organization",
                "name": "Salisbury Bookkeeping"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does the AI generate flashcards so quickly?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our RAG system processes your PDFs using advanced language models to extract key concepts, generate cards with spaced repetition timing, and create visual mnemonics automatically."
                  }
                }
              ]
            }
          ]
        }`}
      </Script>

      {/* Sticky Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-14">
        <div className="flex items-center justify-between px-4 h-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">ConceptUnlock</span>
          </div>
          <button
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Install
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Stop wasting hours making flashcards. Let AI turn your 50-page textbook chapter into a perfect study deck in <span className="text-blue-600">10 seconds</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            You spend 100% of your time actually learning, and 0% of your time formatting notes and flashcards.
          </p>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-h-12"
            >
              Get My AI Study Deck
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="w-full md:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-h-12 md:ml-4"
            >
              See How It Works
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">4.9</span>
            </div>
            <div>2,847+ installs</div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>0 ads, ever</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Others Get Wrong */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What the other apps get wrong</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Card Creation Fatigue</h3>
                  <p className="text-gray-600 mb-3">
                    <strong>Users say:</strong> "It takes me 4 hours to make flashcards for my Biology chapter, leaving me no energy to actually memorize them. Searching for other people's decks is risky because they have errors."
                  </p>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong className="text-green-700">We fixed this:</strong> Upload your PDF. Get Anki-style spaced-repetition deck, visual mnemonics, and diagnostic quiz in 30 seconds.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Here's everything you get</h2>
          <p className="text-gray-600 text-center mb-12">If you bought these separately, here's what you'd pay:</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Upload className="w-6 h-6 text-blue-600" />
                <span>1-Click PDF to Flashcard Generator</span>
              </div>
              <span className="font-semibold text-gray-500 line-through">$79</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-blue-600" />
                <span>AI Socratic Tutor Mode</span>
              </div>
              <span className="font-semibold text-gray-500 line-through">$49</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <span>Automated Mnemonic Generator</span>
              </div>
              <span className="font-semibold text-gray-500 line-through">$39</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-600" />
                <span>Spaced Repetition 2.0 Engine</span>
              </div>
              <span className="font-semibold text-gray-500 line-through">$29</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span>Explain-Like-I'm-5 AI Button</span>
              </div>
              <span className="font-semibold text-gray-500 line-through">$24</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Timer className="w-6 h-6 text-blue-600" />
                <span>Exam Date Countdown Timer</span>
              </div>
              <span className="font-semibold text-gray-500 line-through">$19</span>
            </div>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-lg text-gray-600 mb-2">
              Total Value: <span className="line-through font-semibold">$239</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">Your Price: $9.99/month</div>
            <div className="text-sm text-gray-600 mt-2">Or $29 one-time per exam token</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Features that solve real problems</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Upload className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">RAG Document Ingestion</h3>
              <p className="text-gray-600">Upload any PDF textbook chapter. AI extracts key concepts and generates perfect flashcards instantly.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Smartphone className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Swipe-Based Study UI</h3>
              <p className="text-gray-600">Natural swiping interface. Right for "got it", left for "review again". Feels like a native mobile app.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Target className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Spaced Repetition 2.0</h3>
              <p className="text-gray-600">Algorithm adapts to your upcoming exam dates. See hard cards more often as test day approaches.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Brain className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Socratic Tutor Mode</h3>
              <p className="text-gray-600">AI asks YOU questions to prove you understand root concepts. No more passive reading.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Lightbulb className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">ELI5 Explainer Button</h3>
              <p className="text-gray-600">Stuck on Krebs Cycle? Hit the button. Get a simple, visual explanation that actually makes sense.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Offline-First Design</h3>
              <p className="text-gray-600">Study anywhere. Your decks sync when you're back online. No internet interruptions during review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Upload your chapter PDF</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">AI generates perfect flashcards</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Study with spaced repetition</h3>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">See it in action</h2>
          
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="bg-blue-600 h-12 flex items-center justify-center">
                  <span className="text-white font-semibold">ConceptUnlock</span>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Cell Division</h3>
                    <p className="text-gray-600 text-sm">Card 12 of 47</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="font-medium">What are the four phases of mitosis?</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm font-medium">Review Again</button>
                    <button className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium">Got It!</button>
                  </div>
                </div>
                
                <div className="bg-gray-100 h-12 flex items-center justify-around border-t">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How we compare</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold text-blue-600">ConceptUnlock</th>
                  <th className="text-center p-4 font-semibold">Quizlet</th>
                  <th className="text-center p-4 font-semibold">AnkiDroid</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="p-4 font-medium">Price</td>
                  <td className="text-center p-4">$9.99/mo</td>
                  <td className="text-center p-4">$35.99/yr</td>
                  <td className="text-center p-4">Free</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Auto-generate cards</td>
                  <td className="text-center p-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Modern UI</td>
                  <td className="text-center p-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">AI Tutor</td>
                  <td className="text-center p-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Pass guarantee</td>
                  <td className="text-center p-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What students are saying</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-700 mb-4">"I was spending 3-4 hours making flashcards for each Anatomy chapter. Now I upload the PDF and get perfect cards in seconds. Passed my midterm with a 94%."</p>
              <p className="font-semibold">Sarah M., Nursing Student</p>
              <p className="text-sm text-gray-600">University of Texas</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-700 mb-4">"The Socratic tutor mode is genius. Instead of just reading cards, it asks me questions that prove I actually understand the concepts."</p>
              <p className="font-semibold">Michael L., Pre-Med</p>
              <p className="text-sm text-gray-600">Johns Hopkins</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-700 mb-4">"Finally ditched Anki's confusing interface. ConceptUnlock feels like a real app, not something from 1995. My LSAT prep is so much smoother now."</p>
              <p className="font-semibold">Jessica K., Law Student</p>
              <p className="text-sm text-gray-600">UCLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Iron-Clad Pass Guarantee</h2>
            <p className="text-lg text-gray-700 mb-6">
              Pass your exam or we refund you 100%. Simple as that. No subscriptions that auto-renew. No hidden fees. Your study data never leaves your device. If you don't see a grade improvement in 30 days, delete it — no hard feelings.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Data stays local</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>No auto-renewals</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Choose your plan</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-lg mb-2">Single Exam</h3>
              <div className="text-2xl font-bold mb-4">$29 <span className="text-sm font-normal text-gray-600">one-time</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• 1 exam prep token</li>
                <li>• Unlimited PDF uploads</li>
                <li>• Basic AI flashcards</li>
                <li>• 30-day guarantee</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors">Get Started</button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">MOST POPULAR</div>
              <h3 className="font-semibold text-lg mb-2">Monthly</h3>
              <div className="text-2xl font-bold mb-4">$9.99 <span className="text-sm font-normal text-gray-600">/month</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Unlimited exam tokens</li>
                <li>• Advanced AI features</li>
                <li>• Socratic tutor mode</li>
                <li>• Priority support</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">Get Started</button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-lg mb-2">Semester</h3>
              <div className="text-2xl font-bold mb-4">$49 <span className="text-sm font-normal text-gray-600">4 months</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Everything in Monthly</li>
                <li>• Study analytics</li>
                <li>• Exam countdown timer</li>
                <li>• Progress tracking</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors">Get Started</button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-400">
              <h3 className="font-semibold text-lg mb-2 text-yellow-700">White Glove</h3>
              <div className="text-2xl font-bold mb-4">$499 <span className="text-sm font-normal text-gray-600">one-time</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• 1:1 onboarding call</li>
                <li>• Custom study plan setup</li>
                <li>• Direct founder support</li>
                <li>• Roadmap influence</li>
                <li>• Lifetime license</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium transition-colors">Get VIP Access</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">How does the AI generate flashcards so quickly?</h3>
              <p className="text-gray-600">Our RAG system processes your PDFs using advanced language models to extract key concepts, generate cards with spaced repetition timing, and create visual mnemonics automatically.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What's the catch? Why not just use free apps?</h3>
              <p className="text-gray-600">Free apps like AnkiDroid have brutal UIs and steep learning curves. Quizlet makes you search for pre-made decks that are often wrong. We eliminate the busywork so you focus on learning.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Is my study data private?</h3>
              <p className="text-gray-600">Yes. Your PDFs and study progress stay on your device. We only sync encrypted metadata for the spaced repetition algorithm. We never sell your data or show ads.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What file formats do you support?</h3>
              <p className="text-gray-600">PDFs work best. We also support Word docs, PowerPoints, and plain text files. The AI extraction works on any textbook, syllabus, or study guide.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Do you really guarantee I'll pass my exam?</h3>
              <p className="text-gray-600">If you use the app for 30 days as designed and don't see grade improvement, we'll refund you 100%. This only works if you actually study the generated cards consistently.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How is this different from just highlighting textbooks?</h3>
              <p className="text-gray-600">Highlighting is passive. Our spaced repetition forces active recall. The AI asks you questions in different ways to ensure you understand concepts, not just memorize words.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Absolutely. No contracts, no cancellation fees. Your study data stays on your device even after canceling. One-time purchases never expire.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What exams work best with ConceptUnlock?</h3>
              <p className="text-gray-600">Medical (MCAT, Step 1), nursing (NCLEX), law (LSAT, Bar), and any college exam with lots of memorization. Works especially well for science courses with complex concepts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blue-600 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to stop wasting time on flashcards?</h2>
          <p className="text-xl text-blue-100 mb-8">Join 2,847+ students who pass exams without the busywork</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors mb-4 min-h-12"
          >
            Get My AI Study Deck
          </button>
          <div className="text-sm text-blue-200">
            <a href="#" className="hover:text-white transition-colors">Or try the web version first</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-white">ConceptUnlock</span>
          </div>
          <p className="text-sm mb-4">© 2024 ConceptUnlock. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="text-xs text-gray-500 mt-4">Powered by Salisbury Bookkeeping</p>
        </div>
      </footer>

      {/* Fixed Bottom Install Bar */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 md:hidden z-50 safe-area-inset-bottom">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Install ConceptUnlock
          </button>
        </div>
      )}

      {/* Install/Opt-in Modal */}
      {showModal && (
        <dialog className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" open>
          <div className="bg-white rounded-xl max-w-sm w-full md:max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-semibold text-lg">Get ConceptUnlock</h3>
              <button
                onClick={() => {setShowModal(false); setSubmitMessage("")}}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex mb-6">
                <button
                  onClick={() => setActiveTab(1)}
                  className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${
                    activeTab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Install free
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${
                    activeTab === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Refer 2, get 20% off
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {activeTab === 1 ? (
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      {isSubmitting ? "Sending..." : "Send me the download link"}
                    </button>
                    <p className="text-xs text-gray-500 text-center">No card required. Unsubscribe anytime.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">Share with 2 friends and all three of you get 20% off — instantly.</p>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      name="friend_email_1"
                      placeholder="Friend 1 email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      name="friend_email_2"
                      placeholder="Friend 2 email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      {isSubmitting ? "Processing..." : "Unlock my 20% off code"}
                    </button>
                  </div>
                )}
              </form>

              {submitMessage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm text-green-700">
                  {submitMessage}
                </div>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}