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




const closeGarage = () => {
  $('#open-garage-display').hide();
}

const openGarage = () => {
  $('#open-garage-display').show();
  $('#close-gararge-diplay').hide();
  fetchItems()
}

const appendItems = (allItems) => {
  allItems.forEach((item) => {
    $('.items-list').append(
      `
        <li class='garage-item'>${item.name}</li>

      `
    )
  })
}

const submitNewItem = () => {
  const name = $('.name-input').val();
  console.log(name);
  const whyItStays = $('.whyItStays-input').val();
  console.log(whyItStays);
  const cleanliness = $('.cleanliness-input').val();
  console.log(cleanliness);
  addNewItems(name, whyItStays, cleanliness);
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
  .then((newItems) => {
    appendItems(newItems);
  });
};

const fetchItems = () => {
  fetch('/api/v1/items')
  .then((response) => {
    return response.json();
  })
  .then((allItems) => {
    appendItems(allItems)
  });
};
