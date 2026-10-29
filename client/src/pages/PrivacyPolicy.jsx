import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, Phone, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-pine-800 hover:text-pine-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-sand-700 bg-sand-950/80 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-800/10 border border-pine-800/20 text-pine-800 text-xs font-sans font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal Documentation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-950 tracking-tight">
          Privacy Policy
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-charcoal-700 font-medium">
          <span className="font-bold text-charcoal-950">JungleE Wildlife Expeditions</span>
          <span>•</span>
          <span>Effective Date: <strong>28 October 2026</strong></span>
        </div>

        <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed pt-2 border-t border-sand-700/70">
          At JungleE Wildlife Expeditions (“JungleE,” “we,” “our,” or “us”), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, <a href="https://jungleewildlife.co.in" target="_blank" rel="noopener noreferrer" className="text-pine-800 font-semibold underline underline-offset-2">https://jungleewildlife.co.in</a>, contact us, or book our wildlife expeditions and safari packages.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">

        {/* 1. Information We Collect */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              01
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Information We Collect
            </h2>
          </div>

          <p className="text-sm text-charcoal-800">
            We may collect the following information when you interact with us:
          </p>

          <ul className="space-y-3 text-sm text-charcoal-800">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-800 mt-2 shrink-0" />
              <span><strong>Personal Information:</strong> Name, phone number, email address, and other contact details.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-800 mt-2 shrink-0" />
              <span><strong>Booking Information:</strong> Travel dates, destination preferences, number of travellers, accommodation preferences, and information required to arrange safari permits and reservations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-800 mt-2 shrink-0" />
              <span><strong>Payment Information:</strong> Payment status, transaction references, and billing details. Payments processed through third-party payment providers may be subject to their respective privacy policies.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-800 mt-2 shrink-0" />
              <span><strong>Communication Records:</strong> Messages, inquiries, feedback, and other communications sent through our website, email, WhatsApp, or social media.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-800 mt-2 shrink-0" />
              <span><strong>Technical Information:</strong> IP address, browser type, device information, website usage data, and cookies, where applicable.</span>
            </li>
          </ul>

          <div className="p-3.5 rounded-xl bg-sand-900/80 border border-sand-700 text-xs text-charcoal-700 font-medium">
            We do not intentionally collect more personal information than is reasonably necessary to provide our services.
          </div>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              02
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              How We Use Your Information
            </h2>
          </div>

          <p className="text-sm text-charcoal-800">
            We use your information to:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-charcoal-800">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Respond to inquiries and provide quotations for safari packages.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Process bookings and coordinate wildlife safaris, accommodation, transportation, and other travel arrangements.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Arrange permits and reservations with relevant authorities, resorts, guides, and service providers.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Process or verify payments and maintain transaction records.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Communicate booking confirmations, itineraries, travel updates, and important notices.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Improve our website, customer experience, and services.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Send promotional offers, expedition announcements, and updates where permitted by applicable law.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-900/50 border border-sand-700/60">
              <CheckCircle2 className="w-4 h-4 text-pine-800 mt-0.5 shrink-0" />
              <span>Comply with applicable legal, tax, accounting, and regulatory requirements.</span>
            </li>
          </ul>
        </section>

        {/* 3. Sharing of Information */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              03
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Sharing of Information
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-pine-800/10 border border-pine-800/20 text-sm font-bold text-pine-900">
            We do not sell your personal information to third parties.
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            We may share relevant information with trusted third parties when necessary to deliver our services, including:
          </p>

          <ul className="space-y-2.5 text-sm text-charcoal-800 list-disc pl-5">
            <li>National parks, forest departments, and safari permit authorities.</li>
            <li>Hotels, resorts, transport operators, naturalists, guides, and local tour partners.</li>
            <li>Payment gateways, booking platforms, website hosting providers, and technical service providers.</li>
            <li>Legal, regulatory, or government authorities when disclosure is required by law.</li>
          </ul>

          <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
            We share only the information reasonably necessary for the relevant purpose. Third-party service providers may process your information under their own privacy policies and applicable terms.
          </p>
        </section>

        {/* 4. Cookies and Website Analytics */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              04
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Cookies and Website Analytics
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            Our website may use cookies and similar technologies to improve functionality, understand visitor behaviour, measure website performance, and support marketing activities.
          </p>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            You may be able to manage cookies through your browser settings or any cookie preference tool provided on our website. Disabling certain cookies may affect website functionality.
          </p>

          <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
            Where required by applicable law, we will obtain consent before using non-essential cookies or similar tracking technologies.
          </p>
        </section>

        {/* 5. Data Storage and Security */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              05
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Data Storage and Security
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            We take reasonable technical and organisational measures to protect personal information against unauthorised access, disclosure, alteration, loss, or misuse.
          </p>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            However, no online platform, electronic transmission, or storage system can be guaranteed to be completely secure. We cannot guarantee absolute security of information transmitted over the internet.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              06
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Data Retention
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            We retain personal information only for as long as reasonably necessary to fulfil the purposes described in this policy, provide our services, resolve disputes, maintain business records, and comply with applicable legal obligations.
          </p>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            When information is no longer required, we will take reasonable steps to delete it or anonymise it, subject to applicable retention requirements.
          </p>
        </section>

        {/* 7. Your Privacy Rights */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              07
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Your Privacy Rights
            </h2>
          </div>

          <p className="text-sm text-charcoal-800">
            Depending on applicable law, you may have the right to:
          </p>

          <ul className="space-y-2 text-sm text-charcoal-800 list-disc pl-5">
            <li>Request access to your personal information.</li>
            <li>Request correction or updating of inaccurate information.</li>
            <li>Request deletion of personal information, subject to legal and contractual obligations.</li>
            <li>Withdraw consent where processing is based on consent.</li>
            <li>Raise concerns or submit a grievance regarding how your information is handled.</li>
          </ul>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            To exercise these rights, contact us using the details provided below. We may need to verify your identity before processing a request.
          </p>
        </section>

        {/* 8. Third-Party Links and Services */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              08
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Third-Party Links and Services
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            Our website or communications may contain links to third-party websites, social media platforms, payment services, or booking providers. We are not responsible for the privacy practices, content, or security of external websites. We encourage you to review their respective privacy policies before sharing information.
          </p>
        </section>

        {/* 9. Children’s Privacy */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              09
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Children’s Privacy
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            Our website and booking services are not intended to encourage children to independently submit personal information. Where information about a minor is required for a family booking or travel arrangement, it should be provided by a parent or legal guardian, subject to applicable law.
          </p>
        </section>

        {/* 10. Changes to This Privacy Policy */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              10
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Changes to This Privacy Policy
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our services, technology, or legal obligations. The updated version will be published on this page with a revised effective date.
          </p>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            We encourage visitors to review this page periodically.
          </p>
        </section>

        {/* 11. Contact Us */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 bg-sand-950 space-y-5 shadow-lg">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              11
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Contact Us
            </h2>
          </div>

          <p className="text-sm text-charcoal-800 leading-relaxed">
            For questions, privacy requests, or complaints concerning this Privacy Policy, please contact:
          </p>

          <div className="p-5 rounded-2xl bg-sand-900 border border-sand-700 space-y-3">
            <h3 className="text-base font-bold text-charcoal-950">
              JungleE Wildlife Expeditions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-charcoal-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-pine-800 shrink-0" />
                <span>Website: <a href="https://jungleewildlife.co.in" target="_blank" rel="noopener noreferrer" className="font-sans text-pine-800 font-bold hover:underline">https://jungleewildlife.co.in</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pine-800 shrink-0" />
                <span>Email: <a href="mailto:safari@jungleewildlife.co.in" className="font-sans text-pine-800 font-bold hover:underline">safari@jungleewildlife.co.in</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pine-800 shrink-0" />
                <span>Contact: <strong>Vatsal Dangi</strong> — <a href="tel:+919664665873" className="font-sans text-pine-800 font-bold hover:underline">+91 96646 65873</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pine-800 shrink-0" />
                <span>Additional Contact: <strong>Harsh Barad</strong> — <a href="tel:+916354999899" className="font-sans text-pine-800 font-bold hover:underline">+91 63549 99899</a></span>
              </div>
            </div>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed italic">
            We will review privacy-related requests and respond in accordance with applicable law.
          </p>
        </section>

      </div>

      {/* Acknowledgment Footer Card */}
      <div className="glass-panel p-6 rounded-2xl border border-sand-700 bg-sand-900/60 text-center text-xs text-charcoal-700 leading-relaxed">
        By using our website or voluntarily providing your information for inquiries and bookings, you acknowledge that you have read this Privacy Policy. Where consent is legally required, we will obtain it separately.
      </div>

    </div>
  );
}
