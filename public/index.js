$(document).ready(() => {
  closeGarage();
});

$('.open-btn').on('click', () => {
  console.log('here');
  openGarage();
})

$('.close-btn').on('click', () => {
  closeGarage();
  $('close-garage-diplay').show();
});

$('.add-items-btn').on('click', () => {
  console.log('add-item clicked');
  submitNewItem();
});

const closeGarage = () => {
  $('#open-garage-display').hide();
};

const openGarage = () => {
  $('#open-garage-display').show();
  $('#close-gararge-diplay').hide();
  fetchItems();
};

const appendItems = (allItems) => {
  allItems.forEach((item) => {
    $('.items-list').append(
      `
      <li class='garage-item'>${item.name}</li>
      `
    );
  });
};

const countArrayLengths = (sparklingArr, dustyArr, rancidArr) => {
  const total = sparklingArr.length + dustyArr.length + rancidArr.length;
  $('.array-list').append(
    `
    <p class='lengths'>total: ${total}</p>
    <p class='lengths'>sparkling: ${sparklingArr.length}</p>
    <p class='lengths'>dusty: ${dustyArr.length}</p>
    <p class='lengths'>rancid: ${rancidArr.length}</p>`
  );
};

const submitNewItem = () => {
  const name = $('.name-input').val();
  const whyItStays = $('.whyItStays-input').val();
  const cleanliness = $('.cleanliness-input').val();
  addNewItems(name, whyItStays, cleanliness);
};

const itemCount = (allItems) => {
  const sparklingArr = [];
  const dustyArr = [];
  const rancidArr = [];
  allItems.map((item) => {
    if (item.cleanliness == 'sparkling') {
      sparklingArr.push(item.cleanliness);
    } else if (item.cleanliness == 'dusty') {
      dustyArr.push(item.cleanliness);
    } else {
      rancidArr.push(item.cleanliness);
    }
  });
  countArrayLengths(sparklingArr, dustyArr, rancidArr);
};

const addNewItems = (name, whyItStays, cleanliness) => {
  fetch('/api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, whyItStays, cleanliness }),
  })
  .then(() => {
    fetchItems();
    clearInputs();
  });
};

const fetchItems = () => {
  fetch('/api/v1/items')
  .then((response) => {
    return response.json();
  })
  .then((allItems) => {
    appendItems(allItems);
    itemCount(allItems);
  });
};
