# Architecture Diagram

(Placeholder)

High-Level Flow:

Shopify (orders/create webhook)  
        ↓  
Node Integration Service (Express)  
        ↓  
Odoo XML-RPC  
        ↓  
res.partner (Contacts)  
crm.lead (Optional)