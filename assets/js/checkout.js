var stripe = Stripe('pk_test_RkVFJMTDVjjxQghiM5Qo6MRq');
var elements = stripe.elements();

const style = {
  base: {
    color: "#c7c7c7",
  },
};

// Create an instance of the card Element.
const card = elements.create('card', {style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

document.getElementById('error').classList.remove("ui");

card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('error');
  if (error) {
    displayError.classList.add("ui");
    displayError.textContent = error.message;
  } else {
    displayError.classList.remove("ui");
    displayError.textContent = '';
  }
});

// Create a token or display an error when the form is submitted.
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {token, error} = await stripe.createToken(card);

  if (error) {
    // Inform the customer that there was an error.
    const errorElement = document.getElementById('error');
    errorElement.textContent = error.message;
  } else {
    // Send the token to your server.
    // console.log(token);
    stripeTokenHandler(token);
  }
});

const stripeTokenHandler = (token) => {
  // Insert the token ID into the form so it gets submitted to the server
  const form = document.getElementById('payment-form');
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'guest[stripeToken]');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}