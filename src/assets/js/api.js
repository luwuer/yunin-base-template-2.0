/* eslint-disable */
import http from './http'

const getFileList = () => {
  // return http.get('')
  return Promise.resolve([
    {
      p0: '000',
      p1: '001',
      p2: '002',
      p3: '003',
      p4: '004'
    }
  ])
}

export { getFileList }
