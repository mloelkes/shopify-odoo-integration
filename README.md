# Shopify → Odoo CRM Integration Engine

## Overview

This project demonstrates a production-style integration between a Shopify store and Odoo CRM.  

The goal is to automatically synchronize Shopify customer and order data into Odoo, enrich it with business logic and automation, and maintain data integrity across systems.

This repository simulates a real-world SME setup where e-commerce operations (Shopify) are connected to internal CRM workflows (Odoo).

---

## Business Problem

Many Shopify-based businesses struggle with:

- Manual CRM data entry
- Inconsistent customer records
- Lack of automated follow-up workflows
- Missing integration between sales and CRM systems
- Poor data integrity across tools

This system solves these problems by:

- Automatically syncing Shopify orders to Odoo
- Creating/updating customer records
- Preventing duplicates
- Logging sync events
- Enabling workflow automation
- Adding AI-based customer insights (planned)

---

## Architecture Overview

### High-Level Flow

Shopify (Order Created Webhook)  
↓  
Node.js Integration Service  
↓  
Odoo CRM (Contacts + CRM Module)  

Optional Extensions:
- Workflow automation
- AI enrichment
- Reporting dashboard

---

## System Components

### 1. Shopify Dev Store
- Sends order webhooks
- Provides Admin API access

### 2. Integration Service (Node.js)
- Receives and verifies Shopify webhooks
- Handles deduplication logic
- Syncs data to Odoo
- Logs events and errors
- Manages automation logic

### 3. Odoo (CRM)
- Stores customer data (`res.partner`)
- Creates leads/opportunities (optional)
- Maintains internal activities and notes

---

## Tech Stack

**Backend Integration Service**
- Node.js
- Express
- Odoo XML-RPC / JSON-RPC
- Webhook HMAC verification

**CRM**
- Odoo Community (Docker-based setup)

**Automation (Planned)**
- Zapier / Make
- AI integration (OpenAI API)

---

## Architecture Diagram

> Diagram placeholder

Planned diagram will illustrate:

Shopify → Webhook → Node Integration Layer → Odoo CRM

---

## Status

Work in progress – active development.

