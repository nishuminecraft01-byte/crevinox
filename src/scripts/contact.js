/**
 * CREVINOX — Contact Form & Communication Channels Controller
 * 
 * Provides interactive pill selectors for project type and budget,
 * real-time validation, copy-email functionality, and transparent inquiry handling.
 */

import { trackEvent } from './analytics.js';
import { BUSINESS_CONFIG } from '../config/business.js';

export function initContactForm() {
  const form = document.getElementById('project-inquiry-form');
  const projectTypePills = document.querySelectorAll('.pill-project-type');
  const budgetPills = document.querySelectorAll('.pill-budget');
  const statusAlert = document.getElementById('form-status-alert');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  let selectedProjectType = 'Website Design & Development';
  let selectedBudget = '$3,000 – $7,000';

  // 1. Project Type Selector
  projectTypePills.forEach(pill => {
    pill.addEventListener('click', () => {
      projectTypePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedProjectType = pill.getAttribute('data-value');
    });
  });

  // 2. Budget Selector
  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedBudget = pill.getAttribute('data-value');
    });
  });

  // 3. Copy Email Handlers
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetEmail = btn.getAttribute('data-email') || BUSINESS_CONFIG.contact.email;
      try {
        await navigator.clipboard.writeText(targetEmail);
        const originalText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `✓ Copied`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalText;
        }, 2200);
        trackEvent('copy_email_click', {
          event_category: 'lead_engagement',
          email: targetEmail
        });
      } catch (err) {
        // Fallback
        window.location.href = `mailto:${targetEmail}`;
      }
    });
  });

  // 4. Form Submit Handler with Anti-Spam Honeypot & Rate-Limiting Protection
  let lastSubmitTime = 0;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot Protection: Bots fill hidden trap field
      const honeypot = form.querySelector('input[name="_studio_trap"]')?.value;
      if (honeypot) {
        // Silently deflect spam bots
        showStatus('Inquiry submitted successfully.', 'success');
        return;
      }

      // Rate Limiting Protection: Prevent form flooding (8-second cooldown)
      const now = Date.now();
      if (now - lastSubmitTime < 8000) {
        showStatus('Please wait a moment before sending another inquiry.', 'error');
        return;
      }

      const rawName = form.querySelector('#client-name')?.value.trim() || '';
      const rawEmail = form.querySelector('#client-email')?.value.trim() || '';
      const rawBusiness = form.querySelector('#client-business')?.value.trim() || 'Not specified';
      const rawDetails = form.querySelector('#client-details')?.value.trim() || '';

      // Input sanitization: Strip potentially dangerous HTML/script tags
      const sanitize = (str) => str.replace(/<[^>]*>?/gm, '');
      const name = sanitize(rawName);
      const email = sanitize(rawEmail);
      const business = sanitize(rawBusiness);
      const details = sanitize(rawDetails);

      if (!name || !email || !details) {
        showStatus('Please fill in all required fields (Name, Email, and Project Details).', 'error');
        return;
      }

      // Strict email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please provide a valid email address.', 'error');
        return;
      }

      lastSubmitTime = now;

      // Format clean inquiry payload
      const subject = encodeURIComponent(`CREVINOX Project Inquiry: ${name} — ${business}`);
      const body = encodeURIComponent(
        `Client Name: ${name}\n` +
        `Email: ${email}\n` +
        `Business / Organization: ${business}\n` +
        `Project Type: ${selectedProjectType}\n` +
        `Estimated Budget: ${selectedBudget}\n\n` +
        `Project Details:\n${details}\n\n` +
        `-- Sent via CREVINOX Project Inquiry Portal`
      );

      // Trigger user's mail client directly to official business email
      const targetEmail = BUSINESS_CONFIG.contact.email;
      const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      
      showStatus(
        `✓ Opening your email client to send your inquiry directly to ${targetEmail}. You can also connect with us on Instagram @crevinox.`,
        'success'
      );

      // Track conversion in telemetry
      trackEvent('contact_form_submission', {
        project_type: selectedProjectType,
        budget_range: selectedBudget
      });
      trackEvent('project_inquiry', {
        project_type: selectedProjectType
      });

      // Dispatch mailto
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  function showStatus(message, type) {
    if (!statusAlert) return;
    statusAlert.textContent = message;
    statusAlert.className = `form-status-alert ${type}`;
    statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
