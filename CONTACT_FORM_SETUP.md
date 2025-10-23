# Contact Form Setup Guide

Your contact form is now ready to use with either **Formspree** or **EmailJS**. Choose one of the options below:

---

## Option 1: Formspree (Recommended - Easiest)

Formspree is the simplest option and perfect for personal websites.

### Setup Steps:

1. **Sign up for Formspree**
   - Go to [https://formspree.io/](https://formspree.io/)
   - Create a free account (allows 50 submissions/month)

2. **Create a New Form**
   - After logging in, click "New Project" or "New Form"
   - Name your form (e.g., "Contact Form")
   - Set the email to receive submissions: `Ahmed_murayshid@hotmail.com`
   - Copy the **Form ID** (looks like: `xwkgpzjr`)

3. **Update Your Website**
   - Open `assets/js/main.js`
   - Find the `CONTACT_CONFIG` section at the top
   - Replace `YOUR_FORM_ID` with your actual form ID:
   ```javascript
   const CONTACT_CONFIG = {
     service: 'formspree',
     formspree: {
       formId: 'xwkgpzjr' // Replace with your form ID
     },
     // ...
   };
   ```

4. **Deploy and Test**
   - Save the file and deploy your website
   - Test the contact form - you should receive emails at Ahmed_murayshid@hotmail.com

### Free Plan Limits:
- 50 submissions per month
- Email notifications
- Spam filtering
- File uploads (optional)

---

## Option 2: EmailJS (More Features)

EmailJS offers more customization options and template support.

### Setup Steps:

1. **Sign up for EmailJS**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create a free account (allows 200 emails/month)

2. **Add an Email Service**
   - In the dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (e.g., Gmail, Outlook)
   - Follow the setup instructions
   - Copy the **Service ID**

3. **Create an Email Template**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use these variables in your template:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{message}}` - Message content
     - `{{to_email}}` - Your email (Ahmed_murayshid@hotmail.com)

   Example template:
   ```
   New message from {{from_name}} ({{from_email}}):

   {{message}}
   ```
   - Save and copy the **Template ID**

4. **Get Your User ID**
   - Go to "Account" → "General"
   - Copy your **User ID** (also called Public Key)

5. **Update Your Website**
   - Open `assets/js/main.js`
   - Find the `CONTACT_CONFIG` section
   - Update the configuration:
   ```javascript
   const CONTACT_CONFIG = {
     service: 'emailjs', // Change this to 'emailjs'
     formspree: {
       formId: 'YOUR_FORM_ID'
     },
     emailjs: {
       userId: 'YOUR_USER_ID',      // Replace with your User ID
       serviceId: 'YOUR_SERVICE_ID', // Replace with your Service ID
       templateId: 'YOUR_TEMPLATE_ID' // Replace with your Template ID
     }
   };
   ```

6. **Deploy and Test**
   - Save the file and deploy your website
   - Test the contact form

### Free Plan Limits:
- 200 emails per month
- Custom email templates
- Multiple email services
- Analytics dashboard

---

## Testing Your Contact Form

After setup, test your contact form:

1. Fill out all fields (name, email, message)
2. Click "Send Message"
3. You should see a loading spinner
4. Success message: "✓ Message sent successfully! I'll get back to you soon."
5. Check your email at Ahmed_murayshid@hotmail.com

If you see an error message, check:
- Your form ID/credentials are correct
- You've saved the `main.js` file
- Your website has been deployed with the latest changes

---

## Which One Should You Choose?

### Choose **Formspree** if:
- ✓ You want the simplest setup (5 minutes)
- ✓ You need basic email notifications
- ✓ You get fewer than 50 messages per month

### Choose **EmailJS** if:
- ✓ You want customizable email templates
- ✓ You need more than 50 submissions per month
- ✓ You want analytics and tracking
- ✓ You want to use multiple email services

---

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify your credentials are correct in `main.js`
3. Make sure you've deployed the latest version of your website
4. Check your spam folder for test emails

Both services have excellent documentation:
- Formspree docs: https://help.formspree.io/
- EmailJS docs: https://www.emailjs.com/docs/
