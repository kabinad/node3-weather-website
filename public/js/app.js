const weatherForm = document.querySelector('#locationForm')
const search = document.querySelector('#my-location')
const pickLocation = document.querySelector('#pickLocation')

const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

pickLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    pickLocation.setAttribute('disabled', 'disabled')
    pickLocation.setAttribute('background', 'red')

    navigator.geolocation.getCurrentPosition((position) => {

        const postionStr= position.coords.latitude +'  ' + position.coords.longitude
        messageOne.textContent = postionStr
     
        
    })
})
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    console.log(pickLocation)
    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = data.forecast
            }
        })
    })
})

function geoFindMe() {

    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
  
    mapLink.href = '';
    mapLink.textContent = '';
  
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      status.textContent = '';
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

      fetch('/weather?lat=' + latitude +'&long='+longitude).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            }
            else {
                console.log(data.location)
                document.querySelector('#my-location').value = data.location
                  console.log(search.value)
                messageOne.textContent = data.location
                messageTwo.textContent = data.forecast
            }
        })
    })
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if (!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
  }
  
  document.querySelector('#find-me').addEventListener('click', geoFindMe);