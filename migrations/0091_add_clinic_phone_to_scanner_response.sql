-- Migration 0091: Add clinic_phone to scanner_response
-- Stores clinic phone number for share-verification feature.

ALTER TABLE "scanner_response" ADD "clinic_phone" text;
