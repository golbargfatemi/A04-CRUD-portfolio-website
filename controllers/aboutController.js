exports.getAboutPage = (req, res) => {
    res.render('about', {
      title: 'About Me',
      biography: 'Hello, I\'m Golbarg Fatemi. I specialize in web development and backend engineering.'
    });
  };