import React from 'react';
import { FileText, Shield, ArrowLeft, CheckCircle2, AlertTriangle, Phone, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
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
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-950 tracking-tight">
          Terms & Conditions
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-charcoal-700 font-medium">
          <span className="font-bold text-charcoal-950">JungleE Wildlife Expeditions</span>
          <span>•</span>
          <span>Effective Date: <strong>28 October 2026</strong></span>
        </div>

        <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed pt-2 border-t border-sand-700/70">
          These Terms & Conditions (“Terms”) govern all bookings and services made through <strong>JungleE Wildlife Expeditions</strong> (“JungleE”, “we”, “us”, or “our”), including wildlife safari packages, accommodation/stays, transportation, safari permits, sightseeing, experiences, and other travel-related services offered through our website or directly through our team.
        </p>

        <div className="p-4 rounded-2xl bg-pine-800/10 border border-pine-800/20 text-xs sm:text-sm font-semibold text-pine-900">
          By making a booking, making a payment, or participating in any JungleE experience, you acknowledge that you have read, understood, and agreed to these Terms.
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm text-charcoal-800 leading-relaxed">

        {/* 1. BOOKING & PAYMENT */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              01
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Booking & Payment
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>1.1.</strong> All bookings are subject to availability and confirmation by JungleE and/or the relevant service provider.</li>
            <li><strong>1.2.</strong> A booking is considered confirmed only after the required payment has been received and JungleE has issued a booking confirmation.</li>
            <li><strong>1.3.</strong> Submitting a booking request, enquiry, payment attempt, or selecting a package on the website does not guarantee availability until the booking is confirmed.</li>
            <li><strong>1.4.</strong> Prices displayed on the website are subject to change before booking confirmation unless specifically stated otherwise.</li>
            <li><strong>1.5.</strong> Once a booking has been confirmed, the package price applicable at the time of confirmation shall generally be treated as final, except where additional charges arise due to government fees, permit charges, taxes, changes imposed by authorities, or other circumstances beyond JungleE's control.</li>
            <li><strong>1.6.</strong> Customers are responsible for providing accurate information including guest names, contact details, number of guests, dates of travel, identification details, and any other information required for permits, accommodation, transportation, or other services.</li>
            <li><strong>1.7.</strong> JungleE shall not be responsible for losses, cancellation, rejection of permits, or additional costs resulting from incorrect, incomplete, or inaccurate information provided by the customer.</li>
            <li>
              <strong>1.8. Camera Charges & Electronic Devices:</strong> Camera charges, photography fees, videography fees, or equipment charges, wherever applicable, are not included in the JungleE package price unless specifically mentioned in the package inclusions. Such charges are determined by the respective Forest Department, park authority, or safari operator and must be paid by the guest directly at the safari gate or designated payment counter, as applicable.<br />
              Guests carrying cameras, professional camera equipment, video cameras, or other photography equipment are responsible for checking and paying any applicable charges before entering the safari area.
            </li>
            <li>
              <strong>1.9.</strong> Certain wildlife reserves, safari zones, or protected areas may restrict or prohibit the carrying of mobile phones, electronic devices, or other equipment inside safari vehicles or protected areas. Where such restrictions apply, guests may be required to deposit the prohibited device at a designated facility outside the safari area.<br />
              JungleE shall not be responsible for any loss, theft, damage, or other issue relating to personal electronic devices or equipment deposited with a third party or designated facility. Guests are responsible for complying with the rules and instructions of the concerned Forest Department, park authority, safari operator, or security personnel.
            </li>
            <li><strong>1.10.</strong> Failure to comply with applicable equipment or electronic-device regulations may result in denial of entry or participation in the safari, without entitlement to a refund.</li>
          </ul>
        </section>

        {/* 2. SAFARI PACKAGE BOOKINGS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              02
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Safari Package Bookings
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>2.1.</strong> Safari packages offered by JungleE may include a combination of safari permits, accommodation, meals, transportation, guides/naturalists, sightseeing, and other services as specified in the respective package.</li>
            <li><strong>2.2.</strong> Safari packages are subject to availability of safari permits, safari zones, vehicles, accommodation, guides, naturalists, transportation, and other components included in the package.</li>
            <li><strong>2.3.</strong> A request for a particular safari date, zone, vehicle, guide, hotel, room category, or safari timing does not constitute a guarantee until the relevant arrangements have been successfully confirmed.</li>
            <li><strong>2.4.</strong> JungleE operates and arranges safari experiences in accordance with the rules, regulations, availability, and decisions of the respective Forest Department, National Park, Wildlife Sanctuary, Tiger Reserve, Lion Reserve, or other competent authority.</li>
            <li><strong>2.5.</strong> Once a safari package has been confirmed, it is subject to the cancellation and refund policy stated in these Terms.</li>
            <li><strong>2.6.</strong> Safari permits and related bookings may be subject to government rules and may not be transferable unless specifically permitted by the concerned authority.</li>
            <li><strong>2.7.</strong> The name and identification details provided at the time of booking may be required to match the documents presented at the time of the safari. Any discrepancy may result in denial of entry or participation.</li>
            <li><strong>2.8.</strong> JungleE shall not be responsible for denial of entry where the guest fails to carry valid identification, provides incorrect information, or does not comply with the requirements of the concerned park or Forest Department.</li>
          </ul>
        </section>

        {/* 3. SAFARI PACKAGE CANCELLATION & REFUND POLICY */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              03
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Safari Package Cancellation & Refund Policy
            </h2>
          </div>
          <p className="text-charcoal-700">
            Safari packages are arranged in advance and may involve non-refundable commitments towards permits, accommodation, transportation, guides, vehicles, and other services. Therefore, all confirmed safari package bookings are subject to the following cancellation policy:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-sand-900 border border-sand-700">
              <span className="font-bold text-charcoal-950 block text-xs uppercase font-sans">30+ Days Before Travel</span>
              <p className="text-pine-800 font-bold text-base pt-1">40% Refund</p>
              <p className="text-charcoal-600 text-xs pt-0.5">60% non-refundable</p>
            </div>
            <div className="p-4 rounded-2xl bg-sand-900 border border-sand-700">
              <span className="font-bold text-charcoal-950 block text-xs uppercase font-sans">15–29 Days Before Travel</span>
              <p className="text-pine-800 font-bold text-base pt-1">30% Refund</p>
              <p className="text-charcoal-600 text-xs pt-0.5">70% non-refundable</p>
            </div>
            <div className="p-4 rounded-2xl bg-sand-900 border border-sand-700">
              <span className="font-bold text-charcoal-950 block text-xs uppercase font-sans">Less Than 15 Days</span>
              <p className="text-rose-700 font-bold text-base pt-1">0% Refund</p>
              <p className="text-charcoal-600 text-xs pt-0.5">100% non-refundable</p>
            </div>
          </div>

          <ul className="space-y-2.5 list-disc pl-5 pt-2">
            <li><strong>3.4. No-Show:</strong> If a guest fails to appear for the scheduled safari package (“No-Show”), no refund will be provided.</li>
            <li><strong>3.5. Cancellation on or after the date of travel:</strong> Any cancellation made on or after the scheduled date of travel shall be treated as non-refundable and no refund will be provided.</li>
            <li><strong>3.6. Date changes:</strong> Any request to change the date of a confirmed safari package shall be subject to availability of permits, accommodation, vehicles, guides, price differences, and rules of the concerned authority. Date changes are not guaranteed.</li>
            <li>
              <strong>3.7. Refund calculation:</strong> The applicable refund percentage shall be calculated on the total safari package rate paid by the customer.<br />
              <em>Example:</em><br />
              • Package value of ₹50,000 cancelled 30+ days before travel → ₹20,000 refundable<br />
              • Package value of ₹50,000 cancelled 15–29 days before travel → ₹15,000 refundable<br />
              • Package value of ₹50,000 cancelled less than 15 days before travel → ₹0 refundable<br />
              Any applicable payment gateway charges, transaction charges, government charges, taxes, permit-related charges, or other non-refundable fees may be deducted where applicable.
            </li>
            <li><strong>3.8. Refund processing:</strong> Where a refund is applicable, JungleE will initiate the refund after verifying the cancellation and applicable refund amount. Refunds will normally be processed through the original payment method.</li>
          </ul>
        </section>

        {/* 4. SAFARI CANCELLATION BY AUTHORITIES / PARK CLOSURE */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              04
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Safari Cancellation by Authorities / Park Closure
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>4.1.</strong> Safari operations are controlled by the concerned Forest Department, park authority, government authority, weather conditions, safety conditions, wildlife management requirements, and other competent authorities.</li>
            <li><strong>4.2.</strong> A safari or part of a safari package may be cancelled, postponed, restricted, or modified due to heavy rainfall, adverse weather, flooding, forest fires, natural disasters, wildlife management, government orders, security situations, or park closure.</li>
            <li><strong>4.3.</strong> Where the concerned authority cancels a safari and provides a refund or alternative arrangement, JungleE will assist the guest in processing the applicable refund or alternative arrangement in accordance with the authority's rules.</li>
            <li><strong>4.4.</strong> JungleE cannot guarantee a refund where the Forest Department, park authority, hotel, transport operator, or other third-party service provider does not provide a refund.</li>
            <li><strong>4.5.</strong> JungleE's cancellation policy does not override the cancellation, refund, or rescheduling rules imposed by the relevant government or third-party authority.</li>
            <li><strong>4.6.</strong> If a particular component of a package is cancelled due to circumstances beyond JungleE's control, JungleE may, where reasonably possible, offer an alternative arrangement of comparable nature, subject to availability and applicable additional costs.</li>
          </ul>
        </section>

        {/* 5. WILDLIFE SIGHTINGS & SAFARI EXPERIENCE */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              05
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Wildlife Sightings & Safari Experience
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>5.1.</strong> JungleE does not guarantee sightings of any particular animal, including tiger, Asiatic lion, leopard, elephant, sloth bear, or any other wildlife species.</li>
            <li><strong>5.2.</strong> Wildlife is unpredictable and sightings depend on numerous factors including animal movement, weather, season, habitat conditions, safari zone, time of day, visitor movement, forest conditions, and chance.</li>
            <li><strong>5.3.</strong> The absence of a particular wildlife sighting shall not constitute grounds for cancellation, refund, compensation, replacement safari, or partial refund.</li>
            <li><strong>5.4.</strong> Photographic opportunities, specific animal sightings, or particular safari experiences shown on the JungleE website, social media, advertisements, or promotional material are illustrative and do not constitute a guarantee.</li>
            <li><strong>5.5.</strong> JungleE does not guarantee a particular wildlife encounter, route, zone, photographic opportunity, or animal sighting.</li>
          </ul>
        </section>

        {/* 6. ACCOMMODATION / HOTEL BOOKINGS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              06
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Accommodation / Hotel Bookings
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>6.1.</strong> Accommodation included in a safari package is subject to availability and confirmation by the respective hotel, resort, lodge, campsite, or accommodation provider.</li>
            <li><strong>6.2.</strong> Hotel check-in and check-out times shall be governed by the respective property's policies.</li>
            <li><strong>6.3.</strong> Early check-in, late check-out, room upgrades, specific room categories, adjoining rooms, specific views, and special requests are subject to availability and cannot be guaranteed unless expressly confirmed in writing.</li>
            <li><strong>6.4.</strong> Hotel images displayed on the JungleE website are for representation purposes. Actual room layout, décor, views, furniture, amenities, and room allocation may vary.</li>
            <li><strong>6.5.</strong> Hotels and accommodation providers may require a security deposit, identification documents, or additional payment at check-in.</li>
            <li><strong>6.6.</strong> Any damage to hotel property, loss of hotel property, unpaid bills, or additional charges incurred by the guest shall be the guest's responsibility.</li>
            <li><strong>6.7.</strong> Smoking, pets, outside food, visitors, and other activities are subject to the individual hotel's rules and applicable laws.</li>
          </ul>
        </section>

        {/* 7. ACCOMMODATION CANCELLATION POLICY */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              07
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Accommodation Cancellation Policy
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>7.1.</strong> Accommodation cancellation policies may differ depending on the hotel, resort, lodge, booking rate, season, and package selected.</li>
            <li><strong>7.2.</strong> Where accommodation is booked as part of a JungleE safari package, the package cancellation policy specified in Section 3 shall apply to the overall package, unless a separate written cancellation policy has been specifically communicated to the customer.</li>
            <li><strong>7.3.</strong> Certain hotels, resorts, lodges, promotional rates, discounted rates, advance-purchase rates, peak-season bookings, and festive-season bookings may have stricter cancellation conditions.</li>
            <li><strong>7.4.</strong> Where a separate accommodation booking is made independently from a safari package, the cancellation policy applicable to that particular accommodation booking shall apply.</li>
            <li><strong>7.5.</strong> Where a third-party accommodation provider imposes a non-refundable charge, JungleE may deduct such amount from any refund otherwise payable, where applicable.</li>
          </ul>
        </section>

        {/* 8. PACKAGE BOOKINGS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              08
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Package Bookings
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>8.1.</strong> A JungleE package may include multiple services such as safari permits, accommodation, meals, transportation, sightseeing, activities, and other travel services.</li>
            <li><strong>8.2.</strong> The package price represents the combined price for the package and does not necessarily represent the individual retail price of each component.</li>
            <li><strong>8.3.</strong> Cancellation of a package shall be governed by the applicable package cancellation policy.</li>
            <li><strong>8.4.</strong> If a customer cancels the entire safari package, the refund shall be calculated based on the total package rate, according to the cancellation timeline stated in Section 3.</li>
            <li><strong>8.5.</strong> The customer shall not be entitled to claim a separate refund for an individual component simply because that component was not used, unless JungleE expressly agrees otherwise in writing.</li>
            <li><strong>8.6.</strong> If a guest voluntarily chooses not to use any component included in the package, including safari, accommodation, meals, transportation, sightseeing, or activities, no refund shall automatically be due for the unused component.</li>
            <li><strong>8.7.</strong> If JungleE is required to substitute a hotel, vehicle, activity, safari zone, or other component due to availability or circumstances beyond its control, JungleE may provide a reasonable alternative of comparable nature.</li>
            <li><strong>8.8.</strong> Any increase in cost resulting from a customer-requested upgrade or modification shall be payable by the customer.</li>
          </ul>
        </section>

        {/* 9. TRANSPORTATION */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              09
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Transportation
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>9.1.</strong> Transportation services included in a package may be provided by third-party transport operators.</li>
            <li><strong>9.2.</strong> Vehicle type, model, seating capacity, and driver assignment may be subject to availability unless specifically guaranteed in writing.</li>
            <li><strong>9.3.</strong> Delays caused by traffic, road conditions, weather, vehicle breakdown, government restrictions, road closures, or other circumstances beyond JungleE's reasonable control shall not automatically qualify for a refund.</li>
            <li><strong>9.4.</strong> Guests are responsible for their personal belongings during transportation.</li>
            <li><strong>9.5.</strong> JungleE shall not be responsible for loss, theft, or damage to personal belongings unless caused by proven negligence attributable to JungleE.</li>
          </ul>
        </section>

        {/* 10. GUEST RESPONSIBILITIES */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              10
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Guest Responsibilities
            </h2>
          </div>
          <p>Guests are required to:</p>
          <ul className="space-y-1.5 list-disc pl-5">
            <li>Follow all instructions issued by JungleE representatives, guides, naturalists, drivers, hotel staff, and park authorities.</li>
            <li>Follow all wildlife and forest regulations.</li>
            <li>Maintain appropriate behaviour during safaris.</li>
            <li>Not disturb, feed, chase, approach, or intentionally attract wildlife.</li>
            <li>Not litter inside forests, parks, safari vehicles, hotels, or other protected areas.</li>
            <li>Not make excessive noise or engage in behaviour that may disturb wildlife.</li>
            <li>Follow photography and filming restrictions imposed by the authorities.</li>
            <li>Carry valid government-issued identification where required.</li>
            <li>Arrive at designated reporting points at the specified time.</li>
            <li>Comply with all applicable laws and regulations.</li>
          </ul>
          <p className="text-xs text-rose-700 pt-1 font-medium">
            Failure to comply may result in removal from the safari or activity, cancellation of services, denial of entry, or additional penalties without refund.
          </p>
        </section>

        {/* 11. DELAYS & MISSED SAFARIS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              11
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Delays & Missed Safaris
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>11.1.</strong> Guests are responsible for arriving at the designated safari reporting point before the required reporting time.</li>
            <li><strong>11.2.</strong> If a guest arrives late and misses the safari, the booking shall generally be treated as a No-Show and no refund shall be provided.</li>
            <li><strong>11.3.</strong> JungleE shall not be responsible for a guest missing a safari because of traffic, flight/train delays, personal reasons, oversleeping, incorrect reporting location, or failure to arrive on time.</li>
            <li><strong>11.4.</strong> Guests are strongly advised to allow sufficient travel time to reach the safari reporting point.</li>
          </ul>
        </section>

        {/* 12. HEALTH, SAFETY & MEDICAL CONDITIONS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              12
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Health, Safety & Medical Conditions
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>12.1.</strong> Wildlife safaris involve travel through natural environments and may involve uneven terrain, open safari vehicles, exposure to weather conditions, insects, dust, heat, cold, and unpredictable wildlife.</li>
            <li><strong>12.2.</strong> Guests participate in safari and related activities at their own responsibility.</li>
            <li><strong>12.3.</strong> Guests are responsible for carrying required medication and informing JungleE or the relevant trip coordinator of any requirements that may reasonably affect the organisation of the trip.</li>
            <li><strong>12.4.</strong> JungleE reserves the right to modify or discontinue an activity if it reasonably believes that continuing the activity would pose a serious safety risk.</li>
          </ul>
        </section>

        {/* 13. FORCE MAJEURE */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              13
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Force Majeure
            </h2>
          </div>
          <p>
            JungleE shall not be liable for failure, delay, modification, or cancellation of any service resulting from circumstances beyond its reasonable control, including but not limited to natural disasters, extreme weather, floods, forest fires, government restrictions, government/Forest Department orders, pandemics, civil unrest, strikes, road closures, security threats, wildlife-related safety restrictions, park closures, transport disruptions, technical failures, or Acts of God.
          </p>
          <p className="text-xs text-charcoal-600">
            In such circumstances, JungleE will make reasonable efforts to assist guests with available alternatives, subject to availability and the policies of the relevant service providers.
          </p>
        </section>

        {/* 14. PHOTOGRAPHY, VIDEO & CONTENT */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              14
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Photography, Video & Content
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>14.1.</strong> JungleE may photograph or record its expeditions, safaris, events, or activities for documentation and promotional purposes.</li>
            <li><strong>14.2.</strong> By participating in a JungleE expedition or safari, guests acknowledge that they may appear incidentally in photographs or videos captured during the experience.</li>
            <li><strong>14.3.</strong> JungleE may use such material for legitimate promotional, marketing, social media, website, or business purposes, subject to applicable law.</li>
            <li><strong>14.4.</strong> Guests may contact JungleE if they have a specific concern regarding the use of identifiable images.</li>
          </ul>
        </section>

        {/* 15. WEBSITE INFORMATION */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              15
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Website Information
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>15.1.</strong> JungleE makes reasonable efforts to ensure that information published on its website is accurate and current.</li>
            <li><strong>15.2.</strong> However, prices, availability, hotel facilities, safari availability, government regulations, routes, timings, permit rules, and other travel information may change without prior notice.</li>
            <li><strong>15.3.</strong> In case of any discrepancy between information displayed on the website and the final booking confirmation, the confirmed booking documentation shall prevail.</li>
          </ul>
        </section>

        {/* 16. THIRD-PARTY SERVICE PROVIDERS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              16
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Third-Party Service Providers
            </h2>
          </div>
          <p>
            JungleE may work with third-party service providers including hotels, resorts, safari operators, transport providers, guides, naturalists, government booking systems, Forest Departments, activity providers, and other vendors.
          </p>
          <p>
            Services provided by third parties are subject to their respective terms, policies, availability, and operating conditions.
          </p>
          <p className="text-xs text-charcoal-600">
            JungleE shall not be responsible for circumstances caused solely by the acts, omissions, negligence, operational failures, cancellations, or policy decisions of independent third-party service providers, except to the extent required under applicable law.
          </p>
        </section>

        {/* 17. AMENDMENTS TO BOOKINGS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-3">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              17
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Amendments to Bookings
            </h2>
          </div>
          <p>
            Any request to modify dates, number of guests, accommodation, safari arrangements, transportation, activities, or other booking components shall be subject to availability and applicable charges. JungleE does not guarantee that amendments will be possible after confirmation. Any increase in cost resulting from a modification shall be payable by the customer. A request to modify a booking does not automatically cancel the original booking or extend the applicable cancellation period.
          </p>
        </section>

        {/* 18. REFUND PROCESSING */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              18
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Refund Processing
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>18.1.</strong> Where a refund is applicable under these Terms, JungleE will initiate the refund after verifying the cancellation and applicable refund amount.</li>
            <li><strong>18.2.</strong> Refunds will normally be processed through the original payment method.</li>
            <li><strong>18.3.</strong> Bank/payment gateway processing times may vary and are outside JungleE's direct control.</li>
            <li><strong>18.4.</strong> Any applicable non-refundable payment gateway charges, transaction fees, government charges, taxes, permit charges, or third-party charges may be deducted from the refundable amount where applicable.</li>
            <li><strong>18.5.</strong> Refund eligibility shall be determined based on the date and time on which the cancellation request is received by JungleE through its designated booking/contact channel.</li>
          </ul>
        </section>

        {/* 19. DISPUTES & GOVERNING LAW */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 space-y-4">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              19
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Disputes & Governing Law
            </h2>
          </div>
          <ul className="space-y-2.5 list-disc pl-5">
            <li><strong>19.1.</strong> These Terms shall be governed by and interpreted in accordance with the laws of India.</li>
            <li><strong>19.2.</strong> Any dispute arising in connection with a booking or service shall first be attempted to be resolved amicably between the customer and JungleE.</li>
            <li><strong>19.3.</strong> If the dispute cannot be resolved amicably, it shall be subject to the jurisdiction of the appropriate courts having jurisdiction over the registered/principal place of business of JungleE, subject to applicable law.</li>
          </ul>
        </section>

        {/* 20. ACCEPTANCE OF TERMS */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 bg-sand-950 space-y-4 shadow-lg">
          <div className="flex items-center gap-3 border-b border-sand-700/80 pb-3">
            <span className="w-8 h-8 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-sans font-bold text-xs shrink-0 shadow-sm">
              20
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-950">
              Acceptance of Terms
            </h2>
          </div>
          <p>
            By completing a booking, making a payment, or participating in a JungleE Wildlife Expeditions experience, the customer confirms that:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>They have read and understood these Terms & Conditions.</li>
            <li>They agree to the applicable cancellation and refund policies.</li>
            <li>They understand that confirmed safari packages are subject to a specific cancellation and refund policy based on the date of cancellation.</li>
            <li>They understand that wildlife sightings cannot be guaranteed.</li>
            <li>They understand that safari availability, permits, zones, accommodation, and other services are subject to availability and applicable government/Forest Department regulations.</li>
            <li>They agree to comply with the instructions of JungleE and the relevant authorities.</li>
            <li>They accept responsibility for providing accurate booking information and valid identification.</li>
            <li>They understand that third-party services may have separate terms and operating conditions.</li>
          </ul>
          <p className="text-xs text-charcoal-600 pt-2 italic border-t border-sand-700/60">
            JungleE Wildlife Expeditions reserves the right to update these Terms & Conditions from time to time. The Terms applicable to a booking shall generally be those accepted by the customer at the time of booking, unless otherwise required by applicable law or by a competent authority.
          </p>
        </section>

      </div>

      {/* Support & Contact Basecamp */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 bg-sand-900/60 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-charcoal-950">
          Need clarification on any policy or terms?
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-700 max-w-xl mx-auto">
          Contact our team anytime at <a href="mailto:safari@jungleewildlife.co.in" className="text-pine-800 font-bold hover:underline">safari@jungleewildlife.co.in</a> or visit our <Link to="/contact" className="text-pine-800 font-bold hover:underline">Contact Basecamp</Link>.
        </p>
      </div>

    </div>
  );
}
