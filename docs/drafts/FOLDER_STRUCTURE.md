# Project Folder Structure

## Overview
This document defines the folder tree organization for the project.

```
maenews/
├── services/
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── controllers/
│   │   │   └── services/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── api/
│   │   ├── v1/
│   │   └── v2/
│   │
│   └── shared/
│       ├── utilities/
│       ├── constants/
│       └── types/
│
├── config/
│   ├── dev.env
│   ├── prod.env
│   └── test.env
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── guides/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
│
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── test.sh
│
├── .github/
│   └── workflows/
│
├── node_modules/
├── .gitignore
├── package.json
└── README.md
```

## Folder Descriptions

### `/services`
Main application services container.

- **`frontend/`** - Client-side application
- **`backend/`** - Server-side application
- **`api/`** - API route definitions (optional, can be in backend)
- **`shared/`** - Shared code, utilities, types used across services

### `/config`
Configuration files for different environments.

### `/docs`
Documentation including architecture diagrams, API specs, and guides.

### `/infrastructure`
Infrastructure-as-code and deployment configurations (Docker, K8s, Terraform).

### `/scripts`
Automation scripts for builds, deployments, and testing.

### `/.github`
GitHub-specific configurations (CI/CD workflows, templates).

---

## Customization Notes
Modify this structure based on your specific needs:
- Add/remove services as needed
- Adjust depth based on project complexity
- Consider monorepo vs. separate repos per service
