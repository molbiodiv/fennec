const Biom = require('biojs-io-biom').Biom
const $ = require('jquery')

const biomPromise = new Promise((resolve, reject) => {
    $('document').ready(() => {
        let biomObject = $('#project-data').data('biom-raw')
        if(typeof biomObject === 'undefined'){
            reject(new Error('No biom data found'))
        }
        let biom = new Biom(biomObject)
        resolve(biom)
    })
})

module.exports = biomPromise