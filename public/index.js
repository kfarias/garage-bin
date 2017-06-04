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

const prependItemsList = (allItems) => {
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

const fetchItems = () => {
  fetch('/api/v1/items')
  .then((response) => {
    return response.json();
  })
  .then((allItems) => {
    clear();
    prependItemsList(allItems);
    itemCount(allItems);
  });
};

const openGarage = () => {
  $('#open-garage-display').show();
  $('#close-gararge-diplay').hide();
  fetchItems();
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

const getSingleItem = (name) => {
  fetch(`api/v1/items/${name}`)
    .then(response => response.json())
    .then((item) => {
      item.forEach((info) => {
        prependItemsList(info.name, info.whyItStays, info.cleanliness);
      });
    });
};

const clearInputs = () => {
  const $name = $('.name-input').val('');
  const $whyItStays = $('.whyItStays-input').val('');
};

const submitNewItem = () => {
  const name = $('.name-input').val();
  const whyItStays = $('.whyItStays-input').val();
  const cleanliness = $('.cleanliness-input').val();
  addNewItems(name, whyItStays, cleanliness);
};

const prependName = (name) => {
  $('.items-list').prepend(`
    <div>
      <h3 class='garage-item'>${name}</h3>
    </div>
  `);
};

const sortUp = () => {
  fetch('/api/v1/sortup')
  .then(response => response.json())
  .then((json) => {
    json.map((item) => {
      prependName(item.name);
    });
  })
  .catch(e => console.log('Not sorting'));
};

const sortDown = () => {
  fetch('/api/v1/sortdown')
  .then(response => response.json())
  .then((json) => {
    json.map((item) => {
      prependName(item.name);
    });
  })
  .catch(e => console.log('Not sorting'));
};

$('.sort-up').on('click', () => {
  clear();
  sortUp();
});

$('.sort-down').on('click', () => {
  clear();
  sortDown();
});

$('.items-list').on('click', '.garage-item', (e) => {
  const itemName = e.target.innerHTML;
  getSingleItem(itemName);
});

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
