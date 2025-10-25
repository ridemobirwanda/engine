-- Restore website settings
INSERT IGNORE INTO website_settings (`key`, `value`, description) VALUES
('tawk_property_id', '68d3e2e9a5528e1923b79293', 'Tawk.to property ID'),
('google_ads_enabled', 'true', 'Enable Google Ads tracking and conversion measurement'),
('seo_meta_title', 'Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier', 'Default meta title for SEO'),
('social_instagram', '', 'Instagram profile URL'),
('site_name', 'EngineCore', 'Website name'),
('site_email', 'support@enginecore.com', 'Contact email'),
('site_phone', '+357 96115404', 'Contact phone'),
('whatsapp_number', '+35796115404', 'WhatsApp contact number'),
('whatsapp_enabled', 'true', 'Enable WhatsApp chat widget'),
('stripe_publishable_key', '', 'Stripe publishable API key'),
('shipping_enabled', 'true', 'Enable shipping options'),
('currency_code', 'USD', 'Default currency code'),
('currency_symbol', '$', 'Currency symbol');

