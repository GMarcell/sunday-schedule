# Church Multimedia Scheduler

> An automated scheduling tool for church multimedia teams — manage members, define roles, set service dates, and generate conflict-free monthly schedules in seconds.

![License](https://img.shields.io/badge/license-MIT-blue)
![Made for Churches](https://img.shields.io/badge/made%20for-churches-purple)

## The Problem It Solves

Coordinating multimedia teams for weekly church services — who runs the projector, who handles sound, who livestreams — often relies on group chats, manual spreadsheets, and last-minute scrambles. This tool eliminates all of that with a single automated system.

## Features

- **Member Management** — Add and manage all multimedia team members, including availability and contact info
- **Role Assignment** — Define roles (sound, projection, livestream, etc.) and assign which members are qualified for each
- **Service Planning** — Create recurring or one-off service events with the roles required for each type
- **Auto-Schedule Generator** — Automatically build a full month's schedule, distributing workload fairly across all members

## How It Works

1. Add your team members
2. Define the roles in your multimedia ministry
3. Set your service dates for the month
4. Hit generate — the scheduler assigns members to each role automatically
5. Share the schedule with your team

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/church-multimedia-scheduler
cd church-multimedia-scheduler
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

## Try the Demo

A live demo is available. Use the guest credentials to explore all features:

- **Email:** demo@example.com
- **Password:** demo1234

> Demo data resets every 24 hours. Please do not enter real personal information.

## Built With

- React
- Supabase
- Tailwind CSS
- Node.js

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
