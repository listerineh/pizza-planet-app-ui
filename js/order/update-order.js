function fetchOrderSizes() {
  fetch("http://127.0.0.1:5000/size/")
    .then((response) => response.json())
    .then((sizes) => {
      let rows = sizes.map((element) => createSizeTemplate(element));
      let table = $("#sizes tbody");
      table.append(rows);
    });
}

function createSizeTemplate(size) {
  let template = $("#sizes-template")[0].innerHTML;
  return Mustache.render(template, size);
}

function fetchOrder(_id) {
  fetch(`http://127.0.0.1:5000/order/id/${_id}`)
    .then((response) => response.json())
    .then((order) => {
      $("#_id").val(order._id);
      $("#client_name").val(order.client_name);
      $("#client_dni").val(order.client_dni);
      $("#client_address").val(order.client_address);
      $("#client_phone").val(order.client_phone);
      fetchOrderSizes();
      $("#size_id").val(order.size._id);
    });
}

function loadInformation() {
  let urlParams = new URLSearchParams(window.location.search);
  let _id = urlParams.get("_id");
  fetchOrder(_id);
}

function putOrder(order) {
  fetch("http://127.0.0.1:5000/order/", {
    method: "PUT",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((res) => res.json())
    .then((res) => showNotification());
}

/**
 * Get the form and submit it with fetch API
 */
let orderForm = $("#order-form");
orderForm.submit((event) => {
  let order = getOrderData();
  putOrder(order);

  event.preventDefault();
  event.currentTarget.reset();
  window.location.href = "/app/order/orders.html";
});

/**
 * Gets the order data with JQuery
 */
function getOrderData() {
  return {
    _id: $("input[id='_id']").val(),
    client_name: $("input[id='client_name']").val(),
    client_dni: $("input[id='client_dni']").val(),
    client_address: $("input[id='client_address']").val(),
    client_phone: $("input[id='client_phone']").val(),
    size_id: $("input[name='size_id']").val(),
  };
}

/**
 * Shows a notification when the order is accepted
 */
function showNotification() {
  let orderAlert = $("#order-alert");
  orderAlert.toggle();
  setTimeout(() => orderAlert.toggle(), 5000);
}

window.onload = loadInformation;

function handleSizeChange() {
  $("#size_id").val($("input[name='size']:checked").val());
}
