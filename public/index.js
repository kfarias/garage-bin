$(document).ready(() => {
  closeGarage();
});

const clear = () => {
  $('.items-list').empty();
  $('.array-list').empty();
};

const closeGarage = () => {
  $('#open-garage-display').hide();
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

const itemCount = (allItems) => {
  const sparklingArr = [];
  const dustyArr = [];
  const rancidArr = [];
  allItems.map((item) => {
    if (item.cleanliness === 'sparkling') {
      sparklingArr.push(item.cleanliness);
    } else if (item.cleanliness === 'dusty') {
      dustyArr.push(item.cleanliness);
    } else {
      rancidArr.push(item.cleanliness);
    }
  });
  countArrayLengths(sparklingArr, dustyArr, rancidArr);
};

const prependItems = (allItems) => {
  allItems.forEach((item) => {
    $('.items-list').prepend(
      `
      <div class='garage-item'>
        ${item.name}
        <p class='item-info'> Reason: ${item.whyItStays}</p>
        <p class='cleanliness-text'> ${item.cleanliness}</p>
        <button class='delete-btn'>X</button>
      </div>

      `
    );
  });
};

const fetchItems = () => {
  fetch('/api/v1/items')
  .then((response) => {
    return response.json();
  })
  .then((allItems) => {
    clear();
    prependItems(allItems);
    itemCount(allItems);
  });
};

const openGarage = () => {
  $('#open-garage-display').show();
  $('#close-gararge-diplay').hide();
  fetchItems();
};

const clearInputs = () => {
  const $name = $('.name-input').val('');
  const $whyItStays = $('.whyItStays-input').val('');
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

const submitNewItem = () => {
  const name = $('.name-input').val();
  const whyItStays = $('.whyItStays-input').val();
  const cleanliness = $('.cleanliness-input').val();
  addNewItems(name, whyItStays, cleanliness);
};

$('.add-items-btn').on('click', () => {
  submitNewItem();
});

$('.open-btn').on('click', () => {
  openGarage();
});

$('.close-btn').on('click', () => {
  closeGarage();
  $('close-garage-diplay').show();
});

$('.sort-btn').on('click', () => {
  fetch('/api/v1/items/sort')
  .then((response) => {
    prependItems(response);
  });
});
