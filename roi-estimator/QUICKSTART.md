# Quick Start Guide

Get the Delva ROI Estimator running in 5 minutes.

## Prerequisites

Ensure you have Node.js 18+ installed:

```bash
node --version  # Should be v18 or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

## Installation & Setup

```bash
# 1. Navigate to the project directory
cd roi-estimator

# 2. Install dependencies (this may take a few minutes)
npm install

# 3. Start the development server
npm run dev
```

The application will be available at: **http://localhost:3000**

## First Use

### Landing Page
When you first open the app, you'll see:
- Value proposition and key features
- Overview of the 4 business model templates
- "Start Your ROI Analysis" button

### Create Your First Analysis

1. **Click "Start Your ROI Analysis"**

2. **Step 1 - Choose Template**
   - Select one of 4 templates (SaaS, E-commerce, B2B Sales, Cost Reduction)
   - Optionally add a project name
   - Click "Next"

3. **Step 2 - Enter Business Metrics**
   - Fill in current metrics (baseline data)
   - Enter expected improvements (uplift)
   - All fields have helpful tooltips
   - Click "Next"

4. **Step 3 - Investment & Costs**
   - Delivery cost: Team size, duration, monthly cost
   - Run cost: Ongoing monthly expenses
   - Ramp-up period: How quickly impact materializes
   - Time horizon: How long to measure (default 24 months)
   - Click "Next"

5. **Step 4 - Risk Assessment**
   - Rate market risk (0-10)
   - Rate technical risk (0-10)
   - Rate time-to-market risk (0-10)
   - Click "Next"

6. **Step 5 - Confidence**
   - Data quality: Measured / Partial / Estimated
   - Dependencies: None / 1-2 / 3+
   - Uplift evidence: A/B test / Analogy / Intuition
   - Click "Calculate ROI"

### View Results

After calculation, you'll see:
- **Confidence badge**: High/Medium/Low based on inputs
- **Scenario selector**: Switch between Conservative/Base/Aggressive
- **Key metrics**: Annual profit, total profit, payback, ROI
- **Cashflow chart**: Cumulative cashflow over time
- **Scenario comparison**: Table comparing all three scenarios
- **Insights**: Top drivers, critical assumptions, dominant risks

### Share & Export

- **Copy Summary**: Copies sponsor-ready text to clipboard
- **Share Report**: Generates a unique shareable link
- **Export**: Downloads results as JSON

## Example: Quick Test

Try this example to verify everything works:

1. Choose **E-commerce** template
2. Keep all default values
3. Click through all steps (Next → Next → Next → Next → Calculate)
4. View the results dashboard

You should see positive ROI and a working cashflow chart.

## Production Build

To create an optimized production build:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The production build will be available at: **http://localhost:3000**

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Deploy to Other Platforms

The application is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Digital Ocean
- Heroku
- Any platform supporting Node.js

Refer to [Next.js deployment documentation](https://nextjs.org/docs/deployment) for specific instructions.

## Troubleshooting

### Port 3000 is already in use
```bash
# Kill the process on port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies won't install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit
```

### Build fails
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Next Steps

- Read the [README.md](./README.md) for architecture details
- Check [EXAMPLES.md](./EXAMPLES.md) for sample use cases
- Review the PRD document for product specifications
- Explore the code in `/lib/engine/calculator.ts` for calculation logic
- Customize templates in `/lib/templates/index.ts`

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review error messages in the browser console (F12)
3. Check the terminal for server-side errors
4. Ensure all dependencies are installed correctly

## Development Tips

- **Hot reload**: The dev server automatically reloads on file changes
- **TypeScript**: Use strict typing for better code quality
- **Components**: All UI components are in `/components/ui`
- **Styling**: Use Tailwind CSS classes for consistent styling
- **Testing**: Add tests in `__tests__` directories (coming in V1)

Happy analyzing! 🚀
