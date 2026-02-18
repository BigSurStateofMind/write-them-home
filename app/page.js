"use client";
import { useState, useEffect, useRef } from "react";

// ─── TARGETING DATABASE (baked in) ───────────────────────────────────────────
const SITES = [
  {
    id: "merrimack",
    name: "Merrimack, NH",
    status: "active",
    statusLabel: "HOTTEST FIGHT",
    capacity: "400–600 beds",
    type: "Processing Center",
    summary: "A 324,000 sq ft warehouse that's never been occupied, owned by Trammell Crow (a subsidiary of Fortune 500 company CBRE). DHS wants to convert it into a 400-600 bed processing center — but their own economic analysis was so sloppy it referenced Oklahoma instead of New Hampshire and cited income and sales taxes that don't exist in the state. Governor Ayotte, a Republican, says DHS lied to her. The town stands to lose $529K per year in property tax revenue if the federal government takes ownership.",
    keyFact: "DHS economic analysis cited income tax and sales tax — New Hampshire has neither.",
    targets: [
      { name: "Finlay Rothhaus", title: "Town Council Chairman", email: "TCPublicComments@MerrimackNH.gov", type: "local", ask: "Pass binding moratorium, not just resolution. Follow Kansas City model." },
      { name: "Nancy Harrington", title: "Town Council Vice Chair", email: "TCPublicComments@MerrimackNH.gov", type: "local", ask: "Pass binding moratorium." },
      { name: "Tom Koenig", title: "Town Council Member", email: "tkoenig@merrimacknh.gov", type: "local", ask: "Pass binding moratorium." },
      { name: "Kelly Ayotte", title: "Governor of NH (R)", email: null, contactUrl: "https://www.governor.nh.gov/contact", type: "state", ask: "Follow the Wicker model: call Noem directly and tell her to look elsewhere. Wicker got results in 3 days." },
      { name: "Maggie Hassan", title: "US Senator (D-NH)", email: null, contactUrl: "https://www.hassan.senate.gov/contact", type: "federal", ask: "Use Appropriations subcommittee authority to block ICE funding for this site." },
      { name: "Jeanne Shaheen", title: "US Senator (D-NH)", email: null, contactUrl: "https://www.shaheen.senate.gov/contact", type: "federal", ask: "Use direct funding authority on DHS Appropriations subcommittee." },
      { name: "CBRE Group / Trammell Crow", title: "Property Owner (NYSE: CBRE)", email: null, contactUrl: "https://www.cbre.com/about-us/contact-us", type: "corporate", ask: "Refuse to sell. Fortune 500 reputational risk. Salt Lake City owner refused — you can too." },
    ],
  },
  {
    id: "roxbury",
    name: "Roxbury, NJ",
    status: "active",
    statusLabel: "BIPARTISAN OPPOSITION",
    capacity: "~1,500 beds",
    type: "Processing Center",
    summary: "A brand-new 470,000 sq ft logistics center, built in 2023 and never occupied, owned by Dalfen Industrial out of Dallas. ICE wants to convert it into a ~1,500 bed processing center. The entire Township Council — all Republicans — voted unanimously to oppose. The Township Manager and Police Chief met with ICE at the site and laid out the infrastructure problems. New Jersey state law already prohibits municipalities from contracting with ICE. The council's resolution is symbolic; they have the legal authority under NJ Municipal Land Use Law to pass a binding zoning ordinance instead.",
    keyFact: "All-Republican council unanimously opposed. They should convert their resolution to a binding zoning ordinance.",
    targets: [
      { name: "Shawn Patillo", title: "Mayor (R)", email: "potillos@roxburynj.us", type: "local", ask: "Convert resolution to binding zoning ordinance. NJ Municipal Land Use Law gives you the authority." },
      { name: "Mark Crowley", title: "Deputy Mayor", email: "crowleym@roxburynj.us", type: "local", ask: "Pass zoning ordinance defining detention as impermissible land use." },
      { name: "Jim Rilee", title: "Councilman at Large", email: "rileej@roxburynj.us", type: "local", ask: "Convert opposition resolution to enforceable ordinance." },
      { name: "Jaki Albrecht", title: "Ward 2 Councilwoman", email: "albrechtj@roxburynj.us", type: "local", ask: "Pass binding zoning ordinance." },
      { name: "Fred Hall", title: "Ward 3 Councilman", email: "hallf@roxburynj.us", type: "local", ask: "Pass binding zoning ordinance." },
      { name: "Bob DeFillippo", title: "Councilman at Large", email: "defillippor@roxburynj.us", type: "local", ask: "Pass binding zoning ordinance." },
      { name: "Tom Carey", title: "Ward 4 Councilman", email: "careyt@roxburynj.us", type: "local", ask: "Pass binding zoning ordinance." },
      { name: "Cory Booker", title: "US Senator (D-NJ)", email: null, contactUrl: "https://www.booker.senate.gov/contact", type: "federal", ask: "Use Senate authority to investigate ICE warehouse expansion in NJ." },
      { name: "Andy Kim", title: "US Senator (D-NJ)", email: null, contactUrl: "https://www.andykim.senate.gov/contact", type: "federal", ask: "Demand full accounting of all NJ site selection activities." },
    ],
  },
  {
    id: "chester",
    name: "Chester, NY",
    status: "sold",
    statusLabel: "SOLD — FIGHT LIVE",
    capacity: "1,000–1,500 beds",
    type: "Processing Center",
    summary: "ICE purchased this former Pep Boys warehouse on February 14, 2026 — the sale is done. But the fight isn't over. The site sits in a FEMA flood plain with federal wetlands and the town's sewage system is already at capacity. Over 700 people packed a village board meeting. Rep. Pat Ryan's petition gathered 20,000+ signatures in a town of 12,000. Fifty-three elected officials signed a joint opposition letter. And yet Mayor Bell has refused to take a public position — making him the single most important pressure target in this fight.",
    keyFact: "Mayor Bell remains silent while every other level of government — town, county, state, federal — has opposed.",
    targets: [
      { name: "John T. Bell", title: "Mayor, Village of Chester", email: "info@villageofchesterny.com", type: "local", ask: "Take a public position. Enforce existing zoning and vulnerable-persons ordinance. Every other official has opposed — why haven't you?" },
      { name: "Brandon Holdridge", title: "Town Supervisor", email: "info@villageofchesterny.com", type: "local", ask: "Continue pursuing every legal, zoning, and environmental tool available." },
      { name: "Steve Neuhaus", title: "Orange County Executive (R)", email: null, contactUrl: "https://www.orangecountygov.com/262/County-Executive", type: "local", ask: "File legal challenge the moment the deed is recorded. Request state resources for the fight." },
      { name: "Pat Ryan", title: "US Representative (D-NY-18)", email: null, contactUrl: "https://patryan.house.gov/contact/email-me", type: "federal", ask: "Escalate beyond petition. Demand congressional investigation. Sponsor legislation blocking warehouse conversions." },
    ],
  },
  {
    id: "hudson",
    name: "Hudson, CO",
    status: "active",
    statusLabel: "GEO GROUP CONTRACT",
    capacity: "Unknown",
    type: "Detention Facility",
    summary: "A former correctional facility 30 miles from Denver with no public transit — meaning lawyers can't visit clients and families can't visit loved ones. GEO Group, the private prison company, was awarded a $39 million sole-source contract to run the facility with no competitive bidding. The conflict of interest runs deep: David Venturella, the ICE advisor overseeing site selection nationwide, is a former GEO Group executive. Over 70 speakers opposed the facility at a town council meeting — three hours of testimony, every single speaker against. Mayor Hammock still hasn't taken a position.",
    keyFact: "GEO Group got a $39M sole-source contract with no competitive bidding. The former ICE advisor selecting these sites is a former GEO executive.",
    targets: [
      { name: "Joe Hammock", title: "Mayor", email: "jhammock@hudsonco.gov", type: "local", ask: "Take a position. 70+ constituents spoke against this at your own meeting. Silence is complicity." },
      { name: "Matt Cole", title: "Mayor Pro-Tem", email: "mcole@hudsonco.gov", type: "local", ask: "Pass moratorium. Investigate sole-source GEO contract." },
      { name: "Candace Nolf", title: "Council Member", email: "cnolf@hudsonco.gov", type: "local", ask: "Pass moratorium on detention facilities." },
      { name: "Lisa Marie Buesgens", title: "Council Member", email: "lbuesgens@hudsonco.gov", type: "local", ask: "Pass moratorium on detention facilities." },
      { name: "Zachary Reyes", title: "Council Member", email: "zreyes@hudsonco.gov", type: "local", ask: "Your personal viewpoint is not irrelevant — your constituents are demanding action." },
      { name: "Don Post", title: "Council Member", email: "dpost@hudsonco.gov", type: "local", ask: "Pass moratorium on detention facilities." },
      { name: "Rachel Thwaites", title: "Council Member", email: "rthwaites@hudsonco.gov", type: "local", ask: "Pass moratorium on detention facilities." },
      { name: "Joe Neguse", title: "US Rep (D-CO-02)", email: null, contactUrl: "https://neguse.house.gov/contact", type: "federal", ask: "Use House Judiciary seat to investigate sole-source GEO contracts and Venturella revolving door." },
    ],
  },
  {
    id: "orlando",
    name: "Orlando, FL",
    status: "active",
    statusLabel: "EARLY STAGES",
    capacity: "~1,500 beds",
    type: "Processing Center",
    summary: "A 440,000 sq ft logistics center near Orlando's airport district, owned by TPA Group out of Atlanta. ICE Senior Advisor David Venturella — a former GEO Group executive — toured the site with over 30 people. When reporters started asking questions, the broker removed the listing and stopped returning calls. This fight is early-stage, which means the window to act is wide open. Commissioner Nicole Wilson is already proposing a county moratorium on detention facility conversions.",
    keyFact: "The ICE official selecting warehouse sites is a former private prison executive. The company he used to work for is getting sole-source contracts.",
    targets: [
      { name: "Buddy Dyer", title: "Mayor, City of Orlando", email: "buddy.dyer@orlando.gov", type: "local", ask: "Support Commissioner Wilson's county moratorium. Use every tool available — don't hide behind the Supremacy Clause." },
      { name: "Nicole Wilson", title: "Orange County Commissioner", email: "district1@ocfl.net", type: "local", ask: "We support your moratorium. Push it through the full commission." },
      { name: "Kelly Martinez Semrad", title: "Orange County Commissioner", email: "district5@ocfl.net", type: "local", ask: "Support Commissioner Wilson's moratorium ordinance." },
      { name: "Maxwell Frost", title: "US Rep (D-FL-10)", email: null, contactUrl: "https://frost.house.gov/contact", type: "federal", ask: "Investigate the Venturella/GEO Group revolving door. Demand congressional investigation." },
      { name: "Darren Soto", title: "US Rep (D-FL-09)", email: null, contactUrl: "https://soto.house.gov/contact", type: "federal", ask: "Escalate beyond letter to Noem. Demand full accounting of Orlando site selection." },
    ],
  },
  {
    id: "surprise",
    name: "Surprise, AZ",
    status: "sold",
    statusLabel: "PURCHASED — $70M",
    capacity: "1,500 beds",
    type: "Processing Center",
    summary: "ICE paid $70 million cash for this commerce center on January 23, 2026 — 300 yards from a residential neighborhood and about a mile from Dysart High School. Over 100 speakers opposed the facility at a five-hour city council meeting. The Arizona Attorney General sent a three-page letter to DHS Secretary Noem demanding answers. The building is purchased, but conversion requires permits, inspections, and infrastructure the city controls. The fight is far from over.",
    keyFact: "Lisa Everett, a three-time Trump voter, asks: 'If deportations are the goal, why build so many beds?'",
    targets: [
      { name: "Kevin Sartor", title: "Mayor of Surprise", email: "mayor@surpriseaz.gov", type: "local", ask: "Use every available tool to delay and obstruct conversion. Pursue legal challenge." },
      { name: "Kris Mayes", title: "AZ Attorney General", email: null, contactUrl: "https://www.azag.gov/contact-us", type: "state", ask: "File legal challenge. You have standing and authority." },
      { name: "Mark Kelly", title: "US Senator (D-AZ)", email: null, contactUrl: "https://www.kelly.senate.gov/contact", type: "federal", ask: "Use Senate authority to block ICE funding for Surprise facility." },
      { name: "Ruben Gallego", title: "US Senator (D-AZ)", email: null, contactUrl: "https://www.gallego.senate.gov/contact", type: "federal", ask: "Demand full investigation of $70M purchase with no local consultation." },
      { name: "Juan Ciscomani", title: "US Rep (R-AZ-06), Vice Chair House Approp DHS", email: null, contactUrl: "https://ciscomani.house.gov/contact", type: "federal", ask: "You have direct authority over DHS spending. Your state. Your constituents. Use your power." },
    ],
  },
  {
    id: "merrillville",
    name: "Merrillville, IN",
    status: "active",
    statusLabel: "PROACTIVE OPPOSITION",
    capacity: "500 beds",
    type: "Processing Center",
    summary: "A 275,000 sq ft warehouse owned by Opus Group out of Minnesota. When confronted, Opus sent a carefully worded letter saying they don't have a current contract with ICE — but pointedly did not rule out a future sale. The Town Council unanimously passed a resolution opposing the facility, but resolutions are symbolic. The window to pass a binding zoning ordinance is now, before Opus quietly cuts a deal. Governor Braun is cooperating with ICE statewide and has already housed 1,000 detainees at a state prison — no help is coming from the state level.",
    keyFact: "Opus Group's denial letter was carefully worded to leave the door open. The council needs to act NOW while the building is still uncontracted.",
    targets: [
      { name: "Rick Bella", title: "Council President, Ward 5", email: "rbella@merrillville.in.gov", type: "local", ask: "Convert resolution to binding zoning ordinance/moratorium. The Opus denial is not a guarantee." },
      { name: "Shawn Pettit", title: "Council, Ward 6", email: "spettit@merrillville.in.gov", type: "local", ask: "Push for binding moratorium before Opus cuts a deal." },
      { name: "Keesha Hardaway", title: "Council, Ward 7", email: "khardaway@merrillville.in.gov", type: "local", ask: "Convert symbolic resolution to enforceable ordinance." },
      { name: "Frank Mrvan", title: "US Rep (D-IN-01)", email: null, contactUrl: "https://mrvan.house.gov/contact", type: "federal", ask: "Escalate beyond letter. Demand congressional investigation of Merrillville site selection." },
    ],
  },
  {
    id: "hutchins",
    name: "Hutchins, TX",
    status: "victory",
    statusLabel: "VICTORY — BLOCKED",
    capacity: "9,500 beds",
    type: "Mega Center",
    summary: "Majestic Realty announced it will not enter any agreements to sell or lease buildings to DHS for use as a detention facility. The City Council thanked residents for their patience and professional decorum during council meetings and protests. This was the single largest proposed facility in ICE's national expansion — 9,500 beds in a town of 8,000 — and community opposition killed it.",
    keyFact: "BLOCKED. Majestic Realty refused to sell. Community opposition defeated the largest proposed facility in ICE's entire expansion.",
    targets: [
      { name: "Mario Vasquez", title: "Mayor", email: "colguin@cityofhutchins.org", type: "local", ask: "Pass moratorium. Deny permits. Use every available local tool." },
      { name: "Steve Nichols", title: "Mayor Pro Tem", email: "colguin@cityofhutchins.org", type: "local", ask: "Vote for binding moratorium." },
      { name: "Lance Gooden", title: "US Rep (R-TX-05), House Judiciary", email: null, contactUrl: "https://gooden.house.gov/contact", type: "federal", ask: "This is in your district. 9,500 detainees would overwhelm Hutchins. Your constituents need you to act." },
    ],
  },
];

