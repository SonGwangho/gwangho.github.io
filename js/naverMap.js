class NaverMap {
  constructor() {
    this.API_KEY_ID = MyURL.getParam("API_KEY_ID");
    this.API_KEY = MyURL.getParam("API_KEY");
    this.map;
  }

  makeMap(id) {
    if (!this.API_KEY || !this.API_KEY_ID) {
      this.API_KEY_ID = MyStorage.getLocalData("naver_map_api_key_id");
      this.API_KEY = MyStorage.getLocalData("naver_map_api_key");

      MyToast.showToast("API키가 없네요 ㅋㅋ");
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${this.API_KEY_ID}`;
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

        MyStorage.saveLocal("naver_map_api_key_id", this.API_KEY_ID);
        MyStorage.saveLocal("naver_map_api_key", this.API_KEY);
      });
    };
  }

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
