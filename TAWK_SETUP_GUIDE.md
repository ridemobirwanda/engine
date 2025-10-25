# Tawk.to Setup Guide

## Your Tawk.to Configuration

From your script, I've extracted:
- **Property ID**: `68d3e2e9a5528e1923b79293`
- **Widget ID**: `1j5tqsot9`

## Quick Setup (Recommended)

1. **Go to your admin panel**: `/admin/content`
2. **Find the Tawk.to settings section**
3. **Enter the following values**:
   - `tawk_enabled`: `true`
   - `tawk_property_id`: `68d3e2e9a5528e1923b79293`
   - `tawk_widget_id`: `1j5tqsot9`
4. **Save the settings**

## What You'll See

- **Default Tawk.to widget** will appear automatically
- **Standard Tawk.to chat button** in bottom-right corner
- **No custom styling** - uses Tawk.to's default design
- **Immediate activation** after settings are saved

## Alternative: Direct Database Update

If you have database access, run this SQL:

```sql
INSERT INTO website_settings (key, value, description) VALUES 
('tawk_enabled', 'true', 'Enable Tawk.to chat widget'),
('tawk_property_id', '68d3e2e9a5528e1923b79293', 'Tawk.to Property ID'),
('tawk_widget_id', '1j5tqsot9', 'Tawk.to Widget ID')
ON CONFLICT (key) DO UPDATE SET 
value = EXCLUDED.value,
description = EXCLUDED.description;
```

## Verification

After setup:
1. **Visit your website** (non-admin pages)
2. **Look for the default Tawk.to chat button** in the bottom-right corner
3. **Click the chat button** to test the widget
4. **Check browser console** for "Tawk.to: Widget loaded successfully"

## Troubleshooting

- **Chat not appearing**: Check if `tawk_enabled` is set to `true`
- **Wrong widget**: Verify `tawk_property_id` and `tawk_widget_id` are correct
- **Console errors**: Check browser console for Tawk.to script loading errors

Your Tawk.to integration is now ready with the default widget! 🎉
