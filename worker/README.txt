CONTACT FORM — HOW TO SWITCH IT ON
==================================

The website has a contact form built in, but it stays hidden until it has
somewhere to send enquiries. Until then visitors get the email link, so
nothing is broken while you set this up.

You do this once. About fifteen minutes.


WHAT YOU NEED
-------------
- The Cloudflare account that already holds marvellousminisuk.co.uk
- A free Resend account (resend.com) to actually deliver the email


STEP 1 — GET A SENDING KEY
--------------------------
1. Sign up at resend.com
2. Add marvellousminisuk.co.uk as a domain and follow their DNS steps.
   The records go in the same Cloudflare DNS page as everything else.
3. Create an API key and copy it somewhere safe for the next step.

Sending from your own domain is what stops the enquiries landing in spam.


STEP 2 — CREATE THE WORKER
--------------------------
1. Cloudflare dashboard > Compute (Workers) > Create > Start from Hello World
2. Name it: marvellous-minis-contact
3. Click Deploy, then Edit code
4. Delete everything in the editor and paste in contact-worker.js
   from this folder
5. Deploy


STEP 3 — ADD THE SETTINGS
-------------------------
Worker > Settings > Variables and Secrets. Add three:

   RESEND_API_KEY   (mark as Secret)   the key from step 1
   MAIL_TO          (plain text)       where enquiries should arrive
   MAIL_FROM        (plain text)       e.g. enquiries@marvellousminisuk.co.uk

MAIL_FROM has to be on the domain you verified with Resend.
Deploy again after saving.


STEP 4 — POINT THE WEBSITE AT IT
--------------------------------
The Worker has an address like:

   https://marvellous-minis-contact.<your-account>.workers.dev

Open simple-edit.js, find CONTACT_ENDPOINT near the bottom of the editable
section, and paste that address between the quote marks:

   const CONTACT_ENDPOINT = "https://marvellous-minis-contact.xxx.workers.dev";

Commit the change. The form appears on the site within a couple of minutes.


STEP 5 — TEST IT
----------------
Send yourself an enquiry through the live form and check it arrives.
Reply to it — the reply should go to whoever filled in the form, not to you.


WHAT THE WORKER DOES ABOUT SPAM
-------------------------------
- Only accepts posts coming from your own site, so the address cannot be
  used to send mail to anyone else
- Carries a hidden field that people never see but bots fill in; anything
  that fills it is silently discarded
- Caps the length of every field

If enquiries ever start getting spammy, turn on Cloudflare Turnstile and
say so — it needs a small change here and in the form.
