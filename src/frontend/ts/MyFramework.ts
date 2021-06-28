class MyFramework{
    public getElementById(id:string): HTMLElement{
      return document.getElementById(id);
    }
  
    public requestPOST(url: string, response: HandlerPost, datos: any) {
      let xlm: XMLHttpRequest = new XMLHttpRequest();
  
      xlm.onreadystatechange = () => {
        if (xlm.readyState == 4) {
          response.responsePost(xlm.status, xlm.responseText);
        }
      }
      xlm.open("POST", url, true);
      xlm.setRequestHeader("Content-Type", "application/json");
  
      
      xlm.send(JSON.stringify(datos));
    }
  }