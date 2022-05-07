
   
import config from './config.json'

const getcharacterMbtiList = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/characterMbtiList`, {
        method: 'GET',
    })
    return res.json()
}

const getmbtiMatches = async (page,pagesize,value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/mbti_matches/${value}`, {
        method: 'GET',
    })
    return res.json()
}

const gettop5mvmbti = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/top5mvmbti`, {
        method: 'GET',
    })
    return res.json()
}

const getmvmatches = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/movie/${value}`, {
        method: 'GET',
    })
    return res.json()
}

const getmvmbtipct = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/mvpct/${value}`, {
        method: 'GET',
    })
    return res.json()
}

const rankbymbti = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/actormbtiplayed`, {
        method: 'GET',
    })
    return res.json()
}

const actorpct = async (value) => {
    console.log(value)
    var res = await fetch(`http://${config.server_host}:${config.server_port}/actorpct/${value}`, {
        method: 'GET',
    })
    return res.json()
}



export {
    getcharacterMbtiList,
    getmbtiMatches,
    gettop5mvmbti,
    getmvmatches,
    getmvmbtipct,
    rankbymbti,
    actorpct
}
