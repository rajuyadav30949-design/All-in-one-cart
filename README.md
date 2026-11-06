# ALL-IN-ONE-CART

Vite website starter for customer product-link order requests.

## Files
- `src/main.js` starts the website.
- `src/app.js` contains the page and order form.
- `src/style.css` contains responsive styling.
- `src/supabase.js` connects to Supabase using Vite environment variables.
- `supabase/schema.sql` creates the order table and basic customer insert policy.

## Local setup
1. Install Node.js.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase Project URL and **Publishable** key to `.env.local`.
5. Run `npm run dev`.

## Vercel setup
Add these Environment Variables in Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_WHATSAPP_NUMBER` (optional; digits only, including country code)

Then redeploy.

Never put a Supabase Secret/service-role key in frontend code.

## Database
Run `supabase/schema.sql` in the Supabase SQL Editor. The included insert policy allows anonymous order submissions. Before collecting real customer information, review and strengthen abuse protection, privacy controls, and database policies. This starter does not include customer login, order tracking, or a secured admin panel.
