# IDE-MPS
Industrial Design Engineering | Making&amp; Prototyping Skills


Make-It! Prototyping Rounds — Code Repository

This repository contains all code, assets, and documentation for my Making & Prototyping Skills (IDEM221) course work. It is organized per prototyping round with a final, polished recipe at the end.

Course context: self-directed, four annotated prototyping rounds + a final improved/new tutorial; submissions and community cookbook live on Notion; personal reflection via Brightspace; communication via Teams; assessment is pass/fail. 

MnPS-Course_Manual_25-26

🎯 Learning Focus (personal)

I’m using this course to deepen skills that connect creative making with data-driven, adaptive systems:

Front-end (web) development — creative coding and clarity in communicating prototype purpose (likely React).

Build a simple Neural Network — e.g., image recognition from scratch/re-creation.

Relational Databases — design + use (e.g., PostgreSQL) to support data-grounded prototypes.

Higher-level Digital Prototyping — orchestration (MCP), light agents/automation (n8n/Make/Zapier).
These goals frame how each round is chosen and documented. 

Reflection M&PS

📦 Repository Structure
make-it-prototyping/
├─ rounds/
│  ├─ round-01-<short-title>/
│  │  ├─ README.md            # goals, recipe link/source, what/why/how
│  │  ├─ src/                 # code for the prototype
│  │  ├─ data/                # (optional) sample or generated datasets
│  │  ├─ assets/              # images/gifs/screens, diagrams
│  │  └─ environment/         # .env.example, docker-compose, etc.
│  ├─ round-02-<short-title>/
│  ├─ round-03-<short-title>/
│  └─ round-04-<short-title>/
├─ final-recipe/
│  ├─ README.md                # polished tutorial; ready for the cookbook
│  ├─ src/
│  ├─ assets/
│  └─ environment/
├─ docs/
│  ├─ personal-reflection.md   # Brightspace reflection export/notes
│  ├─ notion-links.md          # links to annotated recipes in Notion
│  └─ changelog.md             # dated progress notes
├─ scripts/                    # helper scripts (setup, lint, data prep)
├─ .editorconfig
├─ .gitignore
├─ LICENSE
└─ README.md                   # (this file)

🧭 How to Use This Repo
1) Setup (per project)

Each round-* and the final-recipe folder contains its own README.md with:

What you’ll build and why it matters

Recipe source (IDE Cookbook or external tutorial)

Prereqs & tools (Node/Python/postgres/etc.)

Quick start (install, run, test, build)

Evidence (screens/gifs), reflection, and next steps

The course encourages following recipes (internal or external), annotating the process, and contributing back to the IDE Prototyping Cookbook. If something isn’t finished by a deadline, a work-in-progress is acceptable and can be updated later. 

MnPS-Course_Manual_25-26

2) Environment

Put secrets in environment/.env files (never commit secrets).

If needed, include Docker (docker-compose.yml) for services like Postgres or vector DBs.

3) Data

Store small sample datasets in data/ (or link to sources).

Add a DATASET.md describing schema, size, license, and acquisition steps.

🧪 Round Template

Each round subfolder should include the following sections in its README.md:

Overview — What skill/tech is targeted? How does it support my learning goals? 

Reflection M&PS

Recipe Source — Link to the IDE Cookbook page or external tutorial and note any adaptations. 

MnPS-Course_Manual_25-26

Setup & Run