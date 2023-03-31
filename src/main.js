const {BrowserWindow, ipcMain} = require("electron");
const path = require('path')
const fs = require('fs');
var shell = require('shelljs');

shell.config.execPath = 'C:/Program Files/nodejs/node.exe'

// const items = [
//     {
//       songName: "Across the Universe",
//       id: 1000
//     },
//     {
//       songName: "All You Need Is Love",
//       id: 1001
//     },
//     { songName: "Back in the U.S.S.R.", id: 1002 },
//     { songName: "Because", id: 1003 },
//     { songName: "Come Together", id: 1004 },
//     { songName: "Don't Let Me Down", id: 1005 },
//     { songName: "Get Back", id: 1006 }
//   ];



const getNames = (pathInput) => {
    try {
        const allFiles = fs.readdirSync(pathInput, {withFileTypes: true})
        let data = allFiles.map((item, idx) => {
            return {songName:item.name, songPath:`${pathInput}${item.name}`, idx:idx}
        })
        // const dataObject = {...data}
        data=JSON.stringify(data)
        return data
        
    } catch (error) {
        return false
    }
}

const convertMilliseconds = (x) => {

    const hourList = x.split(':')
    const minutes = hourList[0]
    const seconds = hourList[1]
    return (Number(minutes)*60 + Number(seconds))*1000
}

const mixData = (data) => {
    
    const dataparsed = JSON.parse(data)
    
    const imgPath = dataparsed.imgPath
    const effectAudioPath = dataparsed.effectAudioPath
    const pathOfSongsWithMix = JSON.parse(dataparsed.pathOfSongsWithMix)
    const template = dataparsed.template
    const pathOutputValueFolder = dataparsed.pathOutputValueFolder

    
    // create folder with the name in the template
    if (!fs.existsSync(pathOutputValueFolder + template)){
        fs.mkdirSync(pathOutputValueFolder + template)
    }
    const verify = []

    pathOfSongsWithMix.forEach(el => {
        const mixes= el.mixes
        let firstMix = convertMilliseconds(mixes[0])
        firstMix = firstMix.toString()
        let secondMix = convertMilliseconds(mixes[1])
        secondMix = secondMix.toString()

        const outSongPath = el.outSongPath
        const songPath = el.songPath
        
        
        const passToffmpeg = `ffmpeg -i "${songPath}" -i "${effectAudioPath}" -i "${effectAudioPath}" -i "${imgPath}" -filter_complex "[1:a]adelay=${firstMix}|${firstMix}[a1];[2:a]adelay=${secondMix}|${secondMix}[a2];[0:a][a1][a2]amix=inputs=3:dropout_transition=0:normalize=0[a]" -map 3:0 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" -ar 44100 -ac 2 -b:a 320k -y "${outSongPath}"`
        // -af loudnorm=I=-16:LRA=11:TP=-1.5

        // const passToffmpeg = `ffmpeg -i "${songPath}" -i "${effectAudioPath}" -i "${effectAudioPath}" -i "${imgPath}" -filter_complex "[0]adelay=0|0[a1];[1]adelay=${firstMix}|${firstMix}[a2];[2]adelay=${secondMix}|${secondMix}[a3];[a1][a2][a3]amix=inputs=3,dynaudnorm[a]" -map "[a]" -map 3:0 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" -ar 44100 -ac 2 -b:a 320k -y "${outSongPath}"`

        // :normalize=false
        
        // console.log(passToffmpeg)
        const execute = (query) => {
            const resp = shell.exec(query);
        
            if (resp.code !== 0) {
                verify.push(false)
                shell.exit(1);
            } else {
                verify.push(true)
                shell.echo("Run passToffmpeg file");
            }
        }
        
        execute(passToffmpeg)
        // `"${outSongPath}" -af loudnorm=I=-16:LRA=11:TP=-1.5 "C:/Users/LENOVO/Desktop/new/out/CD1/out.mp3"`
        execute(`"${outSongPath}" -af loudnorm=I=-16:LRA=11:TP=-1.5 "C:/Users/LENOVO/Desktop/new/out/CD1/out.mp3"`)
        
        // const resp = shell.exec(passToffmpeg);
        
        // if (resp.code !== 0) {
        //     verify.push(false)
        //     shell.exit(1);
        // } else {
        //     verify.push(true)
        //     shell.echo("Run passToffmpeg file");
        // }
    })
    const verifyAll = verify.every(x => x)
    
    return verifyAll
}


const createWindow = () => {
    window = new BrowserWindow(
        {
            width:600,
            height:800,
            webPreferences:{
                preload:path.join(__dirname, "preload.js")
            }

        }
    )
    ipcMain.handle('name-songs', (event, pathInput) => {
        const nameOfSongsString = getNames(pathInput)
        // nameOfSongsString = JSON.stringify(nameOfSongs)
        return nameOfSongsString
    })
    ipcMain.handle('path-songs',  (event, data) => {
        const resp = mixData(data)
        return resp
    })

    window.loadFile('src/ui/index.html')
}

module.exports = {createWindow}
