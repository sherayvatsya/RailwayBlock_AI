import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "RailBlock AI: Technical Dossier & Viva Defense Handbook",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Automatic Maintenance Block Planning & Conflict-Free Scheduling for Indian Railways",
                italics: true,
                bold: true,
                size: 24,
                color: "1E3A8A"
              })
            ],
            spacing: { after: 400 }
          }),

          // 1. PROJECT OVERVIEW
          new Paragraph({
            text: "1. PROJECT OVERVIEW",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Problem This Project Solves:\n",
                bold: true
              }),
              new TextRun(
                "Indian Railways (IR) is the 4th largest railway network in the world, operating over 13,000 passenger trains and 8,000+ freight trains daily across 68,000+ route kilometers. Heavy railway assets (steel tracks, 25 kV AC overhead electric traction (OHE), and electronic interlocking signaling) wear down and require frequent physical maintenance.\n\n" +
                "Currently, maintenance block allocation is manual, fragmented, and siloed:\n" +
                "• Engineering (Civil/Track) asks for a track tamping block on Monday.\n" +
                "• Electrical / TRD (Traction Distribution) asks for an OHE wire inspection on Tuesday.\n" +
                "• S&T (Signal & Telecommunication) asks for point machine calibration on Wednesday.\n\n" +
                "Because these three departments do not coordinate their requests, the same section of track is closed three separate times on consecutive days. This causes repeated train speed restrictions, passenger train delays, punctuality losses, and severe track capacity waste.\n\n" +
                "RailBlock AI solves this by automatically clustering, prioritizing, and scheduling multi-department maintenance tasks into single, integrated 'Jumbo / Traffic-cum-Power' shadow windows during low-density train traffic hours (predominantly 01:00 AM – 04:30 AM), ensuring zero collisions with scheduled passenger trains."
              )
            ],
            spacing: { after: 200 }
          }),

          // Key Railway Terms
          new Paragraph({
            children: [
              new TextRun({ text: "Key Railway Domain Terms:\n", bold: true }),
              new TextRun("• Maintenance Block (Traffic / Power Block): A formally sanctioned time interval during which train operations on a specific track section are temporarily suspended or diverted so that track machines, tower wagons, and maintenance gangs can work safely.\n"),
              new TextRun("• Block Planning: The process of identifying maintenance needs across civil, electrical, and signal wings, verifying track machine availability, finding an empty slot between trains in the working timetable, and allocating track possession.\n"),
              new TextRun("• Conflict-Free Scheduling: Scheduling maintenance windows such that no moving train is scheduled to be on that track segment during the block duration, and multi-department teams do not interfere dangerously.\n"),
              new TextRun("• Status Quo Difficulties: Manual review of paper block registers, phone/WhatsApp coordination, high human error risk, and passenger train delays at outer signals.")
            ],
            spacing: { after: 200 }
          }),

          // Simple Example
          new Paragraph({
            children: [
              new TextRun({ text: "Simple Example: Conflict Detection & Rescheduling:\n", bold: true }),
              new TextRun("• Scenario: Track Section Ghaziabad — Aligarh (KM 45 to KM 52). Track Tamping Machine requested from 10:00 AM – 12:00 PM (120 mins). Train 12004 (Lucknow Shatabdi Express) scheduled at 10:30 AM – 10:55 AM.\n"),
              new TextRun("• Conflict Detected: [10:30, 10:55] overlaps [10:00, 12:00]. The system flags a critical conflict because Train 12004 has Priority Tier 1.\n"),
              new TextRun("• System Recommendation: The system shifts the maintenance block to an available low-density shadow window: 01:30 AM – 03:30 AM (Night Window WIN-01), where no passenger trains run and a TRD OHE inspection can co-occupy the same track segment.")
            ],
            spacing: { after: 300 }
          }),

          // 2. COMPLETE WORKFLOW
          new Paragraph({
            text: "2. COMPLETE WORKFLOW",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Workflow Architecture:\n" +
                "[User Input / Department Demand] (NewTaskModal.tsx)\n" +
                "  ↓\n" +
                "[Frontend State Management] (App.tsx)\n" +
                "  ↓\n" +
                "[Priority Scoring & Spatial Clustering Engine] (calculateTaskScore & clusterTasksByProximity in optimizationEngine.ts)\n" +
                "  ↓\n" +
                "[Train Conflict Detection & Feasibility Filter] (hasTrainConflict in optimizationEngine.ts)\n" +
                "  ↓\n" +
                "[Joint Block Synthesis & Time Calculation] (+30m single safety buffer & capacity gains)\n" +
                "  ↓\n" +
                "[Planner Review & Section Controller Sanction] (PlannerReviewView.tsx)\n" +
                "  ↓\n" +
                "[Interactive Dashboard & Master Timetable Visualization] (DashboardView.tsx, OptimizationEngineView.tsx)\n" +
                "  ↓\n" +
                "[Web Audio Sound Engine & Confetti Feedback] (audioFx.ts)"
              )
            ],
            spacing: { after: 300 }
          }),

          // 3. TECH STACK
          new Paragraph({
            text: "3. TECH STACK",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun("• Frontend Framework: React 19 (19.0.1) - Declarative UI, reactive state management\n"),
              new TextRun("• Language: TypeScript (~5.8.2) - Strict type safety for complex railway data models\n"),
              new TextRun("• Build Tool & Dev Server: Vite (6.2.3) - Fast compilation and local hosting\n"),
              new TextRun("• Styling Engine: Tailwind CSS (v4.1.14) - Modern utility-first responsive layout\n"),
              new TextRun("• Data Visualization: Recharts (3.10.1) - Interactive Bar, Pie, and Area charts\n"),
              new TextRun("• Iconography: Lucide React (0.546.0) - Accessible SVG vector icons\n"),
              new TextRun("• Animations: Canvas Confetti (1.9.4) - Visual celebration effects on block approval\n"),
              new TextRun("• Audio Engine: Web Audio API (Native Browser API) - Multi-chord harmonic synthesizer and sound effects\n"),
              new TextRun("• Backend / Runtime: Express.js / Node.js - Container runtime environment\n"),
              new TextRun("• AI Integration SDK: @google/genai (2.4.0) - Google Gemini API integration")
            ],
            spacing: { after: 300 }
          }),

          // 4. EXPLAIN EVERY TECHNOLOGY
          new Paragraph({
            text: "4. TECHNOLOGY DETAILS & JUSTIFICATION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "React 19 & TypeScript:\n", bold: true }),
              new TextRun("Provides modular components (DashboardView, OptimizationEngineView, TaskQueueView) with rigorous compile-time type verification for railway data objects.\n\n"),
              new TextRun({ text: "Web Audio API (audioFx.ts):\n", bold: true }),
              new TextRun("Generates synthesized audio waveforms directly in the browser with zero external audio asset files, offering live acoustic confirmation for block generation and controller sanctions.\n\n"),
              new TextRun({ text: "Recharts & Tailwind CSS:\n", bold: true }),
              new TextRun("Delivers executive data analytics, department workload distributions, and urgency rankings with dark-mode responsive layouts.")
            ],
            spacing: { after: 300 }
          }),

          // 5. GOOGLE AI STUDIO & GEMINI ROLE
          new Paragraph({
            text: "5. GOOGLE AI STUDIO & GEMINI ROLE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Crucial Distinction:\n" +
                "• Mathematical Scheduling & Train Conflict Detection is 100% Deterministic Rule-Based in TypeScript (optimizationEngine.ts). Railway safety requires mathematical certainty rather than probabilistic approximations.\n" +
                "• Google Gemini & AI Studio provide Decision Support Intelligence, generating natural-language explanations of optimization gains, contingency analysis rationales, and summary briefings for senior railway officers."
              )
            ],
            spacing: { after: 300 }
          }),

          // 6. AUTOMATIC MAINTENANCE BLOCK PLANNING
          new Paragraph({
            text: "6. AUTOMATIC MAINTENANCE BLOCK PLANNING ALGORITHM",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Step 1: Compute Priority Score (0–100) for every demand:\n" +
                "Score = (UrgencyWeight × 30) + (AssetCriticality × 25) + (OverdueBonus × 20) + (BlockRequirements × 25)\n\n" +
                "Step 2: Sort tasks in descending order of Priority Score.\n\n" +
                "Step 3: Cluster tasks by Corridor and Physical Section (KM within ±5 KM).\n\n" +
                "Step 4: Find candidate Block Windows and verify hasTrainConflict() === false.\n\n" +
                "Step 5: Synthesize Composite Block:\n" +
                "• Composite Work Duration = max(task durations in cluster)\n" +
                "• Composite Block Duration = Composite Work Duration + 30 mins single safety buffer\n" +
                "• Status Quo Duration = sum(task durations) + (task_count × 30 mins separate buffers)\n" +
                "• Track Hours Saved = Status Quo Duration - Composite Block Duration"
              )
            ],
            spacing: { after: 300 }
          }),

          // 7. CONFLICT DETECTION
          new Paragraph({
            text: "7. CONFLICT DETECTION MATHEMATICAL LOGIC",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Mathematical Overlap Condition:\n" +
                "Two time intervals [A, B] and [C, D] overlap on the same track if and only if:\n" +
                "A < D && B > C\n\n" +
                "In code (optimizationEngine.ts):\n" +
                "windowStartMin < trainEndMin && windowEndMin > trainStartMin\n\n" +
                "Example: Window [06:00, 08:00] (360m to 480m) vs Train [06:20, 06:45] (380m to 405m):\n" +
                "360 < 405 (True) AND 480 > 380 (True) => CONFLICT DETECTED. The engine automatically rejects the slot."
              )
            ],
            spacing: { after: 300 }
          }),

          // 8. CORRIDORS SUPPORTED
          new Paragraph({
            text: "8. SUPPORTED RAILWAY CORRIDORS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun("1. Delhi — Kanpur Main Line (440 KM - NCR/NR)\n"),
              new TextRun("2. Lucknow — Delhi Main Line via Bareilly/Moradabad (490 KM - NR/NER)\n"),
              new TextRun("3. Chandigarh — Delhi High-Speed Corridor (245 KM - NR 160 kmph)\n"),
              new TextRun("4. Shamli — Delhi / Saharanpur Route (165 KM - NR)\n"),
              new TextRun("5. Delhi — Jaipur Route via Rewari/Alwar (308 KM - NWR)\n"),
              new TextRun("6. Howrah — DDU Grand Chord (678 KM - ER/ECR)\n"),
              new TextRun("7. Mumbai — Ahmedabad High-Density Trunk Route (493 KM - WR)")
            ],
            spacing: { after: 300 }
          }),

          // 9. VIVA VOCE DEFENSE (TOP 10 QUESTIONS)
          new Paragraph({
            text: "9. KEY VIVA QUESTIONS & ANSWERS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Q1: What is the main objective of RailBlock AI?\n", bold: true }),
              new TextRun("A1: To automate multi-department railway maintenance planning and generate conflict-free schedules that bundle civil, electrical, and signal work into unified shadow windows.\n\n"),
              new TextRun({ text: "Q2: What is a Shadow Block?\n", bold: true }),
              new TextRun("A2: Allowing secondary departments (e.g. S&T or TRD) to work concurrently on the same track section during a primary Engineering machine block without needing an independent track closure.\n\n"),
              new TextRun({ text: "Q3: Why is conflict detection deterministic instead of generative?\n", bold: true }),
              new TextRun("A3: Railway safety requires 100% mathematical certainty against train collisions. Exact interval math guarantees zero collisions.\n\n"),
              new TextRun({ text: "Q4: Why was 10.8h calculated for 4 uncoordinated blocks when work sum is 8.8h?\n", bold: true }),
              new TextRun("A4: Each separate block requires its own mandatory +30-minute safety buffer for OHE isolation, earthing, and track clearance. 4 separate blocks add 4 × 0.5h = 2.0h of buffer, totaling 10.8h.")
            ],
            spacing: { after: 300 }
          }),

          // 10. FINAL SUMMARY
          new Paragraph({
            text: "10. PRESENTATION CHEAT SHEET & CONCLUSION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                "• 30-Second Elevator Pitch: RailBlock AI is an automated decision-support system for Indian Railways that eliminates train delays caused by uncoordinated maintenance. Instead of Civil, Electrical, and Signaling departments shutting down tracks on separate days, our algorithm bundles their work into a single conflict-free night window, reducing track closure time by up to 67%.\n\n" +
                "• 2-Minute Summary: Explains the multi-department demand consolidation, spatial proximity clustering (±5 KM), deterministic timetable conflict avoidance, and single-click sanctioning workflow by the Divisional Chief Controller."
              )
            ],
            spacing: { after: 300 }
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(process.cwd(), 'public', 'RailBlock_AI_Complete_Documentation.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated DOCX successfully at: ${outputPath}`);
}

generateDocx().catch(console.error);
