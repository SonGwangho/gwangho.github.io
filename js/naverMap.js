class NaverMap {
  constructor() {
    this.API_KEY_ID = MyURL.getParam("API_KEY_ID");
    this.API_KEY = MyURL.getParam("API_KEY");
    this.map;
    this.infowindow;
  }

  makeMap(id) {
    try {
      if (!this.API_KEY || !this.API_KEY_ID) {
        this.API_KEY_ID = MyStorage.getLocalData("naver_map_api_key_id");
        this.API_KEY = MyStorage.getLocalData("naver_map_api_key");
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
          this.infowindow = new naver.maps.InfoWindow();
          this.infowindow.setContent(
            '<div style="width:10px; height:10px; border-radius:50%; border:none; background:red;"></div>'
          );

          const mapOptions = {
            center: new naver.maps.LatLng(lat, long),
            zoom: 15,
            disableDoubleTapZoom: true,
          };

          this.map = new naver.maps.Map(id, mapOptions);
          this.infowindow.open(this.map, mapOptions.center);
          MyStorage.saveLocal("naver_map_api_key_id", this.API_KEY_ID);
          MyStorage.saveLocal("naver_map_api_key", this.API_KEY);
        });
      };
    } catch {
      MyToast.showToast("API 키가 없네요~");
    }
  }

  initLocation() {
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      this.map.setCenter(new naver.maps.LatLng(lat, long));
      this.infowindow.open(this.map, new naver.maps.LatLng(lat, long));
    });
  }
}
