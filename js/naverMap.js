class NaverMap {
  constructor() {
    this.API_KEY_ID = MyURL.getParam("API_KEY_ID");
    this.API_KEY = MyURL.getParam("API_KEY");
    this.map;
  }

  makeMap(id) {
    const API_KEY_ID = MyURL.getParam("API_KEY_ID");
    const API_KEY = MyURL.getParam("API_KEY");
    if (!API_KEY || !API_KEY_ID) MyToast.showToast("API키가 없네요 ㅋㅋ");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${API_KEY_ID}`;
    script.async = false;
    document.head.appendChild(script);
    script.onload = () => {
      let lat;
      let long;
      navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        const mapOptions = {
          center: new naver.maps.LatLng(lat, long),
          zoom: 15,
          disableDoubleTapZoom: true,
        };

        this.map = new naver.maps.Map(id, mapOptions);
      });
    };
  }

  // makeMap(id) {
  //   let lat;
  //   let long;
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     lat = position.coords.latitude;
  //     long = position.coords.longitude;

  //     const mapOptions = {
  //       center: new naver.maps.LatLng(lat, long),
  //       zoom: 10,
  //       disableDoubleTapZoom: true,
  //     };

  //     this.map = new naver.maps.Map(id, mapOptions);
  //   });
  // }

  initLocation() {
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      this.map.setCenter(new naver.maps.LatLng(lat, long));
    });
  }
}
