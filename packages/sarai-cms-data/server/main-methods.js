Meteor.methods({
  'cms-weather-advisory-update': (title, description, advisory) => {
    Main.update(
      { name: 'weather-advisory' },
      {
        $set : {
          title,
          description,
          subtext
        }
      },
      { upsert: true }
    );
  },

  'cms-weather-advisory-toggle': () => {
    const c = Main.findOne({name: 'weather-advisory'}).enabled
    let n = true
    if (c) {
      n = false
    }

    Main.update(
      { name: 'weather-advisory' },
      {
        $set : {
          enabled: n
        }
      },
      { upsert: true }
    );

  },

  'cms-top-header-update': (message, searchText) => {
    Main.update(
      { name: 'topHeader' },
      {
        $set : {
          message,
          searchText
        }
      },
      { upsert: true }
    );
  },

  'cms-top-header-toggle': () => {
    const c = Main.findOne({name: 'topHeader'}).enabled
    let n = true
    if (c) {
      n = false
    }

    Main.update(
      { name: 'topHeader' },
      {
        $set : {
          enabled: n
        }
      },
      { upsert: true }
    );

  },

  'cms-header-icon-update': (link) => {
    Main.update(
      { name: 'mainHeader' },
      {
        $set : {
          img: link
        }
      },
      { upsert: true }
    );
  },

  'cms-banner-update': (align, title, text, subtext, buttonText) => {
    const banner = Main.findOne({name: 'banner'}).banners[0]

    Main.update(
      { name: 'banner' },
      {
        $set : {
          banners: [
            {
              img: banner.img,
              align,
              title,
              text,
              subtext,
              buttonText
            }
          ]
        }
      },
      { upsert: true }
    );
  },

  'cms-banner-img-update': (link) => {
    const banner = Main.findOne({name: 'banner'}).banners[0]

    Main.update(
      { name: 'banner' },
      {
        $set : {
          banners: [
            {
              img: link,
              align: banner.align,
              title: banner.title,
              text: banner.text,
              subtext: banner.subtext,
              buttonText: banner.buttonText
            }
          ]
        }
      },
      { upsert: true }
    );
  },

  'cms-header-links-update': (links) => {
    Main.update(
      { name: 'mainHeader'},
      {
        $set: {
          links
        }
      },
      { upsert: true }
    )
  },

  'cms-header-button-toggle': () => {
    let buttonEnabled = Main.findOne({name: 'mainHeader'}).buttonEnabled

    buttonEnabled = buttonEnabled ? false : true

    Main.update(
      { name: 'mainHeader'},
      {
        $set: {
          buttonEnabled
        }
      },
      { upsert: true }
    )
  },

  'cms-banner-slide-add': (image, textPosition, title, subTitle, text, buttonText, buttonLink, rank) => {

    const _id = Random.id()
    const slides = Main.findOne({name: 'banner'}).slides

    if (slides) {

      slides.push({_id, image, textPosition, title, subTitle, text, buttonText, buttonLink, rank})

      Main.update(
        { name: 'banner'},
        {
          $set: {
            slides
          }
        },
        { upsert: true }
      )
    }

    else {
      return new Error('Couldn\'t find slides array')
    }
  },

  'cms-banner-slide-edit': (_id, image, textPosition, title, subTitle, text, buttonText, buttonLink, rank) => {

    let slides = Main.findOne({name: 'banner'}).slides

    if (slides) {
      let index = ''

      const slide = slides.find((element, i) => {
        if (element._id == _id) {
          index = i
          return true
        }
      })

      slides[index].image = image
      slides[index].title = title
      slides[index].textPosition = textPosition
      slides[index].subTitle = subTitle
      slides[index].text = text
      slides[index].buttonText = buttonText
      slides[index].buttonLink = buttonLink
      slides[index].rank = rank

      Main.update(
        { name: 'banner'},
        {
          $set: {
            slides
          }
        },
        { upsert: true }
      )
    }

    else {
      return new Error('Couldn\'t find slides array')
    }
  },

  'cms-banner-slide-delete': (_id) => {
    const record = Main.findOne({name: 'banner'})

    if (record) {
      let index = 0

      record.slides.forEach((element, i) => {
        if (element._id == _id) {
          index = i
        }
      })

      const slides = record.slides
      slides.splice(index, 1)

      Main.update(
        { name: 'banner'},
        {
          $set: {
            slides
          }
        },
        { upsert: true }
      )
    }
  }
})