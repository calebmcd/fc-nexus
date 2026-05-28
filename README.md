# Faithful Companion Nexus (Monorepo)

This repository contains the architecture for the FC Master Terminal ecosystem. It is structured as a monorepo to facilitate code sharing across multiple deployment targets.

## 🏗️ Repository Architecture

* **/apps/userscript/**: The production-ready legacy Tampermonkey script (v13+). Contains the core logic for Rapid Check-In and Communal Cremation routing.
* **/apps/extension/**: (WIP) The Manifest V3 React + TypeScript browser extension port. 
* **/apps/desktop/**: (WIP) The native desktop companion app built via Wails (Go + React). 
* **/packages/shared/**: Shared business logic, formatting dictionaries, and data models utilized across all applications.