# Delva ROI Estimator

> Stop shipping guesses → start landing profit

A web application that helps Product Managers create sponsor-ready business cases in under 3 minutes. Transform product metrics into P&L impact with scenarios and confidence scores.

## Features

- **4 Business Model Templates**: SaaS, E-commerce, B2B Sales-led, and Cost Reduction
- **Finance-Friendly Outputs**: Profit, payback, ROI with transparent P&L bridge
- **Scenario Analysis**: Automatic generation of Conservative, Base, and Aggressive scenarios
- **Confidence Scoring**: Assess reliability of estimates based on data quality and assumptions
- **Risk Assessment**: Market, technical, and time-to-market risk evaluation
- **Shareable Reports**: Generate unique links to share results with stakeholders
- **Export Ready**: Copy summaries or export data for presentations

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to the project directory
cd roi-estimator

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Validation**: Zod

### Project Structure

```
roi-estimator/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page and main flow
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── report/[id]/         # Shareable report pages
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Slider.tsx
│   │   └── ProgressBar.tsx
│   ├── forms/               # Form components
│   │   └── InitiativeForm.tsx
│   └── results/             # Results components
│       └── ResultsDashboard.tsx
├── lib/                     # Core business logic
│   ├── engine/              # Calculation engine
│   │   └── calculator.ts    # ROI calculation logic
│   ├── templates/           # Business model templates
│   │   └── index.ts
│   └── analytics.ts         # Analytics tracking
├── types/                   # TypeScript type definitions
│   └── index.ts
└── public/                  # Static assets
```

## Core Concepts

### Templates

Each business model template defines:
- Input fields with validation
- Default assumptions (gross margin, hourly rate, horizon)
- Formulas for calculating delta revenue, costs, and risks
- Scenario rules for conservative/aggressive multipliers

### Calculation Engine

The ROI Calculator implements the P&L bridge model:

```
Profit = (ΔRevenue × Gross Margin) + ΔCost Savings - Delivery Cost - Run Cost
```

Key features:
- Ramp-up modeling (instant, 3/6/12 months)
- Risk-adjusted scenarios
- Confidence-based scenario ranges
- Cumulative cashflow projections

### Confidence Score

Calculated based on:
- **Data quality**: Measured (0) → Partial (-20) → Estimated (-40)
- **Dependencies**: None (0) → 1-2 (-15) → 3+ (-30)
- **Uplift nature**: A/B test (0) → Analogy (-15) → Intuition (-30)

Score influences scenario ranges and displays high/medium/low badges.

## Usage

### Creating an Initiative

1. **Choose Template**: Select from SaaS, E-commerce, B2B Sales, or Cost Reduction
2. **Enter Metrics**: Input baseline metrics and expected improvements
3. **Define Costs**: Estimate delivery and ongoing costs
4. **Assess Risks**: Rate market, technical, and time-to-market risks
5. **Set Confidence**: Specify data quality and assumptions
6. **View Results**: See profit, payback, ROI across three scenarios

### Sharing Results

- **Copy Summary**: One-click copy of sponsor-ready text summary
- **Share Link**: Generate unique URL to share with stakeholders
- **Export**: Download results as JSON (PDF export in V1)

## Analytics

The application tracks key funnel metrics:
- Landing views
- Form starts and completions
- Template selection
- Report shares and exports
- Completion time

Events are stored in localStorage (MVP) and logged to console.

## Roadmap

### V1 (Post-MVP)
- PDF export with professional formatting
- Sensitivity analysis (top 3 impact drivers)
- Budget cap mode with recommendations
- Template builder (admin)
- Post-launch tracking plan generator

### V2 (Future)
- NPV calculation with configurable discount rate
- Portfolio view with initiative comparison
- Collaboration features
- Sector benchmarks
- API integrations (Jira, Linear)

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript is configured in strict mode. Run type checking with:

```bash
npx tsc --noEmit
```

## License

Proprietary - Delva

## Contact

For questions or support, please contact the Delva team.

---

**Built with the goal of helping Product teams transform metrics into profit.**