const UNIVERSAL_FACTS = [
  "ICE's 'Detention Reengineering Initiative' is a $38.3 billion program to build mega-warehouses holding 92,600 people.",
  "32 people died in ICE custody in 2025 — one of the deadliest years in the agency's history. 6 more died in the first 6 weeks of 2026.",
  "Acting ICE Director Todd Lyons described the system he wants to build as 'like Amazon Prime, but with human beings.'",
  "David Venturella, the ICE advisor overseeing site selection, is a former GEO Group executive. GEO Group is simultaneously receiving sole-source contracts to run facilities he selects.",
  "DHS economic impact analyses were copy-pasted across sites — the Merrimack, NH document referenced Oklahoma, cited income tax in a state that has none.",
  "7 of 23 proposed sites have already been blocked by local opposition — including the largest proposed facility in the entire program.",
  "Sen. Roger Wicker (R-MS) wrote one letter to DHS Secretary Noem citing infrastructure concerns. She agreed to abandon the Byhalia site within 3 days.",
  "Over 3,800 children have been booked into ICE custody since January 2025, including 20 infants. 1,300+ held longer than the Flores Settlement allows.",
];

// ─── SYSTEM PROMPT FOR CLAUDE API ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the letter-writing engine for Write Them Home, an AI-assisted campaign opposing ICE warehouse detention facilities. Your role is to help users write personalized, compelling letters to specific decision-makers.

