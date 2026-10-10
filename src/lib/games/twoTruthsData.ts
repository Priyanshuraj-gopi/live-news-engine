import { TwoTruthsRound } from "./types";

export const TWO_TRUTHS_ROUNDS: TwoTruthsRound[] = [
  {
    id: "tt-space-1",
    topic: "India's Space & Frontier Tech Milestones",
    category: "Space & Defense",
    timeframe: "This Week",
    dateStamp: "October 2026",
    statements: [
      {
        id: "s1",
        text: "ISRO's Gaganyaan orbital module includes life support systems designed to keep 3 astronauts safely in a 400 km low Earth orbit for a 3-day mission.",
        isLie: false,
        factCheck: "VERIFIED FACT: The Gaganyaan human spaceflight architecture is engineered for a 3-member crew orbiting at 400 km altitude with sea-landing recovery in Indian waters.",
        sourceCitation: "ISRO Gaganyaan Mission Directorate & Zee News Space Bureau",
      },
      {
        id: "s2",
        text: "India became the first country in history to soft-land an exploration rover near the lunar South Pole with Chandrayaan-3.",
        isLie: false,
        factCheck: "VERIFIED FACT: On August 23, 2023, India achieved the historic world first by touching down on the rugged lunar South Pole terrain, now celebrated as National Space Day.",
        sourceCitation: "Department of Space & Press Information Bureau (PIB)",
      },
      {
        id: "s3",
        text: "ISRO has completed commercial decommissioning of all PSLV rockets in favor of an entirely foreign-built heavy booster.",
        isLie: true,
        factCheck: "DEBUNKED LIE: PSLV remains the primary workhorse rocket of ISRO and has been commercialized domestically through a consortium of HAL and L&T, not replaced by foreign hardware.",
        sourceCitation: "NewSpace India Limited (NSIL) & Ministry of Science & Technology",
      },
    ],
    deepDive: "India's space economy is projected to reach $44 billion by 2033 under the IN-SPACe deregulation and private launch vehicle ecosystem.",
  },

  {
    id: "tt-semicon-2",
    topic: "The Semiconductor Corridor & Electronics Manufacturing",
    category: "Tech & Markets",
    timeframe: "This Week",
    dateStamp: "October 2026",
    statements: [
      {
        id: "s1",
        text: "The Tata Group and Taiwan's PSMC are constructing India's first commercial semiconductor wafer fabrication fab at Dholera, Gujarat.",
        isLie: false,
        factCheck: "VERIFIED FACT: The Dholera mega-fab represents a $11 billion investment producing up to 50,000 wafer starts per month across 28nm and legacy nodes.",
        sourceCitation: "India Semiconductor Mission (ISM) & Ministry of Electronics & IT",
      },
      {
        id: "s2",
        text: "India currently manufactures 100% of all global silicon microchips and ceased all foreign imports in 2025.",
        isLie: true,
        factCheck: "DEBUNKED LIE: While domestic production and assembly have expanded exponentially, Taiwan, South Korea, and the US still dominate global cutting-edge fabrication; India is scaling its capacity.",
        sourceCitation: "Global Semiconductor Industry Association & RBI Bulletin",
      },
      {
        id: "s3",
        text: "Mobile phone exports from India crossed $15 billion annually, driven by the Production Linked Incentive (PLI) scheme.",
        isLie: false,
        factCheck: "VERIFIED FACT: Electronics manufacturing emerged as one of India's fastest-growing export segments, with flagship smartphone assembly expanding rapidly in Tamil Nadu and Karnataka.",
        sourceCitation: "Ministry of Commerce & Industry Trade Data",
      },
    ],
    deepDive: "The $10B India Semiconductor Mission provides up to 50% fiscal capital support from the central government alongside matching state incentives.",
  },

  {
    id: "tt-energy-3",
    topic: "Clean Energy, Climate & Green Hydrogen Transition",
    category: "Climate & Energy",
    timeframe: "This Month",
    dateStamp: "October 2026",
    statements: [
      {
        id: "s1",
        text: "India committed to a national target of reaching 500 GW of non-fossil fuel energy capacity by the year 2030.",
        isLie: false,
        factCheck: "VERIFIED FACT: Established under India's updated Nationally Determined Contributions (NDCs), renewable installations (solar, wind, hydro) are on track toward the 500 GW milestone.",
        sourceCitation: "Ministry of New and Renewable Energy (MNRE)",
      },
      {
        id: "s2",
        text: "The PM Surya Ghar Muft Bijli Yojana provides solar subsidies to enable up to 300 units of free monthly power for 1 crore households.",
        isLie: false,
        factCheck: "VERIFIED FACT: Launched with an outlay of ₹75,000+ crore, the national rooftop solar scheme gives direct financial assistance to households installing rooftop solar units.",
        sourceCitation: "Cabinet Committee on Economic Affairs (CCEA)",
      },
      {
        id: "s3",
        text: "India has completely banned the use of electricity in all industrial factories nationwide to curb carbon emissions.",
        isLie: true,
        factCheck: "DEBUNKED LIE: India is accelerating industrial electrification and green hydrogen adoption, not banning electricity. Grid supply to industries continues expanding with green open-access rules.",
        sourceCitation: "Central Electricity Authority (CEA) Performance Review",
      },
    ],
    deepDive: "The National Green Hydrogen Mission targets at least 5 MMT of annual green hydrogen production by 2030, abating nearly 50 MMT of greenhouse gases.",
  },

  {
    id: "tt-economy-4",
    topic: "Fiscal Policy, Digital Payments & Reserve Bank Directives",
    category: "Economy & Banking",
    timeframe: "This Month",
    dateStamp: "October 2026",
    statements: [
      {
        id: "s1",
        text: "India's Unified Payments Interface (UPI) processes more than 14 billion digital transactions every single month.",
        isLie: false,
        factCheck: "VERIFIED FACT: NPCI data demonstrates UPI regularly exceeding 14–15 billion monthly volume, accounting for over 75% of domestic retail digital transactions.",
        sourceCitation: "National Payments Corporation of India (NPCI) Monthly Metrics",
      },
      {
        id: "s2",
        text: "The Reserve Bank of India has replaced all paper currency notes with physical gold coins that must be weighed at grocery checkouts.",
        isLie: true,
        factCheck: "DEBUNKED LIE: Indian physical currency remains legal tender alongside the Digital Rupee (e₹-CBDC); gold coins are not used for standard grocery checkout tender.",
        sourceCitation: "Reserve Bank of India Monetary Framework",
      },
      {
        id: "s3",
        text: "Bilateral local currency settlements using the Indian Rupee have expanded to multiple partner nations including UAE and Sri Lanka.",
        isLie: false,
        factCheck: "VERIFIED FACT: The RBI enabled Special Rupee Vostro Accounts (SRVA) across dozens of nations to settle international trade directly in INR, reducing dollar dependence.",
        sourceCitation: "Reserve Bank of India Foreign Exchange Department",
      },
    ],
    deepDive: "Cross-border linkages between UPI and global networks like Singapore's PayNow and UAE's Jaywan allow direct remittance settlements within seconds.",
  },
];

/**
 * Get active round of 2 Truths & a Lie based on index or daily rotation
 */
export function getTwoTruthsRound(index = 0): TwoTruthsRound {
  const roundIdx = Math.abs(index) % TWO_TRUTHS_ROUNDS.length;
  return TWO_TRUTHS_ROUNDS[roundIdx];
}
