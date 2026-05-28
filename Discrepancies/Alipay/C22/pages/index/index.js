Page({
  Toshow() {
    my.navigateTo({ url: '../show/show' });
  },
  onLoad(query) {
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  }
});
