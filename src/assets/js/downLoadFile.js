import selfMsgBox from '@/components/SelfMsgBox'

function downLoadFile(options, handleProgress) {
  options = Object.assign({
    method: 'GET',
    url: '',
    data: null,
    filename: 'file',
    responseType: 'blob'
  }, options)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(options.method, options.url, true)
    xhr.withCredentials = true
    xhr.responseType = options.responseType
    xhr.onprogress = (evt)=>{
      if (evt.lengthComputable) {
        var percentComplete = evt.loaded / evt.total
        console.log(percentComplete)
        handleProgress(percentComplete)
      }
    }
    xhr.onreadystatechange = ()=> {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        if (xhr.response.type === 'application/json') {
          const reader = new FileReader()
          reader.addEventListener('loadend', ()=> {
            if (reader.readyState !== 2) {
              return reject(new Error('downlaod fail'))
            }
            let rs = ''
            try {
              rs = JSON.parse(reader.result)
            } catch (e) {
              return reject(e)
            }
            if (!rs.code || rs.code !== 0) {
              selfMsgBox.error(rs.msg)
              return reject(new Error('downlaod fail'))
            } else {
              selfMsgBox.info(rs.msg)
              return resolve(rs)
            }
          })
          reader.readAsText(xhr.response)
        } else {
          if (typeof window.chrome !== 'undefined') {
            // Chrome version
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(xhr.response)
            link.download = options.filename
            link.click()
          } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE version
            const blob = new Blob([xhr.response], { type: 'application/force-download' })
            window.navigator.msSaveBlob(blob, options.filename)
          } else {
            // Firefox version
            const file = new File([xhr.response], options.filename, { type: 'application/force-download' })
            window.open(URL.createObjectURL(file))
          }
          return resolve(true)
        }
      }
    }
    xhr.onerror = ()=> {
      return reject(new Error('下载失败'))
    }
    xhr.send(options.data)
  })
}

export default downLoadFile
