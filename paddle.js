function updateTable(event) {
  if (!event.name) {
    return;
  }

  console.log(event);

  let items = event.data.items;
  let totals = event.data.totals;
  let recurringTotals = event.data.recurring_totals;

  updateItemsTable(items);
  updateSummaryTable(totals, recurringTotals);
}

function updateItemsTable(items) {
  const itemsTableBody = document.querySelector('.items-table tbody');
  itemsTableBody.innerHTML = '';

  items.forEach(item => {
    const newRow = createTableRow(item.product.name, item.price_name, item.quantity, item.totals.subtotal);
    itemsTableBody.appendChild(newRow);
  });
}

function createTableRow(productName, priceName, quantity, total) {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${productName}</td>
    <td>${priceName}</td>
    <td>${quantity}</td>
    <td>${total.toFixed(2)}</td>
  `;
  return newRow;
}

function updateSummaryTable(totals, recurringTotals) {
  document.getElementById('oneTimeTotal').textContent = (totals.subtotal - recurringTotals.subtotal).toFixed(2);
  document.getElementById('recurringTotal').textContent = recurringTotals.subtotal.toFixed(2);
  document.getElementById('discountTotal').textContent = totals.discount.toFixed(2);
  document.getElementById('taxTotal').textContent = totals.tax.toFixed(2);
  document.getElementById('totalToday').textContent = totals.total.toFixed(2);
}

Paddle.Environment.set("sandbox");
Paddle.Initialize({
  token: "test_a9bf67069a7251da0f4a87ccf43", // replace with a client-side token
  eventCallback: updateTable
});

// define items
let monthItemsList = [
  {
    priceId: 'pri_01j588t10jpwcyq8gjg33jbs5s',
    quantity: 10
  },
  {
    priceId: 'pri_01j588rxgw7gaj6rae3g6dsafj',
    quantity: 1
  }
];
let yearItemsList = [
  {
    priceId: 'pri_01j588sfmqnyr1q6y2489tknnw',
    quantity: 1
  }
];

// open checkout
function openCheckout(items){
  Paddle.Environment.set("sandbox");
  Paddle.Checkout.open({
    settings: {
      displayMode: "inline",
      frameTarget: "checkout-container",
      frameInitialHeight: "450",
      frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;"
    },
    items: items
  });
}

// switch plan
let isMonthly = true;

function switchPlan() {
  let updatedItems = isMonthly ? yearItemsList : monthItemsList;
  Paddle.Checkout.updateCheckout({
    items: updatedItems
  });
  isMonthly = !isMonthly;
}

window.onload = openCheckout(monthItemsList)