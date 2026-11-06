/**
 * CREVINOX — Contact Form & Communication Channels Controller
 * 
 * Provides interactive pill selectors for project type,
 * real-time validation, direct-to-inbox dispatch via FormSubmit,
 * seamless mailto backup, and copy-email functionality.
 */

import { trackEvent } from './analytics.js';
import { BUSINESS_CONFIG } from '../config/business.js';

export function initContactForm() {
  const form = document.getElementById('project-inquiry-form');
  const projectTypePills = document.querySelectorAll('.pill-project-type');
  const statusAlert = document.getElementById('form-status-alert');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitText = submitBtn?.querySelector('.submit-btn-text');

  let selectedProjectType = 'Website Design & Development';

  // 1. Project Type Selector
  projectTypePills.forEach(pill => {
    pill.addEventListener('click', () => {
      projectTypePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedProjectType = pill.getAttribute('data-value') || 'Website Design & Development';
    });
  });

  // 2. Copy Email Handlers
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
        window.location.href = `mailto:${targetEmail}`;
      }
    });
  });

  // 3. Form Submit Handler with Direct Email Dispatch & Anti-Spam
  let lastSubmitTime = 0;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot Protection: Bots fill hidden trap field
      const honeypot = form.querySelector('input[name="_studio_trap"]')?.value;
      if (honeypot) {
        showStatusCard('success', 'Inquiry received. Thank you.', 'Our studio will review your submission shortly.');
        return;
      }

      // Rate Limiting Protection (4-second cooldown)
      const now = Date.now();
      if (now - lastSubmitTime < 4000) {
        showError('Please wait a moment before sending another inquiry.');
        return;
      }

      const rawName = form.querySelector('#client-name')?.value.trim() || '';
      const rawEmail = form.querySelector('#client-email')?.value.trim() || '';
      const rawBusiness = form.querySelector('#client-business')?.value.trim() || '';
      const rawPhone = form.querySelector('#client-phone')?.value.trim() || '';
      const rawDetails = form.querySelector('#client-details')?.value.trim() || '';

      // Input sanitization
      const sanitize = (str) => str.replace(/<[^>]*>?/gm, '');
      const name = sanitize(rawName);
      const email = sanitize(rawEmail);
      const business = sanitize(rawBusiness) || 'Not specified';
      const phone = sanitize(rawPhone) || 'Not provided';
      const details = sanitize(rawDetails);

      if (!name || !email || !details) {
        showError('Please fill in all required fields (Your Name, Email, and Project Details).');
        return;
      }

      // Strict email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError('Please provide a valid email address so we can reply to you.');
        return;
      }

      lastSubmitTime = now;

      // Prepare mailto fallback URL
      const targetEmail = BUSINESS_CONFIG.contact.email;
      const subject = encodeURIComponent(`CREVINOX Project Inquiry: ${name} — ${business}`);
      const body = encodeURIComponent(
        `Client Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone / WhatsApp: ${phone}\n` +
        `Business / Organization: ${business}\n` +
        `Project Type: ${selectedProjectType}\n\n` +
        `Project Details & Scope:\n${details}\n\n` +
        `-- Sent via CREVINOX Project Inquiry Portal`
      );
      const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

      // Set Loading UI State
      if (submitBtn && submitText) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        submitText.textContent = 'DISPATCHING TO STUDIO...';
      }

      // Hide previous status alerts
      if (statusAlert) {
        statusAlert.style.display = 'none';
        statusAlert.innerHTML = '';
      }

      // Try Direct AJAX Submission via FormSubmit to crewinox@gmail.com
      let isSuccess = false;
      try {
        const payload = {
          name: name,
          email: email,
          phone: phone,
          business: business,
          project_type: selectedProjectType,
          details: details,
          _subject: `New CREVINOX Project Inquiry: ${name} (${business})`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        };

        const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          isSuccess = true;
        }
      } catch (err) {
        console.warn('Direct FormSubmit dispatch exception:', err);
      }

      // Reset Button State
      if (submitBtn && submitText) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }

      if (isSuccess) {
        // Success: Direct email delivered to crewinox@gmail.com
        if (submitBtn && submitText) {
          submitBtn.classList.add('is-success');
          submitText.textContent = 'INQUIRY DISPATCHED ✓';
          setTimeout(() => {
            submitBtn.classList.remove('is-success');
            submitText.textContent = 'SEND PROJECT INQUIRY';
          }, 6000);
        }

        form.reset();
        // Restore default selected pill
        projectTypePills.forEach((p, idx) => {
          p.classList.toggle('selected', idx === 0);
        });
        selectedProjectType = 'Website Design & Development';

        if (statusAlert) {
          statusAlert.style.display = 'block';
          statusAlert.className = 'form-status-alert';
          statusAlert.innerHTML = `
            <div class="inquiry-success-card">
              <div class="success-check-circle" aria-hidden="true">✓</div>
              <div class="success-body">
                <h4 class="success-title">Project Inquiry Received</h4>
                <p class="success-message">
                  Thank you, <strong>${escapeHtml(name)}</strong>. Your project brief has been dispatched directly to our studio inbox (<strong>${targetEmail}</strong>). We review every submission and will get back to you within 24 hours.
                </p>
                <div class="success-direct-actions">
                  <a href="${mailtoUrl}" class="btn-direct-email">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                    Send Additional Notes via Email ↗
                  </a>
                  <button type="button" class="btn-new-inquiry" id="btn-new-inquiry-trigger">Submit another project</button>
                </div>
              </div>
            </div>
          `;

          const resetTrigger = document.getElementById('btn-new-inquiry-trigger');
          if (resetTrigger) {
            resetTrigger.addEventListener('click', () => {
              statusAlert.style.display = 'none';
              statusAlert.innerHTML = '';
            });
          }
        }

        trackEvent('contact_form_submission', {
          event_category: 'lead_engagement',
          project_type: selectedProjectType
        });

      } else {
        // Fallback: If network or adblocker blocks FormSubmit, launch mail client directly
        if (submitBtn && submitText) {
          submitText.textContent = 'SEND PROJECT INQUIRY';
        }

        if (statusAlert) {
          statusAlert.style.display = 'block';
          statusAlert.className = 'form-status-alert';
          statusAlert.innerHTML = `
            <div class="inquiry-fallback-card">
              <div class="fallback-icon-wrap" aria-hidden="true">✉</div>
              <div class="fallback-body">
                <h4 class="fallback-title">Direct Studio Email Prepared</h4>
                <p class="fallback-message">
                  Your project brief has been formatted. Click below to deliver it directly to <strong>${targetEmail}</strong> via your email app:
                </p>
                <div class="success-direct-actions">
                  <a href="${mailtoUrl}" class="btn btn-primary" style="padding: 0.65rem 1.35rem; font-size: 0.86rem; text-decoration: none;">
                    Deliver to ${targetEmail} ↗
                  </a>
                </div>
              </div>
            </div>
          `;
        }

        // Auto-trigger mailto
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 350);
      }

      if (statusAlert) {
        statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function showError(message) {
    if (!statusAlert) return;
    statusAlert.style.display = 'block';
    statusAlert.className = 'form-status-alert error';
    statusAlert.textContent = message;
    statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showStatusCard(type, title, desc) {
    if (!statusAlert) return;
    statusAlert.style.display = 'block';
    statusAlert.className = `form-status-alert ${type}`;
    statusAlert.innerHTML = `<strong>${title}</strong> ${desc}`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
