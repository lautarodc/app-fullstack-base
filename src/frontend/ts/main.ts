class Main implements EventListenerObject, HandlerPost {
    public myFramework: MyFramework;
    public imageDict: any;
    public verboseDict: any;
    public iconsParse(icon: string, v: number = 11): string {
        return `https://fonts.gstatic.com/s/i/materialiconsoutlined/${icon}/v${v}/24px.svg`
    }

    public selectDevicesInit(id: string, selected: boolean, modal: boolean): void {
        // Initialize de Device Type Dropdown
        let deviceSelect: HTMLSelectElement = this.myFramework.getElementById(id);

        if (modal) {
            // Add the disabled option and erase the rest
            deviceSelect.innerHTML = `<option value="" disabled>Tipo Dispositivo</option>`;
        }

        Object.keys(this.imageDict).forEach(dev => {
            const option = new Option(this.verboseDict[dev], dev, selected, selected);
            // Get icons for the select options
            let imageDir = this.iconsParse(this.imageDict[dev]);
            // Deal with border cases of icons not showing up in Google Fonts
            switch (this.imageDict[dev]) {
                case 'lightbulb_outline':
                    imageDir = this.iconsParse('lightbulb');
                    break;
                case 'settings_remote':
                    imageDir = this.iconsParse('settings_remote', 10);
                    break;
                default:
                    break;
            }
            // Set the image to the option
            option.setAttribute("data-icon", imageDir);
            deviceSelect.add(option, undefined);
        });
        var instances_sel = M.FormSelect.init(deviceSelect, {});
    }

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
        this.verboseDict = {
            'heater': 'Calefacción',
            'cooler': 'Aire Acondicionado',
            'fan': 'Ventilador',
            'lamp': 'Lámpara',
            'tv': 'Televisión',
            'audio': 'Equipo de Audio',
            'window': 'Ventana',
            'general': 'Sin indicar',
        };
    }

    public handleEvent(ev: Event) {

        // Get the target of the event and the type of trigger
        let eventObject: HTMLInputElement = <HTMLInputElement>ev.target;

        // Workaround for problems with the edit Event (mixing types and names with icons)
        // TODO: FIX-ME
        if (eventObject.id == "") {
            eventObject = <HTMLInputElement>eventObject.parentElement;
        }

        // Get the target data in case of a device value update
        let data = {};
        let id = eventObject.id.split("_")[1];
        data['id'] = id;

        switch (<string>eventObject.type) {
            case "checkbox":
                data['value'] = eventObject.checked;
                this.myFramework.requestPOST("http://localhost:8000/value_update", this, data);
                break;

            case "range":
                data['value'] = eventObject.value;
                this.myFramework.requestPOST("http://localhost:8000/value_update", this, data);
                break;

            default:
                break;
        }

        // Get the event functionality (add, save, edit, clear)
        let eventFunction: string = eventObject.id.split("_")[0];

        console.log(eventObject.id);

        switch (eventFunction) {
            case 'add':

                // Store the type of operation
                (<HTMLInputElement>this.myFramework.getElementById('op_type')).value = "add";

                // Initialize de Device Type Dropdown
                this.selectDevicesInit("device_dev", false, true);

                this.myFramework.getElementById('title').innerHTML = "Nuevo Dispositivo";
                (<HTMLInputElement>this.myFramework.getElementById('device_name')).value = "";
                (<HTMLInputElement>this.myFramework.getElementById('device_description')).value = "";
                (<HTMLInputElement>this.myFramework.getElementById('device_type')).value = "";
                (<HTMLInputElement>this.myFramework.getElementById('device_dev')).value = "";
                (<HTMLInputElement>this.myFramework.getElementById('device_id')).value = "";
                break;

            case 'edit':

                // Store the type of operation
                (<HTMLInputElement>this.myFramework.getElementById('op_type')).value = "edit";

                // Initializa the Select Device Type Element
                this.selectDevicesInit("device_dev", false, true);

                // Populate fields with device data
                this.myFramework.getElementById('title').innerHTML = "Editar Dispositivo";
                (<HTMLInputElement>this.myFramework.getElementById('device_name')).value = <string>this.myFramework.getElementById(`name_${id}`).getElementsByClassName("b-text")[0].textContent;
                (<HTMLInputElement>this.myFramework.getElementById('device_description')).value = <string>this.myFramework.getElementById(`description_${id}`).textContent;
                (<HTMLSelectElement>this.myFramework.getElementById('device_type')).value = (<HTMLSelectElement>this.myFramework.getElementById(`type_${id}`)).value;
                (<HTMLInputElement>this.myFramework.getElementById('device_dev')).value = (<HTMLSelectElement>this.myFramework.getElementById(`dev_${id}`)).value;
                (<HTMLInputElement>this.myFramework.getElementById('device_id')).value = id;

                // Get the HTMLSelectElements for initialization after updating the values
                let deviceSelect: HTMLSelectElement = this.myFramework.getElementById("device_dev");
                let typeSelect: HTMLSelectElement = this.myFramework.getElementById("device_type");
                var instances_sel = M.FormSelect.init(deviceSelect, {});
                var instances_sel = M.FormSelect.init(typeSelect, {});

                break;

            case 'clear':
                this.myFramework.requestPOST(`http://localhost:8000/delete/`,this, {"id": id}); 
                break;

            case 'save':
                // Get the type of operation (new or edit)
                let operationType = (<HTMLInputElement>this.myFramework.getElementById('op_type')).value;

                // Get the modal data
                let device_name:string = (<HTMLInputElement>this.myFramework.getElementById('device_name')).value;
                let device_description:string = (<HTMLInputElement>this.myFramework.getElementById('device_description')).value;
                let device_type:string = (<HTMLSelectElement>this.myFramework.getElementById('device_type')).value;
                let device_dev:string = (<HTMLInputElement>this.myFramework.getElementById('device_dev')).value;
                let device_id:string = (<HTMLInputElement>this.myFramework.getElementById('device_id')).value;
                let data = {"id": "", "dev": device_dev, "name": device_name, "description": device_description, "type":device_type, "state":"0"};

                if(operationType == "edit"){
                    // In the edit case, the ID must be provided
                    data["id"] = device_id;
                    this.myFramework.requestPOST(`http://localhost:8000/update/`, this, data);
                }else{
                    this.myFramework.requestPOST(`http://localhost:8000/create/`, this, data); 
                }

                break;

            default:
                console.log("Error: Event unrecognized")
                break;
        }

    }

    public showDevices(filterDevices: Array<string> = ['all']) {

        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    //console.log(xhr.responseText);

                    let listaDis: Array<Device> = JSON.parse(xhr.responseText);

                    this.myFramework.getElementById("device_cards").innerHTML = ``;

                    for (let disp of listaDis) {

                        if (filterDevices.indexOf('all') == 0) {

                        } else {
                            if (filterDevices.indexOf(disp.dev) < 0) {
                                continue;
                            }
                        }

                        /* Depending on the type of device, a switch or a slider will be implemented */
                        let checkboxState = disp.state ? "checked" : "";

                        let switchHtml = `<div class="switch">
                        <label >
                          Off
                          <input id="disp_${disp.id}" type="checkbox" ${checkboxState}>
                          <span class="lever"></span>
                          On
                        </label>
                        </div>`;

                        let sliderHtml = `<div>
                        <p class="range-field">
                            <input type="range" name="range" id="disp_${disp.id}" min="0" max="100" value="${disp.state}"/>
                        </p>
                        </div>`;

                        let deviceControl = disp.type == 1 ? switchHtml : sliderHtml;

                        let cardList = this.myFramework.getElementById("device_cards");
                        cardList.innerHTML += `<li>
                            <div class="col s6 m3">
                                <div class="card indigo darken-4 z-depth-2 small">
                                <div class="card-content white-text">
                                    <span id="name_${disp.id}" class="card-title"><i class="material-icons">${this.imageDict[disp.dev]}</i><span class="b-text" style="margin-left: 10%;"><b>${disp.name}</b></span></span>
                                    <br>
                                    <p id="description_${disp.id}">${disp.description}</p>
                                    <br>
                                    <br>
                                    <a href="#!">          
                                    ${deviceControl}
                                    </a>
                                    <input id="type_${disp.id}" type="text" value="${disp.type}" hidden>
                                    <input id="dev_${disp.id}" type="text" value="${disp.dev}" hidden>
                                </div>
                                <br>
                                <div class="card-action">
                                    <a id="edit_${disp.id}" href="#add_modal" class="btn-floating btn waves-effect waves-light modal-trigger">
                                    <i class="material-icons">mode_edit</i></a>
                                    <a id="clear_${disp.id}" href="#" style="margin-left: 30%;" class="btn-floating btn waves-effect waves-light">
                                    <i class="material-icons">delete_forever</i></a>
                                </div>
                                </div>
                            </div>
                        </li>`;
                    }

                    listaDis.forEach(disp => {
                        /* Add the event listeners of each device */

                        // Event Listeners for the input value 
                        let dispElement = this.myFramework.getElementById("disp_" + disp.id);
                        let eventType: string = disp.type == 1 ? "click" : "change";
                        dispElement.addEventListener(eventType, this);

                        // Event Listeners for device info update and deletion
                        let editElement = this.myFramework.getElementById("edit_" + disp.id);
                        editElement.addEventListener("click", this);
                        let clearElement = this.myFramework.getElementById("clear_" + disp.id);
                        clearElement.addEventListener("click", this);
                    });

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
        console.log(response);
        location.reload();
    }


}
window.addEventListener("load", () => {
    let miObjMain: Main = new Main();
    miObjMain.main();

    // Add an EventListener for the new devices button
    let addButton: HTMLElement = miObjMain.myFramework.getElementById("add_button");
    addButton.addEventListener("click", miObjMain);

    // Add an EventListener for the modal
    let save_button: HTMLElement = miObjMain.myFramework.getElementById("save_device");
    save_button.addEventListener("click", miObjMain);

    // Create a filter select form field to choose which device types to show
    let deviceFilter: HTMLSelectElement = miObjMain.myFramework.getElementById("dev_filter");

    // Initialize the select field with options and icons (all selected by default)
    miObjMain.selectDevicesInit("dev_filter", true, false);

    // Add an event listener to hide/show devices based on the filtered value
    deviceFilter.addEventListener("change", () => {
        // Get the selected values to filter out some devices
        const selectedValues = [...deviceFilter.options]
            .filter((x) => x.selected)
            .map((x) => x.value);
        miObjMain.showDevices(selectedValues);
    });
});