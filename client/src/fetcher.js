import config from './config.json'

const getcharacterMbtiList = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/characterMbtiList?mbti=${value}`, {
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

const gettop5mvmbti = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/top5mvmbti?mbti=${value}`, {
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










export {
    getcharacterMbtiList,
    getmbtiMatches,
    gettop5mvmbti,
    getmvmatches,
    getmvmbtipct
}