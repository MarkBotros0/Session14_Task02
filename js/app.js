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

// data:[{
//   country: "argentina",
//   url: "./assets/images/Flag-Argentina.webp",
//   api: "https://newsapi.org/v2/top-headlines?country=ar&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// },
// {
//   country: "brazil",
//   url: "./assets/images/Flag_of_Brazil.svg.png",
//   api: "https://newsapi.org/v2/top-headlines?country=br&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// },
// {
//   country: "greece",
//   url: "./assets/images/Flag-greece.webp",
//   api: "https://newsapi.org/v2/top-headlines?country=gr&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// },
// {
//   country: "india",
//   url: "./assets/images/Flag_of_India.svg.png",
//   api: "https://newsapi.org/v2/top-headlines?country=in&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// },
// {
//   country: "unitedStates",
//   url: "./assets/images/download.png",
//   api: "https://newsapi.org/v2/top-headlines?country=us&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// },
// {
//   country: "japan",
//   url: "./assets/images/Flag_of_Japan.svg.png",
//   api: "https://newsapi.org/v2/top-headlines?country=jp&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// },
// {
//   country: "japan",
//   url: "./assets/images/Flag_of_Japan.svg.png",
//   api: "https://newsapi.org/v2/top-headlines?country=jp&apiKey=d14c5886634d4e5fab4a7184dc793bc8"
// }
// ]
var model = {
  init() {
    $.ajax(
      {
        url: "https://restcountries.com/v3.1/region/europe",
        success: function (result) {
          model.data = result.reverse();
          carouselView.init()
        }
      });
  },
  currentNews: null
}

var controller = {
  init() {
    model.init()

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
      var countryCode = model.data.find(item => item.name.common == e.target.id).cca2.toLowerCase()
      $.ajax(
        {
          url: `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=d14c5886634d4e5fab4a7184dc793bc8`,
          success: function (result) {
            console.log(result)
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
    if (articles.length == 0) {
      $('.news').html("<h1 class='text-center'>No Available News for this Country</h1>")
    } else {
      const template = document.getElementById('template2').innerHTML;
      const rendered = Mustache.render(template, { articles });
      $('.news').html(rendered)
    }
  }

}

$(document).ready(function () {
  controller.init()
});

