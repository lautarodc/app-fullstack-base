class Main implements EventListenerObject, HandlerPost {
    public myFramework: MyFramework;
    public imageDict : any;
    public main(): void {
        this.myFramework = new MyFramework();
        this.showDevices();
        this.imageDict = {
            'heater': 'hot_tub',
            'cooler': 'ac_unit',
            'fan': 'filter_vintage',
            'lamp': 'lightbulb_outline',
            'tv': 'tv',
            'audio': 'audiotrack',
            'window': 'lock_open',
            'general': 'settings_remote',
        };
    }

    public handleEvent(ev: Event) {

        alert("Se hizo click!");
        let checkBox: HTMLInputElement = <HTMLInputElement>ev.target;
        alert(checkBox.id + " - " + checkBox.checked);

        let datos = { "id": checkBox.id, "status": checkBox.checked }
        this.myFramework.requestPOST("http://localhost:8000/devices", this, datos);
    }

    public showDevices() {

        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log("Llego la respuesta!!!!");
                    console.log(xhr.responseText);

                    let listaDis: Array<Device> = JSON.parse(xhr.responseText);

                    for (let disp of listaDis) {

                        /* Depending on the type of device, a switch or a slider will be implemented */
                        let switchHtml = `<div class="switch">
                        <label >
                          Off
                          <input id="disp_${disp.id}" type="checkbox">
                          <span class="lever"></span>
                          On
                        </label>
                        </div>`;

                        let sliderHtml = `<div>
                        <p class="range-field">
                            <input type="range" name="range" id="rango_${disp.id}" min="0" max="100" value="50"/>
                        </p>
                        </div>`;

                        let deviceControl = disp.type == 1 ? switchHtml : sliderHtml;

                        let cardList = this.myFramework.getElementById("device_cards");
                        cardList.innerHTML += `<li>
                            <div class="col s6 m3">
                                <div class="card indigo darken-4 z-depth-2 small">
                                <div class="card-content white-text">
                                    <span class="card-title"><i class="material-icons">${this.imageDict[disp.dev]}</i><span style="margin-left: 10%;"><b>${disp.name}</b></span></span>
                                    <br>
                                    <p>${disp.description}</p>
                                    <br>
                                    <br>
                                    <a href="#!">          
                                    ${deviceControl}
                                    </a>
                                </div>
                                <br>
                                <div class="card-action">
                                    <a href="#" class="btn-floating btn waves-effect waves-light">
                                    <i class="material-icons">edit</i></a>
                                    <a href="#" style="margin-left: 30%;" class="btn-floating btn waves-effect waves-light">
                                    <i class="material-icons">clear</i></a>
                                </div>
                                </div>
                            </div>
                        </li>`;

                    }

                    for (let disp of listaDis) {
                        let checkDisp = this.myFramework.getElementById("disp_" + disp.id);
                        checkDisp.addEventListener("click", this);
                    }
                } else {
                    alert("error!!")
                }
            }
        }
        xhr.open("GET", "http://localhost:8000/devices", true)
        xhr.send();
        console.log("Ya hice el request!!")
    }

    responsePost(status: number, response: string) {
        alert(response);
    }


}
window.addEventListener("load", () => {
    let miObjMain: Main = new Main();
    miObjMain.main();
    /*     let boton: HTMLElement = miObjMain.myFramework.getElementById("boton");
        boton.textContent = "Listar";
        boton.addEventListener("click", miObjMain); */
});