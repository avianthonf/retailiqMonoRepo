# RetailOS 🚀

An AI-native, omnichannel retail dashboard built for modern commerce. RetailOS transforms standard store management into an interactive, voice-first intelligent platform.

## ✨ Key Features

### 🎙️ AI Voice & Text Agent (Powered by ElevenLabs)
- **Conversational Queries**: Ask your dashboard about inventory, revenue, and customer analytics natively using your voice.
- **Sub-Second Latency**: Real-time continuous STT and TTS streaming.
- **Client Tools**: AI can automatically execute commands on your live Supabase database like `getLowStockItems()` or `getDailyRevenue()`.

### 📦 Core Modules
- **Omnichannel Growth**: Track GMV, AOV, and calculate growth across Online, Marketplace, POS, and Social channels.
- **Inventory Sync**: Real-time cross-platform SKU synchronization, low-stock reorder queues, and supplier status logs.
- **Financial Calendar**: Track upcoming tax dues, payroll, supplier invoices, and SaaS subscription milestones in a beautiful grid UI.
- **Smart Alerts**: Customizable notification rules (in-app vs email) for critical events like revenue drops, order spikes, or VIP purchases.

### 🎨 Next-Generation UI/UX
- **Dynamic Theme Engine**: Switch between 5 premium themes (Claude Classic, Charcoal, Serene Clay, Deep Amethyst, Slate Grey).
- **Custom Accent Colors & Layouts**: Persisted entirely via CSS Variables and `localStorage`.
- **Command Palette**: Press `CMD/CTRL + K` to instantly jump between core RetailOS workflows and analytics.
- **Mobile First**: Fully responsive layout that automatically transitions into a mobile bottom-tab bar on smaller screens.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, React, TailwindCSS, Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Voice AI**: `@elevenlabs/react` conversational widget + OpenAI GPT-4 Turbo
- **Database**: Supabase / PostgreSQL
- **ORM**: Prisma

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nathan09851/RETAILOS.git
   cd RETAILOS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file referencing your Supabase and AI keys:
   ```env
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
   ELEVENLABS_API_KEY=your_elevenlabs_key
   OPENAI_API_KEY=your_openai_key
   DATABASE_URL=your_supabase_pg_url
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard!

---
*Built to redefine the retail operations experience.*
