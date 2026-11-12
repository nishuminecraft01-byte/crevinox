/**
 * CREVINOX — Working Contact Form & Direct Email Controller
 *
 * Features:
 * - Client-side field validation for Name, Email, Service, and Project Details
 * - Direct asynchronous dispatch via FormSubmit AJAX endpoint to crewinox@gmail.com
 * - Anti-spam honeypot (_honey), duplicate-submission lock, and cooldown guard
 * - Loading spinner, confirmed success state + reset, and retryable error feedback
 */

import { trackEvent } from './analytics.js';
import { BUSINESS_CONFIG } from '../config/business.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBMIT_COOLDOWN_MS = 5000;

export function initContactForm() {
  const form = document.getElementById('project-inquiry-form');
  const statusAlert = document.getElementById('form-status-alert');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitText = submitBtn?.querySelector('.submit-btn-text');
  const defaultBtnLabel = submitText ? submitText.textContent.trim() : 'TRANSMIT PROJECT INQUIRY';

  const targetEmail = BUSINESS_CONFIG.contact.email || 'crewinox@gmail.com';
  const endpointUrl = `https://formsubmit.co/ajax/${targetEmail}`;

  setupCopyEmailButtons(targetEmail);

  if (!form || !submitBtn) return;

  const fields = {
    name: {
      input: document.getElementById('client-name'),
      error: document.getElementById('error-name')
    },
    email: {
      input: document.getElementById('client-email'),
      error: document.getElementById('error-email')
    },
    phone: {
      input: document.getElementById('client-phone')
    },
    business: {
      input: document.getElementById('client-business')
    },
    service: {
      input: document.getElementById('client-service'),
      error: document.getElementById('error-service')
    },
    budget: {
      input: document.getElementById('client-budget')
    },
    details: {
      input: document.getElementById('client-details'),
      error: document.getElementById('error-details')
    },
    honeypot: {
      input: document.getElementById('hp-website')
    }
  };

  let isSubmitting = false;
  let lastSuccessTime = 0;

  // Live error clearing / re-validation once a field has been marked invalid
  const requiredKeys = ['name', 'email', 'service', 'details'];
  requiredKeys.forEach((key) => {
    const field = fields[key];
    if (!field?.input) return;
    const eventName = field.input.tagName === 'SELECT' ? 'change' : 'input';
    field.input.addEventListener(eventName, () => {
      if (field.input.classList.contains('is-invalid')) {
        validateSingleField(key, field);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleSubmission();
  });

  async function handleSubmission() {
    if (isSubmitting) return;

    // Anti-spam honeypot: silent abort without dispatching external email
    const honeypotVal = fields.honeypot.input?.value.trim() || '';
    if (honeypotVal) {
      form.reset();
      return;
    }

    const now = Date.now();
    if (lastSuccessTime && now - lastSuccessTime < SUBMIT_COOLDOWN_MS) {
      renderErrorCard('Please wait a few seconds before sending another inquiry.');
      return;
    }

    const validation = validateAllFields(fields);
    if (!validation.isValid) {
      clearStatusAlert();
      validation.firstInvalidEl?.focus();
      return;
    }

    isSubmitting = true;
    setLoadingState(true);
    clearStatusAlert();

    const payload = {
      name: validation.values.name,
      email: validation.values.email,
      phone: validation.values.phone || 'Not provided',
      business: validation.values.business || 'Not specified',
      service: validation.values.service,
      budget: validation.values.budget || 'Not specified',
      message: validation.values.details,
      _subject: 'New Project Inquiry — CREVINOX',
      _replyto: validation.values.email,
      _template: 'table',
      _honey: ''
    };

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      const confirmed = response.ok && result && (result.success === true || result.success === 'true');

      if (!confirmed) {
        const serverMsg = typeof result?.message === 'string' && result.message.trim()
          ? result.message.trim()
          : `Submission could not be completed (status ${response.status}).`;
        throw new Error(serverMsg);
      }

      lastSuccessTime = Date.now();
      form.reset();
      if (fields.service.input) {
        fields.service.input.selectedIndex = 0;
      }
      clearAllFieldErrors(fields);
      renderSuccessCard();

      trackEvent('contact_form_submission', {
        event_category: 'lead_engagement',
        service: payload.service
      });
    } catch (err) {
      const reason = err instanceof Error && err.message ? err.message : 'Network error while contacting the mail service.';
      renderErrorCard(
        `Unable to send your inquiry automatically right now (${reason}). Please retry below or email us directly at ${targetEmail}.`
      );
    } finally {
      isSubmitting = false;
      setLoadingState(false);
    }
  }

  function setLoadingState(loading) {
    submitBtn.disabled = loading;
    submitBtn.setAttribute('aria-busy', String(loading));
    submitBtn.classList.toggle('is-loading', loading);
    if (submitText) {
      submitText.textContent = loading ? 'TRANSMITTING INQUIRY...' : defaultBtnLabel;
    }
  }

  function clearStatusAlert() {
    if (!statusAlert) return;
    statusAlert.className = 'form-status-alert';
    statusAlert.innerHTML = '';
  }

  function renderSuccessCard() {
    if (!statusAlert) return;
    statusAlert.className = 'form-status-alert is-visible';
    statusAlert.innerHTML = `
      <div class="inquiry-success-card">
        <div class="success-icon-circle" aria-hidden="true">✓</div>
        <div class="status-card-body">
          <h4>Thank you for contacting CREVINOX!</h4>
          <p>Your project inquiry has been received. We'll get back to you soon.</p>
          <button type="button" class="btn-new-inquiry" id="dismiss-success-btn">Dismiss confirmation</button>
        </div>
      </div>
    `;

    document.getElementById('dismiss-success-btn')?.addEventListener('click', () => {
      clearStatusAlert();
    });
    statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderErrorCard(message) {
    if (!statusAlert) return;
    statusAlert.className = 'form-status-alert is-visible';
    statusAlert.innerHTML = `
      <div class="inquiry-error-card">
        <div class="inquiry-error-header">
          <div class="error-icon-circle" aria-hidden="true">!</div>
          <h4>Inquiry Could Not Be Sent</h4>
        </div>
        <p>${escapeHtml(message)}</p>
        <div class="inquiry-error-actions">
          <button type="button" class="btn-retry-submit" id="retry-submit-btn">Try Again</button>
          <a href="mailto:${encodeURIComponent(targetEmail)}" class="error-direct-email-link">
            Email ${escapeHtml(targetEmail)} directly ↗
          </a>
        </div>
      </div>
    `;

    document.getElementById('retry-submit-btn')?.addEventListener('click', () => {
      handleSubmission();
    });
    statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function setupCopyEmailButtons(defaultEmail) {
  document.querySelectorAll('.copy-email-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetEmail = btn.getAttribute('data-email') || defaultEmail;
      try {
        await navigator.clipboard.writeText(targetEmail);
        const originalHtml = btn.innerHTML;
        btn.classList.add('copied');
        btn.textContent = '✓ Copied';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalHtml;
        }, 2200);
        trackEvent('copy_email_click', {
          event_category: 'lead_engagement',
          email: targetEmail
        });
      } catch {
        window.location.href = `mailto:${targetEmail}`;
      }
    });
  });
}

