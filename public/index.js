$(document).ready(() => {
  closeGarage();
});

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

const getSingleItem = (id) => {
  fetch(`api/v1/items/${id}`)
    .then(response => response.json())
    .then((item) => {
      prependSingleItem(item[0]);
    });
};

const sortUp = () => {
  fetch('/api/v1/sortup')
  .then(response => response.json())
  .then((json) => {
    console.log(json);
      prependItemsList(json);
    })
  .catch(error => console.log('Not sorting up'));
};

const sortDown = () => {
  fetch('/api/v1/sortdown')
  .then(response => response.json())
  .then((json) => {
      prependItemsList(json);
  })
  .catch(error => console.log('Not sorting down'));
};

const openGarage = () => {
  $('#open-garage-display').show();
  $('#close-gararge-diplay').hide();
  fetchItems();
};

const closeGarage = () => {
  $('#open-garage-display').hide();
};

const clear = () => {
  $('.items-list').empty();
  $('.array-list').empty();
};

const clearInputs = () => {
  const $name = $('.name-input').val('');
  const $whyItStays = $('.whyItStays-input').val('');
};

const clearForm = () => {
  const $name = $('.name-input').val('');
  const $reason = $('.reason-input').val('');
};

const prependItemsList = (allItems) => {
  allItems.forEach((item) => {
    $('.items-list').prepend(
      `
      <div class='garage-item' id='${item.id}'>
        <p>${item.name}</p>
      </div>
      `
    );
  });
};
const prependSingleItem = (item) => {
  $('.items-list').prepend(
      `
      <div class='garage-item' id='${item.id}'>
        <p>${item.name}</p>
        <p>${item.whyItStays}</p>
        <p>${item.cleanliness}</p>
        <button class='delete-btn'>X</button>
      </div>
      <p class='edit-text' >Edit Cleanliness</p>
      <select class="edit-cleanliness" name="Cleanliness" id=${item.id}>
        <option class='edit-options' value="Sparkling">Sparkling</option>
        <option class='edit-options' value="Dusty">Dusty</option>
        <option class='edit-options' value="Rancid">Rancid</option>
      </select>
      `
    );
};

const editItem = (id, cleanliness) => {
  fetch(`/api/v1/items/${id}/edit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cleanliness })
  })
  .then(response => response.json())
  .then((updatedItem) => {
    clear();
    prependSingleItem(updatedItem[0]);
  })
  .catch(error => console.log('Not editing'));
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

$('.items-list').on('change', '.edit-cleanliness', (e) => {
  editItem(e.target.id, e.target.value);
});

$('.sort-up').on('click', () => {
  clear();
  sortUp();
});

$('.sort-down').on('click', () => {
  clear();
  sortDown();
});

$('.items-list').on('click', '.garage-item', (e) => {
  clear();
  getSingleItem(e.target.id);
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
