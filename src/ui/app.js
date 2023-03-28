const container = document.querySelector(".container");

const nameOfTemplate = document.getElementById('name-of-template');
const pathOfImg = document.getElementById('path-of-img');
const pathInput = document.getElementById("input-path");
const searchBtn = document.getElementById("search-btn");
const pathEffect = document.getElementById('effect-path');
const pathOutput = document.getElementById("output-path");

const  removeBtn = document.querySelector(".remove-it");
const  startBtn= document.querySelector(".start-it");
const inLiving = document.querySelector(".in-living");
const wrongPath = document.querySelector('.wrong-path');


// pathSongs = [
//   {
//     songName: 'heiwr_-_Quatro_Paredes.mp3',
//     songPath: 'C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/heiwr_-_Quatro_Paredes.mp3',
//     idx: 0
//   },
//   {
//     songName: 'JekK_-_JekK__-_Keep_me_Alive_(After_Lofi).mp3',
//     songPath: 'C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/JekK_-_JekK__-_Keep_me_Alive_(After_Lofi).mp3',
//     idx: 1
//   },
//   {
//     songName: 'Megan_Graney_-_Megan_Graney_-_So_It_Goes.mp3',
//     songPath: 'C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/Megan_Graney_-_Megan_Graney_-_So_It_Goes.mp3',
//     idx: 2
//   }
// ]

const makeItem = (pathSong, songName, id) => {
  const childString = `<div class="item"> <div class="song-item"><p class="name-song">${songName}</p></div> <div class="container-seconds"><p class="label-seconds"> seconds:</p><div class="container-second-inputs" data-name="${songName}" data-path="${pathSong}"><input type="text" name="seconds-in" id="origin-${id}" class="input-seconds origin" ><input type="text" name="input-seconds" id="effect-${id}" class="input-seconds effect"></div></div> </div>`;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = childString;
  return tempDiv.firstChild;
};


const isvalidPath = (node) => {
  /*
  node is a node
  */
  const path = node.value
  const placeholder = node.getAttribute('placeholder') 
  if (path.length>=1) {
    const condition = path.match(/(?:[A-Z]{1}[:])(?:[\\]{1}[a-z0-9\+-\¡\¿\°\!\#\$%&\=\',;_\. ]+)+$/i)
    if (condition) {
      console.log("Correct path")
      return true
    }
    else {
      console.log("Incorrect Path")
      return false
    }
  }
  else {
    console.log(`Empty ${placeholder}`)
    return false
  }
}

const transformPath = (node) => {
  const path = node.value
  let transformedPath = path.replaceAll("\\", "/")
  return transformedPath
}

const transformToFolder = (value) => {
  return value + "/"
}


window.addEventListener("DOMContentLoaded", () => {
    
    // --> Search it
    searchBtn.addEventListener("click", async () => {
      // --> Remove the content inside the container
      container.innerHTML = ""
      const isValid = isvalidPath(pathInput)
      if (isValid) {
        pathInputValue = transformPath(pathInput)
        pathInputValueFolder = transformToFolder(pathInputValue)
        // console.log(pathInputValueFolder)
        let pathSongs = await window.triggerFunctions.getNameOfSongs(pathInputValueFolder);
        pathSongs = JSON.parse(pathSongs)
        if (pathSongs) {
          pathSongs.forEach((el) => {
            const itemHtml = makeItem(el.songPath ,el.songName, el.idx);
            container.appendChild(itemHtml);
          });
        }
        

      }
    });

  // --> Removed it
  removeBtn.addEventListener('click', () => {
    container.innerHTML = ""
  })
  // --> Start it
    startBtn.addEventListener('click', async () => {
      const template = nameOfTemplate.value
      const isValidImg = isvalidPath(pathOfImg)
      let pathOfImgValue = ""
      if (isValidImg) {
        pathOfImgValue = transformPath(pathOfImg)
      }
      const isValidEffect = isvalidPath(pathEffect)
      let pathEffectValue = "" 
      if (isValidEffect) {
        pathEffectValue = transformPath(pathEffect)

      }
      
      const isValidOut = isvalidPath(pathOutput)
      // console.log(isValidOut, isValidImg, template, pathEffectValue)

      if (isValidOut && isValidImg && template && pathEffectValue) {

        const pathOutputValue = transformPath(pathOutput)
        const pathOutputValueFolder = transformToFolder(pathOutputValue)
        const containerSeconds = document.querySelectorAll('.container-second-inputs')
        
        const data = {
          imgPath:pathOfImgValue,
          effectAudioPath:pathEffectValue,
          template:template,
          pathOutputValueFolder:pathOutputValueFolder
        }
        
        const pathOfSongsWithMix = []

        containerSeconds.forEach(el => {
          const body = {}
          
          body["songName"]= el.getAttribute('data-name')
          body["songPath"]= el.getAttribute('data-path')

          body["outSongPath"]= pathOutputValueFolder + `${template}` + "/" + el.getAttribute('data-name')
          
          const mixes = []
          const inputNodes =  el.childNodes
            inputNodes.forEach(e => {
              mixes.push(e.value)
            })
          body['mixes'] = mixes
          pathOfSongsWithMix.push(body)
              
          })
        
        data['pathOfSongsWithMix'] = JSON.stringify(pathOfSongsWithMix)
        const dataToNode = JSON.stringify(data)
        let resp = await window.triggerFunctions.getPathOfSongs(dataToNode);
        if (resp) {
          inLiving.innerText = 'Successful'
          inLiving.style = "color:Green;"
        }
        
        // console.log(resp)
      }
  }) 
})