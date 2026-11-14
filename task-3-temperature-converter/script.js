/**
 * =========================================================
 * THERMOFLOW · TEMPERATURE CONVERTER JAVASCRIPT
 * Pure Vanilla JavaScript 
 * 
 * Features:
 * 1. Accurate Conversion between Celsius, Fahrenheit, and Kelvin
 * 2. Strict Numeric Input Validation with User-Friendly Errors
 * 3. Simultaneous Multi-Unit Output Display
 * 4. Absolute Zero Physical Boundary Edge Case Handling
 * 5. Feeling Indicator
 * 6. Quick Preset Buttons & Reset Functionality
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // ---------------------------------------------------------
  const tempInput = document.getElementById('temp-input');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const unitRadios = document.querySelectorAll('input[name="temp-unit"]');
  const converterForm = document.getElementById('temp-converter-form');
  const resetBtn = document.getElementById('reset-btn');
  const errorMsgEl = document.getElementById('input-error-msg');

  // Result display elements
  const valCelsiusEl = document.getElementById('val-celsius');
  const valFahrenheitEl = document.getElementById('val-fahrenheit');
  const valKelvinEl = document.getElementById('val-kelvin');

  // Result cards
  const cardCelsius = document.getElementById('card-celsius');
  const cardFahrenheit = document.getElementById('card-fahrenheit');
  const cardKelvin = document.getElementById('card-kelvin');

  // Absolute zero alert
  const absoluteZeroAlert = document.getElementById('absolute-zero-alert');
  const alertMessageEl = document.getElementById('alert-message');

  // Sensation gauge elements
  const sensationEmojiEl = document.getElementById('sensation-emoji');
  const sensationTitleEl = document.getElementById('sensation-title');
  const sensationDescEl = document.getElementById('sensation-desc');

  // Preset buttons
  const presetButtons = document.querySelectorAll('.preset-btn');

  // ---------------------------------------------------------
  // ABSOLUTE ZERO CONSTANTS (PHYSICAL BOUNDARIES)
  // ---------------------------------------------------------
  const ABSOLUTE_ZERO = {
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0
  };

  // ---------------------------------------------------------
  // CORE CONVERSION FORMULAS
  // ---------------------------------------------------------
  function convertTemperature(value, fromUnit) {
    let celsius, fahrenheit, kelvin;

    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        fahrenheit = (value * 9 / 5) + 32;
        kelvin = value + 273.15;
        break;

      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9;
        fahrenheit = value;
        kelvin = celsius + 273.15;
        break;

      case 'kelvin':
        celsius = value - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;
        kelvin = value;
        break;

      default:
        return null;
    }

    return { celsius, fahrenheit, kelvin };
  }

  // Helper to format numbers cleanly (e.g. 21 -> "21.00")
  function formatNumber(num) {
    if (isNaN(num)) return '--';
    // Format to 2 decimal places
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  // ---------------------------------------------------------
  // TEMPERATURE SENSATION / MOOD INDICATOR
  // Evaluates how the temperature feels based on Celsius value
  // ---------------------------------------------------------
  function updateSensation(celsius, isBelowAbsoluteZero) {
    if (isBelowAbsoluteZero) {
      sensationEmojiEl.textContent = 
      sensationTitleEl.textContent = 'Below Absolute Zero (Hypothetical)';
      sensationDescEl.textContent = 'Colder than deep space. Particle kinetic energy is theoretically zero at 0 K.';
      return;
    }

    if (celsius < -50) {
      
      sensationTitleEl.textContent = 'Extreme Polar Freeze';
      sensationDescEl.textContent = 'Equivalent to the Antarctic winter. Unprotected exposure is hazardous.';
    } else if (celsius <= 0) {
      
      sensationTitleEl.textContent = 'Freezing Cold';
      sensationDescEl.textContent = 'Water turns into ice at or below 0°C. Heavy winter gear needed.';
    } else if (celsius < 15) {
      
      sensationTitleEl.textContent = 'Crisp & Chilly';
      sensationDescEl.textContent = 'Brisk morning air. Sweaters and warm layers are recommended.';
    } else if (celsius <= 25) {
      
      sensationTitleEl.textContent = 'Pleasant & Mild Room Temperature';
      sensationDescEl.textContent = 'Ideal, comfortable everyday living and working temperature.';
    } else if (celsius <= 36) {
      
      sensationTitleEl.textContent = 'Warm Summer Weather';
      sensationDescEl.textContent = 'Great weather for a swim or outdoor walk. Remember to stay hydrated.';
    } else if (celsius < 50) {
      sensationEmojiEl.textContent = '🌡️';
      sensationTitleEl.textContent = 'Hot / Human Body Core & Fever';
      sensationDescEl.textContent = 'Normal human body core is ~37°C. Ambient air this hot requires shade and water.';
    } else if (celsius < 100) {
      
      sensationTitleEl.textContent = 'Scalding & Near Boiling';
      sensationDescEl.textContent = 'Dangerously hot water. Capable of instant burns.';
    } else {
      
      sensationTitleEl.textContent = 'Boiling Point of Water or Higher';
      sensationDescEl.textContent = 'Liquid water turns to steam at 100°C under standard sea-level pressure.';
    }
  }

  // ---------------------------------------------------------
  // MAIN CONVERSION & VALIDATION HANDLER
  // ---------------------------------------------------------
  function handleConversion() {
    const rawInput = tempInput.value.trim();

    // Reset error state
    errorMsgEl.textContent = '';
    tempInput.classList.remove('input-invalid');

    // 1. Check if input is empty
    if (rawInput === '') {
      errorMsgEl.textContent = 'Please enter a temperature value to convert.';
      tempInput.classList.add('input-invalid');
      clearResults();
      return false;
    }

    // 2. Validate numeric input (allow negative numbers and decimals, reject non-numbers)
    const numericRegex = /^-?\d*(\.\d+)?$/;
    if (!numericRegex.test(rawInput) || rawInput === '-' || isNaN(Number(rawInput))) {
      errorMsgEl.textContent = 'Invalid input: Please enter a valid number (e.g., 21, -10, 98.6).';
      tempInput.classList.add('input-invalid');
      clearResults();
      return false;
    }

    const value = parseFloat(rawInput);
    const selectedUnit = document.querySelector('input[name="temp-unit"]:checked').value;

    // 3. Highlight the active source unit card
    updateActiveSourceCard(selectedUnit);

    // 4. Perform the conversion
    const results = convertTemperature(value, selectedUnit);
    if (!results) return false;

    // 5. Update result values in the DOM
    valCelsiusEl.textContent = formatNumber(results.celsius);
    valFahrenheitEl.textContent = formatNumber(results.fahrenheit);
    valKelvinEl.textContent = formatNumber(results.kelvin);

    // 6. Check Absolute Zero Edge Case
    const isBelowZero = (
      (selectedUnit === 'celsius' && value < ABSOLUTE_ZERO.celsius) ||
      (selectedUnit === 'fahrenheit' && value < ABSOLUTE_ZERO.fahrenheit) ||
      (selectedUnit === 'kelvin' && value < ABSOLUTE_ZERO.kelvin)
    );

    if (isBelowZero) {
      absoluteZeroAlert.style.display = 'flex';
      const unitLabels = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
      alertMessageEl.innerHTML = `The entered value of <strong>${value}${unitLabels[selectedUnit]}</strong> is lower than <strong>Absolute Zero</strong> (−273.15°C / −459.67°F / 0 K). In physical nature, temperature cannot drop below 0 Kelvin.`;
    } else {
      absoluteZeroAlert.style.display = 'none';
    }

    // 7. Update humanized temperature sensation
    updateSensation(results.celsius, isBelowZero);

    return true;
  }

  // Clear result values if input is invalid or cleared
  function clearResults() {
    valCelsiusEl.textContent = '--';
    valFahrenheitEl.textContent = '--';
    valKelvinEl.textContent = '--';
    absoluteZeroAlert.style.display = 'none';
  
    sensationTitleEl.textContent = 'Awaiting Temperature Input';
    sensationDescEl.textContent = 'Enter any numeric degree value above to see conversions.';
  }

  // Highlight which card corresponds to the selected input unit
  function updateActiveSourceCard(selectedUnit) {
    [cardCelsius, cardFahrenheit, cardKelvin].forEach(card => card.classList.remove('card-source-active'));
    if (selectedUnit === 'celsius') cardCelsius.classList.add('card-source-active');
    if (selectedUnit === 'fahrenheit') cardFahrenheit.classList.add('card-source-active');
    if (selectedUnit === 'kelvin') cardKelvin.classList.add('card-source-active');
  }

  // ---------------------------------------------------------
  // EVENT LISTENERS
  // ---------------------------------------------------------

  // Form submission (Convert Button click or Enter key)
  converterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleConversion();
  });

  // Real-time auto-conversion as user types
  tempInput.addEventListener('input', () => {
    // Unset active preset if custom typing
    presetButtons.forEach(btn => btn.classList.remove('active'));
    handleConversion();
  });

  // Clear input button
  clearInputBtn.addEventListener('click', () => {
    tempInput.value = '';
    tempInput.focus();
    clearResults();
    presetButtons.forEach(btn => btn.classList.remove('active'));
    errorMsgEl.textContent = 'Please enter a temperature value.';
    tempInput.classList.add('input-invalid');
  });

  // Unit selector radio change
  unitRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      handleConversion();
    });
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    tempInput.value = '21';
    tempInput.classList.remove('input-invalid');
    errorMsgEl.textContent = '';
    document.querySelector('input[name="temp-unit"][value="celsius"]').checked = true;
    presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.temp === '21');
    });
    handleConversion();
  });

  // Quick preset buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tempVal = btn.getAttribute('data-temp');
      const unitVal = btn.getAttribute('data-unit');

      tempInput.value = tempVal;
      const targetRadio = document.querySelector(`input[name="temp-unit"][value="${unitVal}"]`);
      if (targetRadio) targetRadio.checked = true;

      handleConversion();
    });
  });

  // Initial calculation on page load
  handleConversion();

});
