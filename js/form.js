/**
 * ENSINA AÍ - Instituição de Ensino
 * Lógica do Formulário de Interesse em Matrícula (js/form.js)
 * JavaScript Vanilla (ES6+) - Validação Local, Máscaras e Estados de Demonstração
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnrollmentForm();
});

function initEnrollmentForm() {
  const form = document.getElementById('enrollment-form');
  const successBanner = document.getElementById('form-success-banner');
  const resetBtn = document.getElementById('btn-reset-form');

  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('parent-name'),
      error: document.getElementById('error-parent-name'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return 'O nome do responsável é obrigatório.';
        if (trimmed.length < 3) return 'O nome deve conter ao menos 3 caracteres.';
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(trimmed)) return 'O nome deve conter apenas letras e espaços.';
        return '';
      }
    },
    stage: {
      input: document.getElementById('student-stage'),
      error: document.getElementById('error-student-stage'),
      validate: (val) => {
        if (!val || val === '') return 'Selecione a série ou etapa de interesse.';
        return '';
      }
    },
    shift: {
      input: document.getElementById('school-shift'),
      error: document.getElementById('error-school-shift'),
      validate: (val) => {
        if (!val || val === '') return 'Selecione o turno desejado.';
        return '';
      }
    },
    whatsapp: {
      input: document.getElementById('parent-whatsapp'),
      error: document.getElementById('error-parent-whatsapp'),
      validate: (val) => {
        const digits = val.replace(/\D/g, '');
        if (!digits) return 'O número de WhatsApp é obrigatório.';
        if (digits.length < 10 || digits.length > 11) {
          return 'Informe um telefone brasileiro com DDD válido (10 ou 11 dígitos).';
        }
        // Validação de DDD brasileiro (11 a 99)
        const ddd = parseInt(digits.substring(0, 2), 10);
        if (ddd < 11 || ddd > 99) {
          return 'Informe um DDD brasileiro válido (ex: 11, 21, 31, etc.).';
        }
        return '';
      }
    },
    email: {
      input: document.getElementById('parent-email'),
      error: document.getElementById('error-parent-email'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return 'O e-mail é obrigatório.';
        // Validação de formato RFC e domínio
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return 'Informe um endereço de e-mail válido (ex: nome@dominio.com).';
        }
        return '';
      }
    }
  };

  // 1. Aplicação da Máscara Dinâmica de Telefone Brasileiro (WhatsApp)
  if (fields.whatsapp.input) {
    fields.whatsapp.input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        // (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        // (XX) XXXX
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        // (XX
        value = value.replace(/^(\d*)/, '($1');
      }

      e.target.value = value;
    });
  }

  // 2. Feedback Inline Amigável no Evento Blur e Input
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field.input) return;

    // Validação ao perder o foco (blur)
    field.input.addEventListener('blur', () => {
      validateSingleField(field);
    });

    // Limpeza do estado de erro quando o usuário começa a corrigir
    field.input.addEventListener('input', () => {
      if (field.input.classList.contains('is-invalid')) {
        validateSingleField(field);
      }
    });

    if (field.input.tagName === 'SELECT') {
      field.input.addEventListener('change', () => {
        validateSingleField(field);
      });
    }
  });

  function validateSingleField(field) {
    const errorMsg = field.validate(field.input.value);
    if (errorMsg) {
      field.input.classList.add('is-invalid');
      field.input.classList.remove('is-valid');
      if (field.error) {
        field.error.textContent = errorMsg;
        field.error.classList.add('show');
      }
      return false;
    } else {
      field.input.classList.remove('is-invalid');
      if (field.input.value.trim() !== '') {
        field.input.classList.add('is-valid');
      }
      if (field.error) {
        field.error.textContent = '';
        field.error.classList.remove('show');
      }
      return true;
    }
  }

  // 3. Submissão do Formulário com Validação Completa e Loading Demonstrativo
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidInput = null;

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      const valid = validateSingleField(field);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      }
    });

    if (!isFormValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Estado de Carregamento Demonstrativo
    const submitBtn = document.getElementById('btn-submit-enrollment');
    const submitText = document.getElementById('btn-submit-text');
    const submitSpinner = document.getElementById('btn-submit-spinner');

    if (submitBtn) submitBtn.disabled = true;
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (submitText) submitText.textContent = 'Validando demonstração...';

    // Desabilita campos durante o processamento demonstrativo
    Object.keys(fields).forEach((key) => {
      fields[key].input.disabled = true;
    });

    // Simulação de processamento assíncrono local (1.2 segundos)
    setTimeout(() => {
      // Coleta dos dados preenchidos para exibição no feedback
      const submittedData = {
        name: fields.name.input.value.trim(),
        stage: fields.stage.input.options[fields.stage.input.selectedIndex].text,
        shift: fields.shift.input.options[fields.shift.input.selectedIndex].text,
        whatsapp: fields.whatsapp.input.value.trim(),
        email: fields.email.input.value.trim()
      };

      // Atualiza os dados no cartão de sucesso
      const summaryList = document.getElementById('success-summary-data');
      if (summaryList) {
        summaryList.innerHTML = `
          <li><strong>Responsável:</strong> ${escapeHtml(submittedData.name)}</li>
          <li><strong>Etapa / Série:</strong> ${escapeHtml(submittedData.stage)}</li>
          <li><strong>Turno:</strong> ${escapeHtml(submittedData.shift)}</li>
          <li><strong>WhatsApp:</strong> ${escapeHtml(submittedData.whatsapp)}</li>
          <li><strong>E-mail:</strong> ${escapeHtml(submittedData.email)}</li>
        `;
      }

      // Oculta o formulário e exibe o estado de sucesso
      form.style.display = 'none';
      if (successBanner) {
        successBanner.classList.add('is-visible');
        successBanner.focus();
      }

      // Restaura o botão para caso haja reinício
      if (submitBtn) submitBtn.disabled = false;
      if (submitSpinner) submitSpinner.style.display = 'none';
      if (submitText) submitText.textContent = 'Manifestar Interesse em Matrícula';
    }, 1200);
  });

  // 4. Reinicialização do Formulário Demonstrativo
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      Object.keys(fields).forEach((key) => {
        fields[key].input.disabled = false;
        fields[key].input.classList.remove('is-valid', 'is-invalid');
        if (fields[key].error) {
          fields[key].error.textContent = '';
          fields[key].error.classList.remove('show');
        }
      });

      if (successBanner) {
        successBanner.classList.remove('is-visible');
      }
      form.style.display = 'block';

      // Foca no primeiro campo para facilidade de uso
      if (fields.name.input) {
        fields.name.input.focus();
      }
    });
  }

  // Função utilitária para sanitização de texto antes de renderizar
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
