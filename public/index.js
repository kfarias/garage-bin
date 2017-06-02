console.log('hello');
$( document ).ready(function() {
  console.log( "ready!" );
});


$(document).ready(() => {
  closeGarage();
});

$('.open-btn').on('click', () => {
  console.log('here');
  openGarage();
})

$('.close-btn').on('click', () => {
  console.log('closing');
  closeGarage();
  $('close-garage-diplay').show();
})

$('.add-items-btn').on('click', () => {
  console.log('add-item clicked');
  submitNewItem();
})


const clear = () => {
  $('.items-list').empty();
  $('.array-list').empty();
}

const closeGarage = () => {
  $('#open-garage-display').hide();
}

const openGarage = () => {
  $('#open-garage-display').show();
  $('#close-gararge-diplay').hide();
  fetchItems()
}

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
    )
  })
}

const countArrayLengths = (sparklingArr, dustyArr, rancidArr) => {
  let total = sparklingArr.length + dustyArr.length + rancidArr.length
  $('.array-list').append(
    `
    <p class='lengths'>total: ${total}</p>
    <p class='lengths'>sparkling: ${sparklingArr.length}</p>
    <p class='lengths'>dusty: ${dustyArr.length}</p>
    <p class='lengths'>rancid: ${rancidArr.length}</p>`
  )
}

const submitNewItem = () => {
  const name = $('.name-input').val();
  const whyItStays = $('.whyItStays-input').val();
  const cleanliness = $('.cleanliness-input').val();
  addNewItems(name, whyItStays, cleanliness);
}

const itemCount = (allItems) => {
  let sparklingArr = []
  let dustyArr = []
  let rancidArr = []
  allItems.map((item) => {
    if(item.cleanliness == 'sparkling') {
      sparklingArr.push(item.cleanliness)
    } else if(item.cleanliness == 'dusty') {
      dustyArr.push(item.cleanliness)
    } else {
      rancidArr.push(item.cleanliness)
    }
  })
  countArrayLengths(sparklingArr, dustyArr, rancidArr)
}

const addNewItems = (name, whyItStays, cleanliness) => {
  fetch('/api/v1/items', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, whyItStays, cleanliness}),
  })
  .then((response) => {
    console.log(response);
    return response.json();
  })
  .then((newItem) => {
    console.log(newItem);
    prependItems(newItem);
  });
};

const fetchItems = () => {
  fetch('/api/v1/items')
  .then((response) => {
    return response.json();
  })
  .then((allItems) => {
    clear();
    prependItems(allItems)
    itemCount(allItems);
  });
};
