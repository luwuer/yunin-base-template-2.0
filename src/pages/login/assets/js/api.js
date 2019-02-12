import http from '@/assets/js/http'

const login = function (
  tenantCode,
  username,
  password,
  valiCode,
  loginType = 'default'
) {
  return http.post('/login.json', {
    tenantCode,
    username,
    password,
    valiCode,
    loginType
  })
}

export {
  login
}
