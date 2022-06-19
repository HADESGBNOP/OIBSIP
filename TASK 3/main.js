'use strict';

const converterForm = document.getElementById('converter');

const fromUnit1Input = document.querySelector('select[name="fromUnit1"]');
const toUnit1Input = document.querySelector('select[name="toUnit1"]');

const answerContainer = document.querySelector('.answer');

function formatUnit(unit) {
  return unit === 'C' ? '°C' : unit === 'F' ? '°F' : 'K';
}
function formatNumber(temperature) {
  // Return integer
  if (Number.isInteger(temperature)) return temperature;

  // Return float
  const numberAsString = temperature + '';
  const [integer, fraction] = numberAsString.split('.');
  const fractionTo2DP = fraction.slice(0, 2);
  const number = [integer, fractionTo2DP].join('.');

  return parseFloat(number);
}

function changeInput(e) {
  const toOptions = toUnit1Input.querySelectorAll('option');
  const matchingOpt = toUnit1Input.querySelector(`option[value="${e.target.value}"]`);

  toOptions.forEach((opt) => (opt.disabled = opt.hidden = false));
  matchingOpt.disabled = matchingOpt.hidden = true;
  matchingOpt.selected = false;
}

function handleValidationError(error) {
  console.error(error.message);
}

function handleFormSubmit(e) {
  try {
    // Prevent default form submission
    e.preventDefault();

    // Get data from the form
    const entries = new FormData(converterForm).entries();
    const data = Object.fromEntries(entries);

    // Validate data
    if (!data.fromTemperature) throw new Error('Must provide a temperature');
    if (data.fromUnit1 === data.toUnit1) throw new Error(`Conversion units cannot be the same`);

    // Convert temperatures
    const answer = convertTemperature(data);

    
    showAnswer(data, answer);
  } catch (error) {
    handleValidationError(error);
  }
}

function convertTemperature(values) {
  switch (values.fromUnit1) {
    case 'C':
      if (values.toUnit1 === 'F') return +values.fromTemperature * 1.8 + 32;
      if (values.toUnit1 === 'K') return +values.fromTemperature + 273;
    case 'F':
      if (values.toUnit1 === 'C') return (+values.fromTemperature - 32) / 1.8;
      if (values.toUnit1 === 'K') return (+values.fromTemperature - 32) / 1.8 + 273;
    case 'K':
      if (values.toUnit1 === 'C') return +values.fromTemperature - 273;
      if (values.toUnit1 === 'F') return (+values.fromTemperature - 273) / 1.8 + 32;
  }
}

function showAnswer({ fromTemperature, fromUnit1, toUnit1 }, answer) {
  answerContainer.innerHTML = `<span>${fromTemperature} ${formatUnit(fromUnit1)}</span> &RightArrow; <span>${formatNumber(answer)}</> ${formatUnit(toUnit1)}</span>`;
}

converterForm.addEventListener('submit', handleFormSubmit);

fromUnit1Input.addEventListener('input', changeInput);
