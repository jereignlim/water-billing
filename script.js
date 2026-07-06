let transactionsProcessed = 0; // running counter across the session

function getRate(consumption) {
  if (consumption <= 20) {
    return 25.00;
  } else if (consumption <= 40) {
    return 35.00;
  } else if (consumption <= 60) {
    return 45.00;
  } else {
    return 60.00;
  }
}

function getDiscountRate(customerType) {
  if (customerType === "Senior Citizen") {
    return 0.25;
  } else if (customerType === "Solo Parent") {
    return 0.15;
  } else {
    return 0;
  }
}

function validateFields() {
  const fields = [
    { id: "customerName", errorId: "nameError", check: v => v.trim() !== "" },
    { id: "consumption", errorId: "consumptionError", check: v => v !== "" && !isNaN(v) && Number(v) > 0 }
  ];

  let isValid = true;

  for (let i = 0; i < fields.length; i++) {
    const inputEl = document.getElementById(fields[i].id);
    const errorEl = document.getElementById(fields[i].errorId);
    const value = inputEl.value;

    if (!fields[i].check(value)) {
      errorEl.style.display = "block";
      isValid = false;
    } else {
      errorEl.style.display = "none";
    }
  }

  return isValid;
}

function buildBillingStatement(name, type, consumption, rate, amount, discountAmount, total) {
  return (
`================================
     WATER BILLING
================================

Customer Name : ${name}
Customer Type : ${type}
Water Usage   : ${consumption} cu.m
Rate          : ₱${rate.toFixed(2)} / cu.m
--------------------------------
Amount        : ₱${amount.toFixed(2)}
Discount      : ₱${discountAmount.toFixed(2)}
--------------------------------
TOTAL BILL    : ₱${total.toFixed(2)}
================================`
  );
}

document.getElementById("billingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateFields()) {
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const consumption = Number(document.getElementById("consumption").value);
  const customerType = document.getElementById("customerType").value;

  const rate = getRate(consumption);
  const amount = consumption * rate;
  const discountRate = getDiscountRate(customerType);
  const discountAmount = amount * discountRate;
  const total = amount - discountAmount;

  transactionsProcessed++;
  document.getElementById("counterDisplay").textContent =
    `Transactions Processed : ${transactionsProcessed}`;

  const statement = buildBillingStatement(name, customerType, consumption, rate, amount, discountAmount, total);
  document.getElementById("billOutput").textContent = statement;

  recordTransaction({
    name, customerType, consumption, rate,
    amount, discountAmount, total
  });
});

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxYF2cjxlQkmqzHXOrgcz7IsBqyh8Jl2LtOMamofsESSz1lpBF6qRmmAGEdD3ieC1_b/exec";

function recordTransaction(record) {
  fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(record)
  }).catch(err => console.error("Could not record transaction:", err));
}