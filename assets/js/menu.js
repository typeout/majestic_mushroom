//set starters active
$('.starters').on("click", e => {
  e.preventDefault();
  $('.starters').addClass('active');
  $('.wraps').removeClass('active');
  $('.entrees').removeClass('active');
  $('.kids').removeClass('active');
  $.get("/menu/Starters, Salads and Sides", (data) => displayMenu(data, loadClickListeners(data)));
});
//set wraps active
$('.wraps').on("click", e => {
  e.preventDefault();
  $('.wraps').addClass('active');
  $('.starters').removeClass('active');
  $('.entrees').removeClass('active');
  $('.kids').removeClass('active');
  $.get("/menu/Wraps and Sandwitches", (data) => displayMenu(data));
});
//set entrees active
$('.entrees').on("click", e => {
  e.preventDefault();
  $('.entrees').addClass('active');
  $('.wraps').removeClass('active');
  $('.starters').removeClass('active');
  $('.kids').removeClass('active');
  $.get("/menu/Entrees", (data) => displayMenu(data));
});
//set kids active
$('.kids').on("click", e => {
  e.preventDefault();
  $('.kids').addClass('active');
  $('.wraps').removeClass('active');
  $('.entrees').removeClass('active');
  $('.starters').removeClass('active');
  $.get("/menu/Kids Meals", (data) => displayMenu(data));
});

function displayMenu(data) {
  let display = `<div class="ui three doubling stackable cards">`;
  data.menuItems.forEach(item => {
    display += `
                  <div class="ui card">
                    <div class="image">
                      <img src="${item.picture}">
                    </div>
                    
                    <div class="content">
                      <div class="right floated"><span class="ui medium header red">$${item.price}</span></div>
                    <div class="header">${item.name}</div>
                    <div class="meta">${item.description}</div>
                    <div class="description"></div>
                    </div>
                    <div class="ui bottom attached two buttons">
                      <div class="ui basic green button">Nutrition</div>
                      <a class="ui green button addItem" href="/add-to-cart/${item._id}"><i class="add icon"></i> Add Item</a>  
                    </div>
                  </div>
    `;
  });
  display += `</div>`;
  $('.menu-inner').html(display);
}

function loadClickListeners(data) {
  let list = document.querySelectorAll(".addItem");
  console.log(list);
  for (let i=0; i<list.length; i++) {
    list[i].addEventListener('click', () => {
      console.log("clicked");
    });
  }


  // data.menuItems.forEach((item, index) => {
  //   console.log(index);
  //   $(".addItem:eq(0)").click(() => {
  //     console.log("clicked");
  //   });
  // });
}