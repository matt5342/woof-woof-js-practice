

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("good-dog-filter").addEventListener('click', toggleFilter)
    getDogs();
})

function toggleFilter(e) {
    if (e.target.innerText == "Filter good dogs: OFF"){
        e.target.innerText = "Filter good dogs: ON"
    }
    else if (e.target.innerText == "Filter good dogs: ON"){
        e.target.innerText = "Filter good dogs: OFF"
    }
    clearDogSpans();
    getDogs();
}
function clearDogSpans() {
    let dogBar = document.getElementById('dog-bar')
    while (dogBar.hasChildNodes()){
        dogBar.removeChild(dogBar.firstChild)
    }
}

function getDogs() {
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(dogData => dogData.forEach(dogSpans))
}

function dogSpans(dog) {
    let filter = document.getElementById("good-dog-filter").innerText.split(": ")[1]
    let dogBar = document.getElementById("dog-bar")
    let makeSpan = document.createElement("span")
    if (filter == "OFF") {
        makeSpan.innerText = dog.name
        makeSpan.dataset.id = dog.id
        dogBar.appendChild(makeSpan)
    }
    else if (filter == "ON"){
        if (dog.isGoodDog == true){
            makeSpan.innerText = dog.name
            makeSpan.dataset.id = dog.id
            dogBar.appendChild(makeSpan)
        }
    }
    makeSpan.addEventListener('click', clickDogSpan)
}
function clickDogSpan(e) {
    getSingleDog(e.target.dataset.id)
    .then(displayDog)
}

function displayDog(dog) {
    let dogInfo = document.getElementById("dog-info")

    while (dogInfo.hasChildNodes()){
        dogInfo.removeChild(dogInfo.firstChild)
    }
    let image = document.createElement("img")
    image.src = dog.image
    let header = document.createElement("h2")
    header.innerText = dog.name
    let button = document.createElement("button")
    button.dataset.id = dog.id
    
    if (dog.isGoodDog == true){
        button.innerText = "Good Dog!"
    }
    else if (dog.isGoodDog == false) {
        button.innerText = "Bad Dog!"
    }
    dogInfo.append(header, image, button)
    button.addEventListener('click', clickDogStatus)
}
function clickDogStatus(e) {
    getSingleDog(e.target.dataset.id)
    .then(goodBoy)
}
function goodBoy(dog) {

    let goodBad
    let buttonText
    if (dog.isGoodDog == true){
        goodBad = { isGoodDog: false}
        buttonText = "Bad Dog!"
    }
    else if (dog.isGoodDog == false) {
        goodBad = { isGoodDog: true}
        buttonText = "Good Dog!"
    }
    let reqObj = {
        headers: {"Content-Type": "application/json", Accept: "application/json"}, 
        method: "PATCH", 
        body: JSON.stringify(goodBad)
    }
   return fetch('http://localhost:3000/pups/' + dog.id, reqObj)
    .then(r => r.json())
    .then(updated => {
        document.getElementsByTagName("button")[1].innerText = buttonText
    })

}
function getSingleDog(id) {
   return fetch('http://localhost:3000/pups/' + id)
   .then(res => res.json())
}