/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Phone,
  CheckCircle,
  BadgeCheck,
  Star,
  ShieldCheck,
  CircleHelp,
  Banknote,
  CalendarCheck,
  AlertTriangle,
  FileText,
  UserMinus,
  HeartOff,
  Wrench,
  Rocket,
  ChevronDown,
  MapPin,
  Mail,
  Globe,
  ThumbsUp,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabase/client';
import { client as sanityClient } from './lib/sanity/client';

// Default content fallback
const DEFAULT_CONTENT = {
  title: "Sell Your Jacksonville or Pensacola House Fast For Cash",
  heroDescription: "We buy houses in any condition with no commissions. Work with a local Florida team you can trust. No repairs, no cleaning, no hassle.",
  heroCheckpoints: [
    'Any condition - We buy as-is',
    'Zero commissions or closing costs',
    'Local Florida investment experts'
  ],
  howItWorksTitle: "How To Sell Your Florida House Fast",
  howItWorksDesc: "Our process is simple, transparent, and designed to get you the most cash in the shortest time.",
  howItWorksSteps: [
    { icon: CircleHelp, title: '1. Tell Us About It', desc: "Submit your property info online or call us. We'll research the property and nearby comps immediately." },
    { icon: Banknote, title: '2. Get Your Offer', desc: "We'll provide a fair, no-obligation cash offer within 24 hours. No pressure, no hidden fees." },
    { icon: CalendarCheck, title: '3. Choose Closing Date', desc: "If you accept, we close at a local title company as fast as 7 days or on your timeline." }
  ],
  faqs: [
    {
      question: "How quickly can you close?",
      answer: "We can close in as little as 7 days, or we can work around your specific schedule. We move as fast or as slow as you need."
    },
    {
      question: "Will you list my house on the MLS?",
      answer: "No, we are not real estate agents. We are direct buyers. We buy your house with our own cash and we do not list it on the MLS."
    },
    {
      question: "Are there really no hidden fees?",
      answer: "Correct! No commissions, no transaction fees, and we even pay for all the closing costs. The offer we give is the amount you walk away with."
    },
    {
      question: "What if my house needs major repairs?",
      answer: "We buy houses in \"as-is\" condition. You don't need to fix the roof, paint, or even sweep the floor. We take care of everything after the purchase."
    },
    {
      question: "Is there an obligation when I submit my info?",
      answer: "Absolutely zero obligation. We'll give you an offer, and it's 100% up to you whether you want to move forward."
    }
  ],
  contact: {
    phone: "(904) 555-0123",
    email: "offers@genesishomebuyers.com",
    address: "123 Downtown Ave, Suite 400, Jacksonville, FL 32202"
  }
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Lead Form State
  const [formData, setFormData] = useState({
    full_name: '',
    property_address: '',
    phone_number: '',
    timeline: 'ASAP'
  });

  // Fetch dynamic content from Sanity
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const query = `*[_type == "landingPage"][0]`;
        const data = await sanityClient.fetch(query);
        if (data) {
          setContent({
            ...DEFAULT_CONTENT,
            title: data.title || DEFAULT_CONTENT.title,
            heroDescription: data.heroDescription || DEFAULT_CONTENT.heroDescription,
            heroCheckpoints: data.heroCheckpoints || DEFAULT_CONTENT.heroCheckpoints,
            faqs: data.faqs || DEFAULT_CONTENT.faqs,
            contact: data.contactInfo || DEFAULT_CONTENT.contact
          });
        }
      } catch (error) {
        console.error("Sanity fetch error:", error);
      }
    };
    fetchContent();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([formData]);

      if (error) throw error;
      setSubmitStatus('success');
      setFormData({ full_name: '', property_address: '', phone_number: '', timeline: 'ASAP' });
    } catch (error) {
      console.error("Supabase submission error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="text-primary">
                <Home className="w-9 h-9" />
              </div>
              <h1 className="text-primary text-xl font-extrabold tracking-tight">
                Genesis <span className="text-slate-500 font-light">Home Buyers</span>
              </h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['How It Works', 'About', 'Reviews', 'FAQ', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href={`tel:${content.contact.phone.replace(/\D/g, '')}`} className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md">
                <Phone className="w-4 h-4" />
                <span>{content.contact.phone}</span>
              </a>
              <button
                className="md:hidden text-slate-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100"
            >
              <div className="px-4 py-6 space-y-4">
                {['How It Works', 'About', 'Reviews', 'FAQ', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-base font-semibold text-slate-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                {content.title}
              </h2>
              <p className="text-xl text-slate-200 mb-8 max-w-xl">
                {content.heroDescription}
              </p>
              <div className="space-y-4 mb-10">
                {content.heroCheckpoints.map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-accent-green bg-white/10 p-1 rounded-full" />
                    <span className="text-lg font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lead Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-2xl p-6 md:p-8"
            >
              <h3 className="text-2xl font-bold text-primary mb-2">Get Your Free Cash Offer</h3>
              <p className="text-slate-500 mb-6 text-sm">Fill out the form below and we'll contact you within 24 hours.</p>

              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Request Received!</h4>
                  <p className="text-slate-500">We will call you shortly to discuss your offer.</p>
                  <button onClick={() => setSubmitStatus('idle')} className="mt-6 text-primary font-bold underline">Send another request</button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-primary outline-none"
                      placeholder="John Doe"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Property Address</label>
                    <input
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-primary outline-none"
                      placeholder="123 Florida St, Jacksonville"
                      type="text"
                      value={formData.property_address}
                      onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-primary outline-none"
                        placeholder="(904) 555-0123"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Timeline</label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-primary outline-none text-slate-600"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      >
                        <option>ASAP</option>
                        <option>Within 30 days</option>
                        <option>1-3 months</option>
                        <option>Just curious</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    By clicking below, you agree to receive SMS/calls from Genesis Home Buyers. Standard rates may apply. Your information is safe with us.
                  </p>
                  <button
                    disabled={isSubmitting}
                    className="w-full bg-accent-green hover:bg-green-600 disabled:bg-slate-300 text-white font-black text-lg py-4 rounded-lg shadow-lg shadow-green-200 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    type="submit"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "GET MY CASH OFFER"}
                  </button>
                  {submitStatus === 'error' && <p className="text-red-500 text-xs text-center mt-2">Error submitting form. Please call us directly.</p>}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Trusted by Florida homeowners:</span>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-8 h-8 text-primary" />
            <span className="font-bold text-slate-700">A+ BBB Rated</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 text-primary fill-primary" />
            <span className="font-bold text-slate-700">4.9/5 Google Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-bold text-slate-700">Licensed & Insured</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">{content.howItWorksTitle}</h2>
          <p className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg">{content.howItWorksDesc}</p>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-slate-200"></div>
            {content.howItWorksSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10"
              >
                <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 text-primary border-4 border-primary/5">
                  {/* In a real app we'd map string names to components, keeping it simple here */}
                  <Banknote className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <button className="mt-16 bg-primary text-white px-10 py-4 rounded-lg font-black text-lg hover:bg-primary/90 transition-all shadow-xl">
            START THE PROCESS NOW
          </button>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-12">Why Sell To Genesis Home Buyers?</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-6 text-slate-400 font-bold text-sm uppercase">Benefits</th>
                  <th className="p-6 bg-primary text-white text-center font-bold">Genesis Home Buyers</th>
                  <th className="p-6 text-slate-700 text-center font-bold">Traditional Listing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Commission / Fees', 'NONE', '6% + Transaction Fees'],
                  ['Who Pays Closing Costs?', 'WE PAY EVERYTHING', 'Typically Seller Pays'],
                  ['Inspections & Repairs', 'NONE (Buy As-Is)', 'Endless Checklists'],
                  ['Showings & Open Houses', 'ZERO', 'Dozen of Disruptions'],
                  ['Time To Close', '7-14 DAYS', '60-90+ Days']
                ].map(([benefit, genesis, traditional], i) => (
                  <tr key={i}>
                    <td className="p-6 font-semibold text-slate-700">{benefit}</td>
                    <td className="p-6 text-center text-accent-green font-bold bg-primary/5">{genesis}</td>
                    <td className="p-6 text-center text-slate-500">{traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Situations Grid */}
      <section className="py-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">Common Situations We Help With</h2>
            <p className="text-slate-600">No matter why you're selling, we're here to provide a stress-free solution.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: AlertTriangle, title: 'Avoid Foreclosure', desc: 'Stop the bank in their tracks and save your credit with a fast cash sale.' },
              { icon: FileText, title: 'Inherited Property', desc: 'Liquidate inherited estate assets quickly without dealing with probate headaches.' },
              { icon: UserMinus, title: 'Tired Landlord', desc: 'Tired of bad tenants? We buy rental properties with or without occupants.' },
              { icon: HeartOff, title: 'Divorce', desc: 'Divide assets quickly and move on to your next chapter without a long sale process.' },
              { icon: Wrench, title: 'Extensive Damage', desc: 'Fire damage, mold, or roof issues? We love projects and buy 100% as-is.' },
              { icon: Rocket, title: 'Relocating Fast', desc: 'Got a new job or need to move quickly? Get cash in hand in just days.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md border border-slate-100 hover:border-primary transition-colors group"
              >
                <item.icon className="w-10 h-10 text-primary mb-4 block group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-16">What Our Florida Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah H.', loc: 'Pensacola, FL', initial: 'SH', text: '"Genesis made selling my dad\'s old house in Pensacola so easy. We didn\'t have to clean a single thing. Fair offer and closed in 10 days!"' },
              { name: 'Michael R.', loc: 'Jacksonville, FL', initial: 'MR', text: '"I was facing foreclosure in Jacksonville. Genesis stepped in, bought the house for cash, and helped me save my credit. Lifesavers."' },
              { name: 'David T.', loc: 'St. Augustine, FL', initial: 'DT', text: '"The team was professional from start to finish. I\'ve sold through agents before, but this was 10x faster and zero stress. Highly recommend!"' }
            ].map((review, i) => (
              <div key={i} className="bg-background-light p-8 rounded-2xl relative">
                <div className="flex text-accent-green mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-accent-green" />)}
                </div>
                <p className="italic text-slate-700 mb-6 text-lg">{review.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{review.initial}</div>
                  <div>
                    <p className="font-bold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-background-light">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <button
                  className="w-full p-6 text-left font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Home className="w-[300px] h-[300px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready For Your Free Cash Offer?</h2>
          <p className="text-xl text-slate-300 mb-10">Don't spend another dime on repairs or months waiting for a buyer. Get your offer today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent-green hover:bg-green-600 text-white px-10 py-5 rounded-lg font-black text-xl shadow-2xl transition-all transform hover:-translate-y-1">
              GET MY CASH OFFER
            </button>
            <a href={`tel:${content.contact.phone.replace(/\D/g, '')}`} className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-lg font-black text-xl border border-white/30 backdrop-blur-sm transition-all text-center">
              CALL {content.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white mb-6">
                <Home className="w-8 h-8" />
                <h2 className="text-xl font-extrabold tracking-tight">Genesis Home Buyers</h2>
              </div>
              <p className="max-w-md mb-6 leading-relaxed">
                We are a local real estate investment company focused on helping Florida homeowners sell their properties without the traditional hassle. We pride ourselves on transparency, speed, and fairness.
              </p>
              <div className="flex gap-4">
                <a className="hover:text-white transition-colors" href="#"><Globe className="w-5 h-5" /></a>
                <a className="hover:text-white transition-colors" href="#"><ThumbsUp className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                {['How It Works', 'Testimonials', 'About Our Team', 'Florida Service Areas', 'FAQ'].map((link) => (
                  <li key={link}><a className="hover:text-white transition-colors" href="#">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{content.contact.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>{content.contact.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>{content.contact.email}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 Genesis Home Buyers. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="#">Sitemap</a>
            </div>
          </div>
          <p className="mt-8 text-[10px] text-center max-w-4xl mx-auto leading-relaxed opacity-50">
            Disclaimer: Genesis Home Buyers is a real estate investment company. We are not real estate agents and do not represent you in the sale of your home. Any offer made is subject to a physical inspection of the property and clear title. We encourage all sellers to consult with their own legal or financial advisors.
          </p>
        </div>
      </footer>
    </div>
  );
}