function sanitizeValue(raw) {
  return raw.replace(/<[^>]*>?/gm, '').trim();
}

function validateSingleField(key, field) {
  if (!field?.input) return '';
  const value = sanitizeValue(field.input.value || '');
  let errorMsg = '';

  if (key === 'name' && !value) {
    errorMsg = 'Please enter your full name.';
  } else if (key === 'email') {
    if (!value) {
      errorMsg = 'Please enter your email address.';
    } else if (!EMAIL_PATTERN.test(value)) {
      errorMsg = 'Please enter a valid email address.';
    }
  } else if (key === 'service' && !value) {
    errorMsg = 'Please select the service you require.';
  } else if (key === 'details' && !value) {
    errorMsg = 'Please enter your project details or message.';
  }

  setFieldError(field.input, field.error, errorMsg);
  return errorMsg;
}

function validateAllFields(fields) {
  const keys = ['name', 'email', 'service', 'details'];
  let firstInvalidEl = null;

  keys.forEach((key) => {
    const err = validateSingleField(key, fields[key]);
    if (err && !firstInvalidEl) {
      firstInvalidEl = fields[key].input;
    }
  });

  return {
    isValid: !firstInvalidEl,
    firstInvalidEl,
    values: {
      name: sanitizeValue(fields.name.input?.value || ''),
      email: sanitizeValue(fields.email.input?.value || ''),
      phone: sanitizeValue(fields.phone.input?.value || ''),
      business: sanitizeValue(fields.business.input?.value || ''),
      service: sanitizeValue(fields.service.input?.value || ''),
      budget: sanitizeValue(fields.budget.input?.value || ''),
      details: sanitizeValue(fields.details.input?.value || '')
    }
  };
}

function setFieldError(inputEl, errorEl, message) {
  const invalid = Boolean(message);
  inputEl.classList.toggle('is-invalid', invalid);
  inputEl.setAttribute('aria-invalid', String(invalid));
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearAllFieldErrors(fields) {
  ['name', 'email', 'service', 'details'].forEach((key) => {
    const field = fields[key];
    if (field?.input) {
      setFieldError(field.input, field.error, '');
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
