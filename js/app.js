var eventsMediator = {
  events: {},
  on: function (eventName, callbackfn) {
    this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(callbackfn);
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (callBackfn) {
        callBackfn(data);
      });
    }
  },
};

var model = {
  data: [{
    country: "argentina",
    url: "./assets/images/Flag-Argentina.webp",
    api: "https://newsapi.org/v2/top-headlines?country=ar&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
  },
  {
    country: "brazil",
    url: "./assets/images/Flag_of_Brazil.svg.png",
    api: "https://newsapi.org/v2/top-headlines?country=br&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
  },
  {
    country: "greece",
    url: "./assets/images/Flag-greece.webp",
    api: "https://newsapi.org/v2/top-headlines?country=gr&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
  },
  {
    country: "india",
    url: "./assets/images/Flag_of_India.svg.png",
    api: "https://newsapi.org/v2/top-headlines?country=in&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
  },
  {
    country: "unitedStates",
    url: "./assets/images/download.png",
    api: "https://newsapi.org/v2/top-headlines?country=us&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
  },
  {
    country: "japan",
    url: "./assets/images/Flag_of_Japan.svg.png",
    api: "https://newsapi.org/v2/top-headlines?country=jp&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
  }
  ],
  currentNews: null
}

var controller = {
  init() {
    carouselView.init()

    eventsMediator.on("news.changed", function (data) {
      controller.setNews(data);
    });    

  },
  setNews(articles) {
    model.currentNews = articles
  },
  getNews() {
    return model.currentNews
  }

}

var carouselView = {
  init() {
    this.render()
    $(".owl-carousel").owlCarousel({
      navigation: false, // Show next and prev buttons
      dots: true,
      slideSpeed: 300,
      paginationSpeed: 400,
      items: 1,
      itemsDesktop: false,
      itemsDesktopSmall: false,
      itemsTablet: false,
      itemsMobile: false
    });
  },
  render() {
    var myData = model.data
    const template = document.getElementById('template').innerHTML;
    const rendered = Mustache.render(template, { myData });
    $('.owl-stage').html(rendered)

    $(".owl-item").on('click', function (e) {
      $.ajax(
        {
          url: model.data.find(item => item.country == e.target.id).api,
          success: function (result) {
            eventsMediator.emit("news.changed", result.articles);

            newsView.render()
          }
        });
    })
  }
}

var newsView = {
  init() {
    this.render()
  },
  render() {
    var articles = controller.getNews()
    const template = document.getElementById('template2').innerHTML;
    const rendered = Mustache.render(template, { articles });
    $('.news').html(rendered)
  }

}

$(document).ready(function () {
  controller.init()
});

