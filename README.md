# RailBlock AI

AI-powered decision-support platform for maintenance block planning and conflict-free scheduling on Indian Railways.

RailBlock AI helps railway controllers, planners, and operating teams coordinate maintenance windows intelligently across multiple departments such as Civil Engineering, TRD Electrical, and Signal & Telecom. The system consolidates maintenance demands, evaluates route conflicts, and proposes optimized block plans that reduce downtime, improve capacity utilization, and minimize train disruption.

## Overview

Indian Railways often faces a recurring challenge: multiple departments request maintenance blocks independently, creating conflicting closures, underutilized windows, and repeated train delays. RailBlock AI addresses this by acting as a unified planning layer that:

- clusters co-located maintenance work
- prioritizes urgent and overdue tasks
- aligns block requests with low-density or shadow train windows
- checks timetable conflicts before approving a plan
- supports planner review and what-if simulation for operational decisions

The solution is designed as an intelligent dashboard-driven decision support system for divisional operating control and maintenance planning teams.

## Problem Statement

The current manual process is fragmented:

- departments work in silos
- block requests are tracked separately
- grant-to-demand ratios remain low
- high-priority train movements conflict with maintenance windows
- planners spend valuable time reconciling overlapping demands

This leads to avoidable delays, unused maintenance opportunities, and reduced track utilization.

## Solution

RailBlock AI introduces a three-step optimization approach:

1. Priority Ranking
   - scores maintenance demands based on urgency, backlog severity, and operational impact
2. Compatibility Grouping
   - groups nearby and related tasks into joint corridor blocks
3. Feasible Window Selection
   - selects timetable-safe maintenance windows while avoiding high-priority train conflicts

This gives controllers a realistic, schedule-aware proposal instead of a purely manual spreadsheet-based decision process.

## Key Features

- Interactive operations dashboard
- Maintenance task queue and prioritization
- AI planning engine for block optimization
- Planner review workflow with approval and rejection controls
- What-if simulator for scenario testing
- Weekly schedule view for sanctioned block planning
- Dark/light theme support for control room usability

## Presentation Reference

This project is aligned with the RailBlock AI presentation and pitch narrative available in the repository:

- [RailBlock_AI_Presentation_Script.pdf](RailBlock_AI_Presentation_Script.pdf)
- [presentation_script.html](presentation_script.html)

The presentation highlights the operational problem, the strategic opportunity, and the product narrative for railway leadership and evaluator audiences.

## Deployed Website

Live demo / deployed site:

- https://railway-block-ai.vercel.app/


## Project Structure

- [src/App.tsx](src/App.tsx) — main application shell
- [src/components](src/components) — dashboard and planning modules
- [src/utils/optimizationEngine.ts](src/utils/optimizationEngine.ts) — optimization logic
- [src/data/mockData.ts](src/data/mockData.ts) — sample railway planning data
- [server.ts](server.ts) — local dev and production server
- [presentation_script.html](presentation_script.html) — presentation narrative
- [RailBlock_AI_Presentation_Script.pdf](RailBlock_AI_Presentation_Script.pdf) — presentation PDF reference

## Tech Stack

- React + TypeScript
- Vite
- Express
- Recharts
- Lucide React
- Custom optimization engine for block planning

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

The app will start locally in development mode and can be opened in the browser.

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

## Notes

This project is a prototype decision-support application for railway maintenance planning and is intended to demonstrate the logic, workflow, and business value of intelligent block scheduling in a rail operations context.

## License

This project is for demonstration and academic/prototype use unless otherwise specified by the project owner.
