const fs = require('fs');
// var cron = require('node-cron')
var shell = require('shelljs');

const data = {
    "imgPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/pics/digimon.jpg",
    "effectAudioPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/effects/dog-barking-close-sound.mp3",
    "template": "CD1",
    "pathOutputValueFolder": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/output/",
    "pathOfSongsWithMix": [
        {
            "songName": "heiwr_-_Quatro_Paredes.mp3",
            "songPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/heiwr_-_Quatro_Paredes.mp3",
            "outSongPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/output/CD1/heiwr_-_Quatro_Paredes.mp3",
            "mixes": [
                "01:10",
                "00:50"
            ]
        },
        {
            "songName": "JekK_-_JekK__-_Keep_me_Alive_(After_Lofi).mp3",
            "songPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/JekK_-_JekK__-_Keep_me_Alive_(After_Lofi).mp3",
            "outSongPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/output/CD1/JekK_-_JekK__-_Keep_me_Alive_(After_Lofi).mp3",
            "mixes": [
                "00:55",
                "01:10"
            ]
        },
        {
            "songName": "Megan_Graney_-_Megan_Graney_-_So_It_Goes.mp3",
            "songPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/Megan_Graney_-_Megan_Graney_-_So_It_Goes.mp3",
            "outSongPath": "C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/output/CD1/Megan_Graney_-_Megan_Graney_-_So_It_Goes.mp3",
            "mixes": [
                "00:40",
                "01:25"
            ]
        }
    ]
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
    const pathOfSongsWithMix = dataparsed.pathOfSongsWithMix
    const template = dataparsed.template
    const pathOutputValueFolder = dataparsed.pathOutputValueFolder

    // create folder with the name in the template
    if (!fs.existsSync(pathOutputValueFolder + template)){
        fs.mkdirSync(pathOutputValueFolder + template)
    }

    pathOfSongsWithMix.forEach(el => {
        const mixes= el.mixes
        let firstMix = convertMilliseconds(mixes[0])
        let secondMix = convertMilliseconds(mixes[1])

        const outSongPath = el.outSongPath
        const songPath = el.songPath
        const passToffmpeg = `ffmpeg -i ${songPath} -i ${effectAudioPath} -i ${effectAudioPath} -i ${imgPath} -filter_complex "[0]adelay=0|0[a1];[1]adelay=${firstMix}|${firstMix}[a2];[2]adelay=${secondMix}|${secondMix}[a3];[a1][a2][a3]amix=inputs=3[a]" -map "[a]" -map 3:0 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)"  ${outSongPath}`
        // console.log(passToffmpeg)
        
        const resp = shell.exec(passToffmpeg);
        
        if (resp.code !== 0) {
            shell.exit(1);
        } else {
            shell.echo("Run passToffmpeg file");
        }
    })
}

const datastring = JSON.stringify(data)
mixData(datastring)




// const fs = require('fs');
// // 
// const getNames = (pathInput) => {
//     try {
//         const allFiles = fs.readdirSync(pathInput, {withFileTypes: true})
//         const data = allFiles.map((item, idx) => {
//             return {songName:item.name, songPath:`${pathInput}${item.name}`, idx:idx}
//         })
//         // const dataObject = {...data}
//         // const nameOfSongs=JSON.stringify(dataObject)
//         return data
        
//     } catch (error) {
//         return "error"
//     }
// }

// console.log(getNames("C:/Users/LENOVO/Desktop/Projects/5.-web-programming/mix/assets/songs/"))
