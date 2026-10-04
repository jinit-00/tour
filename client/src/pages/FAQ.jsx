import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqCategories = [
    {
      category: 'GENERAL',
      questions: [
        {
          id: 1,
          q: 'What is JungleE Wildlife Expeditions?',
          a: `JungleE Wildlife Expeditions is a wildlife travel company specialising in curated wildlife safaris, stays, and nature-focused travel experiences across India's national parks, wildlife sanctuaries, tiger reserves, lion habitats, and other wildlife destinations.

Our packages are designed to combine safari experiences, accommodation, transportation, and other relevant services into a convenient travel experience.`,
        },
        {
          id: 2,
          q: 'What does a JungleE safari package include?',
          a: `The inclusions depend on the specific package selected.

A package may include:
• Accommodation
• Jungle/Park safaris
• Safari permits
• Safari vehicle
• Guide/naturalist
• Meals
• Transfers (optional)
• Other activities mentioned in the package

The exact inclusions and exclusions are displayed on the respective package page or shared in your booking confirmation.

Always check the package inclusions before making a payment.`,
        },
        {
          id: 3,
          q: 'Are all packages private or can I join a group?',
          a: `This depends on the package.

Some JungleE experiences may be organised as private/customised trips, while others may operate as group departures where guests travel together.

The booking page or our team will clearly communicate whether the package is private, shared, or group-based.`,
        },
        {
          id: 4,
          q: 'Can I customise a JungleE package?',
          a: `Yes. Depending on the destination and availability, we can customise aspects such as:
• Number of nights
• Number of safaris
• Hotel category
• Room type
• Number of guests
• Transportation
• Pickup and drop-off locations
• Additional sightseeing
• Additional safari drives
• Trip duration

Customised packages are subject to availability and may have different pricing and cancellation conditions.`,
        },
      ],
    },
    {
      category: 'SAFARI & PERMITS',
      questions: [
        {
          id: 5,
          q: 'Are safaris guaranteed after I book a package?',
          a: `A safari is confirmed only after the relevant permit/booking has been successfully confirmed.

However, safari availability is controlled by the respective Forest Department or park authority. Therefore, safari permits, zones, vehicles, and timings are always subject to availability and applicable government rules.

JungleE will make reasonable efforts to secure the safari arrangements specified in your confirmed package.`,
        },
        {
          id: 6,
          q: 'Can I choose my safari zone?',
          a: `Where the park's booking system allows zone selection or zone preferences, we will try to accommodate your preference.

However, a specific zone cannot always be guaranteed because allocation depends on the rules and availability of the respective park or Forest Department.`,
        },
        {
          id: 7,
          q: 'Can I choose a particular safari timing?',
          a: `We will try to accommodate your preferred morning or afternoon safari timing where possible.

However, safari timings are determined by the respective park authority and availability. A requested timing is not considered confirmed until it appears in your final booking confirmation.`,
        },
        {
          id: 8,
          q: 'Can I choose my safari vehicle?',
          a: `This depends on the destination and type of safari.

Where a specific vehicle type is included or available, it will be mentioned in the package details.

Vehicle allocation may be controlled by the park authority, booking system, or local operator and therefore a particular vehicle cannot always be guaranteed unless specifically confirmed.`,
        },
        {
          id: 9,
          q: 'Can I request a particular guide or naturalist?',
          a: `You may request a particular guide or naturalist, and we can try to accommodate the request where operationally possible.

However, guide and naturalist allocation is generally subject to availability and local authority/operator arrangements. A specific guide cannot be guaranteed unless expressly confirmed.`,
        },
        {
          id: 10,
          q: 'Will I definitely see a tiger or lion?',
          a: `No.

Wildlife sightings can never be guaranteed.

Wild animals move freely in their natural habitat, and sightings depend on animal movement, weather, season, habitat conditions, safari zone, time of day, other vehicles, and simple chance.

JungleE can help maximise your chances through appropriate planning and local knowledge, but we cannot promise a particular animal sighting.`,
        },
        {
          id: 11,
          q: "What happens if I don't see a tiger/lion?",
          a: `Nothing is wrong with your safari.

Wildlife sightings are inherently unpredictable. Not seeing a particular species does not qualify for a refund, replacement safari, compensation, or partial refund.

The value of a wildlife safari lies in experiencing the ecosystem and observing wildlife in its natural habitat—not in guaranteeing a particular sighting.`,
        },
        {
          id: 12,
          q: 'Do you guarantee a tiger sighting because you have seen one there before?',
          a: `No.

Previous sightings, historical sighting records, local knowledge, or high sighting probability do not constitute a guarantee.

We may use our experience to recommend suitable destinations, seasons, zones, and safari schedules, but wildlife remains unpredictable.`,
        },
        {
          id: 13,
          q: 'Is one safari enough?',
          a: `It depends on your objective.

If your primary goal is to maximise the opportunity to see a particular species, we generally recommend multiple safari drives because each drive provides a new opportunity.

The number of safaris recommended will depend on the destination, season, duration of your trip, and your budget.`,
        },
        {
          id: 14,
          q: 'What is the best time for a wildlife safari?',
          a: `The best time depends on the destination and species you want to see.

Different parks have different seasons, weather patterns, animal behaviour, vegetation conditions, and park closures.

Our team can recommend the most suitable period based on your preferred destination and wildlife objective.`,
        },
        {
          id: 15,
          q: 'Are parks open throughout the year?',
          a: `No.

Many national parks and wildlife reserves have seasonal closures or restricted operating periods, often due to monsoon conditions, breeding seasons, forest management, or government regulations.

Opening dates and safari availability may change from year to year.

Always confirm availability for your intended travel dates before making arrangements.`,
        },
      ],
    },
    {
      category: 'BOOKING & PAYMENT',
      questions: [
        {
          id: 16,
          q: 'How do I book a JungleE package?',
          a: `You can select a package through our website and follow the booking process.

Depending on the package, you may be asked to provide:
• Travel dates
• Number of guests
• Guest names
• Contact information
• Identification details
• Other information required for safari permits or accommodation

Your booking becomes confirmed only after the required payment has been received and JungleE confirms the booking.`,
        },
        {
          id: 17,
          q: 'Is my booking confirmed immediately after I make payment?',
          a: `Not necessarily.

Payment and availability are two separate stages.

A booking is considered confirmed only after JungleE verifies the payment and confirms the required services, including safari permits and/or accommodation where applicable.`,
        },
        {
          id: 18,
          q: 'Why does safari availability sometimes take time to confirm?',
          a: `Safari permits are often controlled by government or Forest Department booking systems and may have limited availability.

Depending on the destination, permit availability may also depend on:
• Opening dates of the booking window
• Safari zone
• Safari timing
• Vehicle availability
• Guest details
• Government allocation rules
• Seasonal restrictions

We will confirm your safari as soon as the relevant arrangements are successfully secured.`,
        },
        {
          id: 19,
          q: 'Can I book a safari package for any date?',
          a: `You can submit a request for your preferred date, but the package is subject to availability.

Before making non-refundable travel arrangements such as flights or trains, we recommend confirming your JungleE package and safari arrangements.`,
        },
        {
          id: 20,
          q: 'Can I book for a large group?',
          a: `Yes.

We can arrange packages for families, corporate groups, photography groups, friends, and other larger groups, subject to availability.

Large groups may require multiple safari vehicles and/or multiple accommodation arrangements.

Contact us for a customised group itinerary.`,
        },
        {
          id: 21,
          q: 'Can I book for just one person?',
          a: `Yes, where the selected package and safari permit system allow it.

Pricing for a solo traveller may differ from the per-person price shown for larger groups.`,
        },
        {
          id: 22,
          q: 'What payment methods do you accept?',
          a: `Available payment methods will be displayed during the booking process or communicated by our team.

Payment gateway charges, bank charges, or transaction fees, where applicable, may be non-refundable.`,
        },
      ],
    },
    {
      category: 'CANCELLATION & REFUNDS',
      questions: [
        {
          id: 23,
          q: 'Can I cancel my safari package?',
          a: `Yes, but cancellation is subject to JungleE's cancellation policy.

Because safari packages involve advance commitments to permits, accommodation, vehicles, guides, and other services, refunds are limited.`,
        },
        {
          id: 24,
          q: 'What is the cancellation policy for safari packages?',
          a: `The cancellation policy is:

30 days or more before travel:
40% of the total package rate is refundable.

15–29 days before travel:
30% of the total package rate is refundable.

Less than 15 days before travel:
No refund.

No-show:
No refund.

The applicable refund is calculated on the total safari package rate, subject to the terms and exclusions stated in our Terms & Conditions.`,
        },
        {
          id: 25,
          q: 'What if I cancel because of a personal emergency?',
          a: `The standard cancellation policy still applies.

While we understand that emergencies can occur, JungleE may already have incurred non-recoverable costs for your package.

You may contact us in exceptional circumstances, and we will check whether any alternative arrangement is possible. However, an exception or refund is not guaranteed.

Travel insurance is recommended for guests who wish to protect themselves against unforeseen circumstances.`,
        },
        {
          id: 26,
          q: 'Can I change my travel dates instead of cancelling?',
          a: `You can request a date change, but it is subject to availability and the rules of the respective safari authority, hotel, and other service providers.

A date change is not guaranteed.

Any increase in package cost, permit cost, accommodation cost, or other applicable charges may be payable by the customer.`,
        },
        {
          id: 27,
          q: "What happens if I don't show up for my safari?",
          a: `A no-show is treated as a cancellation on the date of travel.

No refund will be provided.

This includes situations where a guest misses the safari because of personal reasons, late arrival, traffic, transport delays, incorrect reporting location, or failure to arrive at the designated reporting point on time.`,
        },
        {
          id: 28,
          q: 'How long does a refund take?',
          a: `Where a refund is applicable, JungleE will initiate it after confirming the cancellation and calculating the applicable refund amount.

The time taken for the money to appear in your account depends on the payment gateway and banking institution.`,
        },
      ],
    },
    {
      category: 'HOTELS & STAYS',
      questions: [
        {
          id: 29,
          q: 'Can I choose my hotel?',
          a: `Depending on the package, you may be able to select your preferred hotel category or property.

If a particular hotel is specifically included in your package, it will be mentioned in the package details.

Hotel requests remain subject to availability.`,
        },
        {
          id: 30,
          q: 'Can I upgrade my hotel?',
          a: `Yes, subject to availability.

Any additional cost for a hotel or room upgrade will be payable by the customer.`,
        },
        {
          id: 31,
          q: 'Can I request a specific room?',
          a: `You can submit a room preference, such as:
• Double bed
• Twin beds
• Ground floor
• Connecting rooms
• Specific view
• Extra bed

However, room allocation is ultimately subject to hotel availability and hotel policy.`,
        },
        {
          id: 32,
          q: 'What if my hotel room is different from the photos on the website?',
          a: `Hotel photographs are generally representative.

Room layouts, furniture, décor, views, and room allocation can vary between rooms of the same category.

The final room allocation is controlled by the accommodation provider.`,
        },
        {
          id: 33,
          q: 'Are meals included?',
          a: `Meals depend on the package.

The specific meal plan—such as breakfast, breakfast and dinner, or all meals—will be mentioned in the package inclusions.

Additional food, beverages, room service, minibar charges, or other personal expenses are generally not included unless specifically stated.`,
        },
      ],
    },
    {
      category: 'CHILDREN & FAMILIES',
      questions: [
        {
          id: 34,
          q: 'Are children allowed on safaris?',
          a: `Generally, children may participate in safaris subject to the rules of the respective park, Forest Department, and safari booking system.

Age restrictions and ticket/permit rules may vary between destinations.

Please provide the correct age of every child while making the booking so we can advise you correctly.`,
        },
        {
          id: 35,
          q: 'Do children have different safari charges?',
          a: `This depends on the destination and the applicable government/safari booking rules.

Some parks have different pricing or rules based on age, while others may have standard permit or vehicle charges.

The applicable charges will be communicated during booking.`,
        },
        {
          id: 36,
          q: 'Is a safari suitable for elderly guests?',
          a: `Wildlife safaris can be enjoyed by elderly guests, but the experience may involve long drives, uneven roads, dust, heat, cold, and open vehicles.

Guests should consider their physical comfort and medical requirements before booking.

If you have specific mobility requirements, inform us before booking so we can determine what arrangements may be possible.`,
        },
      ],
    },
    {
      category: 'DURING THE SAFARI',
      questions: [
        {
          id: 37,
          q: 'What should I carry for a safari?',
          a: `We generally recommend carrying:
• Government-issued ID
• Booking confirmation
• Comfortable clothing
• Neutral/natural-coloured clothing
• Sunglasses
• Hat/cap
• Sunscreen
• Water bottle
• Personal medication
• Camera/binoculars
• Dust protection where required
• Light jacket during colder months

Your exact packing requirements may vary depending on the destination and season.`,
        },
        {
          id: 38,
          q: 'What should I wear on safari?',
          a: `Comfortable, weather-appropriate clothing is recommended.

Neutral or earthy colours are generally preferable for wildlife photography and observation.

Avoid clothing that is excessively bright or uncomfortable for long periods outdoors.`,
        },
        {
          id: 39,
          q: 'Can I use a drone during a safari?',
          a: `Drone usage is subject to the rules of the respective park, Forest Department, government authorities, and applicable aviation regulations.

Do not fly a drone inside a protected wildlife area unless you have the required permission.

Guests are responsible for complying with all applicable drone regulations.`,
        },
        {
          id: 40,
          q: 'Can I use a professional camera?',
          a: `Yes, generally.

However, certain parks may have specific rules regarding professional photography, camera equipment, tripods, filming, or commercial photography.

Any applicable permissions or charges must be obtained as required by the concerned authority.`,
        },
        {
          id: 41,
          q: 'Can I use a flash during a safari?',
          a: `Flash photography may disturb wildlife and may be prohibited or discouraged in certain circumstances.

Guests should follow the instructions of their guide, naturalist, driver, and park authorities.`,
        },
        {
          id: 42,
          q: 'Can I get out of the safari vehicle?',
          a: `Guests must remain inside the designated safari vehicle unless the guide, driver, or authorised park personnel specifically permits them to exit at an approved location.

Wildlife areas are not normal tourist environments and leaving the vehicle can create serious safety risks.`,
        },
        {
          id: 43,
          q: 'Can we ask the driver to chase an animal?',
          a: `Absolutely not.

Chasing, blocking, cornering, disturbing, feeding, calling, or intentionally attracting wildlife is prohibited and unethical.

Guests must follow responsible wildlife tourism practices at all times.`,
        },
      ],
    },
    {
      category: 'TRANSPORTATION',
      questions: [
        {
          id: 44,
          q: 'Do you provide pickup and drop-off?',
          a: `Pickup and drop-off depend on the selected package.

The included pickup/drop-off locations will be specified in your itinerary or booking confirmation.

Additional transfers may be arranged at an additional cost.`,
        },
        {
          id: 45,
          q: 'Can you arrange airport or railway station transfers?',
          a: `Yes, where available.

Airport, railway station, or other transfers can generally be added to a package subject to availability and additional charges.`,
        },
        {
          id: 46,
          q: 'What happens if my flight or train is delayed?',
          a: `Guests are responsible for informing JungleE as soon as possible if their travel plans are delayed.

We will try to assist with adjustments where operationally possible, but additional transportation costs or missed safari charges may apply.

JungleE cannot guarantee a refund for a safari missed due to delayed flights, trains, or other personal transportation issues.`,
        },
      ],
    },
    {
      category: 'SAFETY & RESPONSIBLE WILDLIFE TOURISM',
      questions: [
        {
          id: 47,
          q: 'Is wildlife safari safe?',
          a: `Wildlife safaris are generally conducted under established park and Forest Department regulations, with trained drivers, guides, and/or naturalists.

However, guests are visiting a natural environment containing wild animals, and there are inherent risks.

Guests must always follow safety instructions and never attempt to approach or interact with wildlife.`,
        },
        {
          id: 48,
          q: 'What happens if the weather becomes bad during my safari?',
          a: `Safari operations are subject to weather and park conditions.

If the authorities determine that conditions are unsafe, a safari may be cancelled, shortened, postponed, or otherwise modified.

Any refund or alternative arrangement will depend on the decision and refund policy of the relevant authority.`,
        },
        {
          id: 49,
          q: 'What if the park closes unexpectedly?',
          a: `If a park or safari zone is closed by the authorities, JungleE will communicate the situation and, where reasonably possible, assist with an alternative arrangement.

Any refund will depend on the applicable policy of the concerned authority and service providers.`,
        },
      ],
    },
    {
      category: 'CUSTOMISATION & SPECIAL REQUESTS',
      questions: [
        {
          id: 50,
          q: 'Can I plan a honeymoon or special occasion through JungleE?',
          a: `Yes.

We can help customise suitable accommodation, meals, transfers, sightseeing, and wildlife experiences for special occasions, subject to availability.

Special requests should be communicated before booking so we can determine what arrangements are possible.`,
        },
        {
          id: 51,
          q: 'Can you organise wildlife photography trips?',
          a: `Yes.

JungleE can create customised wildlife photography itineraries depending on the destination, season, target species, number of safari drives, accommodation requirements, and photography objectives.

However, specific wildlife sightings can never be guaranteed.`,
        },
        {
          id: 52,
          q: 'Can you organise corporate or private group trips?',
          a: `Yes.

We can create customised wildlife experiences for corporate groups, private groups, families, friends, photography communities, and other organisations.

Group size, accommodation, safari availability, transportation, and budget will determine the final itinerary and pricing.`,
        },
      ],
    },
    {
      category: 'BOOKING SUPPORT',
      questions: [
        {
          id: 53,
          q: 'What information do I need to provide to book?',
          a: `Depending on the destination and package, you may need to provide:
• Full name of each guest
• Date of birth/age where required
• Contact number
• Email address
• Travel dates
• Number of guests
• Government-issued identification details
• Pickup/drop-off details
• Any special requirements

Please ensure that all information is accurate before submitting your booking.`,
        },
        {
          id: 54,
          q: 'What happens after I book?',
          a: `Once your payment is received, JungleE will process the booking and confirm the applicable services.

You will receive your booking confirmation/itinerary containing relevant information such as:
• Travel dates
• Accommodation
• Safari details
• Reporting times
• Pickup/drop-off details
• Inclusions
• Important instructions
• Contact information

The exact information provided will depend on your package.`,
        },
        {
          id: 55,
          q: 'Can I book last minute?',
          a: `You can enquire about last-minute availability, but we strongly recommend booking in advance.

Safari permits, especially for popular destinations and peak seasons, can have limited availability.

Last-minute bookings are entirely subject to availability and cannot be guaranteed.`,
        },
        {
          id: 56,
          q: 'Can I book a package without a safari?',
          a: `Yes, depending on the destination.

We can create accommodation-only, sightseeing, transportation, or customised travel arrangements where available.`,
        },
        {
          id: 57,
          q: 'Do I need travel insurance?',
          a: `Travel insurance is not necessarily mandatory for every JungleE package, but it is strongly recommended.

Insurance can help protect against certain unforeseen events such as medical emergencies, trip interruptions, transport disruptions, or other covered circumstances.

Guests should carefully review their insurance coverage before travelling.`,
        },
      ],
    },
    {
      category: 'STILL HAVE QUESTIONS?',
      questions: [
        {
          id: 58,
          q: "I have a question that isn't answered here. What should I do?",
          a: `We're happy to help.

You can contact the JungleE team through the contact details provided on our website or through our official communication channels.

For package-specific questions, please mention your preferred destination, travel dates, number of guests, and the type of experience you are looking for.

We'll help you build the right wildlife experience for your trip.`,
        },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState({ 1: true });

  const toggleAccordion = (id) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCategories = useMemo(() => {
    return faqCategories
      .map((catGroup) => {
        if (activeCategory !== 'ALL' && catGroup.category !== activeCategory) {
          return null;
        }
        const matchingQuestions = catGroup.questions.filter((q) => {
          if (!searchTerm.trim()) return true;
          const term = searchTerm.toLowerCase();
          return q.q.toLowerCase().includes(term) || q.a.toLowerCase().includes(term);
        });

        if (matchingQuestions.length === 0) return null;

        return {
          ...catGroup,
          questions: matchingQuestions,
        };
      })
      .filter(Boolean);
  }, [activeCategory, searchTerm]);

  const allCategoryNames = ['ALL', ...faqCategories.map((c) => c.category)];

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Frequently Asked Questions</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900 tracking-tight">Expedition Knowledgebase</h1>
        <p className="text-sm sm:text-base text-charcoal-700 max-w-2xl mx-auto font-normal">
          Explore complete answers covering safaris, permits, accommodation, cancellation rules, safety protocols, and personalized bookings.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-pine-800 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all 58 questions (e.g. permits, refund, cameras, tiger sighting)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-sand-950 border border-sand-700 text-charcoal-900 text-sm focus:outline-none focus:border-pine-800 shadow-sm transition-all placeholder:text-charcoal-700/60"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 text-xs font-mono text-charcoal-700 hover:text-charcoal-950 bg-sand-800 px-2.5 py-1 rounded-full"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {allCategoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
              activeCategory === cat
                ? 'bg-pine-800 text-sand-950 shadow-md scale-105'
                : 'glass-panel text-charcoal-800 hover:bg-sand-900 border border-sand-700/80'
            }`}
          >
            {cat === 'ALL' ? 'All (58)' : cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordions by Section */}
      <div className="space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-sand-700 space-y-3">
            <HelpCircle className="w-10 h-10 text-pine-800 mx-auto" />
            <h3 className="text-lg font-bold text-charcoal-900">No matching questions found</h3>
            <p className="text-sm text-charcoal-700">Try adjusting your search keyword or clearing the filter.</p>
          </div>
        ) : (
          filteredCategories.map((group) => (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-sand-700/80 pb-2">
                <span className="w-2 h-2 rounded-full bg-pine-800"></span>
                <h2 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-pine-800 uppercase">
                  {group.category}
                </h2>
              </div>

              <div className="space-y-3">
                {group.questions.map((faq) => {
                  const isOpen = !!openIds[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl transition-all border ${
                        isOpen
                          ? 'bg-sand-950/90 border-pine-800/60 shadow-lg'
                          : 'glass-panel border-sand-700 hover:border-sand-600 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus:outline-none"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-mono font-bold text-pine-800 mt-1 shrink-0 bg-sand-900 border border-sand-700 px-2 py-0.5 rounded-md">
                            {faq.id}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-charcoal-900 leading-snug">
                            {faq.q}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-pine-800 shrink-0 mt-1 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-pine-800' : 'text-charcoal-700'
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-charcoal-800 leading-relaxed font-normal border-t border-sand-700/60 whitespace-pre-line">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-sand-700 text-center space-y-4 max-w-3xl mx-auto shadow-xl bg-sand-900/40">
        <MessageCircle className="w-10 h-10 text-pine-800 mx-auto" />
        <h3 className="text-2xl font-bold text-charcoal-950">Have a custom question or itinerary inquiry?</h3>
        <p className="text-sm sm:text-base text-charcoal-700 max-w-xl mx-auto">
          Our team is available to assist you with dates, zones, custom private expeditions, and corporate bookings.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-pine-800 hover:bg-pine-900 text-sand-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105"
          >
            Connect with us
          </Link>
        </div>
      </div>

    </div>
  );
}