CRITICAL RULES:
1. The user provides their "fuel" — their moral argument, their identity/standing, and their specific demand. Your job is to sharpen their voice, not replace it.
2. Every letter must be personalized to the specific recipient and their power/role.
3. Use concrete facts from the campaign database (provided in each request).
4. Keep letters to 250-400 words. Decision-makers don't read long letters.
5. Be direct and specific. Name the facility. Name the town. Name the ask.
6. Never be generic. Never use form-letter language. The CMF data shows that individualized letters are what move congressional offices.
7. Match the framing to the recipient: infrastructure/fiscal arguments for Republicans, human rights/constitutional arguments for Democrats, reputational risk for corporations, local impact for all.
8. End every letter with a specific, actionable demand — not a vague plea.
9. Write in the user's voice as informed by their fuel responses. If they're angry, channel that productively. If they're measured, stay measured.
10. Output ONLY the letter text. No preamble, no explanation, no metadata.
11. CRITICAL: Never claim the writer is a constituent, taxpayer, or resident of the recipient's district unless the user explicitly says they are. Many writers will be concerned citizens from elsewhere. A letter from a non-constituent can be powerful — "I'm watching what you do" carries real weight — but it must be honest about where the writer stands. If the user says they're a parent in California writing to a New Hampshire official, say exactly that.`;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const palette = {
  bg: "#0a0a0c",
  surface: "#131318",
  surfaceHover: "#1a1a22",
  border: "#252530",
  borderActive: "#c4453a",
  text: "#e8e6e1",
  textMuted: "#8a8891",
  textDim: "#5a5866",
  accent: "#c4453a",
  accentGlow: "rgba(196, 69, 58, 0.15)",
  accentSoft: "#d4746a",
  warm: "#e2c074",
  warmDim: "rgba(226, 192, 116, 0.15)",
  success: "#5a9e6f",
  successDim: "rgba(90, 158, 111, 0.12)",
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function Page() {
  const [step, setStep] = useState(0); // 0=landing, 1=pick fight, 2=fuel, 3=targets, 4=collaboration, 5=send
  const [selectedSite, setSelectedSite] = useState(null);
  const [fuel, setFuel] = useState({ moral: "", identity: "", demand: "" });
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [letters, setLetters] = useState({});
  const [generatingFor, setGeneratingFor] = useState(null);
  const [editingLetter, setEditingLetter] = useState(null);
  const [sentCount, setSentCount] = useState(0);
  const [copied, setCopied] = useState(null);

  const site = SITES.find((s) => s.id === selectedSite);

  return (
    <div style={{ background: palette.bg, minHeight: "100vh", color: palette.text, fontFamily: "'EB Garamond', 'Georgia', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {step === 0 && <Landing onStart={() => setStep(1)} />}
      {step === 1 && <PickFight sites={SITES} onSelect={(id) => { setSelectedSite(id); setStep(2); }} onBack={() => setStep(0)} />}
      {step === 2 && <FindFuel site={site} fuel={fuel} setFuel={setFuel} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <PickTargets site={site} selected={selectedTargets} setSelected={setSelectedTargets} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && (
        <Collaboration
          site={site}
          fuel={fuel}
          targets={selectedTargets.map((i) => site.targets[i])}
          letters={letters}
          setLetters={setLetters}
          generatingFor={generatingFor}
          setGeneratingFor={setGeneratingFor}
          editingLetter={editingLetter}
          setEditingLetter={setEditingLetter}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <SendStep
          site={site}
          targets={selectedTargets.map((i) => site.targets[i])}
          letters={letters}
          sentCount={sentCount}
          setSentCount={setSentCount}
          copied={copied}
          setCopied={setCopied}
          onBack={() => setStep(4)}
          onRestart={() => { setStep(1); setSelectedSite(null); setFuel({ moral: "", identity: "", demand: "" }); setSelectedTargets([]); setLetters({}); setSentCount(0); }}
        />
      )}
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StepHeader({ step, total, title, onBack }) {
  return (
    <div style={{ padding: "20px 24px 0", maxWidth: 720, margin: "0 auto" }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", color: palette.textMuted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "4px 0", marginBottom: 8, letterSpacing: "0.03em" }}>
          &larr; Back
        </button>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: palette.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Step {step} of {total}</span>
        <div style={{ flex: 1, height: 1, background: palette.border }} />
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 20px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>{title}</h2>
    </div>
  );
}

function Landing({ onStart }) {
  const [letterCount, setLetterCount] = useState(null);
  const [displayCount, setDisplayCount] = useState(0);
  const GOAL = 1000;

  useEffect(() => {
    fetch('/api/count')
      .then(r => r.json())
      .then(d => setLetterCount(d.count || 0))
      .catch(() => setLetterCount(0));
  }, []);

  // Animated count-up
  useEffect(() => {
    if (letterCount === null || letterCount === 0) return;
    const duration = 1500;
    const steps = 40;
    const increment = letterCount / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= letterCount) {
        setDisplayCount(letterCount);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [letterCount]);

  const pct = letterCount ? Math.min((letterCount / GOAL) * 100, 100) : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 32, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${palette.accentGlow} 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: palette.accent, marginBottom: 24 }}>Write Them Home</div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 500, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
          An AI-assisted letter-writing campaign to stop ICE from building warehouse detention facilities — where children and families are held indefinitely — in American communities.
        </h1>
        <p style={{ fontSize: 15, color: palette.textMuted, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          90% of congressional staffers say personalized letters are among the most effective ways to influence an undecided Member of Congress. In Byhalia, Mississippi, one senator wrote one letter — and the proposed ICE facility was abandoned within three days.
        </p>
        <button onClick={onStart} style={{ background: palette.accent, color: "#fff", border: "none", padding: "14px 40px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}>
          Start Writing
        </button>
        {letterCount !== null && (
          <div style={{ marginTop: 36, padding: "20px 24px", background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 8, maxWidth: 420, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 36, fontWeight: 600, color: palette.accent, lineHeight: 1 }}>{displayCount.toLocaleString()}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: palette.textMuted, marginLeft: 8 }}>letters generated</span>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textDim }}>
                Goal: {GOAL.toLocaleString()}
              </div>
            </div>
            <div style={{ width: "100%", height: 8, background: palette.bg, borderRadius: 4, overflow: "hidden", position: "relative" }}>
              <div style={{
                width: `${pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${palette.accent}, ${palette.accentSoft})`,
                borderRadius: 4,
                transition: "width 1.5s ease-out",
                boxShadow: pct > 0 ? `0 0 8px ${palette.accentGlow}` : "none",
              }} />
            </div>
            {letterCount === 0 && (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textDim, marginTop: 8, textAlign: "center", fontStyle: "italic" }}>
                Be the first.
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: 24, fontSize: 12, color: palette.textDim, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
          You write. AI sharpens your voice into personalized letters for every target.
        </div>
      </div>
    </div>
  );
}

function PickFight({ sites, onSelect, onBack }) {
  return (
    <div style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <StepHeader step={1} total={5} title="Pick Your Fight" onBack={onBack} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: 15, color: palette.textMuted, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
          ICE is building a national network of mega-detention warehouses — facilities holding thousands of people each, in communities that were never consulted. Seven sites have already been blocked by local opposition. These are the key fights.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sites.map((s) => (
            <button key={s.id} onClick={() => onSelect(s.id)} style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 6, padding: "16px 20px", textAlign: "left", cursor: "pointer", transition: "all 0.15s", color: palette.text, position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = palette.borderActive; e.currentTarget.style.background = palette.surfaceHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.background = palette.surface; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 19, fontWeight: 600 }}>{s.name}</div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: s.status === "victory" ? palette.success : s.status === "sold" ? palette.warm : palette.accent,
                  background: s.status === "victory" ? palette.successDim : s.status === "sold" ? palette.warmDim : palette.accentGlow,
                  padding: "3px 8px", borderRadius: 3, whiteSpace: "nowrap"
                }}>{s.statusLabel}</span>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textMuted, marginBottom: 8 }}>{s.type} &middot; {s.capacity} &middot; {s.targets.length} targets</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: palette.textDim, lineHeight: 1.5 }}>{s.keyFact}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FindFuel({ site, fuel, setFuel, onNext, onBack }) {
  const canProceed = fuel.moral.trim().length > 10 && fuel.identity.trim().length > 5;
  const randomFact = UNIVERSAL_FACTS[Math.floor(Math.random() * UNIVERSAL_FACTS.length)];

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <StepHeader step={2} total={5} title="Find Your Fuel" onBack={onBack} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 6, padding: 16, marginBottom: 24, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: palette.textMuted, lineHeight: 1.5 }}>
          <span style={{ color: palette.warm, fontWeight: 600 }}>For context:</span> {site.summary}
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            What makes this wrong? *
          </label>
          <p style={{ fontSize: 13, color: palette.textDim, fontFamily: "'DM Sans', sans-serif", margin: "0 0 10px", lineHeight: 1.5 }}>
            Your moral argument. What principle is being violated? Why should anyone care? Speak from the gut — a sentence or two is enough.
          </p>
          <textarea value={fuel.moral} onChange={(e) => setFuel({ ...fuel, moral: e.target.value })} placeholder="e.g. 'Children don't belong in warehouses. This isn't border security — it's cruelty at industrial scale.'" rows={3}
            style={{ width: "100%", background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 4, padding: 12, color: palette.text, fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = palette.borderActive}
            onBlur={(e) => e.target.style.borderColor = palette.border}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Who are you? *
          </label>
          <p style={{ fontSize: 13, color: palette.textDim, fontFamily: "'DM Sans', sans-serif", margin: "0 0 10px", lineHeight: 1.5 }}>
            What gives you standing to speak? You don't have to be a local constituent — you might be a parent, a teacher, a veteran, a person of faith, a fellow American. If you are a constituent, say so. If not, say what moves you to write.
          </p>
          <textarea value={fuel.identity} onChange={(e) => setFuel({ ...fuel, identity: e.target.value })} placeholder="e.g. 'I'm a parent in California. I don't live in your district, but what happens in your town sets a precedent for the whole country.'" rows={2}
            style={{ width: "100%", background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 4, padding: 12, color: palette.text, fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = palette.borderActive}
            onBlur={(e) => e.target.style.borderColor = palette.border}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            What do you want them to do? <span style={{ fontWeight: 400, color: palette.textDim }}>(optional)</span>
          </label>
          <p style={{ fontSize: 13, color: palette.textDim, fontFamily: "'DM Sans', sans-serif", margin: "0 0 10px", lineHeight: 1.5 }}>
            Your specific demand. Leave blank and we'll tailor the ask to each recipient's power.
          </p>
          <textarea value={fuel.demand} onChange={(e) => setFuel({ ...fuel, demand: e.target.value })} placeholder="e.g. 'Vote for a binding moratorium at the next council meeting.'" rows={2}
            style={{ width: "100%", background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 4, padding: 12, color: palette.text, fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = palette.borderActive}
            onBlur={(e) => e.target.style.borderColor = palette.border}
          />
        </div>

        <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 4, padding: 12, marginBottom: 28, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: palette.textDim, fontStyle: "italic", lineHeight: 1.5 }}>
          {randomFact}
        </div>

        <button onClick={onNext} disabled={!canProceed}
          style={{ background: canProceed ? palette.accent : palette.border, color: canProceed ? "#fff" : palette.textDim, border: "none", padding: "12px 32px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 4, cursor: canProceed ? "pointer" : "not-allowed", letterSpacing: "0.04em" }}>
          Choose Your Targets &rarr;
        </button>
      </div>
    </div>
  );
}

function PickTargets({ site, selected, setSelected, onNext, onBack }) {
  const toggle = (i) => {
    setSelected((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };
  const selectAll = () => setSelected(site.targets.map((_, i) => i));
  const typeLabels = { local: "Local Official", state: "State Official", federal: "Federal Official", corporate: "Corporate Target" };
  const typeColors = { local: palette.accent, state: palette.warm, federal: "#6a8fc4", corporate: "#9a7cc4" };

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <StepHeader step={3} total={5} title="Pick Your Targets" onBack={onBack} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: palette.textMuted, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            {selected.length} of {site.targets.length} selected. More targets = more impact.
          </p>
          <button onClick={selectAll} style={{ background: "none", border: `1px solid ${palette.border}`, color: palette.textMuted, padding: "6px 14px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", borderRadius: 3, cursor: "pointer" }}>
            Select All
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {site.targets.map((t, i) => {
            const isSelected = selected.includes(i);
            return (
              <button key={i} onClick={() => toggle(i)} style={{
                background: isSelected ? palette.accentGlow : palette.surface,
                border: `1px solid ${isSelected ? palette.borderActive : palette.border}`,
                borderRadius: 5, padding: "12px 16px", textAlign: "left", cursor: "pointer",
                color: palette.text, transition: "all 0.12s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, fontWeight: 600 }}>{t.name}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textMuted, marginLeft: 10 }}>{t.title}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: typeColors[t.type], opacity: 0.8 }}>{typeLabels[t.type]}</span>
                    <div style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${isSelected ? palette.accent : palette.border}`, background: isSelected ? palette.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>
                      {isSelected && "✓"}
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textDim, marginTop: 4, lineHeight: 1.4 }}>
                  Ask: {t.ask}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: palette.textDim, marginTop: 3 }}>
                  {t.email ? `✉ ${t.email}` : t.contactUrl ? "→ Web contact form" : "Contact info pending"}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={onNext} disabled={selected.length === 0}
            style={{ background: selected.length > 0 ? palette.accent : palette.border, color: selected.length > 0 ? "#fff" : palette.textDim, border: "none", padding: "12px 32px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 4, cursor: selected.length > 0 ? "pointer" : "not-allowed", letterSpacing: "0.04em" }}>
            Generate {selected.length} Letter{selected.length !== 1 ? "s" : ""} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

function Collaboration({ site, fuel, targets, letters, setLetters, generatingFor, setGeneratingFor, editingLetter, setEditingLetter, onNext, onBack }) {
  const ANGLES = [
    "RHETORICAL ANGLE: Open with a specific, concrete image — a child, a building, a moment — and build outward from there. Make the reader see it before you make your argument.",
    "RHETORICAL ANGLE: Lead with the fiscal and infrastructure argument. Taxpayer cost, property tax loss, inadequate sewage/roads/emergency services. Make it a dollars-and-cents case before you get to the moral one.",
    "RHETORICAL ANGLE: Lead with the Byhalia victory — one senator wrote one letter and the site was abandoned in three days. Prove that opposition works, then make the ask.",
    "RHETORICAL ANGLE: Lead with a direct question to the recipient. 'What will you tell your constituents when they ask what you did?' Make it personal and unavoidable from the first sentence.",
    "RHETORICAL ANGLE: Lead with the children. Over 3,800 children booked into ICE custody since January 2025, including 20 infants. Make the human cost impossible to look away from.",
    "RHETORICAL ANGLE: Lead with the corruption angle — the revolving door between ICE advisor Venturella and GEO Group, the sole-source contracts, the copy-pasted economic analyses. Frame this as government incompetence and self-dealing.",
    "RHETORICAL ANGLE: Lead with the writer's personal story and identity. Why this issue keeps them up at night. Make the letter feel like it could only have been written by one person.",
    "RHETORICAL ANGLE: Lead with the national pattern — 23 sites, $38.3 billion, 92,600 beds. Zoom out to the scale of the program before zooming into this specific site. Make the recipient understand they're part of something much larger.",
    "RHETORICAL ANGLE: Lead with what other officials have already done — other mayors who spoke up, other councils that passed moratoriums, other governors who called Noem. Frame inaction as falling behind peers.",
    "RHETORICAL ANGLE: Lead with common ground. Don't assume the recipient is an adversary. Acknowledge the complexity of border policy, then explain why warehouse detention is a line that shouldn't be crossed regardless of political affiliation.",
    "RHETORICAL ANGLE: Lead with the future — what this community will look like in five years if this facility is built. Paint the picture of a changed town. Then contrast it with what's still possible if they act now.",
    "RHETORICAL ANGLE: Write it as a short, punchy letter — no more than 200 words. Every sentence a direct hit. No filler, no throat-clearing. The brevity itself is the statement.",
  ];

  const getRandomAngle = () => ANGLES[Math.floor(Math.random() * ANGLES.length)];

  const generateLetter = async (target, idx) => {
    setGeneratingFor(idx);
    const angle = getRandomAngle();
    const userPrompt = `Write a letter to ${target.name} (${target.title}) about the proposed ICE facility in ${site.name}.

SITE FACTS: ${site.summary}

KEY FACT: ${site.keyFact}

RECIPIENT'S SPECIFIC ASK: ${target.ask}

USER'S MORAL ARGUMENT: ${fuel.moral}

USER'S IDENTITY/STANDING: ${fuel.identity}

USER'S SPECIFIC DEMAND: ${fuel.demand || "Use the recipient-specific ask above."}

RECIPIENT TYPE: ${target.type}
${target.type === "federal" ? "Frame with congressional authority, constituent accountability, and specific legislative/oversight actions." : ""}
${target.type === "local" ? "Frame with local impact, infrastructure strain, property tax loss, and community values." : ""}
${target.type === "corporate" ? "Frame with reputational risk, shareholder value, and the precedent set by other companies that refused." : ""}
${target.type === "state" ? "Frame with state authority, gubernatorial power, and the Wicker precedent (one call to DHS got results in 3 days)." : ""}

${angle}

Write the letter now. Direct, specific, personal. End with a concrete demand.`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("\n") || "Error generating letter. Please try again.";
      setLetters((prev) => ({ ...prev, [idx]: text }));
      // Increment the counter
      try { fetch("/api/count", { method: "POST" }); } catch(e) {}
    } catch (err) {
      setLetters((prev) => ({ ...prev, [idx]: "Error connecting to AI. Please try again." }));
    }
    setGeneratingFor(null);
  };

  const allGenerated = targets.every((_, i) => letters[i]);

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <StepHeader step={4} total={5} title="The Collaboration" onBack={onBack} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: 14, color: palette.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 20, lineHeight: 1.5 }}>
          Generate each letter, then edit it until it sounds like you. You own every word.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {targets.map((t, i) => (
            <div key={i} style={{ background: palette.surface, border: `1px solid ${letters[i] ? palette.border : palette.borderActive}`, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: letters[i] ? `1px solid ${palette.border}` : "none" }}>
                <div>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textMuted, marginLeft: 10 }}>{t.title}</span>
                </div>
                {!letters[i] && (
                  <button onClick={() => generateLetter(t, i)} disabled={generatingFor !== null}
                    style={{ background: generatingFor === i ? palette.border : palette.accent, color: "#fff", border: "none", padding: "7px 16px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 3, cursor: generatingFor !== null ? "not-allowed" : "pointer" }}>
                    {generatingFor === i ? "Writing..." : "Generate"}
                  </button>
                )}
                {letters[i] && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditingLetter(editingLetter === i ? null : i)}
                      style={{ background: "none", border: `1px solid ${palette.border}`, color: palette.textMuted, padding: "5px 12px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", borderRadius: 3, cursor: "pointer" }}>
                      {editingLetter === i ? "Done Editing" : "Edit"}
                    </button>
                    <button onClick={() => { setLetters((p) => { const n = {...p}; delete n[i]; return n; }); generateLetter(t, i); }}
                      style={{ background: "none", border: `1px solid ${palette.border}`, color: palette.textMuted, padding: "5px 12px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", borderRadius: 3, cursor: "pointer" }}>
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
              {generatingFor === i && (
                <div style={{ padding: "24px 16px", textAlign: "center", color: palette.textDim, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                  <div style={{ display: "inline-block", width: 20, height: 20, border: `2px solid ${palette.border}`, borderTopColor: palette.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 8 }} />
                  <div>Drafting your letter to {t.name}...</div>
                </div>
              )}
              {letters[i] && editingLetter === i && (
                <textarea value={letters[i]} onChange={(e) => setLetters((p) => ({ ...p, [i]: e.target.value }))}
                  style={{ width: "100%", background: palette.bg, border: "none", padding: "16px", color: palette.text, fontFamily: "'EB Garamond', serif", fontSize: 15, lineHeight: 1.65, resize: "vertical", minHeight: 200, boxSizing: "border-box", outline: "none" }}
                />
              )}
              {letters[i] && editingLetter !== i && (
                <div style={{ padding: "16px", fontFamily: "'EB Garamond', serif", fontSize: 15, lineHeight: 1.65, color: palette.text, whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>
                  {letters[i]}
                </div>
              )}
            </div>
          ))}
        </div>
        {allGenerated && (
          <div style={{ marginTop: 24 }}>
            <button onClick={onNext}
              style={{ background: palette.accent, color: "#fff", border: "none", padding: "12px 32px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer", letterSpacing: "0.04em" }}>
              Send {targets.length} Letter{targets.length !== 1 ? "s" : ""} &rarr;
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SendStep({ site, targets, letters, sentCount, setSentCount, copied, setCopied, onBack, onRestart }) {
  const handleSend = (target, idx) => {
    const letter = letters[idx];
    if (!letter) return;
    if (target.email) {
      const subject = encodeURIComponent(`Regarding the proposed ICE facility in ${site.name}`);
      const body = encodeURIComponent(letter);
      window.open(`mailto:${target.email}?subject=${subject}&body=${body}`, "_blank");
      setSentCount((c) => c + 1);
    } else if (target.contactUrl) {
      navigator.clipboard.writeText(letter);
      setCopied(idx);
      window.open(target.contactUrl, "_blank");
      setSentCount((c) => c + 1);
      setTimeout(() => setCopied(null), 3000);
    }
  };

  const copyLetter = (idx) => {
    navigator.clipboard.writeText(letters[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <StepHeader step={5} total={5} title="Send" onBack={onBack} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        {sentCount > 0 && (
          <div style={{ background: palette.successDim, border: `1px solid ${palette.success}`, borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: palette.success }}>
            {sentCount} letter{sentCount !== 1 ? "s" : ""} opened. Check your email client or paste into the contact form.
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {targets.map((t, i) => (
            <div key={i} style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: palette.textMuted, marginLeft: 10 }}>{t.title}</span>
                </div>
              </div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.55, color: palette.textMuted, maxHeight: 80, overflow: "hidden", marginBottom: 12, whiteSpace: "pre-wrap" }}>
                {letters[i]?.substring(0, 200)}...
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {t.email && (
                  <button onClick={() => handleSend(t, i)}
                    style={{ background: palette.accent, color: "#fff", border: "none", padding: "8px 18px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 3, cursor: "pointer" }}>
                    Open Draft in Email
                  </button>
                )}
                {!t.email && t.contactUrl && (
                  <button onClick={() => handleSend(t, i)}
                    style={{ background: palette.accent, color: "#fff", border: "none", padding: "8px 18px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 3, cursor: "pointer" }}>
                    Copy & Open Contact Form
                  </button>
                )}
                <button onClick={() => copyLetter(i)}
                  style={{ background: "none", border: `1px solid ${palette.border}`, color: copied === i ? palette.success : palette.textMuted, padding: "8px 18px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", borderRadius: 3, cursor: "pointer" }}>
                  {copied === i ? "Copied!" : "Copy Letter"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, marginBottom: 8 }}>One fight down. Want to hit another site?</div>
          <button onClick={onRestart}
            style={{ background: "none", border: `1px solid ${palette.accent}`, color: palette.accent, padding: "10px 28px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>
            Write More Letters
          </button>
        </div>
      </div>
    </div>
  );
}
